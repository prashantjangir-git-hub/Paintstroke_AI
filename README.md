# 🎨 Paintstroke AI

### Every picture has a brushstroke story.

**Paintstroke AI** is an experimental browser-based photo-to-painting application that transforms ordinary photographs into artistic paintings through thousands of individually rendered brushstrokes.

Instead of simply applying a filter, Paintstroke AI recreates the painting process: building up colors, shaping forms, adding details, and applying finishing touches, one stroke at a time.

🌐 **[Live Demo](https://prashantjangir-git-hub.github.io/Paintstroke_AI/)**

## ✨ Overview

What if you could watch a photograph being painted by an artist?

Paintstroke AI explores this idea through a custom procedural painting engine built with HTML Canvas. It analyses image colours and visual structures to generate textured brushstrokes that gradually recreate the original photograph as a painting.

The landing page introduces the project with an animated, cursor-responsive liquid artwork. The painting workspace remains focused on the photo-to-painting experience.

The result is not just an image transformation; it's a visualisation of the artistic process itself.

## 🚀 Features

- **🖼️ Image Upload:** Upload your own photographs and transform them into paintings.
- **🖌️ Stroke-by-Stroke Rendering:** Watch your painting emerge through thousands of individual brushstrokes.
- **🎨 Multi-Pass Painting:** Four progressive painting stages build the artwork from broad colour regions to fine details.
- **💧 Watercolor Blooms:** Creates soft, irregular watercolor-like blooms and pigment textures.
- **✏️ Pencil Sketch Style:** Creates a graphite-inspired look using fine pencil strokes, sketch-like shading, and cross-hatching.
- **🖌️ Thick Impasto Style:** Uses bold, chunky strokes and layered paint textures to create a thick, expressive oil-painting effect.
- **🧭 Multiple Artistic Styles:** Switch between distinct rendering approaches, including the original painterly style, Watercolor Blooms, Pencil Sketch, and Thick Impasto.
- **✨ Textured Brushstrokes:** Curved strokes, bristle tracks, pigment variation, and subtle dry-brush effects create a painterly appearance.
- **⚙️ Customizable Brush Size:** Adjust brush size to influence the scale of generated strokes.
- **🔢 Adjustable Stroke Count:** Choose the number of strokes used to build the artwork.
- **⏩ Rendering Speed Control:** Adjust how quickly the painting process unfolds.
- **📊 Live Progress:** Follow the painting process with real-time progress updates.
- **⬇️ Export Artwork:** Download your completed painting as a PNG image.
- **🫧 Interactive Liquid Hero:** The landing page features a large, animated, multi-blob liquid-inspired visual with warm coral, peach, orange, and pink gradients. It responds to pointer movement with smooth deformation and appears over the page's existing background.
- **📱 Interactive Interface:** A responsive studio interface with smooth animations and interactive visual elements.

## 🖼️ Preview

### Landing Page

<img width="1190" height="623" alt="image" src="https://github.com/user-attachments/assets/26d5e3b1-0daa-4727-b349-7ce3f63ed711" />


### Painting Workspace

<img width="1085" height="674" alt="image" src="https://github.com/user-attachments/assets/5052ce8f-3f86-49e1-ab4f-7c8d959bebc6" />


### Painting in Progress

<img width="1054" height="679" alt="Painting in progress" src="https://github.com/user-attachments/assets/623aeab1-b05c-464b-847a-59ff709b4986" />

### Final Artwork

<img width="1047" height="675" alt="Final artwork" src="https://github.com/user-attachments/assets/90d97edc-5721-425c-8d76-20e477efc1e7" />

## 🧠 How It Works

Paintstroke AI uses a procedural, multi-layer Canvas rendering engine to recreate photographs as paintings.

The painting process can be experienced through different artistic styles. Each style changes the way strokes, shading, and texture are generated.

### Artistic Styles

| Style | Visual Character |
|:---|:---|
| **Impressionist / Painterly** | Layered, expressive brushwork that builds the image from broad colour regions to finer details. |
| **Watercolor Blooms** | Soft, irregular pigment blooms and translucent colour effects inspired by watercolor painting. |
| **Pencil Sketch** | Fine graphite-like marks, tonal shading, and cross-hatched strokes for a hand-drawn sketch appearance. |
| **Thick Impasto** | Bold, heavy strokes and layered pigment textures inspired by thick oil paint and palette-knife techniques. |

### The Four Painting Stages

The multi-pass painting workflow consists of four stages:

| Stage | Process | Purpose |
|:---|:---|:---|
| 01 | **Blocking in Colors** | Establishes broad color regions using larger brushstrokes. |
| 02 | **Shaping Forms** | Builds recognizable shapes and visual structure. |
| 03 | **Adding Details** | Introduces smaller strokes and emphasises image contours. |
| 04 | **Final Touches** | Adds fine details and finishing brushwork. |

### Behind the Brushstrokes

The painting engine uses several techniques to generate the artwork:

- Image downsampling and blurring to analyse visual information at different levels.
- Pixel colour sampling to determine the pigment of individual strokes.
- Image gradients to identify edges and guide brushstroke directions.
- Variable brush widths, lengths, opacity, and curvature.
- Layered painting passes to build visual depth and texture.
- Progressive Canvas rendering to display the painting as it develops.
- Time-budgeted rendering batches to help keep the interface responsive during large painting jobs.
- Watercolor-specific rendering adjustments to limit excessive pigment buildup while retaining soft, irregular bloom characteristics.

The landing-page liquid visual is a separate interactive visual effect. It uses animated, metaball-inspired forms and pointer-responsive deformation; it is not part of the photo-to-painting algorithm and should not be confused with a physically accurate fluid simulation.

The painting result is rendered directly in the browser without requiring a hosted AI inference service.

## 🛠️ Tech Stack

| Technology | Purpose |
|:---|:---|
| **React 19** | Component-based user interface |
| **Vite** | Development server and build tooling |
| **HTML5 Canvas** | Procedural painting and brushstroke rendering |
| **JavaScript** | Painting algorithms and application logic |
| **WebGL / shader-based rendering** | Interactive liquid-inspired hero visual |
| **Framer Motion** | Interface animations and motion effects |
| **Lucide React** | Interface icons |
| **GitHub Actions** | Automated deployment |
| **GitHub Pages** | Website hosting |

## 💻 Getting Started

Want to run Paintstroke AI locally or experiment with the painting engine?

Follow these steps.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (Node.js 22 or newer recommended)
- npm (included with Node.js)
- Git

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

Open the local URL displayed in your terminal (usually `http://localhost:5173/`).

### 5. Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🎮 How to Use

1. Open the [Paintstroke AI Studio](https://prashantjangir-git-hub.github.io/Paintstroke_AI/).
2. Upload a photograph by dragging and dropping it into the workspace or browsing your files.
3. Choose an artistic style, such as Impressionist / Painterly, Watercolor Blooms, Pencil Sketch, or Thick Impasto.
4. Customize the available brush settings, stroke count, and rendering speed.
5. Click **Start Painting**.
6. Watch as the engine progressively transforms your photograph.
7. Once rendering is complete, download your artwork as a PNG.

**Tip:** Experiment with different brush sizes and stroke counts to explore different levels of texture and detail. On the landing page, move your pointer over the liquid hero artwork to interact with its deformation.

## 🗺️ Project Structure

```text
Paintstroke_AI/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   └── hero.png
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── PaintingCanvas.jsx
│   ├── index.css
│   └── main.jsx
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

*The structure above reflects the project layout documented for this version. Individual implementation files may change as development continues.*

## 🚧 Current Development Status

Paintstroke AI is an ongoing experimental project.

The current implementation focuses on developing a procedural painting engine capable of generating painterly effects through custom image-processing and Canvas-based drawing techniques. It includes multiple rendering styles, including Watercolor Blooms, Pencil Sketch, and Thick Impasto.

The Watercolor Blooms renderer is designed to retain soft, irregular bloom effects while limiting excessive pigment accumulation. Rendering work is also organised into time-budgeted batches to help maintain interface responsiveness when processing large stroke counts.

The landing page includes a separate, animated liquid-inspired hero visual with pointer-responsive deformation. This is a visual interaction effect, not a physical fluid simulation.

The painting renderer uses custom image-processing and Canvas-based algorithms rather than a trained neural network. Painting results are generated locally in the browser and do not require a hosted AI inference service.

## 🔮 Future Possibilities

There is plenty of room to take Paintstroke AI further.

Some potential directions include:

- Integration of neural style transfer or generative AI models.
- Additional artistic styles, such as Charcoal and other traditional media.
- More sophisticated brush physics and pigment blending.
- Improved edge detection and stroke placement.
- Better control over stroke length, direction, and density.
- Pause, resume, and replay functionality.
- Higher-resolution artwork exports.
- Additional painting controls and customisation options.
- Further refinement of the interactive liquid hero animation.

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
