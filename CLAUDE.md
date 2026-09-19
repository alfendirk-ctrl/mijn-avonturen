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

### Categorie versus tags

An activity has **exactly one `categorie`** and **any number of `tags`**. That
split is deliberate and load-bearing: the category decides the `soort`, and the
soort decides which of the three tabs the activity lives in. Two categories
would mean two possible tabs for one item, with no rule to pick between them.
Tags carry no soort, so they can be combined freely — which is what you want for
something that is both "water" and "kids".

Categories therefore name a **kind of thing** (Water, Eten & drinken, Cultuur,
Dieren, Speelpark, Hike…), never an audience or a mood. An earlier set mixed the
two axes — `Kids`, `Ontspanning` and `Leisure` sat next to `Water` and
`Pretpark` — which forced two restaurants into two different categories purely
because one of them had a playground. `lib/migratie.js` holds the one-time
conversion away from that, and is the place to look before adding a category.

The same file also carries `vulAanMetBundel()`: new finds added to
`EXTRA_SEPT_2026` in the seed would otherwise never reach a phone that already
has stored data, because the seed is only read when `av_db` is empty. It adds
by id, once, guarded by `av_bundel_sept26` — delete one afterwards and it stays
deleted.

That migration is worth understanding before touching it:

- It runs **once**, guarded by `av_assen_gemigreerd` in localStorage. Without
  that marker it would re-run on every load and drag an item back the moment
  the user moved it somewhere else by hand. There is a regression test for
  exactly that.
- An item whose name it does not recognise **stays where it is**, and a retired
  category is only deleted once nothing points at it any more. So a
  self-added adventure in `Ontspanning` keeps both the item and the category
  alive, rather than being dumped into an arbitrary bucket.
- Migrated items are `stempel()`ed so the new layout wins over a device that
  still has the old one.
- The same map builds the seed, so a fresh install and a migrated phone end up
  identical rather than drifting apart.

`schoonTags()` in `data/seed.js` is the single normaliser (trim, collapse
whitespace, cap at `MAX_TAGS`, drop case-insensitive duplicates so "Kids" and
"kids" never coexist). It is used by `sanitizeActivities`, by `saveActivity`,
**and by both directions of sync** — one definition, so stored, typed and
synced tags always have the same shape.

`tags` is handled separately from `ITEM_VELDEN` in `sync.js`: that loop falls
back to `""` for missing values, which would turn a missing array into an empty
string. Filtering by several tags is an **intersection**, not a union — the
point of tags here is finding the overlap.

### Soorten (the three tabs)

Every category carries a `soort` (`uitje` | `hike` | `reis`) which decides the tab its activities appear in. **Do not key this off category names** — an earlier version hardcoded `["Hike NL", "Hike"]`, which silently emptied the Hikes tab if a category was renamed. `soortVoorNaam()` only supplies the default for pre-existing data; after that the stored `soort` wins, and the settings panel lets the user move a category between tabs.
- **`src/useLocalStorage.js`** — a `useState` wrapper that persists to `localStorage`.
- **`src/lib/sync.js`** — optional sharing between two people. See "Delen" below.
- **`src/components/`** — presentational pieces: `Header`, `ActivityCard`, `DetailModal` (both the read-only view *and* the add/edit form, switched by a `mode` prop), `ConfirmDialog`, `SettingsPanel` (category management), `Toast`.
- **`src/styles.css`** — all styling, plain CSS with class names matching the JSX (`.card`, `.chip`, `.modal`, `.vbtn`, …). All animation is CSS keyframes; there is no animation library. Fonts (Syne, DM Sans) load from Google Fonts via `@import`.

### Data model

Two `localStorage` keys, **which must not be renamed** or existing users lose their data:

- **`av_db`** — array of activities: `{ id, naam, locatie, categorie, type, link, notities, gedaan, favoriet, periode, tags, foto }`. `gedaan` and `favoriet` are **independent booleans** — an older single `status` field conflated them, so ticking a favourite as done wiped its favourite mark. `sanitizeActivities` migrates the old `status` field on read.
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

## Kaart

`src/views/KaartView.jsx` plots everything on one map (a fourth tab). Leaflet is
`await import`ed, like tesseract, so it only downloads when the tab is opened.

**Coordinates are derived, never stored.** `lib/kaart.js` holds a small
gazetteer of the places that actually occur in the data and matches the earliest
one named in the free-text `locatie` — locations are written specific-to-general
("Culemborg, Gelderland"), so the leftmost match is the most precise. This keeps
the rule the rest of the app follows: the free text is the truth, nothing extra
to store, sync or migrate, and no geocoding service to depend on.

Two traps already paid for:

