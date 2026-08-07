# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Mijn Avonturen" — a Dutch-language personal activities & vacation database, built as a **client-side React + Vite single-page app** and deployed as a static site to **GitHub Pages** under the path `/mijn-avonturen/`.

There is no backend. All data lives in the browser's `localStorage`.

## Commands

```bash
npm install        # install dependencies
npm run build      # build the app into the repo root (assets/main.js, assets/main.css)
```

There is no linter or test runner configured.

`npm run build` is the primary command: it writes the production build straight into the repo root (see Deployment). To preview the built app the way GitHub Pages serves it (root mounted under `/mijn-avonturen/`), serve the repo root through a static server at that sub-path and open `…/mijn-avonturen/`. Note there is **no** `npm run dev` flow here: the root `index.html` is hand-written to reference the built assets, not `/src/main.jsx`, so a Vite dev server won't hot-load source — rebuild instead.

## Architecture

- **`src/main.jsx`** — React entry; mounts `<App>` and imports `src/styles.css`.
- **`src/App.jsx`** — state, CRUD handlers, the tab bar, and all overlays (modal, settings panel, confirm dialogs). Read this first; the views below are presentational.
- **`src/lib/afleiden.js`** — derives usable data from the free-text fields that already exist. `maandenUitPeriode` parses `periode` (`"juli-aug"`, `"okt-feb"`, `"lente/zomer"`) into month numbers; `afstandUitLocatie` maps `locatie` to one of `dichtbij` / `buurland` / `europa` / `ver` plus a region name. `verrijk()` adds `maanden`, `afstand`, `regio` and `soort` to an activity. **These are computed, never stored** — the free text stays the single source of truth, so there is nothing to migrate when the parser improves.
- **`src/views/NuView.jsx`** — the "Wat doen we?" home screen: only shows what fits the current month, within a chosen distance range, and isn't done yet. Contains the "Verras me" picker.
- **`src/views/LijstView.jsx`** — one list view reused by all three soorten. Uitjes render as compact `ActivityCard`s in a flat grid; hikes and reizen are "saved for later" and render as richer `WishCard`s grouped by distance.
- **`src/data/seed.js`** — default data and fixed lists: `SEED_ACTIVITIES`, `SEED_CATEGORIES`, `SOORTEN`, `MARKERINGEN`, `COLOR_PALETTE`, `EMOJI_OPTIONS`, plus the `sanitize*` functions. Edit here to change starter content.

### Soorten (the three tabs)

Every category carries a `soort` (`uitje` | `hike` | `reis`) which decides the tab its activities appear in. **Do not key this off category names** — an earlier version hardcoded `["Hike NL", "Hike"]`, which silently emptied the Hikes tab if a category was renamed. `soortVoorNaam()` only supplies the default for pre-existing data; after that the stored `soort` wins, and the settings panel lets the user move a category between tabs.
- **`src/useLocalStorage.js`** — a `useState` wrapper that persists to `localStorage`.
- **`src/lib/sync.js`** — optional sharing between two people. See "Delen" below.
- **`src/components/`** — presentational pieces: `Header`, `ActivityCard`, `DetailModal` (both the read-only view *and* the add/edit form, switched by a `mode` prop), `ConfirmDialog`, `SettingsPanel` (category management), `Toast`.
- **`src/styles.css`** — all styling, plain CSS with class names matching the JSX (`.card`, `.chip`, `.modal`, `.vbtn`, …). All animation is CSS keyframes; there is no animation library. Fonts (Syne, DM Sans) load from Google Fonts via `@import`.

### Data model

Two `localStorage` keys, **which must not be renamed** or existing users lose their data:

- **`av_db`** — array of activities: `{ id, naam, locatie, categorie, type, link, notities, gedaan, favoriet, periode }`. `gedaan` and `favoriet` are **independent booleans** — an older single `status` field conflated them, so ticking a favourite as done wiped its favourite mark. `sanitizeActivities` migrates the old `status` field on read.
- **`av_cats`** — object mapping a category name → `{ emoji, kleur, gradient, soort }`.

Both `sanitize*` functions also run over the seed defaults (see `useLocalStorage`), so stored and default data always have the exact same shape.

An activity's `categorie` is a string that keys into `av_cats`; unknown categories fall back to `FALLBACK_CATEGORY`. Deleting a category either reassigns its activities to another category or removes them (see `removeCategory` in `App.jsx`).

## Deployment

This repo's GitHub Pages is configured as **"Deploy from a branch" (`main` / root)** — it serves the repository root. The Pages source cannot be changed to "GitHub Actions" from CI (the Actions token lacks admin rights), so instead the **built app is committed into the repo root** and Pages serves it directly.

- `vite.config.js` builds with **stable filenames** straight into the repo root: `assets/main.js` and `assets/main.css` (`outDir: "."`, `emptyOutDir: false`, `rollupOptions.input: "src/main.jsx"`). `public/` (`manifest.json`, `.nojekyll`) is copied to the root too.
- **`index.html` at the root is hand-written** (not generated by Vite) and references the stable built assets (`/mijn-avonturen/assets/main.js` / `main.css`). Do not point it at `/src/main.jsx` — that only works in a dev server, and Pages would serve it verbatim (blank page). Keep the asset paths prefixed with `/mijn-avonturen/`.
- Committed build outputs at the root (`index.html`, `assets/`, `manifest.json`, `.nojekyll`) are what Pages serves. After changing anything in `src/`, run `npm run build` and commit the regenerated `assets/`.
- `.github/workflows/deploy.yml` automates this: on a push that touches source, it builds and commits the regenerated build outputs back to `main` (`contents: write`), then verifies the live URL. Its trigger `paths` exclude the build outputs so the bot's commit doesn't loop.

