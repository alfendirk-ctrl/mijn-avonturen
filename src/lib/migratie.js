// Eenmalige omzetting van de categorieën naar één as.
//
// De oude indeling mengde twee vragen door elkaar: sommige categorieën zeiden
// wát iets is (Water, Pretpark, Hike), andere voor wie het is of hoe het voelt
// (Kids, Ontspanning, Leisure). Daardoor stonden twee restaurants in twee
// verschillende categorieën, puur omdat er bij de één kinderen bij zaten.
//
// Nu zegt de categorie alleen nog wát iets is, en verhuist het "voor wie /
// wanneer" naar tags. Zie ook "Categorie versus tags" in CLAUDE.md.
//
// Deze kaart wordt op twee plekken gebruikt: om de standaardlijst in seed.js
// in te delen, en om bestaande opgeslagen data om te zetten. Eén bron, zodat
// een verse installatie en een bestaande telefoon niet uit elkaar lopen.

import {
  schoonTags,
  EXTRA_SEPT_2026,
  EXTRA_SEPT_2026_B,
  EXTRA_SEPT_2026_C,
  EXTRA_SEPT_2026_D,
  VERRIJKINGEN_SEPT_2026,
  INGETROKKEN,
} from "../data/seed.js";

// Onder welke sleutel onthouden wordt dat de omzetting gedraaid heeft. Zonder
// die markering zou hij bij elke keer laden opnieuw draaien, en een avontuur
// dat je zelf terugzet meteen weer wegslepen.
export const SLEUTEL_GEMIGREERD = "av_assen_gemigreerd";

// Categorieën die één op één hernoemd worden.
const HERNOEM = {
  "Hike NL": "Hike",
};

// Categorieën die uiteenvallen: per avontuur een eigen bestemming. Een item
// dat hier niet in staat blijft staan waar het staat — zie hieronder waarom.
const PER_AVONTUUR = {
  // Ontspanning was een verzamelbak.
  Sterrenwacht: "Cultuur",
  Naturalis: "Cultuur",
  "Milkyway Dark Sky": "Natuur",
  Dierentuin: "Dieren",
  Picknicken: "Eten & drinken",
  "Peaky Blinders Bar": "Uitgaan",
  Casino: "Uitgaan",
  // Leisure ook.
  Bowlen: "Uitgaan",
  "Scooter huren": "Sport",
  // Kids ging over de doelgroep, niet over wat het is.
  Monkeytown: "Speelpark",
  "Play-in": "Speelpark",
  Kidswonderland: "Speelpark",
  // Avontuur viel uiteen in twee heel verschillende dingen.
  Jumpsquare: "Speelpark",
  Boomkroonpad: "Natuur",
};

// Tags die bij de omzetting worden toegekend. Wat de oude categorie aan
// betekenis droeg gaat hiermee niet verloren.
const TAGS_PER_AVONTUUR = {
  Monkeytown: ["kids", "binnen", "regendag"],
  "Play-in": ["kids", "binnen", "regendag"],
  Kidswonderland: ["kids", "binnen", "regendag"],
  Jumpsquare: ["kids", "binnen", "regendag"],
  Efteling: ["kids", "hele dag"],
  Phantasialand: ["kids", "hele dag"],
  "Adventure Valley": ["kids", "hele dag"],
  "Rulantica Waterpark": ["kids", "zwemmen", "binnen"],
  Dierentuin: ["kids", "dieren", "hele dag"],
  "Recreatieoord Binnenmaas": ["kids", "zwemmen", "speeltuin", "dieren"],
  Naturalis: ["kids", "binnen", "regendag"],
  Terrasboot: ["uit eten"],
  Picknicken: ["gratis", "buiten"],
  Casino: ["avond", "binnen"],
  "Peaky Blinders Bar": ["avond", "binnen"],
  Bowlen: ["binnen", "regendag"],
  Sterrenwacht: ["avond"],
  "Milkyway Dark Sky": ["avond"],
};

// De oude categorieën die verdwijnen zodra ze leeg zijn.
const OPGEHEVEN = ["Ontspanning", "Leisure", "Kids", "Avontuur", "Hike NL"];

