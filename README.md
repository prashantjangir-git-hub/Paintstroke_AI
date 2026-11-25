# Paintstroke AI

A browser-based, stroke-by-stroke photo-to-painting experiment built with React, Vite and Canvas.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This repository is configured to publish from GitHub Actions. Push to `main` and the workflow in `.github/workflows/deploy.yml` will build the Vite app and publish `dist/` to GitHub Pages.

In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.

Live site: https://prashantjangir-git-hub.github.io/Paintstroke_AI/

## Features

- Multi-pass painting: broad color blocking, form shaping, detail and finishing passes.
- Textured brush marks with layered pigment and fine bristle tracks.
- Adjustable brush size, stroke count and live rendering speed.
- Export completed paintings as PNG.

The renderer is a procedural Canvas-based painting engine; it does not currently call a hosted neural-network model.
