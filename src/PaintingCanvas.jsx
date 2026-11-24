import { useEffect, useRef, useState } from "react";

const BACKGROUND = "#f5f2ec";

/*
  Painting passes, drawn coarse to fine (like a real painter):

  blur        how much the reference image is softened for this pass.
              Blurry reference = broad color areas and smooth stroke flow.
  brushScale  stroke width relative to the "Brush size" slider.
  lengthEdge  stroke length on strong edges, as a multiple of stroke width.
  lengthFlat  stroke length in smooth areas, as a multiple of stroke width.
  edgeNorm    gradient magnitude treated as "a strong edge" in this pass.
  edgeBias    0 = strokes land anywhere, 1 = strokes land almost only on edges.
  share       portion of the remaining stroke budget given to this pass.
  coverage    true = place strokes on a jittered grid so no canvas is left bare.
*/
const LAYERS = [
  {
    name: "Blocking in colors",
    blur: 12,
    brushScale: 3.0,
    lengthEdge: 4,
    lengthFlat: 7,
    edgeNorm: 120,
    edgeBias: 0,
    angleJitter: 0.45,
    opacity: [0.85, 1],
    coverage: true,
  },
  {
    name: "Shaping forms",
    blur: 5,
    brushScale: 1.8,
    lengthEdge: 3.5,
    lengthFlat: 6.5,
    edgeNorm: 250,
    edgeBias: 0,
    angleJitter: 0.35,
    opacity: [0.8, 0.97],
    share: 0.375,
  },
  {
    name: "Adding detail",
    blur: 2,
    brushScale: 1.0,
    lengthEdge: 3,
    lengthFlat: 6,
    edgeNorm: 350,
    edgeBias: 0.7,
    angleJitter: 0.25,
    opacity: [0.68, 0.95],
    share: 0.375,
  },
  {
    name: "Final touches",
    blur: 0,
    brushScale: 0.5,
    lengthEdge: 2.5,
    lengthFlat: 5,
    edgeNorm: 400,
    edgeBias: 0.9,
    angleJitter: 0.2,
    opacity: [0.7, 0.95],
    share: 0.25,
  },
];

// The coverage pass uses at most this fraction of the total stroke budget.
const COVERAGE_BUDGET = 0.3;

// The painting is rendered at up to this many pixels on its long side.
// Brush sizes were tuned at REFERENCE_SIDE, so they scale with resolution.
const MAX_SIDE = 1024;
const REFERENCE_SIDE = 640;

// Canvas matches the photo's aspect ratio (no letterbox bars).
function getCanvasSize(imageWidth, imageHeight) {
  const scale = MAX_SIDE / Math.max(imageWidth, imageHeight);
  return {
    width: Math.max(1, Math.round(imageWidth * scale)),
    height: Math.max(1, Math.round(imageHeight * scale)),
  };
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

// Soften an image by repeatedly halving it and scaling it back up.
// (Works in every browser, unlike ctx.filter = "blur()".)
function makeBlurredCopy(source, width, height, factor) {
  if (factor <= 1) return source;

  const targetW = Math.max(2, Math.round(width / factor));
  const targetH = Math.max(2, Math.round(height / factor));

  let current = source;
  let curW = width;
  let curH = height;

  while (curW > targetW) {
    const nextW = Math.max(targetW, Math.floor(curW / 2));
    const nextH = Math.max(targetH, Math.floor(curH / 2));

    const step = createCanvas(nextW, nextH);
    const stepCtx = step.getContext("2d");
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = "high";
    stepCtx.drawImage(current, 0, 0, curW, curH, 0, 0, nextW, nextH);

    current = step;
    curW = nextW;
    curH = nextH;
  }

  const output = createCanvas(width, height);
  const outCtx = output.getContext("2d");
  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = "high";
  outCtx.drawImage(current, 0, 0, curW, curH, 0, 0, width, height);

  return output;
}

// Pixel colors + a brightness map for one pass.
function readLayerData(canvas, width, height) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const pixels = ctx.getImageData(0, 0, width, height).data;

  const brightness = new Float32Array(width * height);
  for (let i = 0; i < brightness.length; i++) {
    const p = i * 4;
    brightness[i] =
      0.299 * pixels[p] + 0.587 * pixels[p + 1] + 0.114 * pixels[p + 2];
  }

  return { pixels, brightness };
}