// Waar een avontuur heen gaat. Onbekende namen blijven met opzet staan waar ze
// staan: zelf toegevoegde avonturen in een opgeheven categorie mogen niet in
// een willekeurig hokje belanden. De categorie blijft dan gewoon bestaan.
export function nieuweCategorie(avontuur) {
  return (
    PER_AVONTUUR[avontuur.naam] ||
    HERNOEM[avontuur.categorie] ||
    avontuur.categorie
  );
}

export function extraTags(avontuur) {
  const uit = [...(TAGS_PER_AVONTUUR[avontuur.naam] || [])];
  // Alles wat onder Kids stond was per definitie voor kinderen, ook als de
  // naam hierboven niet voorkomt.
  if (avontuur.categorie === "Kids" && !uit.includes("kids")) uit.unshift("kids");
  return uit;
}

// Zet een hele lijst om. Geeft ook terug welke categorieën nu nog in gebruik
// zijn, zodat de aanroeper de lege kan opruimen.
export function migreerAvonturen(avonturen) {
  const nogInGebruik = new Set();
  const uit = avonturen.map((a) => {
    const categorie = nieuweCategorie(a);
    nogInGebruik.add(categorie);
    // Via schoonTags, zodat een tag die je zelf al had niet dubbel komt te
    // staan als de omzetting dezelfde tag toevoegt.
    const tags = schoonTags([...(a.tags || []), ...extraTags(a)]);
    return { ...a, categorie, tags };
  });
  return { avonturen: uit, nogInGebruik };
}

// De categorieën die na de omzetting moeten bestaan, met hun uiterlijk.
export const NIEUWE_CATEGORIEEN = {
  "Eten & drinken": { emoji: "🍽️", kleur: "#FFD54F", gradient: "linear-gradient(135deg,#e65100,#f57c00)", soort: "uitje" },
  Uitgaan:          { emoji: "🍸", kleur: "#CE93D8", gradient: "linear-gradient(135deg,#4a148c,#7b1fa2)", soort: "uitje" },
  Cultuur:          { emoji: "🏛️", kleur: "#B0BEC5", gradient: "linear-gradient(135deg,#263238,#455a64)", soort: "uitje" },
  Natuur:           { emoji: "🌿", kleur: "#A5D6A7", gradient: "linear-gradient(135deg,#1b5e20,#2e7d32)", soort: "uitje" },
  Dieren:           { emoji: "🐐", kleur: "#DCE775", gradient: "linear-gradient(135deg,#33691e,#558b2f)", soort: "uitje" },
  Speelpark:        { emoji: "🧸", kleur: "#FF8A65", gradient: "linear-gradient(135deg,#bf360c,#e64a19)", soort: "uitje" },
};

// Werkt het categorie-object bij: nieuwe erbij, opgeheven eruit zodra er niets
// meer in zit. Categorieën die je zelf hebt gemaakt blijven ongemoeid.
export function migreerCategorieen(categorieen, nogInGebruik) {
  const uit = { ...categorieen };
  for (const [naam, meta] of Object.entries(NIEUWE_CATEGORIEEN)) {
    if (!uit[naam]) uit[naam] = { ...meta };
  }
  for (const naam of OPGEHEVEN) {
    if (uit[naam] && !nogInGebruik.has(naam)) delete uit[naam];
  }
  return uit;
}

// ---- Nieuwe avonturen bijzetten ---------------------------------------------

// De standaardlijst wordt alleen gelezen op een toestel waar nog niets staat.
// Wie de app al gebruikt, zou nieuwe vondsten dus nooit te zien krijgen. Deze
// stap zet ze er eenmalig bij.
export const SLEUTEL_BUNDEL_SEPT26 = "av_bundel_sept26";

