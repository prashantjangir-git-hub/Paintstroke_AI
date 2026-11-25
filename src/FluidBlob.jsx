import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentShader = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uPressure;
uniform vec2 uPointerVelocity;

float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / max(k1, 0.0001);
}
float smin(float a, float b, float k) {
  float h = max(k - abs(a-b), 0.0) / k;
  return min(a,b) - h*h*k*0.25;
}

float scene(vec3 p) {
  float t = uTime;
  vec3 q = p;

  // Keep the underlying mass calm and rounded. The tiny animation is deliberately
  // low-amplitude so the silhouette never collapses into spikes or thin tendrils.
  q.x += 0.012 * sin(t * 0.72 + p.y * 1.8);
  q.y += 0.014 * cos(t * 0.64 + p.x * 1.7);

  float d = sdEllipsoid(q - vec3(-0.06, 0.00, 0.00), vec3(0.47, 0.39, 0.36));
  d = smin(d, sdEllipsoid(q - vec3(-0.37, 0.17 + 0.018*sin(t*0.55), 0.00), vec3(0.27,0.27,0.29)), 0.27);
  d = smin(d, sdEllipsoid(q - vec3(0.34, 0.16 + 0.020*cos(t*0.58), 0.01), vec3(0.29,0.27,0.29)), 0.28);
  d = smin(d, sdEllipsoid(q - vec3(0.23,-0.31 + 0.018*sin(t*0.62),0.00), vec3(0.29,0.25,0.28)), 0.27);
  d = smin(d, sdEllipsoid(q - vec3(-0.31,-0.30 + 0.016*cos(t*0.60),0.01), vec3(0.25,0.25,0.27)), 0.26);
  d = smin(d, sdEllipsoid(q - vec3(-0.02,0.43 + 0.014*sin(t*0.5),0.02), vec3(0.21,0.21,0.23)), 0.23);

  // Cursor interaction is a soft pressure dent, not an extra blob. This avoids
  // the sharp pinched centre and detached spike shapes from the previous version.
  vec2 delta = q.xy - uPointer;
  float cursorFalloff = exp(-dot(delta, delta) * 6.0) * uPointerActive;
  float speed = min(length(uPointerVelocity), 1.0);
  float pressure = 0.72 + 0.28 * uPressure;
  d += cursorFalloff * (0.075 + 0.035 * pressure + 0.018 * speed);

  return d;
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0018, 0.0);
  return normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy), scene(p+e.yxy)-scene(p-e.yxy), scene(p+e.yyx)-scene(p-e.yyx)));
}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5*uResolution) / uResolution.y;
  vec3 ro = vec3(0.0, 0.0, 3.15);
  vec3 rd = normalize(vec3(uv*0.96, -1.9));
  float travel = 0.0;
  float hit = -1.0;
  for (int i=0; i<76; i++) {
    vec3 p = ro + rd*travel;
    float dist = scene(p);
    if (dist < 0.0025) { hit = travel; break; }
    travel += max(dist*0.72, 0.007);
    if (travel > 6.0) break;
  }

  vec3 color = vec3(0.0);
  float alpha = 0.0;
  if (hit > 0.0) {
    vec3 p = ro + rd*hit;
    vec3 n = normalAt(p);
    vec3 lightDir = normalize(vec3(-0.55,0.8,1.1));
    float diffuse = max(dot(n,lightDir),0.0);
    float softLight = 0.55 + 0.45*diffuse;
    float palette = smoothstep(-0.68,0.68,p.x + 0.22*p.y + 0.10*sin(p.y*4.0));
    vec3 peach = vec3(1.00,0.57,0.39);
    vec3 coral = vec3(0.98,0.30,0.34);
    vec3 rose = vec3(0.98,0.43,0.61);
    vec3 pink = vec3(0.95,0.20,0.66);
    color = mix(peach, coral, smoothstep(0.05,0.68,palette));
    color = mix(color, rose, smoothstep(0.35,0.95,p.y + 0.28*p.x)*0.58);
    color = mix(color, pink, smoothstep(0.52,1.0,p.x - 0.18*p.y)*0.68);
    // Broad diffuse shading keeps the material soft and satin-like, not chrome or glass.
    color *= softLight;
    color += vec3(1.0,0.72,0.63) * pow(max(dot(n,lightDir),0.0),5.0)*0.10;
    color = mix(color, color*vec3(0.96,0.82,0.84), 0.08);
    alpha = 1.0;
  }
  gl_FragColor = vec4(color, alpha);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || "Shader compilation failed");
  }
  return shader;
}

export default function FluidBlob() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true, powerPreference: "high-performance" });
    if (!gl) return undefined;

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch (error) {
      console.error("Fluid artwork could not initialize:", error);
      return undefined;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    gl.clearColor(0, 0, 0, 0);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const names = ["uResolution", "uTime", "uPointer", "uPointerActive", "uPressure", "uPointerVelocity"];
    const uniforms = Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)]));

    let width = 0, height = 0, frame = 0, start = performance.now();
    let target = [0, 0], pointer = [0, 0], previous = [0, 0], velocity = [0, 0];
    let active = 0, pressure = 0, lastMove = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
      width = Math.max(1, Math.floor(rect.width * ratio));
      height = Math.max(1, Math.floor(rect.height * ratio));
      canvas.width = width; canvas.height = height;
      gl.viewport(0, 0, width, height);
    };
    const move = (event) => {
      const rect = canvas.getBoundingClientRect();
      target = [((event.clientX-rect.left)/rect.width-0.5)*2.0, -((event.clientY-rect.top)/rect.height-0.5)*2.0];
      const now = performance.now();
      const dt = Math.max(8, now - (lastMove || now));
      const nextVelocity = [(target[0]-previous[0])/(dt/16.67), (target[1]-previous[1])/(dt/16.67)];
      velocity = [Math.max(-1.8,Math.min(1.8,nextVelocity[0])), Math.max(-1.8,Math.min(1.8,nextVelocity[1]))];
      previous = [...target];
      lastMove = now;
      active = 1;
      pressure = event.buttons ? 1.0 : 0.72;
    };
    const down = (event) => { move(event); pressure = 1.0; };
    const leave = () => { active = 0; pressure = 0; velocity = [0,0]; };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointerleave", leave);

    const render = (now) => {
      const elapsed = (now-start)/1000;
      // Low-latency tracking makes the fluid follow small cursor movements immediately.
      pointer[0] += (target[0]-pointer[0])*0.48;
      pointer[1] += (target[1]-pointer[1])*0.48;
      velocity[0] *= 0.94;
      velocity[1] *= 0.94;
      gl.useProgram(program);
      gl.uniform2f(uniforms.uResolution, width, height);
      gl.uniform1f(uniforms.uTime, elapsed);
      gl.uniform2f(uniforms.uPointer, pointer[0], pointer[1]);
      gl.uniform1f(uniforms.uPointerActive, active);
      gl.uniform1f(uniforms.uPressure, pressure);
      gl.uniform2f(uniforms.uPointerVelocity, velocity[0], velocity[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointerleave", leave);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-blob-canvas" aria-label="Interactive soft liquid metaball artwork. Move your pointer through the droplets to push, stretch and merge them." />;
}