// Detect local edges using the Sobel operator.
function getImageGradient(brightness, x, y, width, height, edgeNorm) {
  const x0 = Math.max(0, x - 1);
  const x1 = Math.min(width - 1, x + 1);
  const y0 = Math.max(0, y - 1);
  const y1 = Math.min(height - 1, y + 1);

  const tl = brightness[y0 * width + x0];
  const tc = brightness[y0 * width + x];
  const tr = brightness[y0 * width + x1];
  const ml = brightness[y * width + x0];
  const mr = brightness[y * width + x1];
  const bl = brightness[y1 * width + x0];
  const bc = brightness[y1 * width + x];
  const br = brightness[y1 * width + x1];

  const gx = -tl + tr - 2 * ml + 2 * mr - bl + br;
  const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;

  const magnitude = Math.sqrt(gx * gx + gy * gy);

  return {
    angle: Math.atan2(gy, gx),
    strength: Math.min(1, magnitude / edgeNorm),
  };
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// How many strokes each pass gets, given the user's total stroke budget.
function planStrokeCounts(total, width, height, brushSize) {
  const coverageWidth = brushSize * LAYERS[0].brushScale * 0.675;
  const spacing = Math.max(2, coverageWidth);
  const gridCount =
    Math.ceil(width / spacing) * Math.ceil(height / spacing);

  const coverageCount = Math.max(
    1,
    Math.min(gridCount, Math.round(total * COVERAGE_BUDGET))
  );

  const remaining = Math.max(0, total - coverageCount);

  return LAYERS.map((layer, index) =>
    index === 0 ? coverageCount : Math.round(remaining * layer.share)
  );
}

// Decide where and how every stroke of one pass is placed.
function planLayerStrokes(layer, data, count, width, height, brushSize) {
  const { pixels, brightness } = data;
  const strokes = [];

  function makeStroke(x, y) {
    const gradient = getImageGradient(
      brightness,
      x,
      y,
      width,
      height,
      layer.edgeNorm
    );

    // Accept or reject this spot (detail passes favor edges).
    if (layer.edgeBias > 0) {
      const chance =
        1 - layer.edgeBias + layer.edgeBias * gradient.strength;
      if (Math.random() > chance) return null;
    }

    const index = (y * width + x) * 4;

    // Brushstrokes follow contours instead of random directions.
    const angle =
      gradient.angle +
      Math.PI / 2 +
      randomBetween(-layer.angleJitter, layer.angleJitter);

    // Short strokes near edges, longer strokes in smooth areas.
    // Length is relative to width so fine passes get fine strokes.
    const nominalWidth = brushSize * layer.brushScale * 0.675;
    const ratio =
      layer.lengthEdge +
      (1 - gradient.strength) * (layer.lengthFlat - layer.lengthEdge);
    const length = Math.max(
      2,
      nominalWidth * ratio * randomBetween(0.8, 1.2)
    );

    return {
      x,
      y,
      angle,
      length,
      color: `rgb(${pixels[index]}, ${pixels[index + 1]}, ${pixels[index + 2]})`,
      width: Math.max(
        1,
        brushSize * layer.brushScale * randomBetween(0.45, 0.9)
      ),
      opacity: randomBetween(layer.opacity[0], layer.opacity[1]),
      curve: length * randomBetween(-0.12, 0.12),
    };
  }

  if (layer.coverage) {
    // Jittered grid: guarantees the whole canvas gets paint.
    const spacing = Math.sqrt((width * height) / count);
    const points = [];

    for (let gy = spacing / 2; gy < height; gy += spacing) {
      for (let gx = spacing / 2; gx < width; gx += spacing) {
        const x = Math.floor(
          Math.min(width - 2, Math.max(1, gx + randomBetween(-spacing / 2, spacing / 2)))
        );
        const y = Math.floor(
          Math.min(height - 2, Math.max(1, gy + randomBetween(-spacing / 2, spacing / 2)))
        );
        points.push([x, y]);
      }
    }

    shuffle(points);

    for (const [x, y] of points) {
      const stroke = makeStroke(x, y);
      if (stroke) strokes.push(stroke);
    }

    return strokes;
  }

  // Other passes: random spots, with a cap on attempts so a very
  // selective pass can't loop forever on a flat image.
  const maxAttempts = count * 6;
  let attempts = 0;

  while (strokes.length < count && attempts < maxAttempts) {
    attempts++;

    const x = Math.floor(randomBetween(2, width - 2));
    const y = Math.floor(randomBetween(2, height - 2));

    const stroke = makeStroke(x, y);
    if (stroke) strokes.push(stroke);
  }

  return strokes;
}

function PaintingCanvas({ image, brushSize, strokeCount, paintRequest }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Latest settings, readable without re-triggering the paint effect.
  const settingsRef = useRef({ image, brushSize, strokeCount });
  // Last "Start painting" click already handled. Starting from the current
  // value stops a stale click from auto-painting a freshly mounted canvas.
  const handledRequestRef = useRef(paintRequest);
  // Stops a painting in progress (used when the photograph changes).
  const cancelPaintRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready to paint");

  useEffect(() => {
    settingsRef.current = { image, brushSize, strokeCount };
  });

  // Reset the canvas when a new photograph is uploaded.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    cancelPaintRef.current?.();

    const ctx = canvas.getContext("2d");
    let cancelled = false;

    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setProgress(0);
    setStatus("Ready to paint");

    // Match the canvas shape to the new photograph.
    const probe = new Image();
    probe.onload = () => {
      if (cancelled) return;
      const size = getCanvasSize(probe.naturalWidth, probe.naturalHeight);
      canvas.width = size.width; // resizing also clears the canvas
      canvas.height = size.height;
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, size.width, size.height);
    };
    if (image?.url) probe.src = image.url;

    return () => {
      cancelled = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [image]);

  // Generate and render the painting, one layer at a time.
  // Runs only when "Start painting" is clicked, never on setting changes.
  useEffect(() => {
    if (!paintRequest || paintRequest === handledRequestRef.current) return;
    handledRequestRef.current = paintRequest;

    const { image, brushSize, strokeCount } = settingsRef.current;
    if (!image?.url) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    let cancelled = false;

    cancelPaintRef.current = () => {
      cancelled = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    setProgress(0);
    setStatus("Analyzing image structure...");

    const sourceImage = new Image();

    sourceImage.onload = () => {
      if (cancelled) return;

      const size = getCanvasSize(
        sourceImage.naturalWidth,
        sourceImage.naturalHeight
      );
      const { width, height } = size;
      canvas.width = width;
      canvas.height = height;

      // Brush sizes, blur and edge thresholds scale with resolution.
      const res = Math.max(width, height) / REFERENCE_SIDE;
      const brush = brushSize * res;

      // Draw the photograph into an offscreen canvas.
      const baseCanvas = createCanvas(width, height);
      const baseCtx = baseCanvas.getContext("2d");

      baseCtx.fillStyle = BACKGROUND;
      baseCtx.fillRect(0, 0, width, height);

      baseCtx.drawImage(sourceImage, 0, 0, width, height);

      const counts = planStrokeCounts(strokeCount, width, height, brush);
      const totalPlanned = counts.reduce((sum, c) => sum + c, 0);

      // Start with a clean painting surface.
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, width, height);

      let layerIndex = -1;
      let strokes = [];
      let cursor = 0;
      let plannedBefore = 0;
      let strokesPerFrame = 1;

      function startNextLayer() {
        if (layerIndex >= 0) plannedBefore += counts[layerIndex];
        layerIndex++;

        if (layerIndex >= LAYERS.length) return false;

        const layer = LAYERS[layerIndex];

        setStatus(
          `Layer ${layerIndex + 1} of ${LAYERS.length} · ${layer.name}`
        );

        // Each pass looks at its own softened copy of the photograph.
        const reference = makeBlurredCopy(
          baseCanvas,
          width,
          height,
          layer.blur * res
        );
        const data = readLayerData(reference, width, height);

        strokes = planLayerStrokes(
          { ...layer, edgeNorm: layer.edgeNorm / res },
          data,
          counts[layerIndex],
          width,
          height,
          brush
        );
        cursor = 0;

        // Every layer takes roughly the same number of frames to paint.
        strokesPerFrame = Math.min(
          1500,
          Math.max(10, Math.ceil(strokes.length / 120))
        );

        return true;
      }

      function drawStroke(stroke) {
        const {
          x,
          y,
          angle,
          length,
          color,
          width: lineWidth,
          opacity,
          curve,
        } = stroke;

        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;

        const middleX = (x + endX) / 2;
        const middleY = (y + endY) / 2;

        const curveX = middleX + Math.cos(angle + Math.PI / 2) * curve;
        const curveY = middleY + Math.sin(angle + Math.PI / 2) * curve;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(curveX, curveY, endX, endY);

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = opacity;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.globalAlpha = 1;
      }

      function animate() {
        if (cancelled) return;

        for (
          let i = 0;
          i < strokesPerFrame && cursor < strokes.length;
          i++
        ) {
          drawStroke(strokes[cursor]);
          cursor++;
        }

        const layerFraction = strokes.length
          ? cursor / strokes.length
          : 1;

        const done =
          plannedBefore + layerFraction * counts[layerIndex];

        setProgress(
          Math.min(99, Math.round((done / totalPlanned) * 100))
        );

        if (cursor >= strokes.length) {
          if (!startNextLayer()) {
            setProgress(100);
            setStatus("Painting complete!");
            animationRef.current = null;
            return;
          }
        }

        animationRef.current = requestAnimationFrame(animate);
      }

      startNextLayer();
      animationRef.current = requestAnimationFrame(animate);
    };

    sourceImage.onerror = () => {
      if (!cancelled) {
        setStatus("Could not load this image. Try another one.");
      }
    };

    sourceImage.src = image.url;

    return () => {
      cancelled = true;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paintRequest]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <span style={styles.kicker}>LIVE OUTPUT</span>
          <h3 style={styles.title}>Your painting</h3>
        </div>

        <span style={styles.status}>
          <span
            style={{
              ...styles.dot,
              background: progress === 100 ? "#35a77b" : "#c58b42",
            }}
          />
          {status}
        </span>
      </div>

      <div style={styles.canvasFrame}>
        <canvas
          ref={canvasRef}
          width={640}
          height={420}
          style={styles.canvas}
        />
      </div>

      <div style={styles.progressSection}>
        <div style={styles.progressLabels}>
          <span>Painting progress</span>
          <strong>{progress}%</strong>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "22px",
    padding: "20px",
    border: "1px solid rgba(130, 110, 85, 0.16)",
    borderRadius: "16px",
    background: "#fffefa",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  kicker: {
    color: "#9a8065",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },
  title: {
    color: "#29251f",
    fontSize: "20px",
    margin: "5px 0 0",
  },
  status: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#766b5d",
    fontSize: "12px",
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    display: "inline-block",
  },
  canvasFrame: {
    overflow: "hidden",
    borderRadius: "10px",
    background: "#f5f2ec",
    border: "1px solid #eee8df",
  },
  canvas: {
    display: "block",
    width: "100%",
    height: "auto",
  },
  progressSection: {
    marginTop: "15px",
  },
  progressLabels: {
    display: "flex",
    justifyContent: "space-between",
    color: "#766b5d",
    fontSize: "12px",
    marginBottom: "8px",
  },
  progressTrack: {
    height: "5px",
    background: "#eee9e1",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #c58b42, #dfad65)",
    borderRadius: "10px",
    transition: "width 0.12s linear",
  },
};

export default PaintingCanvas;
