# 🎨 Paintstroke AI

### Every picture has a brushstroke story.

**Paintstroke AI** is an experimental browser-based photo-to-painting application that transforms ordinary photographs into artistic paintings through thousands of individually rendered brushstrokes.

Instead of simply applying a filter, Paintstroke AI recreates the painting process — building up colors, shaping forms, adding details, and applying finishing touches, one stroke at a time.

<table>
  <tr>
    <td>
      🌐 <strong><a href="https://github.io">Live Demo</a></strong>
    </td>
  </tr>
</table>

## ✨ Overview

What if you could watch a photograph being painted by an artist?

Paintstroke AI explores this idea through a custom procedural painting engine built with HTML Canvas. It analyzes image colors and visual structures to generate textured brushstrokes that gradually recreate the original photograph as a painting.

The result is not just an image transformation — it's a visualization of the artistic process itself.

## 🚀 Features

- **🖼️ Image Upload:** Upload your own photographs and transform them into paintings.
- **🖌️ Stroke-by-Stroke Rendering:** Watch your painting emerge through thousands of individual brushstrokes.
- **🎨 Multi-Pass Painting:** Four progressive painting stages build the artwork from broad color regions to fine details.
- **✨ Textured Brushstrokes:** Layered pigment, curved strokes, bristle tracks, and subtle dry-brush effects create a painterly appearance.
- **⚙️ Customizable Brush Size:** Adjust brush size to influence the scale of generated strokes.
- **🔢 Adjustable Stroke Count:** Choose between 5,000 and 1,000,000 strokes.
- **⏩ Rendering Speed Control:** Adjust how quickly the painting process unfolds.
- **📊 Live Progress:** Follow the painting process with real-time progress updates.
- **⬇️ Export Artwork:** Download your completed painting as a PNG image.
- **📱 Interactive Interface:** A responsive studio interface with smooth animations and interactive visual elements.

## 🖼️ Preview

<!-- Add screenshots of your application here -->

| Landing Page | Painting Workspace |
|:---:|:---:|
| Add landing page screenshot | Add workspace screenshot |

| Painting in Progress | Final Artwork |
|:---:|:---:|
| Add progress screenshot | Add completed painting screenshot |

## 🧠 How It Works

Paintstroke AI uses a procedural, multi-layer Canvas rendering engine to recreate photographs as paintings.

The painting process consists of four stages:

| Stage | Process | Purpose |
|:---|:---|:---|
| 01 | **Blocking in Colors** | Establishes broad color regions using larger brushstrokes. |
| 02 | **Shaping Forms** | Builds recognizable shapes and visual structure. |
| 03 | **Adding Details** | Introduces smaller strokes and emphasizes image contours. |
| 04 | **Final Touches** | Adds fine details and finishing brushwork. |

### Behind the Brushstrokes

The engine uses several techniques to generate the painting:

- Image downsampling and blurring to analyze visual information at different levels.
- Pixel color sampling to determine the pigment of individual strokes.
- Image gradients to identify edges and guide brushstroke directions.
- Variable brush widths, lengths, opacity, and curvature.
- Multiple overlapping painting passes to build visual depth and texture.
- Progressive Canvas rendering to display the painting as it develops.

The final result is rendered directly in the browser without requiring a hosted AI inference service.

## 🛠️ Tech Stack

| Technology | Purpose |
|:---|:---|
| **React 19** | Component-based user interface |
| **Vite** | Development server and build tooling |
| **HTML5 Canvas** | Procedural painting and brushstroke rendering |
| **JavaScript** | Painting algorithms and application logic |
| **Framer Motion** | Animations and interactive 3D effects |
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
3. Customize the brush size, stroke count, and rendering speed.
4. Click **Start Painting**.
5. Watch as the engine progressively transforms your photograph.
6. Once rendering is complete, download your artwork as a PNG.

**Tip:** Experiment with different brush sizes and stroke counts to explore different levels of texture and detail.

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

## 🚧 Current Development Status

Paintstroke AI is an ongoing experimental project.

The current implementation focuses on developing a procedural painting engine capable of generating increasingly realistic painterly effects.

Some interface options, such as the painting style selector, are currently placeholders for future development.

The current renderer uses custom image-processing and Canvas-based algorithms rather than a trained neural network.

## 🔮 Future Possibilities

There is plenty of room to take Paintstroke AI further.

Some potential directions include:

- Integration of neural style transfer or generative AI models.
- More distinct artistic styles, including Impressionism, Oil Painting, and Watercolor.
- More sophisticated brush physics and pigment blending.
- Improved edge detection and stroke placement.
- Better control over stroke length, direction, and density.
- Pause, resume, and replay functionality.
- Higher-resolution artwork exports.
- Additional painting controls and customization options.

## 🤝 Contributing

Suggestions, ideas, and contributions are welcome!

If you have an idea that could make Paintstroke AI better, feel free to open an issue or submit a pull request.

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