- Place names must match on a **word boundary**. `"Nederland"` contains the
  letters of `"ede"`, so plain `includes` silently pinned every
  location-less adventure on a village in Gelderland.
- `"Nederland"` and `"Europa"` are deliberately **absent** from the gazetteer.
  Twenty pins stacked on the centre of the country say nothing; those
  adventures are listed under the map instead, with a nudge to add a town.

The map opens fitted to the **nearby** adventures (`afstand === "dichtbij"`),
not to all of them. Fitting Thailand and the Pacific Crest Trail turns Europe
into one heap of overlapping 30px pins — on a phone that already happens at
Europe scale. Nothing is hidden: a line above the map counts what lies further
out, and zooming out reveals it.

Pins are `divIcon`s carrying the category emoji and colour — no image assets, so
nothing to bundle or break. Note `vite.config.js` gives non-CSS assets their own
filename: the single stable `assets/main[extname]` pattern would name every
image `main.png` and have them overwrite each other.

Tiles come from OpenStreetMap and need a connection; the rest of the app keeps
working offline.

## Layout en dichtheid

The list view puts **one row of controls** above the results: search, category
chips, and a single **Filters** button. Status, tags and the distance slider
live in the panel behind it, with a badge counting what is active — without
that badge a filtered list looks like missing data.

That is a correction, not a preference. All three used to sit expanded above
the list, which on a 360px phone meant roughly **600px of controls before the
first adventure**, and the tag bar grew with every tag the user invented.

Related rules, each paid for once:

- **The tab bar scrolls itself** (`overflow-x:auto`). With five tabs it is
  428px wide at 360px, and without its own scroll container the *whole
  document* shifted sideways when a tab scrolled into view — the header slid
  off the left edge. Check `document.scrollWidth - clientWidth` on every tab,
  not just the first, after any change to the tab bar.
- **Cards show a maximum of two tags** (three on the roomier `WishCard`), the
  rest as `+n`, and the `type` field is not on the card at all. Everything
  used to render as identically-weighted pills — type, every tag, the period —
  so the eye had nothing to hold on to. Only the **period** carries accent
  colour, because it is the one field that answers "can we do this now?".
- **Tap targets are at least 44px.** Where something must stay visually small
  (the tick on a card is 32px, and larger would dominate the card), the hit
  area is stretched with a transparent `::after` instead. Two conditions make
  that shim silently useless, so **measure it, don't assume it**: an ancestor
  that clips (`.cats-row` has `overflow-x:auto`, and CSS then computes the
  other axis to `auto` too, so it clipped the chips' shim top and bottom —
  fixed with 3px of vertical padding on the row), and a container that
  **wraps**, where a 44px shim on a 28px button reaches 8px into the line below
  and swallows taps there. The tag bar wraps, so those buttons get real height
  instead. Test by hit-testing `document.elementFromPoint` at the centre ±20px
  and checking it returns the button itself — and skip elements whose test
  point falls outside the viewport or outside a horizontally scrolled row,
  because `elementFromPoint` returns `null` there and every off-screen card
  looks like a failure.
- **A confirmation always sits on top.** `.ov.ov-boven` is z-index 400 against
  the settings panel's 300. Without it "Verwijder categorie?" opened *behind*
  the panel: dimmed but visible through the overlay, and completely untappable,
  because every tap landed on the panel underneath.
- **The settings panel does not scroll as a whole.** Header and footer are
  fixed flex items and only `.p-body` scrolls. It used to scroll as one piece
  with a `position:sticky` footer — and a sticky element keeps its place in
  flow *and* covers whatever is at the bottom of the viewport, so any category
  row scrolled to there became unclickable. Padding underneath does not fix
  this; it only helps the last row.
- **The panel opens on the existing categories**, not on the new-category form.
  Forty emoji and a colour picker above the fold buried the thing you actually
  came for, and pushed the list behind that sticky footer.
- On phones the header stats and the season watermark are hidden: the counts
  already sit in the tab bar, and the watermark was clipped at the right edge
  in a way that read as a rendering fault rather than decoration. The tab
  counts are hidden below 520px as well — accepted, because each tab already
  states its own count (the filter bar in a list, `.teller` on "Wat doen we?",
  the line above the map); what is lost on a phone is only comparing tabs at a
  glance.
- **Every colour, font-size and radius is a token in `:root`** (`--kop`,
  `--muted`, `--t-14`, `--r-12`, `--gevaar-28`, …). The stylesheet used to carry
  33 literal hex values — eight greys where this file promises three — twenty
  distinct font sizes including half-steps like 12.5 and 13.5 that existed only
  because one element wanted them, and sixteen radii including `99px` and
  `100px` side by side for the same pill. Each literal was defensible alone;
  together they were no longer a system. `DESIGN.md` documents the resulting
  scale and `impeccable detect` checks the code against it.
  **The category palette is the deliberate exception**: `COLOR_PALETTE` and each
  category's `kleur`/`gradient` in `data/seed.js` are *content* the user picks,
  not chrome, so they stay outside the token set and the detector still reports
  them. Read a category colour from the record; never hard-code one.
