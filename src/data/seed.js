// Seed data & vaste keuzelijsten voor "Mijn Avonturen".
// De localStorage-sleutels (av_db / av_cats) worden gebruikt door useLocalStorage
// zodat bestaande gebruikersdata behouden blijft.

// De drie soorten waarin de app is opgedeeld (de tabs). Een categorie bepaalt
// tot welke soort een item hoort — niet de naam van de categorie, zodat
// hernoemen niets kapotmaakt.
export const SOORTEN = {
  uitje: { tab: "Uitjes", kort: "Uitjes", emoji: "🗺️", enkelvoud: "uitje", meervoud: "uitjes" },
  hike: { tab: "Hikes", kort: "Hikes", emoji: "🥾", enkelvoud: "hike", meervoud: "hikes" },
  reis: {
    tab: "Reizen & Verblijf",
    // Op smalle schermen past de volledige naam niet naast de andere tabs.
    kort: "Reizen",
    emoji: "✈️",
    enkelvoud: "reis of verblijf",
    meervoud: "reizen & verblijven",
  },
};

// Waar een categorie standaard bij hoort (gebruikt voor bestaande data en
// als startwaarde voor nieuwe categorieën).
const STANDAARD_SOORT = {
  Hike: "hike",
  // "Hike NL" bestaat niet meer als categorie (zie lib/migratie.js), maar blijft
  // hier staan: data van vóór de omzetting moet in het juiste tabblad landen,
  // ook als de omzetting nog niet gedraaid heeft.
  "Hike NL": "hike",
  Roadtrip: "reis",
  Vakantie: "reis",
  Verblijf: "reis",
};

export const soortVoorNaam = (naam) => STANDAARD_SOORT[naam] || "uitje";

// Markeringen die een item kan hebben. "gedaan" en "favoriet" staan los van
// elkaar: een favoriet die je gedaan hebt blijft een favoriet.
export const MARKERINGEN = {
  open: { label: "Wil doen", emoji: "🔖", kleur: "#4A90D9", bg: "rgba(74,144,217,0.15)" },
  gedaan: { label: "Gedaan", emoji: "✓", kleur: "#3DBE8A", bg: "rgba(61,190,138,0.15)" },
  favoriet: { label: "Favoriet", emoji: "★", kleur: "#F5A623", bg: "rgba(245,166,35,0.15)" },
};

// Fallback voor een categorie die (nog) niet in de lijst staat.
export const FALLBACK_CATEGORY = {
  emoji: "✦",
  kleur: "#6366F1",
  gradient: "linear-gradient(135deg,#312e81,#4338ca)",
  soort: "uitje",
};

// Standaard-categorieen (opgeslagen onder av_cats).
// Object: naam -> { emoji, kleur, gradient, soort }.
//
// Elke categorie zegt WAT iets is, niet voor wie het is of hoe het voelt. Dat
// laatste zijn tags. Een eerdere indeling mengde die twee assen (Kids en
// Ontspanning naast Water en Pretpark), waardoor twee restaurants in twee
// verschillende categorieen belandden omdat er bij de een kinderen bij zaten.
// Zie lib/migratie.js voor de omzetting en CLAUDE.md voor de regel.
export const SEED_CATEGORIES = {
  Water:            { emoji: "\u{1F30A}", kleur: "#4FC3F7", gradient: "linear-gradient(135deg,#0d47a1,#0288d1)", soort: "uitje" },
  "Eten & drinken": { emoji: "\u{1F37D}\uFE0F", kleur: "#FFD54F", gradient: "linear-gradient(135deg,#e65100,#f57c00)", soort: "uitje" },
  Uitgaan:          { emoji: "\u{1F378}", kleur: "#CE93D8", gradient: "linear-gradient(135deg,#4a148c,#7b1fa2)", soort: "uitje" },
  Cultuur:          { emoji: "\u{1F3DB}\uFE0F", kleur: "#B0BEC5", gradient: "linear-gradient(135deg,#263238,#455a64)", soort: "uitje" },
  Natuur:           { emoji: "\u{1F33F}", kleur: "#A5D6A7", gradient: "linear-gradient(135deg,#1b5e20,#2e7d32)", soort: "uitje" },
  Dieren:           { emoji: "\u{1F410}", kleur: "#DCE775", gradient: "linear-gradient(135deg,#33691e,#558b2f)", soort: "uitje" },
  Speelpark:        { emoji: "\u{1F9F8}", kleur: "#FF8A65", gradient: "linear-gradient(135deg,#bf360c,#e64a19)", soort: "uitje" },
  Sport:            { emoji: "\u{1F3C3}", kleur: "#64B5F6", gradient: "linear-gradient(135deg,#0d47a1,#1565c0)", soort: "uitje" },
  Pretpark:         { emoji: "\u{1F3A2}", kleur: "#EF9A9A", gradient: "linear-gradient(135deg,#b71c1c,#c62828)", soort: "uitje" },
  Hike:             { emoji: "\u{1F97E}", kleur: "#BCAAA4", gradient: "linear-gradient(135deg,#3e2723,#4e342e)", soort: "hike" },
  Verblijf:         { emoji: "\u{1F3D5}\uFE0F", kleur: "#C5E1A5", gradient: "linear-gradient(135deg,#1b5e20,#33691e)", soort: "reis" },
  Roadtrip:         { emoji: "\u{1F6E3}\uFE0F", kleur: "#FFCC80", gradient: "linear-gradient(135deg,#e65100,#bf360c)", soort: "reis" },
  Vakantie:         { emoji: "\u2708\uFE0F", kleur: "#F48FB1", gradient: "linear-gradient(135deg,#880e4f,#ad1457)", soort: "reis" },
};

