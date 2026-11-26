# 🎨 Paintstroke AI

### Every picture has a brushstroke story.

**Paintstroke AI** is an experimental, browser-based photo-to-painting application that recreates photographs as digital artwork using thousands of individually rendered brushstrokes.

Rather than applying a simple image filter, the application builds an artwork progressively: starting with broad colour regions, shaping forms, adding details, and finishing with fine brushwork.

| 🚀 Project link |
| :---: |
| 🌐 **[Launch Paintstroke AI](https://prashantjangir-git-hub.github.io/Paintstroke_AI/)** |



## ✨ Overview

Paintstroke AI explores what it might look like to watch a photograph being painted. Its custom procedural painting engine analyses image colours and visual structures, then uses that information to place textured strokes on an HTML Canvas.

The experience includes an interactive landing page with a cursor-responsive, liquid-inspired visual, as well as a painting workspace where users can upload an image, choose a rendering style, adjust settings, and export the finished result.

The current painting engine runs locally in the browser. It does not rely on a hosted AI inference service or a trained neural network.

## 🚀 Features

- **🖼️ Image Upload:** Select or drag and drop a photograph into the painting workspace.
- **🖌️ Stroke-by-Stroke Rendering:** Watch the image develop through thousands of individual brushstrokes.
- **🎨 Three Painting Styles:** Choose between Impressionist, Pencil Sketch, and Watercolor Blooms.
- **🧱 Multi-Pass Painting:** Four progressive stages build the artwork from broad colour regions to finer details.
- **💧 Watercolor Texture:** Generate soft, irregular watercolor-inspired blooms, ragged edges, dry-brush texture, and layered pigment.
- **✏️ Pencil Sketch:** Create a graphite-inspired appearance with fine marks, tonal shading, and sketch-like texture.
- **🖌️ Expressive Brushwork:** Use curved strokes, bristle tracks, pigment variation, and dry-brush effects for a painterly finish.
- **⚙️ Adjustable Brush Size:** Control the scale of generated brushstrokes.
- **🔢 Adjustable Stroke Count:** Set the number of strokes used to create the artwork.
- **⏩ Rendering Speed Control:** Adjust how quickly the painting process unfolds.
- **📊 Live Progress:** Follow the rendering process as the artwork is created.
- **⬇️ PNG Export:** Download the completed painting as a PNG image.
- **🫧 Interactive Liquid Hero:** Explore a shader-based, liquid-inspired visual that responds to pointer movement.
- **📱 Responsive Interface:** Use the studio interface across different screen sizes.

## 🖼️ Preview

### Landing Page

<img width="1190" height="623" alt="Paintstroke AI landing page" src="https://github.com/user-attachments/assets/26d5e3b1-0daa-4727-b349-7ce3f63ed711" />

### Painting Workspace

<img width="1085" height="674" alt="Paintstroke AI painting workspace" src="https://github.com/user-attachments/assets/5052ce8f-3f86-49e1-ab4f-7c8d959bebc6" />

### Painting in Progress

<img width="1054" height="679" alt="Painting in progress" src="https://github.com/user-attachments/assets/623aeab1-b05c-464c-8d76-20e477efc1e7" />

### Final Artwork

<img width="1047" height="675" alt="Final artwork" src="https://github.com/user-attachments/assets/90d97edc-5721-425c-8d76-20e477efc1e7" />

## 🧠 How It Works

Paintstroke AI uses a procedural, multi-layer rendering engine built with JavaScript and HTML Canvas. It samples image colours and analyses visual structure to decide where to place brushstrokes and how those strokes should look.

### Available Painting Styles

| Style | Visual Character |
|:---|:---|
| **Impressionist** | Expressive, layered brushwork that builds the image from broad colour regions to finer details. |
| **Pencil Sketch** | A graphite-inspired appearance created with fine marks, tonal shading, and sketch-like texture. |
| **Watercolor Blooms** | Soft, irregular pigment effects with translucent colour, ragged edges, and dry-brush texture. |

### The Four Painting Stages

The renderer builds the artwork through four progressive passes:

| Stage | Process | Purpose |
|:---|:---|:---|
| 01 | **Blocking in Colors** | Establishes broad colour regions using larger strokes. |
| 02 | **Shaping Forms** | Builds recognizable shapes and visual structure. |
| 03 | **Adding Detail** | Introduces smaller strokes and emphasises image contours. |
| 04 | **Final Touches** | Adds fine details and finishing brushwork. |

### Behind the Brushstrokes

The painting engine uses techniques such as:

- Image downsampling and blurring to analyse visual information at different scales.
- Pixel colour sampling to determine the colour of individual strokes.
- Image-gradient calculations to identify edges and help guide stroke direction.
- Variable brush widths, lengths, opacity, and curvature.
- Layered painting passes to build visual depth and texture.
- Progressive Canvas rendering to show the artwork as it develops.
- Time-budgeted rendering batches to help keep the interface responsive during larger painting jobs.
- Watercolor-specific rendering adjustments for softer blooms and controlled pigment buildup.

The landing-page liquid visual is a separate effect implemented with WebGL shaders. It uses animated, metaball-inspired forms and pointer-responsive deformation. It is a visual effect, not a physically accurate fluid simulation, and it is not part of the photo-to-painting algorithm.

> **About the AI name:** Despite its name, the current painting renderer is algorithmic and procedural. It does not currently use a trained machine-learning or neural-style-transfer model. Neural model integration is a possible future direction.

## 🛠️ Tech Stack

| Technology | Purpose |
|:---|:---|
| **React 19** | Component-based user interface |
| **Vite** | Development server and build tooling |
| **JavaScript** | Application logic and painting algorithms |
| **HTML5 Canvas** | Procedural brushstroke rendering |
| **WebGL / GLSL shaders** | Interactive liquid-inspired hero visual |
| **Framer Motion** | Interface animations and motion effects |
| **Lucide React** | Interface icons |
| **GitHub Actions** | Automated build and deployment workflow |
| **GitHub Pages** | Website hosting |

## 💻 Getting Started

You can run Paintstroke AI locally to explore the application or experiment with the painting engine.

### Prerequisites

- **Node.js:** 20.19+ or 22.12+
- **npm:** Included with Node.js
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/prashantjangir-git-hub/Paintstroke_AI.git
```

### 2. Navigate to the project directory

```bash
cd Paintstroke_AI
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown in your terminal (usually `http://localhost:5173/`).

### 5. Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

You can also run the project's linter with:

```bash
npm run lint
```

## 🎮 How to Use

1. Open the [Paintstroke AI Studio](https://prashantjangir-git-hub.github.io/Paintstroke_AI/).
2. Upload a photograph by dragging and dropping it into the workspace or browsing your files.
3. Choose one of the available styles: **Impressionist**, **Pencil Sketch**, or **Watercolor Blooms**.
4. Adjust the brush size, number of strokes, and rendering speed.
5. Click **Start Painting**.
6. Watch the painting engine progressively render your image.
7. When the rendering is complete, download your artwork as a PNG.

**Tip:** Try different combinations of brush size and stroke count to explore different textures and levels of detail. On the landing page, move your pointer over the liquid-inspired hero visual to interact with it.

## 🗺️ Project Structure

```text
Paintstroke_AI/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── FluidBlob.jsx
│   ├── PaintingCanvas.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── .oxlintrc.json
├── README.md
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## 🚧 Current Development Status

Paintstroke AI is an experimental project under active development. The current version provides a browser-based procedural painting experience with three rendering styles: Impressionist, Pencil Sketch, and Watercolor Blooms.

The renderer uses custom image-processing and Canvas-based drawing techniques. It progressively plans and renders strokes in multiple passes, with adjustable brush size, stroke count, and rendering speed. Rendering is performed locally in the browser.

The landing page also features a separate WebGL liquid-inspired visual with pointer-responsive deformation.

The project does not currently include a trained AI model or neural style-transfer pipeline. The name reflects the project's creative direction and potential future development.

## 🔮 Future Possibilities

Potential areas for future development include:

- Integration of neural style transfer or generative AI models.
- Additional artistic styles, such as charcoal and other traditional media.
- More sophisticated brush physics and pigment blending.
- Improved edge detection and stroke placement.
- Greater control over stroke length, direction, and density.
- Pause, resume, and replay functionality.
- Higher-resolution artwork exports.
- Additional painting controls and customization options.
- Further refinement of the interactive liquid hero visual.

## 🤝 Contributing

Suggestions, ideas, and contributions are welcome!

If you have an idea that could improve Paintstroke AI, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## 👨‍💻 Author

**Prashant Jangir**

Created with curiosity, code, and a little creativity.

---

<p align="center">
  <b>Paintstroke AI</b><br>
  <i>Turning pixels into paintings, one brushstroke at a time.</i>
  <br><br>
  ⭐ If you like the project, consider giving it a star!
</p>
