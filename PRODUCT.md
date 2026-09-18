# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: the owner, alone.** This is one person's collection of finds, not a
shared planning tool two people co-author. Confirmed in interview.

A partner can open the same list through the optional share link and both read
and write it, but is a **secondary viewer**. Design decisions are settled by
what serves the owner; sharing must not cost the owner anything.

Children appear as a `kids` **tag on an activity** — an attribute of an outing,
never a user of the app. See "Categorie versus tags" in CLAUDE.md for why that
distinction is load-bearing.

## Product Purpose

Catch every uitje, hike and reis worth remembering **before it is lost**, and
make it findable again at the moment it could actually happen.

Success, in the owner's own words: **"er raakt geen vondst meer kwijt."** That
is the bar. Notably it is *not* "we do more things" and *not* "a complete log of
where we have been" — both were offered and neither was chosen. `gedaan` exists
so finished items stop competing for attention in the lists, not as an archive
to look back on.

So when capture/retrieval and logging/celebration pull in different directions,
capture and retrieval win.

## Positioning

**The free text the owner already types is the data.** `maanden`, `afstand`,
`regio` and map coordinates are all derived at read time from the `periode` and
`locatie` strings — never stored, never a second field to fill in. Nothing to
migrate when a parser improves, and no geocoding service to depend on. A
comparable app asks the user to pick a month range from a dropdown, a country
from a list, and drop a pin.

**Capture is built for how finds actually arrive**: as a screenshot of an
Instagram post. Text recognition runs on the device itself; the image never
leaves the phone.

## Operating Context

Three confirmed moments of use:

1. **Capture** — something comes past and has to be stored before it is
   forgotten. Screenshot → OCR → prefilled fields. This is the moment the
   product's success criterion lives or dies on.
2. **Planning at home** — sitting down and choosing what to do in the coming
   period. Browsing, comparing, filtering.
3. **Deciding on the spot** — "wat doen we nú?", answered by the Nu tab against
   the current month and a chosen distance.

**Not a moment of use:** retrospectively ticking off a log. Offered in the
interview and not chosen.

Phone first, portrait, installed as a standalone PWA, frequently on a poor or
absent connection.

## Capabilities and Constraints

- **No backend and no account.** All data lives in the browser. The app is fully
  usable with no connection.
- **`av_db` and `av_cats` must never be renamed** — existing users lose
  everything. Same for the derived-not-stored rule above.
- **Photos live in IndexedDB and are device-only.** Deliberately not synced; the
  partner sees the item but not the picture. Confirmed as the intended design,
  not a gap.
- **Sharing is optional and unauthenticated.** A secret `ruimte_id` in a request
  header *is* the entire credential. Anyone with the link can read **and write**
  the list. Accepted trade-off for a list of day trips — so nothing sensitive
  goes in it, and the app says so.
- **The Supabase project is free-tier and pauses** after roughly a week without
  traffic. Nothing breaks when it does; only syncing stops.
- **One `categorie`, any number of `tags`.** The category determines the `soort`,
  which determines which of the tabs an activity lives in. Categories name a kind
  of thing, never an audience or a mood.
- Deployed as a static site to GitHub Pages under `/mijn-avonturen/`.
- Dutch throughout (`lang="nl"`).

## Brand Commitments

- Name: **Mijn Avonturen**. Tagline in the manifest: *"Wat doen we? Jouw uitjes,
  hikes en reizen — altijd bij de hand."*
- **Dutch, informal, second person.** Labels and messages are short and plain.
- Syne (headings) and DM Sans (body); dark ground `#0C0C14`.
- **The accent colour shifts with the season** and is the app's one recurring
  signature. Never retype it as a hex code anywhere.
- Category emoji carry identity across cards, chips and map pins — no image
  assets anywhere in the interface.

## Evidence on Hand

- **68 real seeded adventures** in `src/data/seed.js`, researched for opening
  times, prices and season. This is genuine content, not filler.
- Screenshots the owner shares are the real capture input.
- **There are no customers, testimonials, reviews, pricing, or usage numbers.**
  It is a personal tool. Future work must not invent any.

## Product Principles

1. **The free text is the truth.** Anything derivable is derived, never stored.
2. **Capture must cost less than the find is worth.** Any friction between
   seeing something and having it saved is a bug against the product's purpose.
3. **Nothing gets lost.** Retrieval — search, filters, tags, the map — outranks
   presentation.
4. **It works with no connection and no account.** Sharing is additive; it may
   never become a precondition.
5. **Recognition guesses, the owner knows.** Automatic fills only ever touch
   empty fields, and never override a choice the owner made.

## Accessibility & Inclusion

No user-specific requirement was established in the interview. The
implementation nonetheless holds a standard, recorded here so future work does
not quietly drop it: tap targets at least 44px, WCAG AA contrast, visible
focus rings, and `prefers-reduced-motion` honoured. See "Layout en dichtheid" in
CLAUDE.md for the cases that were paid for.