// Alle bundels die eenmalig bijgezet moeten worden, elk met een eigen
// markering. Een nieuwe vondstenronde is hier een regel erbij - niet een
// gekopieerd effect in App.jsx, want dan groeit dat bestand met elke bundel en
// is het wachten op eentje waar de markering per ongeluk hergebruikt wordt.
// Hergebruik zou betekenen dat de nieuwe bundel nooit aankomt op een telefoon
// die de vorige al verwerkt heeft.
export const BUNDELS = [
  { sleutel: SLEUTEL_BUNDEL_SEPT26, items: EXTRA_SEPT_2026 },
  { sleutel: "av_bundel_sept26b", items: EXTRA_SEPT_2026_B },
  { sleutel: "av_bundel_sept26c", items: EXTRA_SEPT_2026_C },
  { sleutel: "av_bundel_sept26d", items: EXTRA_SEPT_2026_D },
];

// Locaties waar de kaart geen speld op kan zetten; voor een aanvulling tellen
// die als "nog niet ingevuld". Zie TE_VAAG in lib/kaart.js - bewust hier
// herhaald en niet geimporteerd, want dat zou dit bestand aan de kaart hangen
// voor een lijstje van drie woorden.
const TE_VAAG_OM_TE_BEHOUDEN = ["nederland", "europa", "diverse", ""];

const isLeeg = (waarde, veld) => {
  const t = String(waarde ?? "").trim();
  if (!t) return true;
  return veld === "locatie" && TE_VAAG_OM_TE_BEHOUDEN.includes(t.toLowerCase());
};

export const SLEUTEL_INGETROKKEN = "av_ingetrokken_sept26";

// Haalt avonturen weg die achteraf zijn ingetrokken. Dit is de enige plek waar
// code data van de gebruiker WEGGOOIT, dus er zitten twee sloten op:
//
// 1. de naam moet nog kloppen. Heb je dat id inmiddels aan iets anders gegeven,
//    of het avontuur hernoemd tot iets dat je wél wilt houden, dan blijft het
//    staan;
// 2. het draait een keer, met een eigen markering, net als de rest.
//
// Geeft { lijst, verwijderdeIds } terug, zodat de aanroeper er grafstenen voor
// kan zetten - anders komt het item bij de eerstvolgende synchronisatie gewoon
// terug van het andere toestel.
export function trekIn(avonturen, ingetrokken = INGETROKKEN) {
  const weg = new Set();
  const lijst = avonturen.filter((a) => {
    const bron = ingetrokken.find((i) => i.id === a.id);
    if (!bron) return true;
    if (String(a.naam ?? "").trim() !== bron.naam) return true;
    weg.add(a.id);
    return false;
  });
  return weg.size ? { lijst, verwijderdeIds: [...weg] } : null;
}

export const SLEUTEL_VERRIJKING = "av_verrijking_sept26";

// Vult lege velden aan op avonturen die er al staan. Wat jij zelf hebt
// ingevuld blijft staan - dezelfde regel als bij de tekstherkenning: de
// aanvulling raadt, jij weet. Geeft null als er niets te doen viel, zodat de
// aanroeper de lijst ongemoeid kan laten.
export function verrijkAvonturen(avonturen, verrijkingen = VERRIJKINGEN_SEPT_2026) {
  let veranderd = false;
  const uit = avonturen.map((a) => {
    const bron = verrijkingen.find((v) => v.id === a.id);
    if (!bron) return a;
    const aanvulling = {};
    for (const [veld, waarde] of Object.entries(bron.velden)) {
      if (isLeeg(a[veld], veld)) aanvulling[veld] = waarde;
    }
    if (!Object.keys(aanvulling).length) return a;
    veranderd = true;
    return { ...a, ...aanvulling };
  });
  return veranderd ? uit : null;
}

// Vult de lijst aan met avonturen die er nog niet in zitten, herkend op id.
// Verwijder je er later een, dan komt hij niet terug: de markering is dan al
// gezet. Dat is met opzet - jouw beslissing hoort te blijven staan.
export function vulAanMetBundel(avonturen, bundel = EXTRA_SEPT_2026) {
  const bestaandeIds = new Set(avonturen.map((a) => a.id));
  const ontbreekt = bundel.filter((a) => !bestaandeIds.has(a.id));
  if (!ontbreekt.length) return null;
  // Vooraan, zodat je ze meteen ziet.
  return [...ontbreekt, ...avonturen];
}
