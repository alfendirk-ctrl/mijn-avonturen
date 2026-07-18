# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Mijn Avonturen" — a Dutch-language personal activities & vacation database, built as a **client-side React + Vite single-page app** and deployed as a static site to **GitHub Pages** under the path `/mijn-avonturen/`.

There is no backend. All data lives in the browser's `localStorage`.

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server → http://localhost:5173/mijn-avonturen/
npm run build      # production build to dist/
npm run preview    # serve the built dist/ → http://localhost:4173/mijn-avonturen/
```

There is no linter or test runner configured.

Note: the dev/preview URLs include the `/mijn-avonturen/` path because `base` is set to `/mijn-avonturen/` in `vite.config.js` (the site's GitHub Pages sub-path). Opening `localhost:5173/` without that suffix shows a blank page — always use the full path the CLI prints.

## Architecture

- **`src/main.jsx`** — React entry; mounts `<App>` and imports `src/styles.css`.
- **`src/App.jsx`** — the whole app. Holds all state, filtering, stats, and CRUD handlers; renders the header, the tab switcher, and one of two views. This is the file to read first.
  - A top-level tab toggles between two views: **Activiteiten** (the planner — search/filter bar, category chips, "Verras me" picker, activity grid) and **Hikes** (`HikesView`).
  - The **Hikes** view is a "saved for later" wishlist for the categories in `HIKE_CATEGORIES` (`"Hike NL"`, `"Hike"` in `seed.js`). Those categories are excluded from the planner (chips, grid, surprise, stats) and shown only in `HikesView`, grouped into Nederland / internationaal, with a per-card done toggle. There is no separate data type — hikes are ordinary activities whose `categorie` is one of `HIKE_CATEGORIES`, so the data model and `av_db` key are unchanged.
- **`src/data/seed.js`** — the default data and fixed option lists: `SEED_ACTIVITIES`, `SEED_CATEGORIES`, `STATUSES`, `COLOR_PALETTE`, `EMOJI_OPTIONS`, and the empty form templates. Edit here to change the starter content.
- **`src/useLocalStorage.js`** — a `useState` wrapper that persists to `localStorage`.
- **`src/components/`** — presentational pieces: `Header`, `ActivityCard`, `DetailModal` (both the read-only view *and* the add/edit form, switched by a `mode` prop), `ConfirmDialog`, `SettingsPanel` (category management), `Toast`.
- **`src/styles.css`** — all styling, plain CSS with class names matching the JSX (`.card`, `.chip`, `.modal`, `.vbtn`, …). All animation is CSS keyframes; there is no animation library. Fonts (Syne, DM Sans) load from Google Fonts via `@import`.

### Data model

Two `localStorage` keys, **which must not be renamed** or existing users lose their data:

- **`av_db`** — array of activities: `{ id, naam, locatie, categorie, type, link, notities, status, periode }`. `status` is one of `"wil doen"`, `"gedaan"`, `"favoriet"` (the keys of `STATUSES`).
- **`av_cats`** — object mapping a category name → `{ emoji, kleur, gradient }`.

An activity's `categorie` is a string that keys into `av_cats`; unknown categories fall back to `FALLBACK_CATEGORY`. Deleting a category either reassigns its activities to another category or removes them (see `removeCategory` in `App.jsx`).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages. The workflow uses `actions/configure-pages` with `enablement: true`, so it turns Pages on and puts it in "GitHub Actions" mode automatically — no manual *Settings → Pages* change is needed (unless an org policy blocks the Actions token from managing Pages, in which case set the Source to "GitHub Actions" by hand). Files in `public/` (`manifest.json`, `.nojekyll`) are copied into `dist/` as-is.

Because `base` is `/mijn-avonturen/`, all built asset URLs are prefixed accordingly — do not hardcode absolute `/asset` paths in code; let Vite handle them.
