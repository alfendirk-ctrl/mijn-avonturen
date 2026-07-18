// Seed data & vaste keuzelijsten voor "Mijn Avonturen".
// De localStorage-sleutels (av_db / av_cats) worden gebruikt door useLocalStorage
// zodat bestaande gebruikersdata behouden blijft.

// Categorieën die als "Hikes" worden getoond (aparte bewaar-/wishlist-sectie
// i.p.v. onderdeel van de activiteiten-planner).
export const HIKE_CATEGORIES = ["Hike NL", "Hike"];

// De drie statussen die een activiteit kan hebben.
export const STATUSES = {
  "wil doen": { label: "Wil doen", emoji: "🔖", kleur: "#4A90D9", bg: "rgba(74,144,217,0.15)", dim: "rgba(74,144,217,0.06)" },
  gedaan:     { label: "Gedaan",   emoji: "✓", kleur: "#3DBE8A", bg: "rgba(61,190,138,0.15)", dim: "rgba(61,190,138,0.06)" },
  favoriet:   { label: "Favoriet", emoji: "★", kleur: "#F5A623", bg: "rgba(245,166,35,0.15)", dim: "rgba(245,166,35,0.06)" },
};

// Fallback voor een categorie die (nog) niet in de lijst staat.
export const FALLBACK_CATEGORY = {
  emoji: "✦",
  kleur: "#6366F1",
  gradient: "linear-gradient(135deg,#312e81,#4338ca)",
};

