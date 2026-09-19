// Coördinaten afleiden uit de locatietekst die er al staat.
//
// Net als de afstand en het seizoen wordt dit BEREKEND, niet opgeslagen: de
// vrije tekst blijft de waarheid. Dat betekent ook: geen geocodeerdienst, geen
// netwerk en geen extra veld dat bij het synchroniseren mee moet.
//
// De coördinaten zijn plaatsniveau, niet adresniveau. Een speld staat dus in
// het dorp en niet op de stoep - genoeg om te zien waar iets ligt en of het
// bij elkaar in de buurt is, niet om op te navigeren. Daar is de link voor.

const PLAATSEN = {
  // Nederlandse plaatsen
  apeldoorn: [52.2112, 5.9699],
  culemborg: [51.9556, 5.2272],
  ede: [52.0402, 5.6649],
  kaatsheuvel: [51.6547, 5.0486],
  kraggenburg: [52.6667, 5.9],
  leiden: [52.1601, 4.497],
  mijnsheerenland: [51.7833, 4.4833],
  binnenmaas: [51.7833, 4.4833],
  nieuwegein: [52.0292, 5.0806],
  nijmegen: [51.8126, 5.8372],
  arnhem: [51.9851, 5.8987],
  nuenen: [51.4728, 5.5472],
  schalkwijk: [51.9833, 5.2167],
  terschelling: [53.3833, 5.3333],
  vinkeveen: [52.2167, 4.9333],
  wamel: [51.8833, 5.4667],
  woerden: [52.0855, 4.8836],
  woudenberg: [52.08, 5.4167],
  zeist: [52.0907, 5.2333],
  valkenburg: [50.8653, 5.8317],

  // Nederlandse provincies (middelpunt)
  drenthe: [52.9476, 6.6231],
  flevoland: [52.5279, 5.5953],
  friesland: [53.1642, 5.7818],
  gelderland: [52.0452, 5.8717],
  groningen: [53.2194, 6.5665],
  limburg: [51.2, 5.9333],
  "noord-brabant": [51.4826, 5.2322],
  "noord-holland": [52.5206, 4.7885],
  overijssel: [52.4388, 6.5016],
  utrecht: [52.0907, 5.1214],
  zeeland: [51.4941, 3.8497],
  "zuid-holland": [51.99, 4.47],

  // Buitenland
  transinne: [50.0167, 5.2667],
  bruhl: [50.8283, 6.905],
  rust: [48.2667, 7.7333],
  belgie: [50.5039, 4.4699],
  duitsland: [51.1657, 10.4515],
  luxemburg: [49.8153, 6.1296],
  frankrijk: [46.2276, 2.2137],
  italie: [41.8719, 12.5674],
  spanje: [40.4637, -3.7492],
  zwitserland: [46.8182, 8.2275],
  oostenrijk: [47.5162, 14.5501],
  zweden: [60.1282, 18.6435],
  noorwegen: [60.472, 8.4689],
  ijsland: [64.9631, -19.0208],
  jordanie: [30.5852, 36.2384],
  thailand: [15.87, 100.9925],
  nepal: [28.3949, 84.124],
  "verenigde staten": [39.8283, -98.5795],

  // Streken
  alpen: [46.5, 10.0],
  dolomieten: [46.4102, 11.844],
  pyreneeen: [42.6, 1.0],
  ardennen: [50.15, 5.6],
};

// "Nederland" en "Europa" staan er met opzet NIET in. Een speld op het
// middelpunt van Nederland zegt niets, en bij twintig van die spelden op één
// punt wordt de kaart onleesbaar. Zulke avonturen tellen we apart.
const TE_VAAG = ["nederland", "europa", "diverse"];

const zonderAccenten = (t) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Een plaatsnaam moet als heel woord voorkomen. Zonder die eis zet "Nederland"
// alles in Ede, want "nEDErland" bevat die drie letters - en dan staan er
// twintig spelden op een dorp in Gelderland waar niemand ooit is geweest.
const patronen = new Map();
function positieVan(tekst, naam) {
  let patroon = patronen.get(naam);
  if (!patroon) {
    patroon = new RegExp(`\\b${naam.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    patronen.set(naam, patroon);
  }
  const m = patroon.exec(tekst);
  return m ? m.index : -1;
}

// Zoekt de plaats die het VROEGST in de tekst genoemd wordt. Locaties zijn
// geschreven van specifiek naar algemeen ("Culemborg, Gelderland"), dus wat
// vooraan staat is het nauwkeurigst. Bij gelijke positie wint de langste naam.
export function coordinatenVoor(locatie) {
  const tekst = zonderAccenten(String(locatie ?? ""));
  if (!tekst.trim()) return null;

  let beste = null;
  for (const [naam, punt] of Object.entries(PLAATSEN)) {
    const pos = positieVan(tekst, naam);
    if (pos === -1) continue;
    if (!beste || pos < beste.pos || (pos === beste.pos && naam.length > beste.naam.length)) {
      beste = { pos, naam, punt };
    }
  }
  return beste ? beste.punt : null;
}

// Is deze locatie te vaag om op een kaart te zetten? Handig om te kunnen
// uitleggen waarom iets ontbreekt, in plaats van het stilletjes weg te laten.
export function isTeVaag(locatie) {
  const tekst = zonderAccenten(String(locatie ?? ""));
  return !coordinatenVoor(locatie) && TE_VAAG.some((v) => tekst.includes(v));
}

// Verdeelt een lijst in wat wel en niet op de kaart past.
export function splitsOpKaart(items) {
  const op = [];
  const zonder = [];
  for (const a of items) {
    const punt = coordinatenVoor(a.locatie);
    if (punt) op.push({ ...a, punt });
    else zonder.push(a);
  }
  return { op, zonder };
}