// Kleuren-palet voor het aanmaken van een nieuwe categorie.
export const COLOR_PALETTE = [
  { naam: "Indigo", kleur: "#818CF8", gradient: "linear-gradient(135deg,#312e81,#4338ca)" },
  { naam: "Blauw",  kleur: "#4FC3F7", gradient: "linear-gradient(135deg,#0d47a1,#0288d1)" },
  { naam: "Groen",  kleur: "#A5D6A7", gradient: "linear-gradient(135deg,#1b5e20,#2e7d32)" },
  { naam: "Teal",   kleur: "#4DB6AC", gradient: "linear-gradient(135deg,#004d40,#00695c)" },
  { naam: "Geel",   kleur: "#FFD54F", gradient: "linear-gradient(135deg,#e65100,#f57c00)" },
  { naam: "Oranje", kleur: "#FFCC80", gradient: "linear-gradient(135deg,#bf360c,#e64a19)" },
  { naam: "Rood",   kleur: "#EF9A9A", gradient: "linear-gradient(135deg,#b71c1c,#c62828)" },
  { naam: "Roze",   kleur: "#F48FB1", gradient: "linear-gradient(135deg,#880e4f,#ad1457)" },
  { naam: "Paars",  kleur: "#CE93D8", gradient: "linear-gradient(135deg,#4a148c,#7b1fa2)" },
  { naam: "Bruin",  kleur: "#BCAAA4", gradient: "linear-gradient(135deg,#3e2723,#4e342e)" },
  { naam: "Lime",   kleur: "#DCE775", gradient: "linear-gradient(135deg,#33691e,#558b2f)" },
  { naam: "Cyaan",  kleur: "#80DEEA", gradient: "linear-gradient(135deg,#006064,#00838f)" },
];

// Emoji-keuzes voor een nieuwe categorie.
export const EMOJI_OPTIONS = [
  "🌊", "☀️", "🎳", "🧸", "🧗", "🏃", "🎢", "🏕️", "🛣️", "🇳🇱",
  "🥾", "✈️", "🏔️", "🎭", "🍕", "🎵", "🏖️", "🌿", "🚴", "🎯",
  "🏛️", "🌋", "🎪", "🚂", "🏄", "🎿", "🌅", "🦁", "🍷", "🎨",
  "🏝️", "🗺️", "⛷️", "🤿", "🛶", "🦅", "🌄", "🏜️", "🌊", "🧭",
];

// Lege sjablonen voor de formulieren.
export const EMPTY_ACTIVITY = { naam: "", locatie: "", categorie: "Water", type: "", link: "", notities: "", gedaan: false, favoriet: false, periode: "", tags: [], foto: false };
export const EMPTY_CATEGORY = { naam: "", emoji: "🌍", kleurIndex: 0, soort: "uitje" };

// Kleine hulp: veilig naar kleine letters (ook bij null/undefined/getallen).
export const lc = (v) => String(v ?? "").toLowerCase();

