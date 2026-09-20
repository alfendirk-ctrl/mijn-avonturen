// Notities zijn vrije tekst en dat blijven ze. Maar in de praktijk zit er al
// structuur in: één lopend verhaal met hier en daar een geschreeuwde aanhef
// ("LET OP DE KOSTEN NAAST DE ENTREE: ...") voor het ene ding dat je moet
// weten voor je in de auto stapt. Die structuur lezen we eruit in plaats van
// hem op te slaan - zelfde regel als bij de maanden, de afstand en de
// kaartcoördinaten: de vrije tekst is de waarheid, er valt niets te migreren
// als deze lezer beter wordt, en een notitie die de gebruiker zelf typt
// profiteert er net zo goed van.
//
// Zonder dit stond er in het detailvenster één blok van negenhonderd tekens
// waar de waarschuwing middenin verstopt zat.

// Korte woorden die in hoofdletters horen en dus niet "ontschreeuwd" mogen
// worden. Let op wat hier NIET in staat: "DE" hoort er niet bij, ook al is het
// de landcode van Duitsland - in het Nederlands is het het lidwoord, en
// "Let op DE kosten" is precies het soort halfvertaalde kop die dit moest
// oplossen. Twijfelgevallen laten we liever aan de regel hieronder over.
const AFKORTINGEN = new Set([
  "EUR", "VR", "TV", "BBQ", "KM", "3D", "4D", "F1", "OV", "WC", "WC'S", "WIFI",
]);

// Hoeveel zinnen er hoogstens in één alinea komen. Meer en het wordt weer een
// muur; minder en elke zin staat los, wat net zo onleesbaar is.
const ZINNEN_PER_ALINEA = 3;

// Splitsen op zinseinde, maar alleen als er een hoofdletter of cijfer op
// volgt. Anders knipt "EUR 1,50 p.p. op woensdag" middenin de afkorting.
const ZINSEINDE = /(?<=[.!?])\s+(?=[A-ZÀ-Þ0-9])/;

// Een geschreeuwde aanhef aan het begin van een zin, plus het leesteken dat
// erachter staat. Dat leesteken houden we vast: de kop is geen losse titel
// maar het begin van de zin zelf, en ": ", ", " of " " maakt het verschil
// tussen "Toegang gaat op lengte, niet op leeftijd" en een kop met een losse
// flard eronder.
// De punt zit in het woordpatroon zodat "P.P." één woord is. Zonder dat brak
// "AAN DE KASSA BETAAL JE EUR 1 P.P." middenin de afkorting af en bleef er een
// kop over die eindigde op "EUR 1 p" met ".P." als losse staart erachter.
const WOORDDEEL = "[A-ZÀ-Þ0-9][A-ZÀ-Þ0-9'’.-]*";
const AANHEF = new RegExp(`^(${WOORDDEEL}(?:\\s+${WOORDDEEL})+)(\\s*[:;,]?\\s*)`);

// Dezelfde reeks, maar overal in een zin. Nodig voor de enkeling die in zijn
// geheel geschreeuwd is ("JAARLIJKS ZOMEREVENEMENT, GEEN VASTE ATTRACTIE"):
// de aanhef stopt bij de komma en de rest bleef anders staan schreeuwen.
const REEKS = new RegExp(`\\b${WOORDDEEL}(?:\\s+${WOORDDEEL})+`, "g");