Note: `base` is `/mijn-avonturen/` (the Pages sub-path); keep asset URLs prefixed accordingly.

## Offline (PWA)

`public/sw.js` caches the app shell so the app works without a connection.
It is **network-first**: online you always get the current build, and the cache
is only a fallback. Cache-first would be faster but risks serving stale code,
which is how this app once ended up showing a blank page.

The subtlety worth keeping: the service worker refetches with `cache: "no-cache"`.
Without that, `fetch()` inside the worker can be answered from the browser's own
HTTP cache, so a freshly deployed build is never seen — verified by deploying a
change and reloading. `no-cache` still allows a cheap 304, it just forces
revalidation. Requests to other origins (the shared database) are passed straight
through and never cached; Google Fonts are the one cache-first exception.

Bump `VERSIE` in `sw.js` to force old caches to be discarded on activate.

## Foto's

Screenshots (typically of an Instagram find) live in **IndexedDB**, not
localStorage: localStorage caps out around 5 MB for the whole app, which a
handful of phone screenshots would fill. `lib/fotos.js` downsizes to 900px and
JPEG-encodes at 0.72 before storing, taking a 2-3 MB screenshot down to roughly
100-200 kB.

The activity record carries only a `foto` boolean, so cards can tell there is
an image without reading a blob per card, and so the flag survives sync. The
image itself is keyed by activity id and is **not synced** — the partner sees
the item but not the picture. That is a deliberate choice, not a gap waiting to
be filled: the owner confirmed device-only photos are what they want. Changing
it would mean Supabase Storage, or pushing only changed rows so a base64 column
doesn't re-upload everything on every sync.

`useFoto` revokes its object URL on unmount; without that, scrolling a list of
photo cards leaks memory.

### Velden invullen vanaf een screenshot

`lib/lezen.js` reads the text out of a screenshot and derives form fields from
it, so an Instagram find can be added without retyping it.

- Recognition is **tesseract.js, in the browser**, `await import`ed inside
  `haalWerker()` so it lands in its own chunk (`assets/tekstherkenning.js` — the
  name comes from `manualChunks` in `vite.config.js`, because chunk filenames
  carry no hash and "index.js" would collide with the next chunk). The image
  never leaves the device; only the recognizer itself is fetched, from a CDN, on
  first use. A failed start **resets `werkerBelofte`** — a cached rejected
  promise would make every retry fail instantly, so "probeer opnieuw" would be a
  lie.
- The worker is created once, so its `logger` reads a module-level
  `meldVoortgang` rather than the callback of the first call; otherwise only the
  first read would report progress.
- OCR runs on the **original** file, not the 900px version stored for display —
  small text in a phone screenshot does not survive the downscale.
- `veldenUitTekst()` holds the heuristics: strip Instagram chrome (like counts,
  "2 d geleden", the status-bar clock), turn a handle like `strandbad_nuenen`
  into "Strandbad Nuenen", take a `Plaats, Provincie` tag from the **top** lines
  only (further down that pattern is just a sentence), and match keywords for
  category and season. Keyword matching is prefix-anchored, and words of four
  characters or fewer must stand alone — otherwise "meer" fires on "meerdere"
  and "sup" on "supermarkt".
- It only fills fields that are still **empty**, and leaves the category alone
  once the user has picked one. Recognition guesses; the user knows.
- The word lists it matches locations against (`PROVINCIES`, `LANDEN`) are
  exported from `lib/afleiden.js` so the two stay in step.

## Delen (optional sync)

Two people can share one list. The design is **local-first**: `localStorage`
stays the working copy so the app is fully usable offline, and syncing merges
on top of it. Nothing here is required — with no key configured the app runs
purely locally and the share panel says so.

- **Access model**: a secret `ruimte_id` (uuid). It travels in an `x-ruimte`
  request header; Postgres RLS compares it against the row's `ruimte_id`, so
  knowing the uuid *is* the credential. There is no login. Anyone with the link
  can read and write the list — an accepted trade-off for a list of day trips,
  but do not put anything sensitive in it.
- **Merging** is last-write-wins per row on a `bijgewerkt` epoch-ms stamp.
  Every mutation in `App.jsx` goes through `stempel()` to set it. On a tie the
  remote row wins, which makes both sides converge.
- **Deletions** need tombstones, otherwise a delete on one device is undone by
  the other device pushing the row back. Local deletes are recorded in
  `av_verwijderd` (`{id: bijgewerkt}`) and pushed as rows with
  `verwijderd = true`.
- **Order matters**: `synchroniseer()` pulls, merges, *then* pushes the merged
  result. Pushing first would let a stale local row overwrite a newer remote one.
- The sync effect compares a JSON snapshot (`laatsteMomentopname`) before
  running, otherwise writing the merge result back into state would retrigger
  the effect forever.

`PUBLIEKE_SLEUTEL` in `sync.js` is the Supabase anon key. It is public by
design; it grants nothing without a `ruimte_id`. `syncBeschikbaar()` gates the
whole feature on it being set.

**`supabase/schema.sql` is the source of truth for the database side** — the two
tables, the `huidige_ruimte()` header reader, the RLS policies and the grants.
It is idempotent, so it can be pasted into the SQL editor of a fresh (or
restored) project. Keep it in step with any change made to the live database, so
that database stays reproducible rather than a thing that was configured once by
hand and can only be re-derived by guessing.

Supabase pauses a free project after about a week without traffic. Nothing
breaks when that happens — the app is local-first and keeps working entirely
offline; only syncing between the two devices stops until the project is resumed
from the dashboard. If the project is ever gone for good, `schema.sql` rebuilds
it and the local `localStorage` copies are still the real data.
