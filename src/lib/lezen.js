// Leest tekst uit een screenshot en probeert daar de velden van een avontuur
// uit af te leiden. Bedoeld voor schermafdrukken van Instagram-posts.
//
// De tekstherkenning draait in de browser zelf (tesseract.js) en wordt pas
// opgehaald als je 'm gebruikt — anders zou iedereen die de app opent een
// paar megabyte moeten downloaden voor een functie die hij misschien nooit
// gebruikt.

import { PROVINCIES, LANDEN } from "./afleiden.js";

let werkerBelofte = null;
// De voortgangsmelder hangt aan de werker, en die maken we maar één keer aan.
// Daarom wijst de logger naar deze variabele in plaats van naar de functie die
// hem meegaf — anders zou alleen de eerste leesbeurt voortgang tonen.
let meldVoortgang = null;

// De herkenner wordt één keer opgestart en daarna hergebruikt.
function haalWerker() {
  if (!werkerBelofte) {
    werkerBelofte = (async () => {
      const { createWorker } = await import("tesseract.js");
      return createWorker("nld", 1, {
        logger: (m) => {
          if (m.status === "recognizing text" && meldVoortgang) {
            meldVoortgang(Math.round(m.progress * 100));
          }
        },
      });
    })().catch((fout) => {
      // Mislukt opstarten (geen internet bij de eerste keer) mag niet blijven
      // plakken: zonder dit levert elke volgende poging meteen dezelfde fout.
      werkerBelofte = null;
      throw fout;
    });
  }
  return werkerBelofte;
}

export async function leesTekst(afbeelding, opVoortgang) {
  const werker = await haalWerker();
  meldVoortgang = opVoortgang;
  try {
    const uitkomst = await werker.recognize(afbeelding);
    return uitkomst?.data?.text || "";
  } finally {
    meldVoortgang = null;
  }
}

// ---- Van ruwe tekst naar velden ---------------------------------------------

// Regels die uit de schil van Instagram komen en niets over de plek zeggen.
const RUIS = [
  /^\d+[.,\d]*\s*(vind-?ik-?leuks?|likes?|reacties|comments|weergaven|views|volgers|followers)/i,
  /^(vind ik leuk|like|reageer|comment|delen|share|opslaan|save|volgen|following|volg)/i,
  /^(bekijk (alle|vertaling)|see (all|translation)|meer|more|origineel)/i,
  /^\d+\s*(u|d|w|min|uur|dagen|weken|seconden)\s*(geleden)?$/i,
  /^(zoeken|search|home|reels|profiel|profile|bericht|delen)$/i,
  /^[\W_]+$/, // alleen leestekens of pictogrammen
  /^\d{1,2}:\d{2}/, // klokje in de statusbalk
];

// Trefwoorden per categorie. Eerste treffer wint, dus specifiek vóór algemeen.
const CATEGORIE_WOORDEN = [
  ["Hike", ["hike", "hiking", "trek", "trail", "huttentocht", "meerdaagse", "bergwandel"]],
  ["Hike NL", ["wandelroute", "wandeling", "boswandeling", "hunebed"]],
  ["Verblijf", ["camping", "kamperen", "cabin", "chalet", "bed and breakfast", "b&b", "hotel", "overnacht", "glamping", "tiny house", "boomhut", "slapen"]],
  ["Roadtrip", ["roadtrip", "road trip", "camper", "rondreis"]],
  ["Water", ["strand", "zwem", "zwemmeer", "meertje", "plas", "kano", "sup", "vaar", "boot", "duik", "surf", "waterval"]],
  ["Pretpark", ["pretpark", "attractiepark", "achtbaan", "themepark", "waterpark"]],
  ["Kids", ["kinder", "kids", "speeltuin", "speelparadijs", "gezin", "familie"]],
  ["Sport", ["klimmen", "klimhal", "mountainbike", "fiets", "padel", "ski", "snowboard", "hardlopen"]],
  ["Avontuur", ["avontuur", "abseil", "kajak", "survival", "grot"]],
  ["Ontspanning", ["sauna", "spa", "wellness", "museum", "terras", "restaurant", "koffie", "picknick"]],
  ["Vakantie", ["vakantie", "resort", "eiland", "citytrip"]],
];

