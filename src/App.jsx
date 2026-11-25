
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Paintbrush,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Settings2,
  Play,
  Download,
  ArrowUpRight,
  WandSparkles,
  Layers3,
  Clock3,
  X,
} from "lucide-react";
import "./App.css";
import PaintingCanvas from "./PaintingCanvas";
import FluidBlob from "./FluidBlob";

function App() {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [strokeCount, setStrokeCount] = useState(5000);
  const [renderSpeed, setRenderSpeed] = useState(1);
  const [style, setStyle] = useState("Impressionist");
  const [paintRequest, setPaintRequest] = useState(0);
  // Mouse-responsive 3D movement
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const paintingSectionRef = useRef(null);
  useEffect(() => {
    if (paintRequest > 0) {
      paintingSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [paintRequest]);
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [8, -8]),
    { stiffness: 150, damping: 20 }
  );

  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-10, 10]),
    { stiffness: 150, damping: 20 }
  );

  useEffect(() => {
    return () => {
      if (image?.url) URL.revokeObjectURL(image.url);
    };
  }, [image]);

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;

    if (image?.url) URL.revokeObjectURL(image.url);

    setImage({
      name: file.name,
      url: URL.createObjectURL(file),
    });
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#">
          <div className="brand-icon">
            <Paintbrush size={21} />
          </div>
          <span>
            paintstroke<span className="brand-ai">.ai</span>
          </span>
        </a>

        <nav className="top-nav">
          <a className="active" href="#studio">Studio</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>

        <div className="top-actions">
          <span className="engine-status">
            <span className="status-dot" />
            Engine in development
          </span>

          <a
            className="github-link"
            href="https://github.com/prashantjangir-git-hub/Paintstroke_AI"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
          >
            <ArrowUpRight size={19} />
          </a>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow">
              <Sparkles size={14} />
              <span>ART MEETS ARTIFICIAL INTELLIGENCE</span>
            </div>

            <h1>
              Every picture has
              <br />
              a <span className="gradient-text">brushstroke story.</span>
            </h1>

            <p className="hero-description">
              Watch artificial intelligence transform your photographs
              into paintings, one brushstroke at a time.
            </p>

            <a href="#studio" className="hero-cta">
              Explore the studio <ArrowUpRight size={16} />
            </a>
          </motion.div>

          {/* INTERACTIVE 3D ARTWORK */}
          <motion.div
            className="hero-art-stage"
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1000,
            }}
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse") return;

              const rect = e.currentTarget.getBoundingClientRect();

              pointerX.set(
                (e.clientX - rect.left) / rect.width - 0.5
              );

              pointerY.set(
                (e.clientY - rect.top) / rect.height - 0.5
              );
            }}
            onPointerLeave={() => {
              pointerX.set(0);
              pointerY.set(0);
            }}
          >
            <FluidBlob />
          </motion.div>
        </section>

        {/* PAINTING WORKSPACE */}
        <section className="studio-layout" id="studio">
          <div className="workspace-card">
            <div className="workspace-header">
              <div>
                <div className="section-kicker">YOUR CANVAS</div>
                <h2>Painting workspace</h2>
              </div>

              {image && (
                <button
                  className="icon-button"
                  onClick={() => setImage(null)}
                  title="Remove image"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div
              className={`upload-area ${dragging ? "dragging" : ""} ${image ? "has-image" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !image && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !image) {
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {image ? (
                <div className="image-preview">
                  <img
                    src={image.url}
                    alt="Your uploaded photograph"
                  />

                  <div className="image-overlay">
                    <span>
                      <ImageIcon size={15} />
                      {image.name}
                    </span>

                    <button
                      className="change-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Change image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="upload-content">
                  <div className="upload-icon">
                    <Upload size={25} />
                  </div>

                  <h3>Drop your image here</h3>
                  <p>or click to browse files</p>

                  <span className="file-types">
                    PNG · JPG · WEBP · Up to 20 MB
                  </span>
                </div>
              )}
            </div>

            <div className="canvas-footer">
              <div className="canvas-info">
                <span className="live-indicator" />
                {image
                  ? "Image loaded successfully"
                  : "Waiting for an image"}
              </div>

              <span className="canvas-resolution">
                {image ? "Original resolution" : "Canvas · 1024 × 1024"}
              </span>
            </div>
          </div>

          {/* SETTINGS PANEL */}
          <aside className="settings-card">
            <div className="settings-heading">
              <div className="settings-heading-icon">
                <Settings2 size={18} />
              </div>

              <div>
                <div className="section-kicker">CUSTOMIZE</div>
                <h2>Painting settings</h2>
              </div>
            </div>

            <div className="setting-group">
              <label>Painting style</label>

              <div className="style-options">
                {["Impressionist", "Pencil Sketch", "Watercolor Blooms"].map(
                  (item) => (
                    <button
                      key={item}
                      className={`style-option ${style === item ? "selected" : ""}`}
                      onClick={() => setStyle(item)}
                    >
                      {item}
                      {style === item && (
                        <span className="selected-dot" />
                      )}
                    </button>
                  )
                )}
              </div>

              <p className="setting-note">
                Choose your finish: expressive brushwork, graphite sketching, or broad watercolor brushstrokes with ragged edges, dry-brush texture and layered pigment.
              </p>
            </div>

            <div className="setting-divider" />

            <div className="setting-group">
              <div className="setting-label-row">
                <label htmlFor="brush-size">Brush size</label>
                <span className="setting-value">{brushSize}</span>
              </div>

              <input
                id="brush-size"
                type="range"
                min="1"
                max="10"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
              />

              <div className="range-labels">
                <span>Fine details</span>
                <span>Broad strokes</span>
              </div>
            </div>

            <div className="setting-divider" />

            <div className="setting-group">
              <div className="setting-label-row">
                <label htmlFor="stroke-count">Number of strokes</label>
                <span className="setting-value">{strokeCount}</span>
              </div>

              <input
                id="stroke-count"
                type="range"
                min="5000"
                max="1500000"
                step="5000"
                value={strokeCount}
                onChange={(e) => setStrokeCount(Number(e.target.value))}
              />

              <div className="range-labels">
                <span>5,000 · Faster</span>
                <span>1,500,000 · More detail</span>
              </div>
            </div>

            <div className="setting-divider" />

            <div className="setting-group">
              <div className="setting-label-row">
                <label htmlFor="render-speed">Rendering speed</label>
                <span className="setting-value">{renderSpeed.toFixed(2)}×</span>
              </div>

              <input
                id="render-speed"
                type="range"
                min="0.25"
                max="4"
                step="0.25"
                value={renderSpeed}
                onChange={(e) => setRenderSpeed(Number(e.target.value))}
              />

              <div className="range-labels">
                <span>Slow · more gradual</span>
                <span>Fast · 4×</span>
              </div>
            </div>

            <div className="setting-divider" />

            <div className="model-info">
              <div className="model-info-icon">
                <WandSparkles size={17} />
              </div>

              <div>
                <strong>Layered brushstroke engine</strong>
                <p>Soft, irregular watercolor blooms with feathered edges and layered pigment.</p>
              </div>
            </div>

            <button
              className="paint-button"
              disabled={!image}
              onClick={() => setPaintRequest((previous) => previous + 1)}
            >
              <Play size={17} fill="currentColor" />
              Start painting
              <span className="coming-soon">
                {paintRequest > 0 ? "REPAINT" : "START"}
              </span>
            </button>

            <p className="button-caption">
              Experimental brushstroke renderer · Neural model coming next.
            </p>
          </aside>
        </section>

        {/* FEATURES */}
        <section className="features" id="how-it-works">
          <div className="feature-item">
            <div className="feature-icon">
              <Layers3 size={19} />
            </div>
            <div>
              <strong>Stroke by stroke</strong>
              <p>Watch every brushstroke unfold.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <Clock3 size={19} />
            </div>
            <div>
              <strong>Your own pace</strong>
              <p>Pause, replay and explore the process.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <Download size={19} />
            </div>
            <div>
              <strong>Take your art home</strong>
              <p>Download the final painting.</p>
            </div>
          </div>
        </section>
        {image && (
          <div ref={paintingSectionRef}>
            <PaintingCanvas
              image={image}
              brushSize={brushSize}
              strokeCount={strokeCount}
              renderSpeed={renderSpeed}
              style={style}
              paintRequest={paintRequest}
            />
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer" id="about">
          <span>© 2026 Paintstroke AI</span>
          <span>Made with curiosity and a little creativity.</span>

          <a
            href="https://github.com/prashantjangir-git-hub/Paintstroke_AI"
            target="_blank"
            rel="noreferrer"
          >
            Open source <ArrowUpRight size={13} />
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