// Hoeveel tags er maximaal op één avontuur passen. Geen technische grens maar
// een leesbaarheidsgrens: meer dan dit en de kaart wordt een lappendeken.
export const MAX_TAGS = 8;

// Tags zijn vrije labels náást de categorie. De categorie bepaalt het tabblad
// en kan er daarom maar één zijn; tags mogen vrij gecombineerd worden, zodat
// iets dat zowel water als kids is niet in één hokje geperst hoeft te worden.
//
// Accepteert ook een komma-gescheiden string, want zo typt een mens ze in.
export function schoonTags(waarde) {
  const ruw = Array.isArray(waarde)
    ? waarde
    : typeof waarde === "string"
      ? waarde.split(",")
      : [];
  const gezien = new Set();
  const uit = [];
  for (const stuk of ruw) {
    const tag = String(stuk ?? "").replace(/\s+/g, " ").trim().slice(0, 24);
    if (!tag) continue;
    // "Kids" en "kids" zijn dezelfde tag; de eerste schrijfwijze wint.
    const sleutel = tag.toLowerCase();
    if (gezien.has(sleutel)) continue;
    gezien.add(sleutel);
    uit.push(tag);
    if (uit.length >= MAX_TAGS) break;
  }
  return uit;
}

// Schoont een opgeslagen activiteitenlijst op zodat elk item de verwachte
// velden heeft. Voorkomt crashes door onvolledige/oude data. Geeft null bij
// onbruikbare invoer (dan valt de app terug op de seed).
export function sanitizeActivities(arr) {
  if (!Array.isArray(arr)) return null;
  return arr
    .filter((a) => a && typeof a === "object")
    .map((a, i) => {
      // Oudere data had één statusveld; dat wordt hier gesplitst in twee
      // losse markeringen, zodat een gedane favoriet favoriet blijft.
      const gedaan =
        typeof a.gedaan === "boolean" ? a.gedaan : a.status === "gedaan";
      const favoriet =
        typeof a.favoriet === "boolean" ? a.favoriet : a.status === "favoriet";
      return {
        id: typeof a.id === "number" ? a.id : Date.now() + i,
        naam: String(a.naam ?? ""),
        locatie: String(a.locatie ?? ""),
        categorie: String(a.categorie ?? "Water"),
        type: String(a.type ?? ""),
        link: a.link ? String(a.link) : null,
        notities: String(a.notities ?? ""),
        gedaan,
        favoriet,
        periode: String(a.periode ?? ""),
        tags: schoonTags(a.tags),
        // Vlag, niet de afbeelding zelf: die staat in IndexedDB (lib/fotos.js).
        foto: !!a.foto,
      };
    });
}

// Schoont een opgeslagen categorie-object op.
export function sanitizeCategories(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
  const out = {};
  for (const [naam, meta] of Object.entries(obj)) {
    if (meta && typeof meta === "object") {
      out[naam] = {
        emoji: String(meta.emoji ?? FALLBACK_CATEGORY.emoji),
        kleur: String(meta.kleur ?? FALLBACK_CATEGORY.kleur),
        gradient: String(meta.gradient ?? FALLBACK_CATEGORY.gradient),
        soort: SOORTEN[meta.soort] ? meta.soort : soortVoorNaam(naam),
      };
    }
  }
  return Object.keys(out).length ? out : null;
}