// Uit hoeveel echte woorden moet die aanhef bestaan? Twee. Eén is te weinig:
// "maar GRATIS met Museumkaart" is nadruk midden in een zin, geen kop, en met
// één woord zou bijna elke zin er een krijgen. Cijfers tellen niet mee, anders
// wordt "EUR 7 p.p. extra ..." aan het begin van een zin ook een kop.
// De afsluitende punt mag mee ("MAANDAG DICHT." telt als twee woorden), een
// punt middenin niet - dan is het een afkorting als "P.P." en geen woord.
const WOORD = /^[A-ZÀ-Þ][A-ZÀ-Þ'’-]+\.?$/;

// "EDENYA" mag geen "edenya" worden. Meestal staat diezelfde naam verderop in
// de notitie gewoon als "Edenya"; die schrijfwijze nemen we dan over. Zo hoeft
// er geen lijst van eigennamen bijgehouden te worden.
function schrijfwijzeElders(woord, heleTekst) {
  const patroon = new RegExp(
    `\\b${woord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
    "gi",
  );
  const telling = new Map();
  for (const gevonden of heleTekst.match(patroon) || []) {
    if (gevonden === woord) continue;
    telling.set(gevonden, (telling.get(gevonden) ?? 0) + 1);
  }
  if (!telling.size) {
    // Niets gevonden. Laatste kans: een samenstelling waarvan alleen het
    // eerste deel elders staat. "SPEULDERBOS" komt in zijn geheel nergens
    // anders voor, maar "Speulder-" wel - en dat is genoeg om te weten dat
    // het een eigennaam is. Zonder dit werd het "speulderbos".
    const klein = woord.toLowerCase();
    for (const [, gevonden] of heleTekst.matchAll(/\b(\p{Lu}\p{Ll}{3,})/gu)) {
      if (klein.startsWith(gevonden.toLowerCase())) {
        return woord.charAt(0) + woord.slice(1).toLowerCase();
      }
    }
    return null;
  }
  // De vaakst voorkomende schrijfwijze wint, en bij gelijkspel de kleine
  // letter. Anders werd "PAS OP MET DE PRIJS" een "Pas op met De prijs": het
  // lidwoord "de" staat ook ergens aan het begin van een zin als "De", en de
  // eerste treffer was toevallig die.
  return [...telling].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  )[0][0];
}

function ontschreeuw(aanhef, heleTekst) {
  const woorden = aanhef.split(/\s+/).map((w) => {
    if (AFKORTINGEN.has(w)) return w;
    if (/\d/.test(w)) return w;
    return schrijfwijzeElders(w, heleTekst) || w.toLowerCase();
  });
  return woorden.join(" ");
}

function hoofdletter(tekst) {
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

// Zachter zetten wat midden in een zin nog staat te schreeuwen. Alleen reeksen
// van twee of meer woorden: losse woorden ("maar GRATIS met Museumkaart",
// "zitten NIET bij de entree in") zijn nadruk die de schrijver bedoelde, en
// die laten we staan.
function zachtjes(tekst, heleTekst) {
  return tekst.replace(REEKS, (reeks) => {
    const woorden = reeks.split(/\s+/).filter((w) => WOORD.test(w));
    return woorden.length >= 2 ? ontschreeuw(reeks, heleTekst) : reeks;
  });
}

/**
 * Leest een notitie als een rij blokken.
 *
 * - `{ soort: "alinea", tekst }` — gewoon lopende tekst
 * - `{ soort: "letop", kop, scheiding, tekst }` — een zin met een geschreeuwde
 *   aanhef. De drie delen samen vormen weer precies die zin; alleen de aanhef
 *   wordt niet meer geschreeuwd maar vet.
 *
 * De zinnen ná een waarschuwing beginnen weer een gewone alinea. Ze bij de
 * waarschuwing trekken zou vaker fout dan goed gaan: soms hoort de volgende
 * zin erbij ("Ga er dus niet heen zonder..."), soms is het een heel nieuw
 * onderwerp. Direct eronder lezen ze allebei goed.
 */
export function leesNotitie(tekst) {
  const schoon = (tekst || "").trim();
  if (!schoon) return [];

  const blokken = [];
  for (const zin of schoon.split(ZINSEINDE)) {
    const treffer = AANHEF.exec(zin);
    const woorden = treffer ? treffer[1].split(/\s+/).filter((w) => WOORD.test(w)) : [];
    if (treffer && woorden.length >= 2) {
      blokken.push({
        soort: "letop",
        kop: hoofdletter(ontschreeuw(treffer[1], schoon)),
        scheiding: treffer[2],
        tekst: zachtjes(zin.slice(treffer[0].length), schoon),
      });
      continue;
    }
    const vorige = blokken[blokken.length - 1];
    if (vorige && vorige.soort === "alinea" && vorige.aantal < ZINNEN_PER_ALINEA) {
      vorige.tekst += " " + zachtjes(zin, schoon);
      vorige.aantal += 1;
    } else {
      blokken.push({ soort: "alinea", tekst: zachtjes(zin, schoon), aantal: 1 });
    }
  }
  return blokken;
}

/**
 * De eerste alinea, voor op een kaart in de lijst. Daar is geen ruimte voor
 * het hele verhaal - de hele notitie stond er ongeknipt onder, wat een kaart
 * van een halve schermhoogte opleverde.
 */
export function eersteAlinea(tekst) {
  const blokken = leesNotitie(tekst);
  if (!blokken.length) return "";
  const eerste = blokken.find((b) => b.soort === "alinea") || blokken[0];
  return eerste.soort === "alinea"
    ? eerste.tekst
    : eerste.kop + eerste.scheiding + eerste.tekst;
}
