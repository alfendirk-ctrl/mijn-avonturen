// Leidt bruikbare gegevens af uit de vrije tekst die al in de database staat.
// De brontekst (periode, locatie, categorie) blijft de waarheid; alles hier
// wordt berekend, zodat er niets gemigreerd of dubbel opgeslagen hoeft te worden.

// ---- Seizoen ----------------------------------------------------------------

const SEIZOENEN = {
  lente: [3, 4, 5],
  voorjaar: [3, 4, 5],
  zomer: [6, 7, 8],
  hoogzomer: [7, 8],
  herfst: [9, 10, 11],
  najaar: [9, 10, 11],
  winter: [12, 1, 2],
};

const MAAND_NAMEN = {
  jan: 1, januari: 1,
  feb: 2, februari: 2,
  mrt: 3, mar: 3, maart: 3,
  apr: 4, april: 4,
  mei: 5,
  jun: 6, juni: 6,
  jul: 7, juli: 7,
  aug: 8, augustus: 8,
  sep: 9, sept: 9, september: 9,
  okt: 10, oktober: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

export const MAAND_LABEL = [
  "", "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

// Maanden van a t/m b, ook als het jaargrens overschrijdt (okt-feb).
function reeks(a, b) {
  const out = [];
  let m = a;
  for (let i = 0; i < 12; i++) {
    out.push(m);
    if (m === b) break;
    m = m === 12 ? 1 : m + 1;
  }
  return out;
}

// "juli-aug" -> [7,8]   "okt-feb" -> [10,11,12,1,2]   "lente/zomer" -> [3..8]
// Lege of onbegrepen tekst levert [] op: dat betekent "het hele jaar door".
export function maandenUitPeriode(periode) {
  const tekst = String(periode ?? "").toLowerCase().trim();
  if (!tekst) return [];

  const maanden = new Set();
  for (const deel of tekst.split(/[/,]|\ben\b/)) {
    const stuk = deel.trim();
    if (!stuk) continue;

    if (SEIZOENEN[stuk]) {
      SEIZOENEN[stuk].forEach((m) => maanden.add(m));
      continue;
    }

    const grenzen = stuk.split("-").map((s) => s.trim());
    if (grenzen.length === 2 && MAAND_NAMEN[grenzen[0]] && MAAND_NAMEN[grenzen[1]]) {
      reeks(MAAND_NAMEN[grenzen[0]], MAAND_NAMEN[grenzen[1]]).forEach((m) => maanden.add(m));
      continue;
    }

    if (MAAND_NAMEN[stuk]) maanden.add(MAAND_NAMEN[stuk]);
  }
  return [...maanden].sort((a, b) => a - b);
}

// Past dit item in maand `maand`? Zonder periode kan het altijd.
export function pastInMaand(maanden, maand) {
  return !maanden.length || maanden.includes(maand);
}

export function huidigeMaand() {
  return new Date().getMonth() + 1;
}

export function seizoenVanMaand(maand) {
  if ([3, 4, 5].includes(maand)) return "lente";
  if ([6, 7, 8].includes(maand)) return "zomer";
  if ([9, 10, 11].includes(maand)) return "herfst";
  return "winter";
}

// Het seizoen kleurt de hele app. Dat is geen versiering: het onderstreept
// waar de app om draait — wat kan er nú.
export const SEIZOEN_THEMA = {
  lente: {
    naam: "lente",
    emoji: "🌱",
    stemming: "alles loopt weer uit",
    accent: "#4ADE80",
    accent2: "#BEF264",
    glow: "rgba(74,222,128,0.13)",
  },
  zomer: {
    naam: "zomer",
    emoji: "☀️",
    stemming: "lange dagen, laat licht",
    accent: "#FFC043",
    accent2: "#FF7A59",
    glow: "rgba(255,192,67,0.14)",
  },
  herfst: {
    naam: "herfst",
    emoji: "🍂",
    stemming: "gouden licht, lege paden",
    accent: "#EA7C3C",
    accent2: "#9A3412",
    glow: "rgba(234,124,60,0.13)",
  },
  winter: {
    naam: "winter",
    emoji: "❄️",
    stemming: "korte dagen, heldere luchten",
    accent: "#7DD3FC",
    accent2: "#A78BFA",
    glow: "rgba(125,211,252,0.13)",
  },
};

export function themaVanMaand(maand) {
  return SEIZOEN_THEMA[seizoenVanMaand(maand)];
}

// ---- Afstand ----------------------------------------------------------------

// Deze woordenlijsten worden ook door lib/lezen.js gebruikt om een locatie uit
// een herkende schermafdruk te vissen — vandaar dat ze geëxporteerd zijn.
export const PROVINCIES = [
  "drenthe", "flevoland", "friesland", "gelderland", "groningen", "limburg",
  "noord-brabant", "noord-holland", "overijssel", "utrecht", "zeeland",
  "zuid-holland",
];

const BUURLANDEN = ["belgie", "belgië", "duitsland", "luxemburg"];

const EUROPA = [
  "frankrijk", "italie", "italië", "zwitserland", "oostenrijk", "spanje",
  "portugal", "zweden", "noorwegen", "denemarken", "finland", "ijsland",
  "polen", "tsjechie", "tsjechië", "kroatie", "kroatië", "slovenie",
  "slovenië", "griekenland", "ierland", "schotland", "engeland", "europa",
  "alpen", "dolomieten", "pyreneeen", "pyreneeën", "corsica", "sardinie",
];

// Alle landen en streken die we bij naam kennen, dichtstbij eerst.
export const LANDEN = ["nederland", ...BUURLANDEN, ...EUROPA];

export const AFSTANDEN = {
  dichtbij: { label: "In Nederland", kort: "NL", emoji: "🇳🇱", volgorde: 0 },
  buurland: { label: "Buurlanden", kort: "Buurland", emoji: "🚗", volgorde: 1 },
  europa: { label: "Europa", kort: "Europa", emoji: "🏔️", volgorde: 2 },
  ver: { label: "Verre reis", kort: "Ver weg", emoji: "🌍", volgorde: 3 },
};

function metHoofdletter(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Leidt afstandsklasse + regionaam af uit de locatietekst.
export function afstandUitLocatie(locatie) {
  const tekst = String(locatie ?? "").toLowerCase();
  if (!tekst.trim()) return { afstand: "dichtbij", regio: "" };

  const provincie = PROVINCIES.find((p) => tekst.includes(p));
  if (provincie) return { afstand: "dichtbij", regio: metHoofdletter(provincie) };
  if (tekst.includes("nederland")) return { afstand: "dichtbij", regio: "Nederland" };

  const buur = BUURLANDEN.find((l) => tekst.includes(l));
  if (buur) return { afstand: "buurland", regio: metHoofdletter(buur) };

  const eu = EUROPA.find((l) => tekst.includes(l));
  if (eu) return { afstand: "europa", regio: metHoofdletter(eu) };

  // Onbekend land: neem het laatste deel van de locatie als regionaam.
  const laatste = String(locatie).split(",").pop().trim();
  return { afstand: "ver", regio: laatste };
}

// ---- Alles bij elkaar -------------------------------------------------------

// Verrijkt een activiteit met afgeleide velden voor filteren en tonen.
export function verrijk(activiteit, soortVanCategorie) {
  const maanden = maandenUitPeriode(activiteit.periode);
  const { afstand, regio } = afstandUitLocatie(activiteit.locatie);
  return {
    ...activiteit,
    maanden,
    afstand,
    regio,
    soort: soortVanCategorie(activiteit.categorie),
  };
}