const SEIZOEN_WOORDEN = [
  ["zomer", ["zomer", "summer", "hoogzomer"]],
  ["winter", ["winter", "sneeuw", "snow", "wintersport"]],
  ["lente", ["lente", "voorjaar", "spring", "bloesem"]],
  ["herfst", ["herfst", "najaar", "autumn", "herfstkleuren"]],
];

// Een trefwoord moet aan het begin van een woord staan, anders herkent "meer"
// ook "meerdere". Korte woorden ("sup", "spa", "ski") moeten helemaal los
// staan, want die zitten anders zo in "supermarkt" of "spannend".
const woordCache = new Map();
function bevat(tekst, woord) {
  let patroon = woordCache.get(woord);
  if (!patroon) {
    const veilig = woord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    patroon = new RegExp(`\\b${veilig}${woord.length <= 4 ? "\\b" : ""}`, "i");
    woordCache.set(woord, patroon);
  }
  return patroon.test(tekst);
}

const MAAND_WOORDEN =
  /\b(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\b/gi;

const isRuis = (regel) => RUIS.some((p) => p.test(regel.trim()));

// Een gebruikersnaam als "strandbad_nuenen" of "de.groene.hut" wordt een nette
// naam: "Strandbad Nuenen".
function naamUitHandle(regel) {
  const schoon = regel.replace(/^@/, "").trim();
  if (!/^[a-z0-9._]+$/i.test(schoon) || schoon.length < 3) return null;
  if (!/[._]/.test(schoon) && schoon === schoon.toLowerCase() && schoon.length < 5) return null;
  return schoon
    .split(/[._]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Zoekt een bekende provincie of land in de tekst.
function locatieUitTekst(regels, alles) {
  const laag = alles.toLowerCase();

  // Een regel die eruitziet als een locatie-tag ("Nuenen, Noord-Brabant").
  // Alleen bovenaan gezocht: daar staat de tag, verderop is het een zin.
  const tag = regels
    .slice(0, 6)
    .find((r) => /^[A-ZÀ-Ý][\w' -]{2,30},\s*[A-ZÀ-Ý][\w' -]{2,30}$/.test(r.trim()));
  if (tag) return tag.trim();

  const provincie = PROVINCIES.find((p) => bevat(laag, p));
  if (provincie) return provincie.charAt(0).toUpperCase() + provincie.slice(1);

  const land = LANDEN.find((l) => bevat(laag, l));
  if (land) return land.charAt(0).toUpperCase() + land.slice(1);

  return "";
}

function categorieUitTekst(laag, toegestaan) {
  for (const [categorie, woorden] of CATEGORIE_WOORDEN) {
    if (!toegestaan || toegestaan.includes(categorie)) {
      if (woorden.some((w) => bevat(laag, w))) return categorie;
    }
  }
  return "";
}

function periodeUitTekst(laag) {
  const maanden = [...laag.matchAll(MAAND_WOORDEN)].map((m) => m[1].toLowerCase());
  if (maanden.length >= 2) return `${maanden[0]}-${maanden[1]}`;
  if (maanden.length === 1) return maanden[0];
  for (const [seizoen, woorden] of SEIZOEN_WOORDEN) {
    if (woorden.some((w) => bevat(laag, w))) return seizoen;
  }
  return "";
}

// Zet herkende tekst om in ingevulde velden. Geeft alleen terug wat gevonden is;
// de rest laat het formulier ongemoeid.
export function veldenUitTekst(tekst, toegestaneCategorieen) {
  const regels = String(tekst || "")
    .split("\n")
    .map((r) => r.replace(/\s+/g, " ").trim())
    .filter((r) => r.length > 1 && !isRuis(r));

  const alles = regels.join("\n");
  const laag = alles.toLowerCase();

  // De naam: eerst een gebruikersnaam bovenaan, anders de eerste zinnige regel.
  let naam = "";
  for (const regel of regels.slice(0, 4)) {
    const uitHandle = naamUitHandle(regel);
    if (uitHandle) {
      naam = uitHandle;
      break;
    }
  }
  if (!naam) {
    const kandidaat = regels.find((r) => r.length >= 3 && r.length <= 60);
    if (kandidaat) naam = kandidaat.replace(/[.,!?]+$/, "");
  }

  return {
    naam,
    locatie: locatieUitTekst(regels, alles),
    categorie: categorieUitTekst(laag, toegestaneCategorieen),
    periode: periodeUitTekst(laag),
    tekst: alles,
  };
}