- **Do not put `border-radius` in the `:focus-visible` rule.** It is a universal
  selector, so it overrode the shape of every focused element — a chip visibly
  morphed from a pill to a rounded rectangle when you tabbed to it, and
  `transition:all` animated the morph. The outline follows the element's own
  radius already.
- **Never retype the accent as a hex code.** `--accent` shifts with the season
  (autumn is `#EA7C3C`), so a copied `#6366F1` stays winter-indigo while
  everything around it turns orange. Two places had done exactly that. Mix
  against the token instead: `color-mix(in srgb, var(--accent) 45%, #FFFFFF)`.
  Note Chromium reports such a value from `getComputedStyle` as
  `color(srgb 0.96 0.77 0.66)` — channels 0–1, not 0–255 — so a contrast
  checker that assumes `rgb()` will read every mixed colour as near-black.

## Toegankelijkheid en eerste gebruik

- **Every overlay is a real dialog.** `useDialoog` (`src/useDialoog.js`) traps
  Tab inside the panel and returns focus to whatever opened it. Without it a
  keyboard user tabbed straight out into the list behind the scrim — measured on
  the edit form: **25 of 40 tabs landed outside the dialog**, on controls that
  were invisible but still operable. All four overlays carry `role="dialog"`
  (`alertdialog` for a confirmation), `aria-modal` and `aria-labelledby`.
- **Form fields are labelled with `htmlFor`/`id`, built from `useId()`.** A
  visible `<label>` that is not linked buys nothing: a screen reader fell back
  to the placeholder, which is exactly the text that disappears once you type.
  The one unlabelled input left is the `hidden` file picker, driven by a labelled
  button — screen readers skip it.
- **`prefers-reduced-motion` does not use the global `0.01ms` kill.** That also
  destroys useful feedback. What causes trouble is *displacement*, not colour, so
  animations and transforms go and colour/opacity transitions stay. Anything that
  animates *in* needs an explicit `opacity:1; transform:none` or `animation:none`
  leaves it stuck at its start frame (invisible).
- **The screenshot route is the front door of adding, not a footnote.** It used
  to sit below six fields behind two taps, which for an app whose whole purpose
  is catching a find before it is lost had it backwards. On a *new* adventure it
  is the first thing in the form, and choosing an image there runs the
  recognition immediately (`leesMeteen`); the plain photo button still just
  attaches a picture.
- **Empty states distinguish their cause.** Nothing yet / nothing matching the
  search / everything filtered out are three different situations with three
  different ways out, and the app knows which it is. Note the category chip is
  *not* part of `actieveFilters`, so the empty state adds it separately
  (`knijpers`) — otherwise it reports "0 filters" while a chip is hiding
  everything.
- **Long compound names break at the internal capital.** `lib/tekst.jsx` inserts
  `<wbr>` between a lowercase and an uppercase letter, so "BatensteinBuiten"
  wraps as "Batenstein / Buiten" instead of "BatensteinBuite / n".
  `overflow-wrap:anywhere` stays as the last resort for a word with no boundary
  at all. That file is `.jsx`, not `.js`, because it returns JSX — Vite will not
  parse JSX in a `.js` file.

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

`.github/workflows/wakker-houden.yml` tries to prevent the pause, every three
days. It reads the URL and the anon key out of `src/lib/sync.js` rather than
duplicating them.

**The first version of this did not work, and the evidence is worth keeping.**
It did an anonymous `select` with no `x-ruimte` header, so RLS returned an empty
list with status 200. The scheduled runs of 7, 10 and 13 August 2026 all
reported 200 — and the project was paused anyway, somewhere between 13 and 16
August. An empty read does not count as usage. Every run from 16 August on
failed with `curl: (6) Could not resolve host`, because a paused project loses
its DNS record.

So it now does a **write**: an upsert of one fixed row in a dedicated heartbeat
ruimte, which keeps exactly one row rather than growing a list. Whether that is
enough is unproven — if the project pauses again despite this, the honest
conclusion is that a free project cannot be kept awake from outside, and the
answer is to resume it from the dashboard when sharing is actually wanted.

Two details worth not re-learning: `curl` runs with `set +e` around it, because
under `bash -e` a DNS failure kills the step before the explanatory message and
all you see is "exit code 6"; and a successful upsert answers 201 or 204, not
only 200. Note GitHub also disables scheduled workflows after 60 days of repo
inactivity.
