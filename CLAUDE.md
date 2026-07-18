# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This repo does **not** contain application source code. It holds the **compiled production build** of "Mijn Avonturen" (a Dutch-language personal activities & vacation database PWA), deployed as a static site to **GitHub Pages**.

Everything tracked here is build output:

- `index.html` — entry point; loads a single hashed ES module bundle.
- `assets/index-*.js` — the entire minified React application in one bundle (React + Framer Motion, client-side only).
- `manifest.json` — PWA manifest (standalone display, theme `#6366F1`, dark background `#0C0C14`).
- `.nojekyll` — disables Jekyll so GitHub Pages serves the `assets/` directory verbatim.

The original Vite/React source project lives elsewhere and is **not** part of this repository.

## Key implications for working here

- **There is no build, lint, or test step in this repo.** No `package.json`, no `node_modules`, no tooling. Do not attempt `npm install`, `npm run build`, or run a test runner — none exist.
- **The `assets/*.js` bundle is a generated artifact.** Do not hand-edit minified bundle code to change app behavior; that belongs in the upstream source project. Editing here is only appropriate for deploy-level concerns (the HTML shell, manifest, base paths).
- **Base path is hardcoded to `/mijn-avonturen/`.** GitHub Pages serves this project under that sub-path, so `index.html` references `/mijn-avonturen/assets/...` (absolute, path-prefixed). Any new asset reference must keep this prefix or it will 404 in production.
- **App data is stored in the browser's `localStorage`** (JSON-serialized). The app has no backend/API — it is fully client-side. There is nothing server-side to configure.

## Deployment workflow

Deploys happen by committing a fresh bundle. The commit history shows the pattern:

1. A new `assets/index-<hash>.js` is added (the freshly built bundle from the upstream source).
2. `index.html` is updated to point its `<script src>` at the new hash.
3. The previous bundle is removed.

When updating the deployed app, keep `index.html`'s script `src` hash in sync with the actual filename in `assets/`, and preserve the `/mijn-avonturen/` prefix and the `.nojekyll` file.

## Verifying changes

Since there is no build tooling, verify locally by serving the directory statically (e.g. `python3 -m http.server`) and loading it. Note that the app expects to live under a `/mijn-avonturen/` path, so a plain server at the repo root will fail to load the bundle unless that path prefix is reproduced.