// Standaard-activiteiten (opgeslagen onder av_db).
export const SEED_ACTIVITIES = [
  { id: 1, naam: "Bootje varen", locatie: "Nederland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 2, naam: "Vissen", locatie: "Nederland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 3, naam: "IJsbad nemen", locatie: "Nederland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 4, naam: "Terrasboot", locatie: "Nederland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "", tags: ["uit eten"] },
  { id: 5, naam: "Recreatieoord Binnenmaas", locatie: "Binnenmaas, Zuid-Holland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "zomer", tags: ["kids","zwemmen","speeltuin","dieren"] },
  { id: 6, naam: "Henschotermeer", locatie: "Woudenberg/Zeist, Utrecht", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "zomer", tags: [] },
  { id: 7, naam: "Strandbad Nuenen", locatie: "Nuenen, Noord-Brabant", categorie: "Water", type: "Wateractiviteit", link: "https://www.ticketsstrandbad.nl/strandbad.html", notities: "", status: "wil doen", periode: "mei-sept", tags: [] },
  { id: 8, naam: "Sterrenwacht", locatie: "Nederland", categorie: "Cultuur", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "herfst/winter", tags: ["avond"] },
  { id: 9, naam: "Peaky Blinders Bar", locatie: "Nederland", categorie: "Uitgaan", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "", tags: ["avond","binnen"] },
  { id: 10, naam: "Picknicken", locatie: "Nederland", categorie: "Eten & drinken", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "lente/zomer", tags: ["gratis","buiten"] },
  { id: 11, naam: "Casino", locatie: "Nederland", categorie: "Uitgaan", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "", tags: ["avond","binnen"] },
  { id: 12, naam: "Dierentuin", locatie: "Nederland", categorie: "Dieren", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","dieren","hele dag"] },
  { id: 13, naam: "Naturalis", locatie: "Leiden, Zuid-Holland", categorie: "Cultuur", type: "Museum", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","binnen","regendag"] },
  { id: 14, naam: "Milkyway Dark Sky", locatie: "Terschelling, Friesland", categorie: "Natuur", type: "Natuur/Beleving", link: null, notities: "Donkerste plek van NL", status: "favoriet", periode: "okt-feb", tags: ["avond"] },
  { id: 15, naam: "Scooter huren", locatie: "Nederland", categorie: "Sport", type: "Activiteit", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 16, naam: "Bowlen", locatie: "Nederland", categorie: "Uitgaan", type: "Activiteit", link: null, notities: "", status: "wil doen", periode: "", tags: ["binnen","regendag"] },
  { id: 17, naam: "Monkeytown", locatie: "Wamel, Gelderland", categorie: "Speelpark", type: "Indoor Speelpark", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","binnen","regendag"] },
  { id: 18, naam: "Play-in", locatie: "Utrecht", categorie: "Speelpark", type: "Indoor Speelpark", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","binnen","regendag"] },
  { id: 19, naam: "Kidswonderland", locatie: "Nederland", categorie: "Speelpark", type: "Kinderuitje", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","binnen","regendag"] },
  { id: 20, naam: "Jumpsquare", locatie: "Nieuwegein / Nijmegen / Arnhem / Ede", categorie: "Speelpark", type: "Trampoline Park", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","binnen","regendag"] },
  { id: 21, naam: "Boomkroonpad", locatie: "Drenthe", categorie: "Natuur", type: "Natuur", link: null, notities: "", status: "wil doen", periode: "lente/zomer", tags: [] },
  { id: 22, naam: "Padel", locatie: "Nederland", categorie: "Sport", type: "Racketsport", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 23, naam: "Skien", locatie: "Alpen", categorie: "Sport", type: "Wintersport", link: null, notities: "", status: "favoriet", periode: "dec-maart", tags: [] },
  { id: 24, naam: "Mountainbiken", locatie: "Nederland/Europa", categorie: "Sport", type: "Fietssport", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 25, naam: "Adventure Valley", locatie: "Europa", categorie: "Pretpark", type: "Pretpark", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","hele dag"] },
  { id: 26, naam: "Efteling", locatie: "Kaatsheuvel, Noord-Brabant", categorie: "Pretpark", type: "Pretpark", link: null, notities: "", status: "gedaan", periode: "", tags: ["kids","hele dag"] },
  { id: 27, naam: "Phantasialand", locatie: "Bruhl, Duitsland", categorie: "Pretpark", type: "Pretpark", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","hele dag"] },
  { id: 28, naam: "Rulantica Waterpark", locatie: "Rust, Duitsland", categorie: "Pretpark", type: "Waterpark", link: null, notities: "", status: "wil doen", periode: "zomer", tags: ["kids","zwemmen","binnen"] },
  { id: 29, naam: "Drijfhuisje Vinkeveen", locatie: "Vinkeveen, Utrecht", categorie: "Verblijf", type: "Bijzonder Verblijf", link: null, notities: "", status: "favoriet", periode: "", tags: [] },
  { id: 30, naam: "Valkenburg", locatie: "Limburg", categorie: "Verblijf", type: "Weekendje Weg", link: null, notities: "", status: "wil doen", periode: "winter", tags: [] },
  { id: 31, naam: "Boomhut", locatie: "Nederland", categorie: "Verblijf", type: "Bijzonder Verblijf", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 32, naam: "Cabiner", locatie: "Nederland, diverse locaties", categorie: "Verblijf", type: "Kamperen", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 33, naam: "Winterwoods", locatie: "Nederland", categorie: "Verblijf", type: "Kamperen", link: null, notities: "", status: "wil doen", periode: "winter", tags: [] },
  { id: 34, naam: "Cabin Anna", locatie: "Nederland", categorie: "Verblijf", type: "Kamperen", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 35, naam: "Netl Camping Kallumaan", locatie: "Kraggenburg, Flevoland", categorie: "Verblijf", type: "Kamperen", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 36, naam: "Roadtrip Limburg", locatie: "Limburg, Nederland", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 37, naam: "Roadtrip Luxemburg", locatie: "Luxemburg", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 38, naam: "Roadtrip Alpen", locatie: "Alpen, Europa", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "favoriet", periode: "zomer", tags: [] },
  { id: 39, naam: "Roadtrip Zwarte Woud", locatie: "Duitsland", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 40, naam: "Roadtrip Bretagne", locatie: "Frankrijk", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "zomer", tags: [] },
  { id: 41, naam: "Roadtrip Wallonie", locatie: "Belgie", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 42, naam: "Roadtrip IJsland", locatie: "IJsland", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "Droomdestinatie", status: "favoriet", periode: "juni-aug", tags: [] },
  { id: 43, naam: "Roadtrip Dolomieten", locatie: "Dolomieten, Italie", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "zomer", tags: [] },
  { id: 44, naam: "Roadtrip Noorwegen", locatie: "Noorwegen", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "zomer", tags: [] },
  { id: 45, naam: "Mokerheide", locatie: "Gelderland", categorie: "Hike", type: "Hike", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 46, naam: "Radio Kootwijk", locatie: "Gelderland", categorie: "Hike", type: "Hike", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 47, naam: "Pyramide van Austerlitz", locatie: "Utrecht", categorie: "Hike", type: "Hike", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 48, naam: "Hunebedden", locatie: "Drenthe", categorie: "Hike", type: "Hike", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 49, naam: "t Nije Hemelriek", locatie: "Drenthe", categorie: "Hike", type: "Hike", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 50, naam: "Alta Via 1", locatie: "Dolomieten, Italie", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "", status: "favoriet", periode: "juli-sept", tags: [] },
  { id: 51, naam: "Tre Cime di Lavaredo Trek", locatie: "Dolomieten, Italie", categorie: "Hike", type: "Dagwandeling", link: null, notities: "", status: "wil doen", periode: "juni-okt", tags: [] },
  { id: 52, naam: "Tour du Mont Blanc", locatie: "Frankrijk / Italie / Zwitserland", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "10 dagen, huttenroute", status: "favoriet", periode: "juli-aug", tags: [] },
  { id: 53, naam: "Matterhorn Circuit", locatie: "Zwitserland", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "", status: "wil doen", periode: "zomer", tags: [] },
  { id: 54, naam: "Camino de Santiago", locatie: "Spanje", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "", status: "wil doen", periode: "mei-okt", tags: [] },
  { id: 55, naam: "Kungsleden", locatie: "Zweden", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "", status: "favoriet", periode: "juli-aug", tags: [] },
  { id: 56, naam: "Everest Base Camp Trek", locatie: "Nepal", categorie: "Hike", type: "Expeditie", link: null, notities: "Bucket list", status: "favoriet", periode: "okt-nov / mrt-mei", tags: [] },
  { id: 57, naam: "Pacific Crest Trail", locatie: "Verenigde Staten", categorie: "Hike", type: "Thru-Hike", link: null, notities: "5 maanden", status: "wil doen", periode: "april-sept", tags: [] },
  { id: 58, naam: "Thailand", locatie: "Thailand", categorie: "Vakantie", type: "Verre Reis", link: null, notities: "", status: "wil doen", periode: "nov-feb", tags: [] },
  { id: 59, naam: "Jordanie", locatie: "Jordanie", categorie: "Vakantie", type: "Verre Reis", link: null, notities: "", status: "wil doen", periode: "mrt-mei", tags: [] },
  { id: 60, naam: "Dolomieten vakantie", locatie: "Italie", categorie: "Vakantie", type: "Bergvakantie", link: null, notities: "", status: "favoriet", periode: "juli-aug", tags: [] },
];
