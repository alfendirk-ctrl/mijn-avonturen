---
name: Mijn Avonturen
description: Een donker seizoensnotitieboek voor uitjes, hikes en reizen
colors:
  grond: "#0A0A12"
  papier: "#12121E"
  rand: "rgba(255,255,255,0.08)"
  tekst: "#E8E8F0"
  kop: "#F0F0FF"
  kaart-naam: "#E8E8F8"
  veld-tekst: "#E0E0F0"
  zacht: "#B6B6D0"
  chip-tekst: "#9090B8"
  gedempt: "#8A8AA8"
  schuif: "#2A2A3A"
  wit: "#FFFFFF"
  accent-lente: "#4ADE80"
  accent-lente-diep: "#BEF264"
  accent-zomer: "#FFC043"
  accent-zomer-diep: "#FF7A59"
  accent-herfst: "#EA7C3C"
  accent-herfst-diep: "#9A3412"
  accent-winter: "#7DD3FC"
  accent-winter-diep: "#A78BFA"
  gedaan: "#3DBE8A"
  favoriet: "#F5A623"
  waarschuwing-tekst: "#D8B878"
  gevaar: "#EF6B6B"
  gevaar-tekst: "#FCA5A5"
  gevaar-sterk: "#FECACA"
  gevaar-vlak: "#B91C1C"
  gevaar-12: "rgba(239,68,68,0.12)"
  gevaar-20: "rgba(239,68,68,0.20)"
  gevaar-28: "rgba(239,68,68,0.28)"
  scrim-45: "rgba(0,0,0,0.45)"
  scrim-60: "rgba(0,0,0,0.60)"
  scrim-75: "rgba(0,0,0,0.75)"
  cat-indigo: "#818CF8"
  cat-blauw: "#4FC3F7"
  cat-groen: "#A5D6A7"
  cat-teal: "#4DB6AC"
  cat-geel: "#FFD54F"
  cat-oranje: "#FFCC80"
  cat-rood: "#EF9A9A"
  cat-roze: "#F48FB1"
  cat-paars: "#CE93D8"
  cat-bruin: "#BCAAA4"
  cat-lime: "#DCE775"
  cat-cyaan: "#80DEEA"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(26px, 6vw, 38px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-1px"
  headline:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(21px, 4.6vw, 27px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.8px"
  title-lg:
    fontFamily: "Syne, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.15
  title:
    fontFamily: "Syne, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
  subtitle:
    fontFamily: "Syne, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.25
  card-title:
    fontFamily: "Syne, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.25
  card-title-sm:
    fontFamily: "Syne, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
  body-lg:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "1.5px"
  micro:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.3
  glyph:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "8px"
    fontWeight: 400
    lineHeight: 1
  modal-title:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(22px, 5vw, 34px)"
    fontWeight: 800
    lineHeight: 1.1
  watermark:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(68px, 16vw, 120px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-5px"
  icon:
    fontFamily: "system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1
  icon-lg:
    fontFamily: "system-ui, sans-serif"
    fontSize: "52px"
    fontWeight: 400
    lineHeight: 1
rounded:
  r6: "6px"
  r8: "8px"
  r10: "10px"
  r12: "12px"
  r14: "14px"
  r16: "16px"
  r18: "18px"
  r22: "22px"
  pil: "100px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "20px"
  goot: "24px"
  goot-telefoon: "16px"
components:
  knop-accent:
    backgroundColor: "{colors.accent-herfst}"
    textColor: "{colors.grond}"
    rounded: "{rounded.r12}"
    padding: "13px 18px"
    height: "46px"
  knop-stil:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "{colors.zacht}"
    rounded: "{rounded.r12}"
    padding: "13px 18px"
    height: "46px"
  chip:
    backgroundColor: "rgba(255,255,255,0.03)"
    textColor: "#9090B8"
    rounded: "{rounded.pil}"
    padding: "9px 16px"
    height: "38px"
  chip-actief:
    backgroundColor: "{colors.accent-herfst}"
    textColor: "{colors.grond}"
    rounded: "{rounded.pil}"
    padding: "9px 16px"
    height: "38px"
  kaart:
    backgroundColor: "rgba(255,255,255,0.025)"
    textColor: "#E8E8F8"
    rounded: "{rounded.r16}"
    padding: "20px"
  veld:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "#E0E0F0"
    rounded: "{rounded.r10}"
    padding: "11px 13px"
  tabblad:
    backgroundColor: "rgba(255,255,255,0.03)"
    textColor: "#9090B8"
    rounded: "14px"
    padding: "11px 8px"
    height: "48px"
---

# Design System: Mijn Avonturen

## Overview

**Creative North Star: "Het Seizoensnotitieboek"**

A dark notebook that knows what time of year it is. The ground is near-black
ink (`#0A0A12`); everything sits on it as a faintly lit page. Nothing here is a
dashboard and nothing here is a feed — it is a private collection, and the
interface behaves like paper that has been written on rather than a surface that
is selling something.

The one thing that moves is the season. Four times a year the entire accent
shifts — spring green, summer amber, autumn orange, winter ice — and with it the
header glow, every active chip, the focus ring, the period badge, the slider. It
is not decoration: it is the app's answer to the question the product exists to
answer, *what can we do now*, rendered as colour. Everything else stays put.

The character is **firm and confident**, not soft. Surfaces have visible edges,
buttons look pressable, headings are heavy Syne with tight negative tracking.
Emoji do real work — they are the category system's identity across cards, chips
and map pins, and the reason the interface carries no icon set. The only images
in the whole app are the PWA launcher icons, one inline SVG noise texture in the
header, the map's OpenStreetMap tiles, and the screenshots the owner adds
themselves.

**Key Characteristics:**
- Near-black ground, tonal layering instead of shadows
- One seasonal accent, used sparingly and never hard-coded
- Syne for structure, DM Sans for everything you actually read
- Emoji as the icon system; no icon library, no illustration
- Density tuned for a phone held in one hand

## Colors

A near-monochrome dark field with exactly one chromatic voice, which changes
four times a year.

### Primary

- **Seasonal Accent** (`--accent`): the only chromatic voice in the interface.
  Carries the active chip, the primary button, the focus ring, the period badge,
  the slider fill, the header glow and the eyebrow line. Set on `:root` at
  runtime by `App.jsx` from `SEIZOEN_THEMA`; autumn `#EA7C3C` is what the tokens
  above show, but any of the four is equally canonical.
- **Seasonal Deep** (`--accent2`): the partner tone. Used only in the two places
  that need a gradient — the selected tab's fill and the "Verras me" card — never
  for text, never for a button fill.

Four fixed alpha mixes derive from it (`--accent-05` through `--accent-40`) so
translucent accent surfaces stay in step when the season turns.

### Neutral

- **Inkt** (`#0A0A12`): the page ground, and the text colour placed *on* the
  accent.
- **Papier** (`#12121E`): raised surfaces — modals, the settings panel, toasts.
- **Kop** (`#F0F0FF`): headings and emphasised numbers.
- **Tekst** (`#E8E8F0`): default body text.
- **Zacht** (`#B6B6D0`): secondary text — notes, hints, button labels.
- **Gedempt** (`#8A8AA8`): tertiary — location lines, counts, field labels. This
  is the floor; nothing goes dimmer.
- **Rand** (`rgba(255,255,255,0.08)`): every border and divider.

### Tertiary

Three status colours, each used only as a marker and never as a surface:
**Gedaan Groen** (`#3DBE8A`), **Favoriet Amber** (`#F5A623`), **Fout Rood**
(`#EF6B6B`).

### Category palette

Twelve pastel swatches (`cat-*`) live in `COLOR_PALETTE` in `src/data/seed.js`.
They are **content, not chrome**: the owner picks one per category, and it shows
up as the selected chip's fill, the card's corner glow, and the map pin. Each
swatch also carries a two-stop dark `gradient` used for the hero banner at the
top of the detail modal — the one place in the app where a gradient is the
point rather than a tell.

Those gradient stops (`#0d47a1`, `#7b1fa2`, …) are deliberately outside the
token set. Promoting them would suggest an interface element may reach for
`#7b1fa2`, which is exactly wrong: only a category may, and only through the
value stored on that category.

### Named Rules

**The Content Palette Rule.** A category colour is data. Read it from the
category record (`cat.kleur`, `cat.gradient`); never hard-code one, and never
use one for interface chrome.

**The Living Accent Rule.** The accent is never written as a hex code anywhere
outside `SEIZOEN_THEMA`. Use `var(--accent)`, one of the `--accent-XX` mixes, or
`color-mix(in srgb, var(--accent) N%, #FFFFFF)`. A copied hex freezes that
element in one season while the rest of the app moves on — this has been the
cause of two real bugs.

**The Three Greys Rule.** Secondary text has exactly three levels — `zacht`,
`chip-tekst`, `gedempt` — and that is it. Hierarchy comes from size, weight and
spacing, not from inventing a fourth grey. Anything below `#8A8AA8` failed
contrast on the card ground and was removed.

This rule was written before the stylesheet obeyed it: there were **eight**
greys, four near-identical light tints and six ways of writing a dark ground.
Every literal is now a named token in `:root`, so the next change cannot quietly
produce a ninth.

## Typography

**Display Font:** Syne (fallback: sans-serif)
**Body Font:** DM Sans (fallback: sans-serif)

**Character:** Syne is geometric and slightly eccentric at weight 800 with tight
negative tracking — it gives headings a confident, almost editorial snap. DM Sans
underneath is quiet and completely unshowy. The pairing reads as a notebook with
a strong cover.

### Hierarchy

- **Display** (Syne 800, `clamp(26px, 6vw, 38px)`, lh 1.05, ls −1px): the one
  question per screen — "Wat doen we?".
- **Headline** (Syne 800, `clamp(21px, 4.6vw, 27px)`, lh 1, ls −0.8px): the app
  title in the header.
- **Title** (Syne 700, 17px / 15px on the compact card, lh 1.25): adventure names
  on cards. The only place Syne appears at a readable size.
- **Body** (DM Sans 400, 14–15px, lh 1.5–1.6): notes, hints, field values.
- **Label** (DM Sans 500, 11px, ls 1.5px, uppercase): form labels and section
  headings only.

A decorative **watermark** (Syne 800, `clamp(68px, 16vw, 120px)`, ls −5px, 13%
opacity) prints the month behind the Nu heading. It is flat colour, hidden below
900px, and `aria-hidden`.

### Named Rules

**The Uppercase Is A Label Rule.** Letter-spaced capitals mean "this is a field
label", nothing else. Using them for an eyebrow above a heading made the heading
look like the second thing on the page; both such eyebrows were converted to
sentence case.

**The No Gradient Text Rule.** Type is a single flat colour. A gradient across
letters reads as decoration pretending to be meaning.

## Layout

One centred column, `max-width: 900px`, with a `24px` gutter that tightens to
`16px` below 520px. Cards sit in an auto-filling grid — `minmax(210px, 1fr)` for
compact uitjes, `minmax(260px, 1fr)` for the roomier wish cards — at a `14px`
gap, which lands as two columns on a phone and three or four on a desktop.

Breakpoints: **520px** (phone density: tighter gutters, hidden header stats,
hidden tab counts), **640px** and **760px** (component-local), **900px** (the
watermark disappears).

**Control density is the thing this layout is most opinionated about.** Above any
list there is exactly one row of controls — search, category chips, one *Filters*
button carrying a count badge. Status, tags and the distance slider live behind
that button. Expanded, those three occupied roughly 600px before the first
adventure on a 360px phone.

### Named Rules

**The One Control Row Rule.** A list gets one row of controls. Anything else goes
behind a disclosure with a badge stating how many filters are active — a filtered
list with no badge reads as missing data.

**The Own Scroll Container Rule.** A horizontally scrolling strip (the tab bar,
the chip row) carries `overflow-x: auto` itself. Without it the whole document
shifts sideways and the header slides off the left edge.

## Elevation & Depth

**Tonal, not lifted.** Depth comes from stacking translucent whites on the near-
black ground — `rgba(255,255,255,0.025)` for cards, `0.03`–`0.05` for controls —
each with a one-pixel `rgba(255,255,255,0.08)` border. Cards cast no shadow at
rest.

Shadows appear only where something genuinely floats above the page, and there
are four:

### Shadow Vocabulary

- **Venster** (`0 12px 40px rgba(0,0,0,0.4)`): the detail modal.
- **Toast** (`0 8px 32px rgba(0,0,0,0.4)`): the transient message.
- **Duim** (`0 2px 8px rgba(0,0,0,0.5)`): the distance slider's thumb.
- **Focus** (`0 0 0 3px var(--accent-25)`): a state, not a depth.

One ambient element sits outside this system: a soft radial `--glow` behind the
header, tinted by the season.

### Named Rules

**The Flat At Rest Rule.** A surface that is not overlaying another surface has
no shadow. Depth is a lighter tone and a one-pixel border.

## Shapes

Generously rounded, with the radius scaling to the size of the thing: `8px` for
small controls, `10px` for fields, `12px` for buttons, `14px` for tabs, `16px`
for compact cards, `18px` for wish cards, `22px` for the modal (and
`22px 22px 0 0` when it becomes a bottom sheet below 520px).

Anything that acts as a token — chips, tags, the period badge, the toast — is a
full pill (`100px`). Circles (`50%`) are reserved for the tick and star on a card
and for colour swatches. Borders are always a single pixel of `rand`; there is no
heavier weight in the system.

### Named Rules

**The Pill Means Token Rule.** A full-round shape means "this is one small piece
of data or one filter". A rectangle with a soft radius means "this is a surface
or an action". Never mix them.

## Components

### Buttons

- **Shape:** soft rectangle (`12px`), minimum height `46px`.
- **Accent:** flat `var(--accent)` fill with `#0A0A12` text at weight 600. Flat —
  **never a gradient**; a two-stop fill on a button is the single most common
  generated-app tell.
- **Stil (secondary):** `rgba(255,255,255,0.05)` on a `rand` border, `zacht`
  text.
- **Hover / Active:** accent buttons brighten (`filter: brightness(1.12)`);
  quiet buttons lift their background. Both compress slightly on press
  (`scale(0.97)`).
- **Focus:** a `2px` solid accent outline at `2px` offset, on `:focus-visible`
  only.

### Chips

- **Style:** pill, `rgba(255,255,255,0.03)` on a `rand` border, `#9090B8` text,
  `38px` tall with the hit area stretched to `44px`.
- **Selected:** filled with **the category's own colour**, text flipped to
  `#0A0A12`, border transparent. The "Alle" chip uses the seasonal accent.
- Each carries a count at 65% opacity.

### Cards

- **Corner:** `16px` compact, `18px` wish card.
- **Background:** `rgba(255,255,255,0.025)` with a `rand` border and a blurred
  glow of the category colour bleeding from the top-left corner.
- **Hover:** lifts `2px` on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Done:** drops to 55% opacity and gains a green "✓ gedaan" mark.
- **Internal padding:** `20px`.
- **Content order:** category emoji and actions, name, location, then one quiet
  row of period and at most two tags. The period is the only element on a card
  carrying accent colour.

### Inputs

- **Style:** `rgba(255,255,255,0.04)` on a near-invisible border, `10px` radius,
  `11px 13px` padding.
- **Focus:** border becomes the accent and the fill warms to `--accent-05`. No
  glow.
- **Placeholder:** `gedempt`.

### Navigation

Five pill-ish tabs (`14px` radius, Syne 700, `48px` tall) in a self-scrolling
strip. The selected tab fills with an accent-to-accent2 gradient at low alpha
plus an inset accent ring — the one place a gradient is allowed, because it reads
as a lit surface rather than a painted button. Counts hide below 520px.

### Signature: the seasonal header

A radial `--glow` in the season's colour, an SVG noise overlay at 4% opacity, the
app name with "Avonturen" in the accent. It is the only ornamental surface in the
app and it never repeats elsewhere.

## Do's and Don'ts

### Do:

- **Do** reach for `var(--accent)` or `color-mix(in srgb, var(--accent) N%, #FFFFFF)` for anything chromatic.
- **Do** keep tap targets at `44px`, stretching the hit area with a transparent `::after` when something must stay visually smaller — and verify the shim is not clipped by a scrolling or wrapping ancestor.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for anything that moves in space — entering, lifting, sliding. It is the system's one custom curve; plain `ease` and `ease-in-out` stay where nothing travels (fades, the sync pulse).
- **Do** let emoji carry category identity.
- **Do** give one screen one question.

### Don't:

- **Don't** put a gradient on a button fill or on text.
- **Don't** add a fourth grey, or go below `#8A8AA8` for text.
- **Don't** introduce image assets, icon fonts, or an icon library.
- **Don't** use letter-spaced capitals for anything but a field label.
- **Don't** add a bouncing or overshooting easing.
- **Don't** let it drift toward a business dashboard, a booking site, a social feed, or the purple-gradient generated-app look. All four were named as anti-references.