// Standaard-categorieën (opgeslagen onder av_cats). Object: naam -> { emoji, kleur, gradient }.
export const SEED_CATEGORIES = {
  Water:       { emoji: "🌊", kleur: "#4FC3F7", gradient: "linear-gradient(135deg,#0d47a1,#0288d1)" },
  Ontspanning: { emoji: "☀️", kleur: "#FFD54F", gradient: "linear-gradient(135deg,#e65100,#f57c00)" },
  Leisure:     { emoji: "🎳", kleur: "#CE93D8", gradient: "linear-gradient(135deg,#4a148c,#7b1fa2)" },
  Kids:        { emoji: "🧸", kleur: "#FF8A65", gradient: "linear-gradient(135deg,#bf360c,#e64a19)" },
  Avontuur:    { emoji: "🧗", kleur: "#A5D6A7", gradient: "linear-gradient(135deg,#1b5e20,#2e7d32)" },
  Sport:       { emoji: "🏃", kleur: "#64B5F6", gradient: "linear-gradient(135deg,#0d47a1,#1565c0)" },
  Pretpark:    { emoji: "🎢", kleur: "#EF9A9A", gradient: "linear-gradient(135deg,#b71c1c,#c62828)" },
  Verblijf:    { emoji: "🏕️", kleur: "#C5E1A5", gradient: "linear-gradient(135deg,#1b5e20,#33691e)" },
  Roadtrip:    { emoji: "🛣️", kleur: "#FFCC80", gradient: "linear-gradient(135deg,#e65100,#bf360c)" },
  "Hike NL":   { emoji: "🇳🇱", kleur: "#81D4FA", gradient: "linear-gradient(135deg,#01579b,#0277bd)" },
  Hike:        { emoji: "🥾", kleur: "#BCAAA4", gradient: "linear-gradient(135deg,#3e2723,#4e342e)" },
  Vakantie:    { emoji: "✈️", kleur: "#F48FB1", gradient: "linear-gradient(135deg,#880e4f,#ad1457)" },
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
export const EMPTY_ACTIVITY = { naam: "", locatie: "", categorie: "Water", type: "", link: "", notities: "", status: "wil doen", periode: "" };
export const EMPTY_CATEGORY = { naam: "", emoji: "🌍", kleurIndex: 0 };

// Standaard-activiteiten (opgeslagen onder av_db).
export const SEED_ACTIVITIES = [
  { id: 1, naam: "Bootje varen", locatie: "Nederland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 2, naam: "Vissen", locatie: "Nederland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 3, naam: "IJsbad nemen", locatie: "Nederland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 4, naam: "Terrasboot", locatie: "Nederland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 5, naam: "Recreatieoord Binnenmaas", locatie: "Binnenmaas, Zuid-Holland", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "zomer" },
  { id: 6, naam: "Henschotermeer", locatie: "Woudenberg/Zeist, Utrecht", categorie: "Water", type: "Wateractiviteit", link: null, notities: "", status: "wil doen", periode: "zomer" },
  { id: 7, naam: "Strandbad Nuenen", locatie: "Nuenen, Noord-Brabant", categorie: "Water", type: "Wateractiviteit", link: "https://www.ticketsstrandbad.nl/strandbad.html", notities: "", status: "wil doen", periode: "mei-sept" },
  { id: 8, naam: "Sterrenwacht", locatie: "Nederland", categorie: "Ontspanning", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "herfst/winter" },
  { id: 9, naam: "Peaky Blinders Bar", locatie: "Nederland", categorie: "Ontspanning", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 10, naam: "Picknicken", locatie: "Nederland", categorie: "Ontspanning", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "lente/zomer" },
  { id: 11, naam: "Casino", locatie: "Nederland", categorie: "Ontspanning", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 12, naam: "Dierentuin", locatie: "Nederland", categorie: "Ontspanning", type: "Uitje", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 13, naam: "Naturalis", locatie: "Leiden, Zuid-Holland", categorie: "Ontspanning", type: "Museum", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 14, naam: "Milkyway Dark Sky", locatie: "Terschelling, Friesland", categorie: "Ontspanning", type: "Natuur/Beleving", link: null, notities: "Donkerste plek van NL", status: "favoriet", periode: "okt-feb" },
  { id: 15, naam: "Scooter huren", locatie: "Nederland", categorie: "Leisure", type: "Activiteit", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 16, naam: "Bowlen", locatie: "Nederland", categorie: "Leisure", type: "Activiteit", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 17, naam: "Monkeytown", locatie: "Wamel, Gelderland", categorie: "Kids", type: "Indoor Speelpark", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 18, naam: "Play-in", locatie: "Utrecht", categorie: "Kids", type: "Indoor Speelpark", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 19, naam: "Kidswonderland", locatie: "Nederland", categorie: "Kids", type: "Kinderuitje", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 20, naam: "Jumpsquare", locatie: "Nieuwegein / Nijmegen / Arnhem / Ede", categorie: "Avontuur", type: "Trampoline Park", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 21, naam: "Boomkroonpad", locatie: "Drenthe", categorie: "Avontuur", type: "Natuur", link: null, notities: "", status: "wil doen", periode: "lente/zomer" },
  { id: 22, naam: "Padel", locatie: "Nederland", categorie: "Sport", type: "Racketsport", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 23, naam: "Skien", locatie: "Alpen", categorie: "Sport", type: "Wintersport", link: null, notities: "", status: "favoriet", periode: "dec-maart" },
  { id: 24, naam: "Mountainbiken", locatie: "Nederland/Europa", categorie: "Sport", type: "Fietssport", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 25, naam: "Adventure Valley", locatie: "Europa", categorie: "Pretpark", type: "Pretpark", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 26, naam: "Efteling", locatie: "Kaatsheuvel, Noord-Brabant", categorie: "Pretpark", type: "Pretpark", link: null, notities: "", status: "gedaan", periode: "" },
  { id: 27, naam: "Phantasialand", locatie: "Bruhl, Duitsland", categorie: "Pretpark", type: "Pretpark", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 28, naam: "Rulantica Waterpark", locatie: "Rust, Duitsland", categorie: "Pretpark", type: "Waterpark", link: null, notities: "", status: "wil doen", periode: "zomer" },
  { id: 29, naam: "Drijfhuisje Vinkeveen", locatie: "Vinkeveen, Utrecht", categorie: "Verblijf", type: "Bijzonder Verblijf", link: null, notities: "", status: "favoriet", periode: "" },
  { id: 30, naam: "Valkenburg", locatie: "Limburg", categorie: "Verblijf", type: "Weekendje Weg", link: null, notities: "", status: "wil doen", periode: "winter" },
  { id: 31, naam: "Boomhut", locatie: "Nederland", categorie: "Verblijf", type: "Bijzonder Verblijf", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 32, naam: "Cabiner", locatie: "Nederland, diverse locaties", categorie: "Verblijf", type: "Kamperen", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 33, naam: "Winterwoods", locatie: "Nederland", categorie: "Verblijf", type: "Kamperen", link: null, notities: "", status: "wil doen", periode: "winter" },
  { id: 34, naam: "Cabin Anna", locatie: "Nederland", categorie: "Verblijf", type: "Kamperen", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 35, naam: "Netl Camping Kallumaan", locatie: "Kraggenburg, Flevoland", categorie: "Verblijf", type: "Kamperen", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 36, naam: "Roadtrip Limburg", locatie: "Limburg, Nederland", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 37, naam: "Roadtrip Luxemburg", locatie: "Luxemburg", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 38, naam: "Roadtrip Alpen", locatie: "Alpen, Europa", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "favoriet", periode: "zomer" },
  { id: 39, naam: "Roadtrip Zwarte Woud", locatie: "Duitsland", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 40, naam: "Roadtrip Bretagne", locatie: "Frankrijk", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "zomer" },
  { id: 41, naam: "Roadtrip Wallonie", locatie: "Belgie", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 42, naam: "Roadtrip IJsland", locatie: "IJsland", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "Droomdestinatie", status: "favoriet", periode: "juni-aug" },
  { id: 43, naam: "Roadtrip Dolomieten", locatie: "Dolomieten, Italie", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "zomer" },
  { id: 44, naam: "Roadtrip Noorwegen", locatie: "Noorwegen", categorie: "Roadtrip", type: "Roadtrip", link: null, notities: "", status: "wil doen", periode: "zomer" },
  { id: 45, naam: "Mokerheide", locatie: "Gelderland", categorie: "Hike NL", type: "Hike", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 46, naam: "Radio Kootwijk", locatie: "Gelderland", categorie: "Hike NL", type: "Hike", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 47, naam: "Pyramide van Austerlitz", locatie: "Utrecht", categorie: "Hike NL", type: "Hike", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 48, naam: "Hunebedden", locatie: "Drenthe", categorie: "Hike NL", type: "Hike", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 49, naam: "t Nije Hemelriek", locatie: "Drenthe", categorie: "Hike NL", type: "Hike", link: null, notities: "", status: "wil doen", periode: "" },
  { id: 50, naam: "Alta Via 1", locatie: "Dolomieten, Italie", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "", status: "favoriet", periode: "juli-sept" },
  { id: 51, naam: "Tre Cime di Lavaredo Trek", locatie: "Dolomieten, Italie", categorie: "Hike", type: "Dagwandeling", link: null, notities: "", status: "wil doen", periode: "juni-okt" },
  { id: 52, naam: "Tour du Mont Blanc", locatie: "Frankrijk / Italie / Zwitserland", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "10 dagen, huttenroute", status: "favoriet", periode: "juli-aug" },
  { id: 53, naam: "Matterhorn Circuit", locatie: "Zwitserland", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "", status: "wil doen", periode: "zomer" },
  { id: 54, naam: "Camino de Santiago", locatie: "Spanje", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "", status: "wil doen", periode: "mei-okt" },
  { id: 55, naam: "Kungsleden", locatie: "Zweden", categorie: "Hike", type: "Meerdaagse Hike", link: null, notities: "", status: "favoriet", periode: "juli-aug" },
  { id: 56, naam: "Everest Base Camp Trek", locatie: "Nepal", categorie: "Hike", type: "Expeditie", link: null, notities: "Bucket list", status: "favoriet", periode: "okt-nov / mrt-mei" },
  { id: 57, naam: "Pacific Crest Trail", locatie: "Verenigde Staten", categorie: "Hike", type: "Thru-Hike", link: null, notities: "5 maanden", status: "wil doen", periode: "april-sept" },
  { id: 58, naam: "Thailand", locatie: "Thailand", categorie: "Vakantie", type: "Verre Reis", link: null, notities: "", status: "wil doen", periode: "nov-feb" },
  { id: 59, naam: "Jordanie", locatie: "Jordanie", categorie: "Vakantie", type: "Verre Reis", link: null, notities: "", status: "wil doen", periode: "mrt-mei" },
  { id: 60, naam: "Dolomieten vakantie", locatie: "Italie", categorie: "Vakantie", type: "Bergvakantie", link: null, notities: "", status: "favoriet", periode: "juli-aug" },
];
