import { coordinatenVoor } from "./kaart.js";

// Hoe ver en hoe lang rijden is het naar een avontuur?
//
// Dit is de enige plek in de app die iets aan een dienst buiten de deur
// vraagt - de rest is bewust zelfvoorzienend. Dat verdient uitleg, want het
// gaat in tegen twee regels die verder overal gelden.
//
// 1. "Afgeleid, niet opgeslagen." Een echte rijafstand kun je niet uitrekenen
//    uit wat er al staat; daar hoort een wegennet bij. Wat we wél doen is het
//    resultaat behandelen als een cache en niet als gegevens: het hangt aan
//    coördinaten, niet aan een avontuur, het gaat niet mee in de synchronisatie
//    en je kunt het weggooien zonder dat er iets kwijtraakt.
// 2. "Werkt offline." Zonder verbinding blijft staan wat al berekend is, en
//    verschijnt er voor de rest gewoon niets. Er gaat nooit iets kapot; er is
//    alleen minder te zien.
//
// Het thuisadres blijft op dit toestel. Het staat in localStorage, gaat NIET
// mee in de synchronisatie met de ander, en verlaat het apparaat alleen op het
// moment dat je het instelt - dan wordt het één keer opgezocht om er
// coördinaten bij te vinden. Daarna nooit meer. De app zegt dat ook in het
// instellingenpaneel; een adres stilletjes doorgeven is niet iets om als
// implementatiedetail te behandelen.

export const THUIS_SLEUTEL = "av_thuis";
export const ROUTES_SLEUTEL = "av_routes";

// Eén verzoek per lichting, niet één per bestemming: OSRM kan in één keer de
// afstand van één vertrekpunt naar veel aankomstpunten geven. Vijfendertig
// plaatsen worden zo één aanroep. De demo-server houdt een maximum aan, dus we
// knippen ruim daaronder.
const PER_LICHTING = 80;

const ROUTEDIENST = "https://router.project-osrm.org/table/v1/driving/";
const ZOEKDIENST = "https://nominatim.openstreetmap.org/search";

// Als de routedienst wel tijden maar geen afstanden teruggeeft (dat hangt af
// van hoe de server gebouwd is), rekenen we de kilometers uit de hemelsbrede
// afstand met een omwegfactor. Dat is een schatting en wordt ook zo getoond.
const OMWEG = 1.32;

export function hemelsbreed([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function puntSleutel(punt) {
  return punt.map((n) => n.toFixed(4)).join(",");
}

// De cache hangt aan het vertrekpunt én het aankomstpunt. Verhuis je, dan
// horen er andere afstanden bij en vervalt alles vanzelf - geen opruimactie
// die vergeten kan worden.
export function routeSleutel(thuis, punt) {
  return `${puntSleutel([thuis.lat, thuis.lon])}>${puntSleutel(punt)}`;
}

export function leesRoutes() {
  try {
    return JSON.parse(localStorage.getItem(ROUTES_SLEUTEL) || "{}");
  } catch {
    return {};
  }
}

export function bewaarRoutes(routes) {
  try {
    localStorage.setItem(ROUTES_SLEUTEL, JSON.stringify(routes));
  } catch {
    // Vol of geweigerd: dan rekenen we het de volgende keer opnieuw uit. Een
    // cache die niet wegschrijft is traag, niet stuk.
  }
}

export function wisRoutes() {
  try {
    localStorage.removeItem(ROUTES_SLEUTEL);
  } catch {
    // Zie hierboven: een cache die niet wil opruimen is geen fout.
  }
}

/**
 * Zoekt coördinaten bij een vrij ingetypt adres.
 *
 * Eerst de eigen plaatsenlijst: staat er een plaats of provincie in die de app
 * toch al kent, dan hoeft er niets de deur uit. Pas als dat niets oplevert
 * gaat het adres één keer naar de zoekdienst.
 */
export async function zoekAdres(adres) {
  const tekst = String(adres || "").trim();
  if (!tekst) return null;

  const eigen = coordinatenVoor(tekst);
  if (eigen) {
    return { adres: tekst, lat: eigen[0], lon: eigen[1], bron: "eigen" };
  }

  const url = `${ZOEKDIENST}?format=jsonv2&limit=1&q=${encodeURIComponent(tekst)}`;
  const antwoord = await fetch(url, { headers: { Accept: "application/json" } });
  if (!antwoord.ok) throw new Error(`zoekdienst gaf ${antwoord.status}`);
  const treffers = await antwoord.json();
  if (!Array.isArray(treffers) || !treffers.length) return null;
  return {
    adres: tekst,
    lat: Number(treffers[0].lat),
    lon: Number(treffers[0].lon),
    omschrijving: treffers[0].display_name,
    bron: "zoekdienst",
  };
}

/**
 * Vraagt rijafstand en rijtijd op van één vertrekpunt naar veel bestemmingen.
 * Geeft een object terug met per puntsleutel `{ km, min, geschat }`.
 */
export async function haalRijtijden(thuis, punten) {
  const uit = {};
  for (let i = 0; i < punten.length; i += PER_LICHTING) {
    const lichting = punten.slice(i, i + PER_LICHTING);
    const coords = [
      `${thuis.lon},${thuis.lat}`,
      ...lichting.map(([lat, lon]) => `${lon},${lat}`),
    ].join(";");
    const url = `${ROUTEDIENST}${coords}?sources=0&annotations=duration,distance`;
    const antwoord = await fetch(url);
    if (!antwoord.ok) throw new Error(`routedienst gaf ${antwoord.status}`);
    const data = await antwoord.json();
    if (data.code !== "Ok" || !data.durations?.[0]) {
      throw new Error(`routedienst gaf ${data.code || "onbruikbaar antwoord"}`);
    }
    const duren = data.durations[0];
    const meters = data.distances?.[0];
    lichting.forEach((punt, n) => {
      const seconden = duren[n + 1];
      if (seconden == null) return; // onbereikbaar over de weg, bv. een eiland
      const geschat = meters?.[n + 1] == null;
      uit[puntSleutel(punt)] = {
        km: Math.round(
          geschat
            ? hemelsbreed([thuis.lat, thuis.lon], punt) * OMWEG
            : meters[n + 1] / 1000,
        ),
        min: Math.round(seconden / 60),
        geschat,
      };
    });
  }
  return uit;
}

/** "32 km · 28 min", of "180 km · 1 u 55" als het lang duurt. */
export function beschrijfRit(rit) {
  if (!rit) return "";
  const tijd =
    rit.min < 90
      ? `${rit.min} min`
      : `${Math.floor(rit.min / 60)} u ${String(rit.min % 60).padStart(2, "0")}`;
  return `${rit.km} km · ${tijd}`;
}
