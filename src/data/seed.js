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
  "🏝️", "🗺️", "⛷️", "🤿", "🛶", "🦅", "🌄", "🏜️", "🍽️", "🧭",
];

// Lege sjablonen voor de formulieren.
export const EMPTY_ACTIVITY = { naam: "", locatie: "", categorie: "Water", type: "", link: "", notities: "", gedaan: false, favoriet: false, periode: "", tags: [], waardering: 0, foto: false };
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
// Een waardering is 0 (niet beoordeeld) of 1 t/m 5. Alles daarbuiten - een
// komma, een tekst, iets negatiefs, 7 - wordt 0 en niet geraden. Eigen
// normaliseerfunctie, net als schoonTags, zodat opgeslagen, getypte en
// gesynchroniseerde waarderingen dezelfde vorm hebben.
export const MAX_STERREN = 5;

export function schoonWaardering(ruw) {
  const n = Math.round(Number(ruw));
  return Number.isFinite(n) && n >= 1 && n <= MAX_STERREN ? n : 0;
}

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
        // 0 = nog geen oordeel. Alleen zinvol als `gedaan` aan staat, maar we
        // gooien hem niet weg als dat uit staat: vink je per ongeluk uit en
        // weer aan, dan is je oordeel er nog.
        waardering: schoonWaardering(a.waardering),
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
// Vondsten van september 2026, uit gedeelde Instagram-posts en daarna
// nagezocht. Apart benoemd omdat lib/migratie.js ze eenmalig toevoegt aan een
// telefoon die de standaardlijst allang niet meer leest.
export const EXTRA_SEPT_2026 = [
  {id: 61, naam: "Kinderboerderij De Heuvel", locatie: "Culemborg, Gelderland", categorie: "Dieren", type: "Kinderboerderij & speeltuin", link: "https://www.deheuvelculemborg.nl/", notities: "Gratis entree. Varkens, koeien, schapen, geiten, kippen en ezels. Speeltuin in twee delen: een deel voor de kleintjes en een speelweide voor grotere kinderen. Ook een natuur- en milieucentrum op het terrein. Di t/m zo, meestal 10-17 uur (weekend vanaf 12 uur). Bij aanhoudende hitte rond de 30 graden dicht, dan hebben de dieren rust nodig. Weithusen 63.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "dieren", "speeltuin", "gratis"]},
  {id: 62, naam: "Bapsang BBQ", locatie: "Utrecht", categorie: "Eten & drinken", type: "Koreaanse BBQ, all you can eat", link: "https://bapsangbbq.nl/", notities: "All you can eat en drink: je grilt zelf aan tafel, drankjes en nagerechten zitten bij de prijs in. Ook sushi en Koreaanse bijgerechten op het buffet. Halal. Ma t/m do EUR 40, 95 / vr t/m zo EUR 42, 95. Open vanaf 16:30 tot 22:30, reserveren aan te raden. Proostwetering 80L, aan de rand van de stad (De Wetering-Noord), dus met de auto makkelijker dan met de trein. Recensies zijn verdeeld over hoe Koreaans het echt is; het is vooral een all-you-can-eat-concept.", gedaan: false, favoriet: false, periode: "", tags: ["all you can eat", "halal", "avond", "binnen"]},
  {id: 63, naam: "Restaurant 7 Continenten", locatie: "Ede, Gelderland", categorie: "Eten & drinken", type: "Wereldrestaurant met indoor speelruimte", link: "https://7continenten.nl/", notities: "Onbeperkt eten, drinken en spelen; wereldkeuken uit zeven continenten in het oude V&D-pand. Je boekt een tijdslot: 2 uur EUR 42, 95, 2, 5 uur EUR 45, 95 (frisdrank, bier en wijn inbegrepen). Kinderen 3 t/m 13 jaar betalen EUR 4 per levensjaar, t/m 2 jaar gratis. Eigen indoor speelruimte met poffertjes, popcorn, chocoladefontein en patat; kinderen alleen onder toezicht. Reserveren mag online en levert korting op bij betalen met iDeal. Achterdoelen 25, centrum van Ede.", gedaan: false, favoriet: false, periode: "", tags: ["all you can eat", "kids", "regendag", "binnen"]},
  {id: 64, naam: "Recreatieoord Binnenmaas", locatie: "Mijnsheerenland, Zuid-Holland", categorie: "Water", type: "Buitenzwembad, speeltuin & kinderboerderij", link: "https://www.bresaccommodaties.nl/recreatieoord-binnenmaas", notities: "Groot recreatieoord aan het water in de Hoeksche Waard. Zwembad met 25-meterbad, duikplanken, vier glijbanen, kleuterbad en waterspeelpark. Grote buitenspeeltuin plus een overdekte speeltuin (die is sinds dit jaar ook buiten het seizoen open). Kinderboerderij, en bijna vier kilometer wandelpad rond het meer. LET OP DE KOSTEN NAAST DE ENTREE: de jeepsafari, bootjes, botsbootjes en mini-F1 gaan op MUNTJES en zitten NIET bij de entree in, en parkeren kost ongeveer EUR 6-9 per dag. Entree zelf ergens tussen EUR 6 en EUR 10, 50 p.p. vanaf 1 jaar, afhankelijk van het seizoen; bronnen spreken elkaar tegen, dus check vooraf. Seizoen loopt eind maart t/m eind oktober, het buitenzwembad gaat eind april open. Een seizoensabonnement kost rond de EUR 95 (EUR 80 in de voorverkoop), wat bij meer dan een paar bezoeken snel uit kan.", gedaan: false, favoriet: false, periode: "mei-aug", tags: ["kids", "zwemmen", "speeltuin", "dieren", "hele dag"]},
  {id: 65, naam: "PAND Pannenkoek", locatie: "Schalkwijk, Utrecht", categorie: "Eten & drinken", type: "Pannenkoekenrestaurant met speeltuin", link: "https://www.pandpannenkoek.nl/", notities: "Familierestaurant op het Eiland van Schalkwijk. Naast pannenkoeken ook burgers, spareribs, salades en soepen. Binnen staat een echte caravan en een auto om in te spelen; buiten ligt een grote speeltuin, dus bij mooi weer is het hier het leukst. Afsluiten doe je met een muntje voor de ijsjeskraam (Italiaans ijs, en er zit rare smaken bij zoals zure matten). Wo t/m zo 11:30-20:30, ma en di dicht. Reserveren kan online tot 6 personen, daarboven op aanvraag. Provincialeweg 1. Let op: de Instagram-post waar dit vandaan komt was een betaalde samenwerking (AD).", gedaan: false, favoriet: false, periode: "", tags: ["kids", "speeltuin", "uit eten", "lunch"]},
  {id: 66, naam: "Euro Space Center", locatie: "Transinne, Belgie", categorie: "Cultuur", type: "Ruimtevaartcentrum", link: "https://www.eurospacecenter.be/nl/infos-tarifs", notities: "Astronautentraining voor een dag in de Ardennen. Raketsimulator, ervaren hoe gewichtloosheid voelt, een echte ruimtecapsule en raket van dichtbij, VR-ervaringen en proefjes. Reken op een uur of zes; laatste toegang 16:00. LET OP DE OPENINGSDAGEN: alleen weekends, feestdagen en BELGISCHE schoolvakanties - die vallen niet gelijk met de Nederlandse, dus check de kalender voor je rijdt. Dicht op 24, 25 en 31 december en 1 januari. Entree ongeveer EUR 36 volwassenen, EUR 32 kinderen, 60-plussers EUR 34; kinderen onder 1, 10 m gratis maar die mogen niet in alle simulators. Vanaf een jaar of zes is het pas echt leuk. Vooraf reserveren scheelt EUR 2 per ticket. Devant les Hetres 1.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "binnen", "hele dag", "regendag"]},
  {id: 67, naam: "BatensteinBuiten", locatie: "Woerden, Utrecht", categorie: "Water", type: "Gratis spraypark & speeltuin", link: "https://www.woerdensport.nl/batensteinbuiten", notities: "Gratis speel- en waterterrein bij zwembad Batenstein, en parkeren is ook gratis. Spraypark met VERWARMD water (28 graden), grote airtrampoline van 12 bij 6 meter, kabelbaan, klimtoestellen, zandbak, schommels, tafeltennis en een levensgroot schaakspel. Midgetgolf (12 holes) kost wel geld, ergens tussen EUR 4 en EUR 6 p.p. - bronnen noemen verschillende bedragen. Open van april t/m oktober, dagelijks 9-18 uur, maar bij slecht weer of vroege duisternis dicht. Buiten dat seizoen kun je er nog wel op het terrein, maar dan staat het SPRAYPARK UIT en is het luchtkussen afgesloten - dan blijft er weinig over van de reden om te gaan.", gedaan: false, favoriet: false, periode: "apr-okt", tags: ["gratis", "kids", "zwemmen", "speeltuin", "buiten"]},
];

// Vondsten van 19 september 2026, uit gedeelde Instagram-posts en daarna
// nagezocht. Eigen bundel met een eigen markering, want lib/migratie.js voegt
// elke bundel precies een keer toe; hergebruik van de vorige markering zou
// betekenen dat deze drie nooit op een bestaande telefoon aankomen.
export const EXTRA_SEPT_2026_B = [
  {id: 68, naam: "SharkTown", locatie: "Utrecht", categorie: "Speelpark", type: "Indoor speelhal, onderwaterthema", link: "https://www.sharktown.nl/", notities: "Indoorspeelhal met onderwaterthema, geopend op 15 augustus 2026. Ballenbak, glijbanen, trampolines, tunnels en een hindernisbaan; bedoeld voor kinderen van ongeveer 1 tot 12 jaar, met horeca voor de ouders. Volgens de post komen er elke week karakters langs (prinsessen en bekende helden) en is het eten halal. Prijzen uit die post: 0-1 jaar gratis, 2-3 jaar EUR 5,95, 4-12 jaar EUR 9,95, volwassenen gratis - dat waren de openingsprijzen, dus check ze voor je gaat. SOKKEN ZIJN VERPLICHT; vergeet je ze, dan kosten ze EUR 2,50 aan de kassa. Dagelijks 10-18 uur, maandag dicht. Binnenlopen kan gewoon, reserveren hoeft alleen voor groepen en feestjes. Australielaan 24, aan de rand van Utrecht (Kanaleneiland), ongeveer 960 m2. Het is nieuw, dus in vakanties kan het druk zijn.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "binnen", "regendag", "halal"]},
  {id: 70, naam: "De Pannenkoekenjungle", locatie: "Apeldoorn, Gelderland", categorie: "Eten & drinken", type: "Pannenkoekenrestaurant met speeltuin", link: "https://depannenkoekenjungle.nl/", notities: "Pannenkoekenrestaurant met jungledecor: planten, dieren en tropische aankleding, een kleine binnenspeeltuin en een grotere buitenspeeltuin. Het paradepaardje is de POFFERTJES EXPERIENCE: je bakt zelf aan tafel en kiest vijf toppings (mango, aardbei, blauwe bessen, Nutella, vruchtenhagel en meer). Die experience is voor 4 personen, maar met vijf lukt ook prima als je wat extra's bijbestelt. Verder pannenkoeken, lunchgerechten, burgers (ook vega), nagerechten en met de hand geperste jus. Voor de kinderen is er een speurtocht door het restaurant met een presentje aan het eind, en kleurplaten. Brinklaan 145. Openingstijden staan niet betrouwbaar online, dus check de site. Let op: de post waar dit vandaan komt was een uitnodiging van het restaurant (AD).", gedaan: false, favoriet: false, periode: "", tags: ["kids", "speeltuin", "uit eten", "lunch"]},
];

// Vondsten van 19 september 2026, tweede ronde. Zelfde patroon: eigen bundel,
// eigen markering.
export const EXTRA_SEPT_2026_C = [
  {id: 72, naam: "Pairi Daiza", locatie: "Brugelette, Belgie", categorie: "Dieren", type: "Dierenpark met tropische serre", link: "https://www.pairidaiza.eu/nl/", notities: "Groot dierenpark in Henegouwen, vaak uitgeroepen tot mooiste dierentuin van Europa. De post gaat over EDENYA, de nieuwe tropische serre die op 7 februari 2026 openging: vier hectare onder een glazen koepel van twintig meter hoog, met tropische regen, watervallen, capibaras, maki's, luiaards, jaguars, dwergnijlpaarden, reuzenotters en zelfs haaien - bijna 230 soorten. Er zit ook een onderwaterrestaurant in. PAS OP MET DE PRIJS: Edenya zit NIET bij de gewone entree in. Je betaalt EUR 7 p.p. extra bovenop je dagticket (leden EUR 5), en je moet er APART voor reserveren; vol is vol. Een dag Pairi Daiza mét Edenya komt in 2026 op maximaal ongeveer EUR 59 per persoon, waarbij de gewone entree voor 12 t/m 64 jaar tussen EUR 43 en EUR 52 ligt afhankelijk van dag en seizoen. Die toeslag leverde publieke kritiek op toen hij werd aangekondigd. Reken op een hele dag; het park is enorm. Let op: de post was een samenwerking met het park.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "dieren", "hele dag", "buiten"]},
  {id: 73, naam: "Maritiem Museum", locatie: "Rotterdam, Zuid-Holland", categorie: "Cultuur", type: "Museum met buitenspeelterras", link: "https://maritiemmuseum.nl/", notities: "Museum over de haven en de zee, met de kinderexpositie Plons! De toekomst van de zee. Sinds 18 juli 2026 hoort daar een BUITENSPEELTERRAS OP HET DAK bij: klimmen, klauteren en sjouwen tussen speelelementen met een zeethema. Je vaart met een bootkarretje, zoekt je weg door het wierenwoud en helpt mee op de zeeboerderij - die sluit aan op wat er binnen in de expositie te leren valt. Bedoeld voor kinderen van ongeveer 3 tot 8 jaar. Een volwassenkaartje kost vanaf EUR 18, maar GRATIS met Museumkaart, Rotterdampas of jeugdvakantiepaspoort, en kinderen t/m 3 jaar zijn sowieso gratis. Leuvehaven 1, in het Maritiem District vlak bij de Erasmusbrug. Het terras ligt buiten, dus bij regen blijft alleen het binnenmuseum over. Let op: de post waar dit vandaan komt was op uitnodiging.", gedaan: false, favoriet: false, periode: "apr-okt", tags: ["kids", "binnen", "buiten", "museumkaart"]},
  {id: 74, naam: "Speelpark De Splinter", locatie: "Eindhoven, Noord-Brabant", categorie: "Speelpark", type: "Grote speeltuin met kinderboerderij", link: "https://www.speelparkdesplinter.nl/", notities: "Verborgen pareltje in het Henri Dunantpark in Woensel-Noord, zo groot als zeven voetbalvelden. Speeltoestellen voor verschillende leeftijden, een piratenschip en speelfort, een bouwhoek, kinderboerderij, voetbalveld, picknicktafels, wc's en een winkeltje voor een ijsje of drinken (het aanbod hangt af van welke vrijwilligers er zijn). ENTREE IS BIJNA NIETS: van 1 april tot 1 november betaal je EUR 1,50 p.p. op woensdag, zaterdag en zondag, en in de schoolvakanties elke dag; buiten die periode is het gratis, en van 1 november tot eind december is het ma t/m za gratis met zondag dicht. In herfst en winter gaat het dicht zodra het donker wordt. LET OP HET ZWEMBAD: de post noemt een zwembadje en spraypark, maar dat bad is dit seizoen NIET opengegaan vanwege herstelwerk en ligt er al langer uit - er is zelfs ophef over geweest omdat het nieuw is. Ga er dus niet heen voor het water zonder eerst de site of hun socials te checken. Rode Kruislaan 2.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "speeltuin", "dieren", "gratis", "buiten"]},
];

// Aanvullingen op avonturen die er AL staan, maar als kale regel: een naam en
// verder niets. "Adventure Valley" stond er met locatie "Europa", zonder link
// en zonder notities - dat is precies de vondst die alsnog kwijtraakt, want de
// naam alleen vertelt je niet dat het in Durbuy ligt en wat het kost.
//
// Deze vullen ALLEEN velden die leeg zijn. Wat jij zelf hebt ingevuld blijft
// staan, net zoals de tekstherkenning dat doet: de aanvulling raadt, jij weet.
// Voor `locatie` geldt een kleine uitzondering: een waarde die de kaart zelf al
// te vaag vindt om een speld op te zetten (zie TE_VAAG in lib/kaart.js) telt
// hier als leeg, want daar heb je niets aan.
export const VERRIJKINGEN_SEPT_2026 = [
  {
    id: 25,
    velden: {
      locatie: "Durbuy, Belgie",
      link: "https://www.adventure-valley.be/nl/tickets",
      type: "Outdoor avonturenpark",
      periode: "apr-okt",
      notities: "Avonturenpark in de Ardennen met vijf zones en meer dan twintig attracties: klimnetten, glijbanen en parcours voor de kleintjes, en deathrides en een sky ladder voor wie het hoog en eng wil. De nieuwe zone heet Wild Wood: een boomparcours met bruggen, netten, touwparcours en uitzichtpunten. TOEGANG GAAT OP LENGTE, niet op leeftijd: vanaf 1,10 m betaal je het volwassenentarief, tussen 85 cm en 1,10 m het kindertarief, onder 85 cm gratis. Er geldt ook een maximum van 120 kg. VOORAF RESERVEREN IS VERPLICHT en de toegang hangt af van beschikbaarheid, dus niet zomaar langsgaan. Losse dagtickets gaan richting de EUR 33; via kortingssites zag ik lagere tarieven, en er lopen regelmatig acties zoals kom-met-3-betaal-voor-2. Reken op een hele dag. Let op: de Instagram-post waar dit vandaan komt was een advertentie.",
    },
  },
];

// Vijfde ronde. Een uitkijktoren in het bos bij Putten, gevonden als
// herfsttip; dus met een periode, want daar is het startscherm voor.
export const EXTRA_SEPT_2026_E = [
  {id: 80, naam: "Bostoren Schovenhorst", locatie: "Putten, Gelderland", categorie: "Hike", type: "Uitkijktoren met boswandeling", link: "https://schovenhorst.nl/bostoren/", notities: "Uitkijktoren van veertig meter op Landgoed Schovenhorst, met 235 treden naar boven. Onderweg kom je langs een klein theater, een wand met nestkasten en een vrijhangend klimnet voor wie durft. Vanaf de top kijk je over de boomtoppen uit, en in oktober en november kleurt dat hele bos oranje - dat is waar de tip om begonnen is. DE TOREN STAAT NIET IN HET SPEULDERBOS, zoals de post suggereert, maar op Landgoed Schovenhorst. Het Speulder- en Sprielderbos ligt ernaast en is van Staatsbosbeheer, dus een wandeling eraan vastknopen kan prima - het is alleen niet hetzelfde terrein. DE TOREN IS OOK NIET GRATIS: EUR 4 p.p., vanaf tien personen EUR 3 als je online koopt. Het landgoed zelf is wel vrij toegankelijk van zonsopgang tot zonsondergang. Dagelijks open van 9:00 tot 17:15 (een andere bron zegt 17:30, dus ga niet op het laatste kwartier af). Betalen kan contactloos bij de draaideur; kaartjes zijn er ook bij Brasserie Schovenhorst, Museum de Tien Malen en de VVV in Putten. Parkeren aan de Garderenseweg bij de kruising met de Nieuwe Prinsenweg, vanaf daar is het nog ongeveer 500 meter lopen.", gedaan: false, favoriet: false, periode: "okt-nov", tags: ["herfst", "uitzicht", "bos", "wandelen", "kids"]},
];

// Zesde ronde. GLOW is een jaarlijks festival van een week, geen vaste
// attractie - net als "Jij Bouwt de Toekomst". Het verschil: die editie was
// al voorbij toen hij erbij kwam, deze moet nog komen.
export const EXTRA_SEPT_2026_F = [
  {id: 81, naam: "GLOW", locatie: "Eindhoven, Noord-Brabant", categorie: "Cultuur", type: "Lichtkunstfestival, een week in november", link: "https://gloweindhoven.nl/", notities: "Lichtkunstfestival door de binnenstad: grote en kleine lichtprojecties op gevels, pleinen en in het groen, verbonden door een wandelroute van ongeveer vijf kilometer. De route begint bij het station, maar je kunt overal instappen. De editie van 2026 is de 21e, loopt van 7 t/m 14 november en heeft als thema Connect. JAARLIJKS FESTIVAL VAN EEN WEEK, GEEN VASTE ATTRACTIE: buiten die week valt er niets te zien, dus dit is er een om in november te pakken. ALLES IS GRATIS en speelt zich af in de openbare ruimte. Eindhoven zelf is open van 18:30 tot 23:00; de routes in Helmond, Best, Oirschot, Veldhoven en Lieshout tot 22:00. KOM MET DE TREIN als het even kan: vanaf 18:30 gaan er straten in het centrum dicht, en het station ligt gewoon op de route. Moet je toch met de auto, neem dan P+R Meerhoven of P+R Genneper Parken (EUR 4 per dag, dag en nacht open) in plaats van een garage in het centrum. In het weekend is het druk; doordeweeks loopt het een stuk rustiger. Ook prima met kinderen - het is buiten, je loopt in je eigen tempo en er is van alles te zien onderweg.", gedaan: false, favoriet: false, periode: "nov", tags: ["gratis", "avond", "kids", "buiten", "wandelen"]},
];

// Tweede ronde aanvullingen. Eigen lijst en straks een eigen markering: de
// vorige is op een bestaande telefoon al afgevinkt, dus hergebruiken zou
// betekenen dat deze daar nooit aankomt. Zelfde regel als bij de bundels.
export const VERRIJKINGEN_SEPT_2026_B = [
  {
    // Stond er al sinds het begin, maar kaal: alleen een naam, een plaats en
    // "Kamperen". Terwijl dit nou juist het soort plek is waarvan je een half
    // jaar later niet meer weet waarom je hem had opgeschreven.
    id: 35,
    velden: {
      link: "https://www.netl.nl/campingkallumaan",
      periode: "apr-sept",
      tags: ["kamperen", "natuur", "water", "kids", "huisdiervrij"],
      notities:
        "Camping bij Netl de Wildste Tuin, een natuurpark van zo'n negentig voetbalvelden in de Noordoostpolder. Op het terrein liggen het grootste bamboebos van de Benelux, zwemmeren, het Vuurtorenstrand en een grote natuurspeeltuin met modderglijbaan, kabelbaan en klimtoestellen; in het hoogseizoen is er op het strand live muziek. Slapen kan op een van de 233 plaatsen (144 afgebakend) of in een lodge, een huurtent voor twee tot zes personen of een omgebouwde zeecontainer. HUISDIEREN MOGEN NIET MEE - dat stond niet in de post zelf maar in de reacties eronder, en de camping bevestigt het. Wie de hond niet kan wegbrengen hoeft niet verder te kijken. DE DAGENTREE VAN HET PARK ZIT BIJ JE OVERNACHTING IN; los kost die vanaf 1 april EUR 7,50 p.p. OVER HET SEIZOEN SPREKEN DE BRONNEN ELKAAR TEGEN: de een zegt Goede Vrijdag t/m september plus een aantal weekenden tussen november en maart, de ander april t/m oktober. Check dus voor je boekt. Leemringweg 19, Kraggenburg. Er is een Open Camping Dag op zaterdag 28 maart 2026 als je eerst wilt rondkijken.",
    },
  },
];

// Derde ronde aanvullingen: de kale regels die een ECHTE, BESTAANDE PLEK zijn.
// Van de 79 avonturen hadden 54 niets dan een naam, een plaats en een
// categorie. Een deel daarvan is een werkwoord ("Bowlen", "Picknicken") en daar
// valt niets op te zoeken; deze elf zijn plekken met een adres, een website en
// openingstijden, en dus het soort regel waarvan je een half jaar later niet
// meer weet waarom je hem had opgeschreven.
//
// Wat hier WEL en NIET in gaat, is een keuze die het navragen waard was. Een
// prijs is een momentopname: over een jaar klopt hij niet meer, maar in een
// notitie ziet hij er nog even gezaghebbend uit. Daarom staat er per plek
// vooral wat lang meegaat - de officiele link, het seizoensgat, de valkuil - en
// een prijs alleen als ik hem bij de bron zelf zag staan, met het jaartal
// erbij. Waar bronnen elkaar tegenspraken staat dat er gewoon bij; dat is
// nuttiger dan een getal dat zeker lijkt.
// De notitie bij Rulantica in twee versies. Versie 1 staat al op een telefoon
// die de ronde hierboven verwerkt heeft, en bevatte een zin die naar het
// periodeveld verwees - dat veld is inmiddels gecorrigeerd, dus die zin klopt
// niet meer. Versie 2 is tijdloos.
//
// Versie 1 wordt AFGELEID van versie 2 in plaats van overgetypt: twee losse
// kopieen van duizend tekens lopen vroeg of laat uiteen, en dan herkent de
// correctie de oude tekst niet meer en gebeurt er stilletjes niets. Er is een
// controle die nagaat dat de twee echt verschillen, want als de vervanging
// niets vindt zijn ze gelijk en is de correctie zinloos geworden.
const RULANTICA_ZIN_V2 =
  "Er staat daarom geen seizoen bij dit avontuur: het past het hele jaar.";
const RULANTICA_ZIN_V1 =
  "De regel hierboven staat nog op zomer; dat kun je in het detailvenster zelf aanpassen, want een aanvulling overschrijft nooit iets dat al ingevuld is.";

export const RULANTICA_NOTITIE =
  "Groot waterpark bij Europa-Park in Rust, Duitsland, met een Scandinavisch thema. Het is grotendeels overdekt en volgens Europa-Park zelf het hele jaar open, dagelijks van 09:30 tot 22:00 - die openingstijd tot tien uur 's avonds maakt het ook een avondbestemming. DIT IS GEEN ZOMERBESTEMMING MAAR EEN WINTERBESTEMMING: binnen is het altijd warm, en juist in de koude maanden heb je er het meest aan. " +
  RULANTICA_ZIN_V2 +
  " Er is wel een buitengedeelte met een groot buitenbad, en de strandarrangementen daar zijn alleen van mei tot september te boeken. Het binnenbad Svommepol is het hele jaar open. Het park is los van Europa-Park te bezoeken, dus je hoeft geen pretparkdag te plannen om er te komen; reken op een rit van ongeveer vijf uur.";

export const RULANTICA_NOTITIE_V1 = RULANTICA_NOTITIE.replace(
  RULANTICA_ZIN_V2,
  RULANTICA_ZIN_V1,
);

export const VERRIJKINGEN_SEPT_2026_C = [
  {
    id: 13,
    velden: {
      link: "https://www.naturalis.nl/museum/praktische-informatie",
      notities:
        "Natuurhistorisch museum in Leiden, met de dinozaal als publiekstrekker: daar staat Trix, een echte Tyrannosaurus rex. Verder zalen over de ijstijd, de aarde, het leven en de dood, en een verdieping waar je zelf aan de slag gaat. Een flinke halve dag, en volledig binnen, dus dit is een regendagbestemming die niet van het seizoen afhangt. Dagelijks open van 10:00 tot 17:00. De entree was in 2026 EUR 18 vanaf vier jaar en gratis tot en met drie jaar; met een Museumkaart kom je gratis binnen en met een CJP- of studentenkaart betaal je EUR 13,50. LET OP DE PARKEERKOSTEN: de P+R bij het museum rekende EUR 1,20 per half uur, oftewel EUR 25 voor een dag - met de trein ben je van Leiden Centraal in een kwartier ter plaatse. Er zijn een paar vaste sluitingsdagen door het jaar, waaronder Koningsdag, eerste kerstdag en twee schoonmaakdagen in de zomer, dus kijk de kalender na voor een losse dag. Online kopen is geen verplichting maar wel een garantie: dan weet je zeker dat je erin komt.",
    },
  },
  {
    id: 21,
    velden: {
      link: "https://www.staatsbosbeheer.nl/boomkroonpad",
      tags: ["bos", "kids", "wandelen", "uitzicht", "natuur"],
      notities:
        "Buitencentrum van Staatsbosbeheer bij Drouwen op de Hondsrug, met een loopbrug van honderden meters die je door de boomkronen voert - je loopt op zo'n twintig meter hoogte tussen de toppen door. Onderweg hoort een worteltunnel waar je ondergronds door de wortels kruipt; dat is een apart onderdeel en wordt soms ook los aangeboden. IN DE WINTER IS HET MAAR DRIE DAGEN PER WEEK OPEN: van 1 november tot en met 31 maart alleen op vrijdag, zaterdag en zondag van 10:00 tot 16:00, plus de schoolvakanties. Van 1 april tot en met 31 oktober is het dagelijks open van 10:00 tot 17:00. Dat staat zo in de eigen brochure van Staatsbosbeheer voor 2026, dus een winterse zondag kan prima - een winterse woensdag niet. Over de entree lopen de bronnen uiteen, rond de EUR 4,50 voor een volwassene, maar dat kon ik niet op de officiele pagina bevestigen; bellen kan via 0592-377305.",
    },
  },
  {
    id: 6,
    velden: {
      link: "https://www.henschotermeer.nl/",
      tags: ["zwemmen", "strand", "kids", "water"],
      notities:
        "Zandmeer op de Utrechtse Heuvelrug tussen Woudenberg en Maarn, met brede zandstranden, flauw aflopend water en bos eromheen. Het terrein is van zonsopgang tot zonsondergang toegankelijk. IN HET ZOMERSEIZOEN BETAAL JE TOEGANG, buiten dat seizoen niet: meerdere bronnen noemen 1 april tot en met 30 september als de betaalde periode. Reken daarbuiten dus op een gratis bos- en waterwandeling en in de zomer op een kaartje. VOORAF ONLINE REGELEN IS HET VERSCHIL TUSSEN WEL EN NIET NAAR BINNEN: zowel de toegangskaarten als de parkeerkaarten gaan volgens meerdere bronnen uitsluitend online, met een QR-code per mail die bij beide poorten werkt. Parkeren is apart betaald en er zijn drie parkeerterreinen rond het meer; fietsen stallen is gratis. Honden zijn er volgens een deel van de bronnen niet welkom - dat spreekt elkaar tegen, dus kijk op de borden. De actuele tarieven heb ik niet kunnen bevestigen; hun eigen site hield mij buiten de deur.",
    },
  },
  {
    id: 5,
    velden: {
      link: "https://bresaccommodaties.nl/recreatieoord-binnenmaas",
      notities:
        "Recreatieoord aan het water in de Hoeksche Waard, Vrouwehuisjesweg 1 in Mijnsheerenland. Er zit meer dan alleen zwemmen: een buitenzwembad met ligweide, een overzichtelijke speeltuin, een binnenspeeltuin, een waterspraypark, een kinderboerderij met boerderijdieren, elektrische bootjes en een jeepsafari. De overzichtelijke speeltuin is het woord dat hun eigen site gebruikt, en dat is met kleine kinderen precies wat je wil. HET SEIZOEN BEPAALT WAT ER OPEN IS, en dat is hier geen detail: het buitenzwembad en het waterspraypark lopen op het openingsseizoen, terwijl de binnenspeeltuin in november alleen op woensdag, vrijdag en in het weekend open is. Kijk dus per onderdeel en niet per park. Tarieven en openingstijden staan achter aparte links op hun site en wisselen per maand, dus die zijn hier niet overgenomen; de kinderboerderij was volgens een derde bron gratis.",
    },
  },
  {
    id: 17,
    velden: {
      link: "https://monkeytown.eu/nl/wamel",
      notities:
        "Overdekte speeltuin van de Monkey Town-keten in Wamel, aan de Waal tussen Tiel en Nijmegen: klimtoestellen, glijbanen, een apenkooi en een aparte hoek voor de kleinsten. Volledig binnen, dus een vaste regendagbestemming die niet van het seizoen afhangt. Maandag tot en met zaterdag open van 09:00 tot 18:00, zondag van 10:00 tot 18:00, met afwijkende tijden op feestdagen zoals nieuwjaarsdag, tweede paasdag en kerstavond. BEGELEIDERS GAAN GRATIS NAAR BINNEN: ouders en grootouders betalen volgens Monkey Town zelf geen entree, dus je rekent alleen voor de kinderen. Het peutertarief was EUR 5,95 voor kinderen van een tot en met drie jaar, maar alleen op maandag tot en met vrijdag als je voor 11:30 binnen bent, en niet in schoolvakanties of op feestdagen - dat is dus echt een vroege-ochtendkorting. Het gewone tarief staat niet op de vestigingspagina en wisselt per vestiging, dus kijk dat na voor je gaat.",
    },
  },
  {
    id: 18,
    velden: {
      link: "https://www.play-in.nl/",
      notities:
        "Binnenhal vol activiteiten in Utrecht, Hertogswetering 173, in winkelcentrum The Wall langs de A2. Het is geen enkele attractie maar een verzameling: Kids Paradise voor de kleinere kinderen vanaf ongeveer een jaar, een trampolinepark, klimwanden en een indoor minigolfbaan die in het donker oplicht. Alles binnen, dus ook dit is er een voor een regendag. JUMPSOKKEN ZIJN VERPLICHT voor het trampolinedeel; die koop je op locatie of meteen bij het online reserveren, en ze gaan niet in de prijs van je kaartje mee. De minigolf is vanaf zeven jaar en tot twaalf jaar onder begeleiding. VOORAF RESERVEREN WORDT STERK AANGERADEN en voor het springen was het volgens de ticketverkoop zelfs verplicht, omdat er met tijdslots per uur wordt gewerkt. Prijzen verschillen per onderdeel en ik kreeg hun eigen site niet te pakken, dus die staan hier niet: reken erop dat elk onderdeel apart betaald wordt.",
    },
  },
  {
    id: 20,
    velden: {
      notities:
        "Trampolinepark: een hal vol aan elkaar gekoppelde trampolines, met daarnaast meestal een schuimrubberbak, een dodgeballveld en een basketring om op af te vliegen. Vanaf ongeveer zes jaar is het leuk; voor kleinere kinderen is er op sommige locaties een apart uurtje. CONTROLEER EERST OF DE VESTIGING DIE JE WIL NOG BESTAAT: deze keten is de afgelopen jaren flink verschoven. Eindhoven ging verder onder de naam You Jump, Amsterdam is gesloten en Gouda heet nu ook You Jump, terwijl de regel hierboven nog vier plaatsen noemt. Bel of kijk online voor je rijdt, en zoek eventueel op You Jump of Jump XL in plaats van op deze naam. JUMPSOKKEN ZIJN VERPLICHT en kosten rond de EUR 2 per paar, dus dat komt bovenop het kaartje - je eigen sokken mogen niet. Er wordt met runs van een uur gewerkt die elk half uur starten, dus reserveren voorkomt wachten. Een officiele link staat hier niet: ik kon in deze sessie geen pagina bevestigen die nog bij de juiste vestiging hoort.",
    },
  },
  {
    id: 26,
    velden: {
      link: "https://www.efteling.com/nl/park/openingstijden",
      notities:
        "Het grote sprookjespark in Kaatsheuvel, en volgens hun eigen kalender alle seizoenen geopend: Winter Efteling, Kerst, Oud en Nieuw, Lente, Zomer en Herfst hebben elk hun eigen programma. Dat maakt dit een van de weinige grote parken waar november geen dood seizoen is. In de Winter Efteling blijft een deel van het park tot 20:00 open, met vuurkorven, schaatsen en het Sprookjesbos in het donker - veel mensen vinden dat de mooiste tijd om te gaan. DE OPENINGSTIJDEN VERSCHILLEN PER DAG en staan alleen in de kalender op hun site, niet als vast rooster; kijk dus de datum na die je in gedachten hebt in plaats van een algemene tijd aan te nemen. Reken op een hele dag en op drukte in vakanties. Kaartjes zijn datumgebonden en online vooraf doorgaans goedkoper dan aan de poort, en parkeren wordt apart gerekend.",
    },
  },
  {
    id: 27,
    velden: {
      periode: "apr-jan",
      link: "https://www.phantasialand.de/nl/openingstijden/",
      notities:
        "Attractiepark in Bruhl, net onder Keulen, op ongeveer twee uur rijden van het zuiden van het land. Bekend om zijn achtbanen - Taron, Black Mamba, F.L.Y. - en om de zorgvuldig uitgewerkte themagebieden, die veel bezoekers mooier vinden dan die van de grote Nederlandse parken. HET PARK SLUIT EIND JANUARI EN GAAT PAS IN HET VOORJAAR WEER OPEN: hun eigen openingstijdenpagina loopt doorlopend tot en met 24 januari, en daarna is er een winterstop. Februari en maart zijn dus geen optie, en dat is de reden dat hier nu een periode bij staat. In de weken rond de kerst loopt Wintertraum, met een deel van het park in winterjas en andere tijden, meestal van 11:00 tot 20:00. Kerstavond, eerste kerstdag en nieuwjaarsdag zijn gesloten, en er vallen in januari nog een paar losse sluitingsdagen. Buiten die winterperiode is het park dagelijks vanaf 09:00 open, waarbij de attracties zelf om 10:00 beginnen - dat eerste uur is dus voor binnenkomen en doorlopen.",
    },
  },
  {
    id: 28,
    velden: {
      link: "https://www.europapark.de/en/rulantica",
      notities: RULANTICA_NOTITIE,
    },
  },
  {
    id: 30,
    velden: {
      link: "https://www.kerststadvalkenburg.nl/",
      tags: ["winter", "kerst", "stedentrip", "wandelen"],
      notities:
        "Weekendje Zuid-Limburg, en de reden dat hier winter staat is Kerststad Valkenburg: van 13 november 2026 tot en met 3 januari 2027 verandert het stadje in een kerstbestemming. DE KERSTMARKTEN ZITTEN ONDER DE GROND, in de Gemeentegrot en de Fluweelengrot, en dat is wat dit onderscheidt van elke andere kerstmarkt - je loopt door mergelgangen op elf graden in plaats van over een plein in de regen. Die grotmarkten lopen volgens meerdere bronnen van 13 november tot en met 30 december en sluiten dus eerder dan de stad zelf; op eerste kerstdag zijn de grotten dicht. De tijden waren maandag tot en met vrijdag 11:00 tot 19:00 en in het weekend 10:00 tot 19:00. KOOP KAARTJES VOORAF EN KIES EEN TIJDSLOT: in het weekend lopen de slots vol, en ze duren maar een half uur. Buiten die periode is Valkenburg alsnog een goede basis: kasteelruine, de Cauberg, het heuvelland eromheen en thermen in de buurt.",
    },
  },
];

// Zevende vondstenronde, november 2026. Twintig avonturen binnen ongeveer
// veertig kilometer van Tiel.
//
// Aanleiding was een meting die eerst een verkeerde conclusie opleverde: ik
// rekende de afstanden vanaf Eindhoven, omdat Strandbad Nuenen, De Splinter en
// GLOW daar liggen, en concludeerde dat de lijst scheef stond. Vanaf Tiel
// klopt de spreiding juist prima. Wat er wél ontbrak was per CATEGORIE: een
// museum, drie dieren en twee natuur, terwijl "binnen" en "regendag" samen de
// meest gebruikte tags zijn. Deze ronde zet daar zes musea, twee dierentuinen
// en vijf natuurgebieden tegenover, plus vier streekgebonden dingen waar de
// lijst niets van had.
//
// De vier seizoensgebonden regels zijn de enige met een periode. De rest staat
// bewust leeg, ook waar iets een winterstop heeft: `maandenUitPeriode` kan één
// aaneengesloten venster aan, en het Openluchtmuseum heeft er twee met een gat
// ertussen. Dat hoort dan in de notitie en niet in een veld dat het niet kan
// uitdrukken.
export const EXTRA_NOV_2026_G = [
  {id: 82, naam: "Ouwehands Dierenpark", locatie: "Rhenen, Utrecht", categorie: "Dieren", type: "Dierentuin", link: "https://www.ouwehand.nl/", notities: "Dierentuin op de Grebbeberg, en met ongeveer twaalf kilometer het dichtstbijzijnde grote uitje dat je hebt. Bekend van de ijsberen en de gorilla's, en van het Berenbos: een bosgebied waar beren leven die uit slechte omstandigheden zijn gehaald. Door de dag heen zijn er dierenpraatjes bij onder andere de ijsbeer en de gorilla. HET PARK IS ELKE DAG VAN HET JAAR OPEN, maar dat is geen garantie: bij sneeuwval kan het alsnog dichtgaan, en dat stond er op de dag dat ik keek ook. Kijk dus even op de site voor je in de auto stapt. JE KIEST VOORAF EEN TIJDSLOT en online koop je volgens het park zelf het scherpste tarief, dus ter plekke bij de kassa betaal je meer. Parkeren gaat via aparte parkeertickets en zit niet bij de entree in. Een algemene prijs stond niet op de pagina die ik las.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "dieren", "hele dag", "buiten", "dichtbij"]},
  {id: 83, naam: "Burgers' Zoo", locatie: "Arnhem, Gelderland", categorie: "Dieren", type: "Dierentuin", link: "https://www.burgerszoo.nl/", notities: "Dierentuin in Arnhem die werkt met ecodisplays: in plaats van hokken loop je door nagebouwde leefgebieden. Er zijn er zeven - Bush (tropisch regenwoud), Desert, Ocean (een groot koraalrif), Mangrove, Safari, Rimba en het Park zelf. Dat maakt het een ander soort bezoek dan een gewone dierentuin, en ook een flink stuk lopen. HET GROOTSTE DEEL IS OVERDEKT, wat dit tot een van de weinige dierentuinen maakt die op een regendag werkt - Bush, Desert, Ocean en Mangrove zitten allemaal binnen. Het hele jaar open, met een zomerseizoen tot eind oktober van 9 tot 18 uur en een winterseizoen van 9 tot 17 uur. PARKEREN KOST APART GELD, rond de negen tot tien euro, en de entree lag in 2026 rond de EUR 31 volgens een ticketverkoper - allebei niet bevestigd op hun eigen site, dus kijk na.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "dieren", "binnen", "regendag", "hele dag"]},
  {id: 84, naam: "Nederlands Openluchtmuseum", locatie: "Arnhem, Gelderland", categorie: "Cultuur", type: "Openluchtmuseum", link: "https://www.openluchtmuseum.nl/", notities: "Een heel dorp aan verplaatste historische gebouwen op een park van 44 hectare: boerderijen, molens, een kruidenierswinkel en een rijdende historische tram die je er rondbrengt. Overal staan mensen in kostuum die het vak laten zien, van bakken tot klompen maken. Met kinderen is het eerder een dag buiten dan een museumbezoek. LET OP HET SEIZOEN, want dit is geen museum dat het hele jaar open is. Er is een zomerseizoen van eind maart tot eind oktober en daarnaast een apart winterprogramma van begin december tot halverwege januari, met daartussen en daarna wekenlang niets. In november en in februari sta je dus voor een dicht hek. Omdat het om twee losse periodes gaat met een gat ertussen staat er hier geen seizoen bij; dat veld kan maar één aaneengesloten periode aan. MET EEN MUSEUMKAART IS DE ENTREE GRATIS, maar parkeren kost EUR 8,50 en dat zit er niet bij in.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "cultuur", "buiten", "hele dag", "museumkaart"]},
  {id: 85, naam: "Kroller-Muller Museum", locatie: "Otterlo, Gelderland", categorie: "Cultuur", type: "Museum met beeldentuin", link: "https://krollermuller.nl/", notities: "Museum midden in Nationaal Park De Hoge Veluwe, met de op een na grootste Van Gogh-verzameling ter wereld. Daarachter ligt een van de grootste beeldentuinen van Europa: ongeveer tweehonderd beelden verspreid over 25 hectare bos en open plekken, van onder anderen Barbara Hepworth en Jean Dubuffet. Die tuin is met kinderen het sterkste deel, want je loopt gewoon buiten rond. JE BETAALT TWEE KEER: het museum en het park zijn aparte stichtingen, dus naast je museumkaartje betaal je ook parkentree. Reken daarop, want het is een veelgemaakte misrekening. Dinsdag tot en met zondag open van 10 tot 17 uur, en op feestdagen ook; op 1 januari dicht. Je komt er vanaf de parkingangen met een van de tweeduizend gratis witte fietsen, wat voor kinderen al de helft van de lol is.", gedaan: false, favoriet: false, periode: "", tags: ["cultuur", "kunst", "buiten", "bos", "hele dag"]},
  {id: 86, naam: "Museum Het Valkhof", locatie: "Nijmegen, Gelderland", categorie: "Cultuur", type: "Museum over de Romeinen", link: "https://www.museum.nl/nl/valkhof-museum", notities: "Nijmegen was de grootste Romeinse stad van Nederland, en dit museum gaat daarover: het leven aan de grens van het rijk en het Romeinse leger. De collectie staat onder het thema 'de mens op de grens', wat op de ligging van de stad aan de oude rijksgrens slaat. Het museum is na een verbouwing weer open in het eigen gebouw. KINDEREN GAAN ER GRATIS NAAR BINNEN - de ene bron zegt tot en met twaalf jaar, de nieuwere tot en met zeventien, en dat laatste heb ik niet op hun eigen site kunnen bevestigen. Volwassenen betaalden EUR 10 en met een museumkaart is het gratis, maar ook dat komt van derden. VOOR VOLWASSENEN MOET JE WEL VOORAF EEN TICKET RESERVEREN, ook als je gratis naar binnen zou gaan. Dinsdag tot en met zondag van 11 tot 17 uur; oudere pagina's noemen een tijdelijk adres aan het Keizer Karelplein en zijn achterhaald.", gedaan: false, favoriet: false, periode: "", tags: ["cultuur", "geschiedenis", "binnen", "regendag", "museumkaart"]},
  {id: 87, naam: "Spoorwegmuseum", locatie: "Utrecht", categorie: "Cultuur", type: "Museum over treinen", link: "https://www.spoorwegmuseum.nl/bezoek/bezoekersinformatie/", notities: "Museum in het oude station Maliebaan in Utrecht, en een van de weinige musea waar de toeschouwer het grootste deel van de tijd in iets zit of op iets klimt in plaats van ernaar te kijken. Historische locomotieven en rijtuigen, en een paar attracties waar je echt doorheen rijdt. Dit is het museum om achter de hand te hebben als het regent. Dinsdag tot en met zondag van 10 tot 17 uur; MAANDAG IS HET DICHT, behalve in de schoolvakanties en op een aantal feestdagen. De entree was EUR 19,50 per persoon en kinderen tot en met drie jaar gaan gratis naar binnen. MET EEN MUSEUMKAART KOM JE GRATIS BINNEN, MAAR JE MOET ALSNOG EEN STARTTIJD RESERVEREN - dat is verplicht, ook met een geldig kaartje op zak, dus zomaar langsgaan werkt hier niet.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "binnen", "regendag", "cultuur", "museumkaart"]},
  {id: 88, naam: "Flipje en Streekmuseum", locatie: "Tiel, Gelderland", categorie: "Cultuur", type: "Streekmuseum", link: "https://www.museum.nl/nl/flipje-en-streekmuseum-tiel", notities: "Het museum van je eigen stad, op Plein 48 in het centrum, en daarmee het enige avontuur in deze lijst waar je naartoe kunt lopen. Het gaat over Flipje, het frambozenmannetje dat de mascotte van de jamfabriek De Betuwe was, en breder over voedsel en voedselproductie in het rivierengebied - met veel jam. Er is een speurtocht voor kinderen en alle verdiepingen zijn met een lift bereikbaar. LET OP DE OPENINGSTIJDEN, want die zijn krap: volgens een gids is het van 1 mei tot en met 31 oktober open op dinsdag tot en met vrijdag van 13 tot 17 uur, dus doordeweeks en alleen in de middag. Die opgave komt van derden en kan verouderd zijn; bel even (0344-614416) als je er speciaal voor gaat. Entree rond de EUR 5 voor volwassenen en EUR 2 voor kinderen tot twaalf, ook onbevestigd.", gedaan: false, favoriet: false, periode: "", tags: ["cultuur", "kids", "binnen", "regendag", "dichtbij"]},
  {id: 89, naam: "GeoFort", locatie: "Herwijnen, Gelderland", categorie: "Cultuur", type: "Forteiland over klimaat en techniek", link: "https://www.geofort.nl/", notities: "Een fort van de Nieuwe Hollandse Waterlinie op een eiland, omgebouwd tot wat ze zelf het Toekomstmuseum noemen: alles draait er om klimaat, energie en water. Binnen en buiten door elkaar, met doe-dingen in plaats van vitrines, en een vleermuizentunnel in het oude fort. Je zit er op ongeveer vijfentwintig kilometer. HET IS ALLEEN IN HET WEEKEND OPEN, zaterdag en zondag van 10 tot 17 uur - dat is de belangrijkste beperking en je leest er makkelijk overheen. Er vallen ook losse zaterdagen uit, dus kijk de agenda na. DE VLEERMUIS EXPERIENCE LOOPT ALLEEN VAN APRIL TOT EN MET OKTOBER. Per activiteit gelden verschillende minimumleeftijden, van drie jaar voor het verspringen tot acht jaar voor andere onderdelen. Tickets zijn online met korting te koop; een prijs stond er niet bij.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "cultuur", "techniek", "buiten", "fort"]},
  {id: 90, naam: "Waterliniemuseum Fort bij Vechten", locatie: "Bunnik, Utrecht", categorie: "Cultuur", type: "Museum over de waterlinie", link: "https://waterliniemuseum.nl/", notities: "Museum op een fort van de Nieuwe Hollandse Waterlinie, die sinds kort werelderfgoed is: het verhaal van een verdediging die niet op muren maar op onderwaterzetten draaide. Voor kinderen is er een grote maquette in de binnentuin en een interactieve tafel waarop ze zelf forten kunnen plaatsen en het land onder water kunnen zetten. Het fortterrein zelf is een flink park om in rond te lopen. Dinsdag tot en met zondag van 10 tot 17 uur, en in de schoolvakanties ook op maandag. LET OP IN DE WINTER: van 1 november tot en met 1 maart is het ook op dinsdag gesloten, met 22 en 29 december als uitzondering. Tickets vanaf EUR 12,50, af te rekenen aan de kassa, en reserveren hoeft niet. Of de museumkaart geldt kon ik niet hard krijgen - het logo staat er wel, maar er staat niet bij wat het betekent.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "cultuur", "geschiedenis", "fort", "buiten"]},
  {id: 91, naam: "Slot Loevestein", locatie: "Poederoijen, Gelderland", categorie: "Cultuur", type: "Kasteel", link: "https://www.slotloevestein.nl/", notities: "Middeleeuws slot op de punt waar de Maas en de Waal samenkomen, tussen Gorinchem, Woudrichem en Zaltbommel. Bekend van Hugo de Groot, die er in 1621 in een boekenkist uit ontsnapte - en dat verhaal is precies het soort dat met kinderen blijft hangen. Eromheen ligt het natuurgebied Munnikenland, dus je kunt het bezoek aan een wandeling vastknopen. Dagelijks open van 10 tot 17 uur, dicht op 25 en 31 december en 1 januari. ER IS EEN WINTERPROGRAMMA: Sintfestijn van 15 november tot 4 december 2026, de kerstvakantie van 19 december tot 3 januari en Warme Winteravonden op 28, 29 en 30 december. Dat maakt dit een van de weinige dingen in deze lijst die juist in december de moeite zijn. Over de prijs lopen de bronnen uiteen, van EUR 12,50 tot EUR 18 voor een volwassene; een rondleiding kost EUR 5 extra en geeft zelf geen toegang.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "cultuur", "geschiedenis", "kasteel", "wandelen"]},
  {id: 92, naam: "Nationaal Park De Hoge Veluwe", locatie: "Otterlo, Gelderland", categorie: "Natuur", type: "Nationaal park", link: "https://www.hogeveluwe.nl/", notities: "Vijfenvijftig vierkante kilometer bos, heide en stuifzand, 365 dagen per jaar open. Het bekendste eraan zijn de tweeduizend gratis witte fietsen: je pakt er een bij een van de ingangen, bij het Marchantplein of bij het museum, en zet hem weer neer waar je klaar bent. Reserveren hoeft niet. Met kinderen is dat het hele uitje al. Er lopen edelherten, moeflons en wilde zwijnen rond, het best te zien rond zonsopgang en zonsondergang. DIT PARK IS NIET GRATIS EN DAT IS BEWUST: het is een particuliere stichting zonder subsidie, dus de entree betaalt het onderhoud. Reken op ongeveer EUR 14 per volwassene en EUR 7 per kind, met de auto meenemen apart erbovenop - een gezin van vier zit zo boven de vijftig euro. DE VELUWEZOOM HIERNAAST IS WEL GRATIS, dus als het je om bos te doen is en niet om de witte fietsen, is dat de goedkopere keuze.", gedaan: false, favoriet: false, periode: "", tags: ["natuur", "fietsen", "bos", "kids", "hele dag"]},
  {id: 93, naam: "Nationaal Park Veluwezoom", locatie: "Rheden, Gelderland", categorie: "Natuur", type: "Nationaal park", link: "https://www.natuurmonumenten.nl/natuurgebieden/nationaal-park-veluwezoom", notities: "Het oudste nationale park van Nederland, van Natuurmonumenten, met de Posbank als bekendste punt: glooiende heide die in augustus paars kleurt, met uitzicht over de IJsselvallei. Toegang is gratis. Het bezoekerscentrum aan de Heuvenseweg 5a in Rheden heeft binnen een speelhoek met een zwijnenkuil en buiten een speeltuin, en is dinsdag tot en met zondag van 10 tot 17 uur open - maandag dicht. Er liggen zestien wandelroutes, waaronder een korte van 2 km langs de schaapskooi en een kinderwagenvriendelijke van 3,5 km naar uitkijkpunt Herikhuizen. HET PARKEREN IS HIER HET STRUIKELBLOK: de doorgaande weg over de Posbank is sinds 2024 deels dicht voor auto's, een aantal kleine parkeerplaatsen is opgeheven en Natuurmonumenten vraagt bezoekers met de fiets of het openbaar vervoer te komen. In juli en augustus zitten de resterende plaatsen snel vol. Kijk vooraf op posbank-parkeren.nl.", gedaan: false, favoriet: false, periode: "", tags: ["natuur", "heide", "wandelen", "uitzicht", "gratis"]},
  {id: 94, naam: "De Blauwe Kamer", locatie: "Rhenen, Utrecht", categorie: "Natuur", type: "Uiterwaarden met wilde grazers", link: "", notities: "Uiterwaardengebied aan de Rijn aan de voet van de Grebbeberg, op een kilometer of twaalf. Er lopen konikpaarden en Galloway-runderen vrij rond, die zich vaak aan de waterkant verzamelen - dat is wat dit gebied anders maakt dan een bos: je ziet er grote dieren zonder hek ertussen. Het landschap verandert sterk met de waterstand, dus het is er in elk seizoen anders. Gratis toegankelijk. DE DIEREN LOPEN LOS EN ZIJN GEEN KNUFFELDIEREN: koniks en Galloways zijn aan mensen gewend maar blijven grote dieren, dus houd afstand, zeker met jonge dieren erbij, en houd honden aangelijnd of laat ze thuis. Er varen in het seizoen rondvaarten vanaf Wageningen en Renkum naar het gebied, meestal met een wandeling van drie kwartier erbij. Een eigen website heb ik niet gevonden; kijk bij Het Utrechts Landschap.", gedaan: false, favoriet: false, periode: "", tags: ["natuur", "dieren", "wandelen", "water", "gratis"]},
  {id: 95, naam: "Park Lingezegen", locatie: "Elst, Gelderland", categorie: "Natuur", type: "Landschapspark", link: "https://www.parklingezegen.nl/", notities: "Landschapspark tussen Arnhem en Nijmegen, op zo'n vijfentwintig kilometer, opgedeeld in deelgebieden waarvan De Park bij Elst de interessantste is met kinderen. Daar ligt Landerij De Park (De Park 12, Elst) met een kinderboerderij waar de meeste dieren geaaid mogen worden, een natuurspeelplaats, klim- en ontdekhoeken en een waterspeelplaats met een waterrad van drieënhalve meter dat kinderen met een handpomp zelf kunnen laten draaien. Er is ook een speelbos en een doolhof. Toegang is gratis. Wandelen kan met het Ommetje De Park van 3,5 km dat bij de Landerij begint; in deelgebied Waterrijk ligt de Familieroute, en bij Lent de Appelroute van 4 km. LET OP MET EEN KINDERWAGEN: het Ommetje gaat deels over onverharde en bij nat weer modderige paden, en van de Appelroute staat er met zoveel woorden bij dat hij niet geschikt is voor de allerkleinsten en kinderwagens.", gedaan: false, favoriet: false, periode: "", tags: ["gratis", "kids", "natuur", "speeltuin", "dieren"]},
  {id: 96, naam: "Loonse en Drunense Duinen", locatie: "Udenhout, Noord-Brabant", categorie: "Natuur", type: "Nationaal park met stuifzand", link: "", notities: "Een van de grootste stuifzandgebieden van West-Europa, bijgenaamd de Brabantse Sahara: open zandvlaktes met bos eromheen, op een kilometer of vijfendertig. Voor kinderen is het eigenlijk een enorme zandbak - van de duinen afrollen, rennen, graven. Er lopen reeën en konijnen, en in de bosranden zitten boompieper, tjiftjaf en vink. De kindvriendelijke route is de Kapucijnenberg bij Udenhout, bijna vier kilometer, door Natuurmonumenten zelf als kinderroute aangemerkt. Parkeren kan bij Parkeerplaats Bosch en Duin in Udenhout of bij restaurant De Rustende Jager. Het bezoekerscentrum staat in Oisterwijk, aan de Van Tienhovenlaan 5. DE ROUTES OVER HET STUIFZAND ZIJN NIET GESCHIKT VOOR EEN KINDERWAGEN - met zand en een buggy kom je niet ver, dus neem een draagzak of loop de Kapucijnenberg heen en terug over hetzelfde pad, dan is het twee kilometer.", gedaan: false, favoriet: false, periode: "", tags: ["natuur", "zand", "kids", "wandelen", "bos"]},
  {id: 97, naam: "Betuwse bloesem", locatie: "Geldermalsen, Gelderland", categorie: "Natuur", type: "Bloeiende boomgaarden, fiets- en wandeltochten", link: "", notities: "Twee weken per jaar staat de streek waar je woont vol bloesem, en dat is het enige seizoensgebonden ding in deze lijst dat letterlijk om de hoek gebeurt. Globaal van half april tot half mei, maar het schuift per boomsoort: peren en kersen bloeien eind maart tot begin april, appels pas tegen eind april. WARM WEER OF EEN STORM KAN HET SEIZOEN IN EEN PAAR DAGEN BEEINDIGEN, dus dit is er een om kort van tevoren te beslissen en niet om maanden vooruit te plannen; op bloesem.info staat de actuele stand. De bekende Bloesemtocht fietst ongeveer 46 km vanaf station Geldermalsen en volgt grotendeels de Linge; er is ook een langere Betuwse Bloesem-route van 70 km. De Betuwse Bloesemtocht is de wandelversie, met afstanden van 9, 15, 27 of 40 km vanaf Fruitmasters in Geldermalsen. DE ROUTES STARTEN IN GELDERMALSEN EN NIET IN TIEL, dus vanuit Tiel rijd of fiets je daar eerst heen.", gedaan: false, favoriet: false, periode: "apr-mei", tags: ["lente", "fietsen", "wandelen", "natuur", "dichtbij"]},
  {id: 98, naam: "Kersen plukken Streeckerij De Betuwe", locatie: "Wadenoijen, Gelderland", categorie: "Natuur", type: "Zelfplukboomgaard", link: "", notities: "Fruitbelevingspark met een zelfplukboomgaard aan de Overlaat 5 in Wadenoijen, vlak bij Tiel - vier hectare kersen alleen al. Je loopt tussen de rijen en plukt wat er op dat moment rijp is: kersen, maar door het seizoen heen ook aardbeien, pruimen en appels. Met kinderen is dat een beter soort uitje dan het klinkt, want ze mogen zelf iets doen en nemen het resultaat mee naar huis. In juli zijn er de Open Kersendagen in de boomgaard; in 2022 viel dat op 2, 3 en 4 juli, maar een datum voor dit jaar heb ik niet gevonden, dus kijk na. HET SEIZOEN IS KORT EN WEERAFHANKELIJK: vrijwel alle kersenrassen zijn plukrijp in juni en juli, maar welk ras wanneer verschilt sterk, dus bel of kijk online voor je rijdt. Er zijn in de buurt meer zelfplukadressen, onder andere Fruitbedrijf De Hoenderik in Tricht en kersenteler Hakkert in Buurmalsen.", gedaan: false, favoriet: false, periode: "juni-juli", tags: ["zomer", "kids", "buiten", "eten", "dichtbij"]},
  {id: 99, naam: "Fruitfestival Tiel", locatie: "Tiel, Gelderland", categorie: "Cultuur", type: "Jaarlijks oogstfeest met praalwagens", link: "https://fruitfestival.nl/", notities: "Het oogstfeest van je eigen stad, met praalwagens die helemaal met fruit beplakt zijn - appels, peren, bessen, met miljoenen stuks tegelijk. HET HEET NIET MEER FRUITCORSO: het is omgedoopt tot Fruitfestival Tiel, en fruitcorso.nl stuurt je tegenwoordig door naar fruitfestival.nl. Onder de oude naam zoeken levert dus verouderde informatie op. OOK DE OPZET IS VERANDERD: vanaf 2026 rijden de wagens niet meer langs het publiek, maar staan ze opgesteld zodat je er zelf langs wandelt. Het valt in september, al wisselt het weekend: 2024 was 21 tot 23 september, 2025 was 27 tot 29 september, dus de regel 'derde weekend' klopt niet altijd. In 2024 kostte een dagticket op zaterdag of zondag EUR 7,50, waren kinderen tot en met tien jaar gratis en was de maandag voor iedereen vrij toegankelijk; of dat nog zo is weet ik niet. De editie van dit jaar is voorbij.", gedaan: false, favoriet: false, periode: "sept", tags: ["dichtbij", "kids", "buiten", "festival", "herfst"]},
  {id: 100, naam: "Appelpop", locatie: "Tiel, Gelderland", categorie: "Uitgaan", type: "Muziekfestival aan de Waalkade", link: "https://www.appelpop.nl/", notities: "Tweedaags muziekfestival op de Waalkade in Tiel, elk jaar in het tweede weekend van september, en jarenlang een van de grootste gratis festivals van het land. DAT GRATIS IS VOORBIJ: in 2026 werd voor het eerst entree gevraagd. Voor 2027 staan een weekendticket op EUR 30, een vrijdagticket op EUR 15 en een zaterdagticket op EUR 20, inclusief EUR 2,50 servicekosten - laag gehouden, maar niet meer nul. De volgende editie is 10 en 11 september 2027. Het terrein ging in 2026 op vrijdag om 16:00 open en op zaterdag om 12:00, met programma tot een uur 's nachts. Auto's en fietsen kunnen aan deze kant van de Waal gratis parkeren, en je kunt er vanuit huis naartoe lopen of fietsen - wat bij een festival dat tot in de nacht doorgaat meer waard is dan het klinkt.", gedaan: false, favoriet: false, periode: "sept", tags: ["dichtbij", "avond", "muziek", "buiten", "festival"]},
  {id: 101, naam: "GlowGolf Tiel", locatie: "Tiel, Gelderland", categorie: "Speelpark", type: "Indoor glow-in-the-dark midgetgolf", link: "", notities: "Vijftien holes midgetgolf in het donker, met fluorescerende banen, in Bowlingcentrum Tiel aan de Oude Medelsestraat 11a. Binnen een paar minuten rijden van huis, volledig overdekt en weerbestendig - en daarmee een van de weinige dingen in deze lijst die je op een regenachtige zondagmiddag zonder plannen nog kunt doen. Maandag en dinsdag open van 16 tot 22 uur, woensdag tot en met zondag van 12 tot 22 uur. Volwassenen EUR 9, kinderen van vier tot en met twaalf EUR 8 en kinderen tot en met drie gratis. DEZE GEGEVENS KOMEN VAN EEN UITJESSITE EN NIET VAN HENZELF: een eigen website heb ik niet gevonden, en de gids waar dit vandaan komt raadt zelf aan de actuele tijden en prijzen na te vragen. Bellen kan op 0344 61 28 96. In hetzelfde pand zit de bowling, dus die twee zijn te combineren.", gedaan: false, favoriet: false, periode: "", tags: ["dichtbij", "binnen", "regendag", "kids", "avond"]},
];

// Achtste vondstenronde: de winter. Van de 46 uitjes waren er maar vier echt
// winters, waardoor "Wat doen we?" in januari vrijwel hetzelfde aanbood als in
// juli - niet omdat de maandfilter stuk is, maar omdat er niets in stond dat
// alleen in december bestaat.
//
// Deze ronde is anders van aard dan de vorige, en dat verandert hoe de
// notities geschreven zijn. Bijna alles hier is een JAARLIJKSE EDITIE met data
// die volgend jaar niet meer kloppen. De datum van dit jaar is dus het minst
// duurzame dat erin kan staan. Daarom staat in elke notitie eerst het patroon
// - dat het elk jaar terugkomt en ongeveer wanneer - en pas daarna de datum
// van dit seizoen, met het jaartal erbij zodat je ziet wanneer hij verouderd
// is. Eén controle is op de officiele site gedaan, de rest waar dat niet lukte
// op uitjessites, en dat staat er per geval bij.
export const EXTRA_NOV_2026_H = [
  {id: 102, naam: "Winterpaleis Het Loo", locatie: "Apeldoorn, Gelderland", categorie: "Cultuur", type: "Verlicht paleis met wintertuin", link: "https://www.paleishetloo.nl/bezoek/agenda/winterpaleis-het-loo", notities: "Paleis Het Loo gaat elke winter in de lichtjes, binnen en buiten, en afficheert zichzelf dan als het mooist verlichte paleis van het land. De tuinen horen erbij, dus je loopt een deel van de avond buiten in het donker tussen de verlichting - dat is wat het van een gewoon museumbezoek onderscheidt. In het weekend en in de kerstvakantie zijn er extra activiteiten voor kinderen. DIT IS EEN JAARLIJKS WINTERPROGRAMMA en geen vaste opstelling: het loopt grofweg van eind november tot begin januari en daarbuiten is er niets van te zien. Dit seizoen, 2026-2027, is dat van 27 november tot en met 3 januari, dagelijks van 10 tot 17 uur. DE AVONDOPENSTELLINGEN ZIJN MAAR EEN HANDVOL DAGEN: 19, 20 en 27 december en 2 en 3 januari tot 19 uur, en in het donker is het natuurlijk op zijn mooist - dus daar plan je omheen. Prijzen stonden niet op de agendapagina.", gedaan: false, favoriet: false, periode: "nov-jan", tags: ["winter", "avond", "kids", "lichtjes", "cultuur"]},
  {id: 103, naam: "Schaatsen bij Triavium", locatie: "Nijmegen, Gelderland", categorie: "Sport", type: "Overdekte ijsbaan", link: "https://www.triavium.nl/", notities: "De grootste schaatslocatie van Nijmegen, en anders dan alle tijdelijke ijsbanen in deze lijst is dit een echte overdekte baan die er elk jaar gewoon staat. Er zijn drie banen naast elkaar - een ringbaan, een funbaan en een ijshockeybaan - dus je kunt er rondjes rijden en de kinderen ergens anders laten klungelen. Schaatsen zijn er te huur. OVERDEKT BETEKENT HIER OOK WEERONAFHANKELIJK: dit is het alternatief voor als de buitenijsbaan in Tiel niet doorgaat of het gewoon niet vriest, en dat is in Nederland de meeste winters het geval. Let op: er zijn per dag wisselende tijden voor publieksuren, ijshockey en trainingen, en die staan op een apart dagschema - zomaar langsgaan kan dus betekenen dat de baan vol ligt met hockeyers. Kijk het schema na voor je rijdt. Van Rosenburgweg 2. Tarieven stonden niet op de voorpagina.", gedaan: false, favoriet: false, periode: "", tags: ["winter", "sport", "kids", "binnen", "schaatsen"]},
  {id: 104, naam: "Kerst op Kasteel Middachten", locatie: "De Steeg, Gelderland", categorie: "Cultuur", type: "Kerstevenement op een landgoed", link: "", notities: "Vijf dagen lang verandert het landgoed rond Kasteel Middachten in een kerstwereld, met een markt, een lichtjeswandeling over het terrein en het kasteel zelf in kerstsfeer. Het draait om de avond: de openingstijden lopen tot acht uur, dus je komt in het donker aan. DIT IS EEN JAARLIJKSE TRADITIE die telkens in de tweede week van december valt - 2024 was 11 tot en met 15 december, 2025 was 10 tot en met 14 december en 2026 is 9 tot en met 13 december, van 12 tot 20 uur. Je kunt er dus elk jaar op rekenen, maar niet op een vaste datum. DE PRIJS DIE IK VOND IS VAN 2023 en dus achterhaald: toen EUR 13 voor een volwassene, EUR 5 voor een kind en EUR 2 parkeergeld per auto. Reken op meer en kijk het na op de site van Middachten; die waarschuwt zelf dat tijden, prijzen en parkeerplaatsen kunnen wisselen. Een eigen evenementpagina met de actuele cijfers heb ik niet kunnen bevestigen.", gedaan: false, favoriet: false, periode: "dec", tags: ["winter", "kerst", "avond", "lichtjes", "kasteel"]},
  {id: 105, naam: "Nijmeegse Winterweken", locatie: "Nijmegen, Gelderland", categorie: "Uitgaan", type: "Winterfeest in de binnenstad", link: "", notities: "Drie weken lang is de Nijmeegse binnenstad een winterstad: een route van het licht, een lichtjesoptocht, straattheater, kinderactiviteiten in de Stevenskerk en een schaatsbaan aan de Waalkade. Het loopt door tot in de kerstvakantie, dus het is er zowel voor een avond uit als voor een middag met kinderen. HET KOMT ELK JAAR TERUG en loopt steeds van ongeveer half december tot de eerste week van januari; in 2025-2026 was dat 13 december tot 4 januari en voor 2026-2027 wordt 12 december tot en met 3 januari genoemd. DIE DATA KOMEN VAN EEN TWEEDE BRON en niet van de organisatie zelf, dus controleer ze. Wat er precies in het programma zit wisselt per jaar: de rolschaatsbaan op de Waalkade stond in de editie van vorig jaar, maar of die terugkomt staat nergens bevestigd. Het Kerstcircus in het Goffertpark hoort er ook bij en staat apart in deze lijst.", gedaan: false, favoriet: false, periode: "dec-jan", tags: ["winter", "avond", "kids", "lichtjes", "gratis"]},
  {id: 106, naam: "Kerstcircus Nijmegen", locatie: "Nijmegen, Gelderland", categorie: "Uitgaan", type: "Circus in een verwarmde tent", link: "", notities: "Circus in het Goffertpark tussen kerst en nieuwjaar, in verwarmde tenten - zowel de piste als de foyer. Een voorstelling duurt ongeveer twee uur inclusief pauze. Het hoort bij de Nijmeegse Winterweken maar heeft een eigen kaartverkoop. DIT IS EEN VASTE KERSTVAKANTIE-TRADITIE: de editie van 2026-2027 is de vijftiende, heet 'WE ARE THE WORLD' en loopt van 22 december tot en met 3 januari. Vorig jaar liep het van 22 december tot 4 januari, dus het schuift een dag of wat. KAARTJES ZIJN AAN EEN VOORSTELLING GEBONDEN, niet aan een dag, dus je kiest vooraf een tijdstip - en in de kerstvakantie lopen de populaire tijden vol. Via de officiele site van het Kerstcircus. Een losse bron noemde een einddatum van 7 januari; dat lijkt een oudere editie te zijn. Prijzen vond ik niet.", gedaan: false, favoriet: false, periode: "dec-jan", tags: ["winter", "kids", "avond", "binnen", "kerst"]},
  {id: 107, naam: "Kerstmarkt Kasteel Doornenburg", locatie: "Doornenburg, Gelderland", categorie: "Cultuur", type: "Kerstmarkt op een kasteelbinnenplaats", link: "", notities: "Kerstmarkt op de binnenplaats van een echt middeleeuws kasteel, met live kerstmuziek, eten en drinken en activiteiten voor kinderen. DE MARKT ZELF IS GRATIS; alleen als je het kasteelmuseum in de hoofdburcht in wil betaal je, en de kasteelwinkel is die dag open. Dat maakt dit een van de weinige kerstuitjes waar je niets kwijt bent als het tegenvalt. Het valt rond half december, maar een bevestigde datum voor 2026 heb ik niet gevonden - de datum die rondgaat, 14 december, hoort bij de editie van 2025. IN DE KERSTVAKANTIE ZIJN ER LOSSE FAMILIERONDLEIDINGEN, dit jaar op 28, 29 en 30 december om 11 en 13 uur, ongeveer anderhalf uur en vanaf vier jaar; daarbij gaan de kinderen met een gids mee terwijl de volwassenen de geschiedenis van het kasteel doen. Kerkstraat 27. Het museum zelf is doorgaans alleen in het weekend open, van 11:30 tot 16 uur.", gedaan: false, favoriet: false, periode: "dec", tags: ["winter", "kerst", "gratis", "kids", "kasteel"]},
  {id: 108, naam: "Winters Wijchen", locatie: "Wijchen, Gelderland", categorie: "Uitgaan", type: "Winterfeest met lichtjes en muziek", link: "", notities: "Winterfeest in Wijchen met lichtjes, muziek en optredens, op ongeveer een half uur rijden. Het is een weekendevenement en geen weken durende markt, dus het is een avond uit en geen dagprogramma. Er is in hetzelfde weekend ook een kerstmarkt op De Zweef in Wijchen, dus die twee zijn te combineren. HET KOMT ELK JAAR TERUG en valt steeds in het tweede weekend van december; voor 2026 worden 13 en 14 december genoemd. DIE DATUM KOMT VAN EEN UITJESSITE en niet van de organisatie, en bij dat soort regionale feesten wisselt het weekend nog weleens - kijk dus na bij de gemeente Wijchen of de organisatie voor je gaat. In hetzelfde dorp zit ook Thermen Berendonck, dat apart in deze lijst staat.", gedaan: false, favoriet: false, periode: "dec", tags: ["winter", "avond", "lichtjes", "kerst", "gratis"]},
  {id: 109, naam: "IJsbaan Tiel", locatie: "Tiel, Gelderland", categorie: "Sport", type: "Tijdelijke buitenijsbaan", link: "", notities: "Elke winter komt er een tijdelijke ijsbaan in het plantsoen aan de Julianalaan, op loopafstand. Dat maakt dit het enige winteruitje in deze lijst waarvoor je de auto niet nodig hebt. HET IS EEN TIJDELIJKE BAAN MET EEN WISSELENDE PERIODE: de gemeentelijke melding voor de winter van 2025-2026 noemde alleen 'data nog vast te stellen, tussen december en maart', en voor dit seizoen heb ik nog geen aankondiging gevonden. Dat is normaal - die komen meestal pas in de loop van november naar buiten, dus kijk op de site van de gemeente Tiel of in de lokale agenda. GAAT HIJ NIET DOOR, DAN IS TRIAVIUM IN NIJMEGEN HET ALTERNATIEF: die baan is overdekt en staat er elk jaar, en die staat apart in deze lijst. Over openingstijden en tarieven van de Tielse baan heb ik niets kunnen vinden; dat verschilt per jaar met de organisator.", gedaan: false, favoriet: false, periode: "dec-feb", tags: ["winter", "dichtbij", "kids", "schaatsen", "buiten"]},
  {id: 110, naam: "Thermen Berendonck", locatie: "Wijchen, Gelderland", categorie: "Sport", type: "Saunaresort", link: "https://www.thermenberendonck.nl/", notities: "Groot wellnessresort bij Wijchen met dertien sauna's, binnen- en buitenbaden en meerdere restaurants, op een half uur rijden. Het staat in deze winterronde omdat dit het soort uitje is waar je in januari wat aan hebt en in juli niet: buiten in een warm bad zitten terwijl het vriest is het hele idee. Het is het hele jaar open, vandaar geen seizoen bij deze regel. DIT IS GEEN GEZINSUITJE: een saunaresort is een volwassenbestemming, en of kinderen welkom zijn en vanaf welke leeftijd kon ik nergens bevestigd vinden - niet op hun eigen site en niet elders. Ga daar dus niet vanuit en bel even als je ze mee wil nemen. Een gids noemde EUR 26,50 voor een volwassene en dagelijks open van 9 tot 23 uur, maar dat stond niet op hun eigen pagina en kan verouderd zijn. Er is een hotel bij als je er een nacht van wil maken.", gedaan: false, favoriet: false, periode: "", tags: ["winter", "ontspanning", "twee personen", "avond", "binnen"]},
  {id: 111, naam: "Kerst op de Arnhemse landgoederen", locatie: "Arnhem, Gelderland", categorie: "Cultuur", type: "Kerstmarkten en winterfairs op buitenplaatsen", link: "", notities: "Rond Arnhem liggen een paar landgoederen die in december allemaal iets kerstigs doen, en omdat ze dicht bij elkaar liggen kun je er een middag van maken. Kerst op Zypendaal valt op losse dagen - voor 2026 worden 7, 14 en 21 december en 4 januari genoemd - en de winterfair op kasteel Rosendael staat voor 20 en 21 december. In Arnhem zelf loopt Winter Arnhem op 13, 14, 27 en 28 december, en op Schaarsbergen is er op 13 december een kerstmarkt. DIT ZIJN LOSSE DAGEN EN GEEN DOORLOPEND PROGRAMMA, en dat is het verschil met Valkenburg of Nijmegen: je kunt hier niet zomaar een willekeurige decemberdag heen rijden, je moet de datum opzoeken. ALLE DATA KOMEN VAN EEN UITJESSITE en niet van de landgoederen zelf, en bij dit soort kleine evenementen schuiven ze per jaar - dus controleer ze bij Geldersch Landschap, dat Zypendaal en Rosendael beheert.", gedaan: false, favoriet: false, periode: "dec", tags: ["winter", "kerst", "kasteel", "buiten", "lichtjes"]},
];

// Vierde ronde aanvullingen: de tien kale hikes. Vijf Nederlandse, waar de
// vraag "waar parkeer ik en wat kost dat" het antwoord is, en vijf grote
// buitenlandse treks, waar de vraag "wanneer moet ik dit boeken" het antwoord
// is - bij drie ervan maanden van tevoren, en dat is precies het soort ding
// dat je te laat ontdekt.
//
// Bij de Nederlandse blijft `periode` bewust leeg. Heide bloeit in augustus en
// september, maar deze bossen zijn het hele jaar de moeite, en een periode
// invullen zou ze de overige tien maanden van "Wat doen we?" weghouden.
export const VERRIJKINGEN_NOV_2026_D = [
  {
    id: 45,
    velden: {
      link: "https://www.natuurmonumenten.nl/natuurgebieden/landgoed-mookerheide",
      tags: ["bos", "heide", "wandelen", "uitzicht", "hond"],
      notities:
        "Heuvelachtig heide- en bosgebied van Natuurmonumenten op de grens van Gelderland en Limburg, bij Mook onder Nijmegen. Het hoogteverschil is voor Nederlandse begrippen fors en de uitzichten over de stuwwal zijn er navenant; er lopen ook grote grazers rond. Natuurmonumenten heeft hier zes gemarkeerde routes, waaronder het Landgoedpad van ongeveer een kilometer dat geschikt is voor een rolstoel of kinderwagen, de Twee Schansen-route van 5 km langs Jachtslot Mookerheide, en de Bisseltroute van 6,2 km richting Groesbeek. PARKEREN KOST SINDS JANUARI 2026 GELD voor wie geen lid is: de parkeerplaats aan de Heumensebaan vraagt een bijdrage, en leden en vrijwilligers staan er gratis met hun pas. Het bedrag staat niet op de gebiedspagina. Honden mogen mee op de paden, aangelijnd. Startadres Heumensebaan 2 in Molenhoek; er is ook een parkeerplaats bij de Papenbergseweg in Mook.",
    },
  },
  {
    id: 46,
    velden: {
      link: "https://www.staatsbosbeheer.nl/uit-in-de-natuur/locaties/radio-kootwijk",
      tags: ["bos", "zand", "wandelen", "architectuur", "veluwe"],
      notities:
        "Een kathedraalachtig betonnen zendgebouw uit 1923 midden op de Veluwe, met daaromheen stuifzand, heide en bos - het Kootwijkerzand ligt ernaast en is een van de grootste zandverstuivingen van West-Europa. Die combinatie van een enorm leeg gebouw in een leeg landschap is wat de plek bijzonder maakt. Staatsbosbeheer beheert het terrein sinds 2008. HET ZENDGEBOUW IS NORMAAL NIET OPEN: je kunt er alleen in tijdens een rondleiding of een evenement, dus kijk dat vooraf na als het je om het gebouw te doen is - van buiten is het ook zonder meer de moeite. Wandelen kan altijd: er is een heideroute van ongeveer 12,5 km met rode paaltjes en een korte route van zo'n 2 km met groene paaltjes, allebei ook te starten bij Hoog Buurlo. PARKEREN BIJ HET ZENDGEBOUW IS BETAALD; een bron noemt EUR 5 per dag, maar dat is niet bevestigd en dateert van eerder. Gratis staan kan aan de Alverschotenseweg. Adres Radioweg 1, 7348 BG Radio Kootwijk - en let op: niet elke navigatie kent die plaatsnaam.",
    },
  },
  {
    id: 47,
    velden: {
      link: "https://pyramidevanausterlitz.nl/",
      tags: ["uitzicht", "monument", "bos", "kids", "wandelen"],
      notities:
        "Een aarden piramide van 36 meter op de Utrechtse Heuvelrug, in 1804 in zes weken opgeworpen door de soldaten van Napoleons leger dat hier gelegerd lag. Er zit een trap in naar een bordes met uitzicht over de heuvelrug, en eromheen ligt bos waar je zo een wandeling aan vastknoopt; aan de voet staat een restaurant met een grote speeltuin. HET MONUMENT IS OP DIT MOMENT GESLOTEN WEGENS ONDERHOUD, dus de trap op kan nu niet - dat staat op hun eigen site, zonder einddatum, dus kijk dat na voor je rijdt. IN HET WINTERSEIZOEN, van 26 oktober 2026 tot 20 maart 2027, zijn alleen het restaurant en de speeltuin open, en alleen op zondag van 10:00 tot 18:00. Buiten die zondagen is er in de winter dus weinig te halen behalve het bos zelf. Het park zelf is gratis en er is ruim gratis parkeren. Er zijn twee aparte websites: deze gaat over het park, het restaurant en de speeltuin, en monumentdepyramidevanausterlitz.nl over het monument en het bezoekerscentrum. Zeisterweg 98, Woudenberg.",
    },
  },
  {
    id: 48,
    velden: {
      link: "https://www.hunebedcentrum.eu/",
      tags: ["wandelen", "geschiedenis", "kids", "hondsrug", "bos"],
      notities:
        "Vijfduizend jaar oude grafkamers van zwerfkeien, verspreid over de Hondsrug. Van de ruim vijftig in Nederland liggen er op twee na allemaal in Drenthe. D27 in Borger is de grootste van het land, ruim 22 meter lang, en ligt pal naast het Hunebedcentrum. DE HUNEBEDDEN ZELF STAAN GEWOON IN HET LANDSCHAP en zijn vrij te bezoeken; het museum ernaast is betaald en daar zit het verhaal, met een gereconstrueerd steentijddorp erbij. Je hoeft dus niet naar binnen om de stenen te zien. De mooiste manier is een wandeling: de ANWB-route vanaf het Hunebedcentrum is 18,5 km en in te korten tot 12,5 of 5 km, loopt langs meerdere hunebedden en gaat voor driekwart over onverharde paden. Parkeren bij het centrum is gratis. LET OP DE WEBSITE: die staat op .eu en niet op .nl. Hunebedstraat 27 in Borger; de prijzen van het museum wisselen en staan niet betrouwbaar bij derden, dus kijk op hun eigen site.",
    },
  },
  {
    id: 49,
    velden: {
      tags: ["zwemmen", "bos", "kids", "hondsrug", "wandelen"],
      notities:
        "Zwemplas midden in het bos bij Gasselte, aan de rand van Boswachterij Gieten-Borger op de Hondsrug. Het water is helder en ondiep en daarmee uitgesproken geschikt voor kleine kinderen, met zandstranden eromheen - en anders dan de meeste zwemplassen ligt deze echt in het bos, dus je kunt er zwemmen en wandelen aan elkaar knopen. Vlakbij ligt het Gasselterveld, een oude zandafgraving die in het midden vijftig meter diep is; dat is een ander water en niet hetzelfde als deze plas. Er loopt ook een mountainbikeroute van ongeveer 30 km door het bos, en het Boomkroonpad ligt op een paar minuten rijden - die twee zijn goed te combineren tot een dag. Adres Houtvester Jansenweg 2, 9462 TB Gasselte. OVER HET PARKEREN IS HET BEELD ONDUIDELIJK: er wordt op het terrein al ergens betaald geparkeerd en Staatsbosbeheer wil betaald parkeren bij de plas zelf invoeren, maar een officieel besluit met tarief heb ik niet gevonden. Reken erop dat het geld kost. Een officiele pagina voor deze plas is er niet; de informatie loopt via het recreatieterrein Gasselterveld.",
    },
  },
  {
    id: 50,
    velden: {
      link: "https://cortina.dolomiti.org/en/summer/what-to-do/activities/trekking/alta-via-n-1/",
      tags: ["meerdaags", "berghut", "dolomieten", "uitdagend", "uitzicht"],
      notities:
        "De bekendste meerdaagse trek van de Dolomieten, van Lago di Braies in het noorden naar Belluno in het zuiden, in twaalf etappes van hut naar hut. Bij elkaar rond de 120 tot 130 kilometer met zo'n 7.500 meter klimmen; de officiele etappelijst telt dagen van 6 tot 15 km, dus het zijn korte afstanden met veel hoogtemeters. Je slaapt in rifugi met bedden en eten, dus je hoeft geen tent en geen kookspullen mee. BOEK DE HUTTEN MAANDEN VAN TEVOREN: de reserveringen openen bij de meeste rifugi ergens tussen oktober en januari voor de zomer erna, en de populaire hutten zitten binnen dagen vol - dit is de reden dat mensen deze trek een jaar vooruit plannen. Elke hut boek je apart, soms online en soms alleen per mail of telefoon, dus reken op een avond uitzoekwerk. Het seizoen loopt ongeveer van half juni tot eind september en de hutten zijn daarbuiten dicht. Je eindigt bij bushalte La Pissa, twintig minuten van Belluno, vanwaar bus en trein gaan.",
    },
  },
  {
    id: 51,
    velden: {
      link: "https://auronzo.info/",
      tags: ["dagwandeling", "dolomieten", "uitzicht", "berghut"],
      notities:
        "DIT IS GEEN MEERDAAGSE TREK MAAR EEN DAGRONDJE, ondanks het woord trek in de naam: de klassieke lus om de drie torens heen is ongeveer 10 km en kost drie tot vier uur, vanaf Rifugio Auronzo. Dat maakt het een van de weinige plekken waar je het grote Dolomietenbeeld meekrijgt zonder dat je er een week voor vrij hoeft te maken. Onderweg liggen Rifugio Lavaredo en Rifugio Locatelli, met vanaf die laatste het ansichtkaartbeeld van de drie noordwanden. RESERVEREN VAN DE TOLWEG EN PARKEERPLAATS IS VERPLICHT EN KAN NIET OP DE DAG ZELF: dat gaat uitsluitend online, via de gemeente Auronzo, en uiterlijk de avond ervoor tot 23:59. Zonder reservering kom je de weg niet op. Dat kostte in 2026 EUR 40 voor een auto, inclusief twaalf uur parkeren; een motor EUR 26 en een camper EUR 60. Goedkoper kan: parkeren in Misurina en met de bus omhoog, of starten bij Lago d'Antorno net voor de tolpoort. De tolweg is ongeveer van eind mei tot eind oktober open, afhankelijk van de sneeuw.",
    },
  },
  {
    id: 53,
    velden: {
      link: "https://zermatt.swiss/en/p/the-matterhorn-trek-01tVj000005EvrhIAC",
      tags: ["meerdaags", "berghut", "alpen", "uitdagend", "uitzicht"],
      notities:
        "LET OP: ER BESTAAN TWEE ROUTES MET BIJNA DEZELFDE NAAM, en dat scheelt een week vakantie. De Tour du Cervin oftewel de grote ronde om de Matterhorn heen is zo'n 145 tot 155 km in acht tot elf dagen, loopt via Zwitserland en Italie en gaat over gletsjer en hoge passen - voor een deel daarvan heb je stijgijzers nodig. De Matterhorn Trek van Zermatt zelf is een andere, kortere route: vijf dagen van hut naar hut met etappes van vier tot zes uur, start en finish in Zermatt, langs Trift, Schonbiel, de Hornlihutte en de Gandegghutte. Die laatste is de route waar deze link over gaat en de meest haalbare van de twee als je een week hebt. Allebei zijn ze hoogalpien en allebei alleen in de zomer, grofweg juli tot half september, als de hutten open zijn en de passen sneeuwvrij. Boek de hutten ruim vooruit; de Hornlihutte aan de voet van de Matterhorn is de drukst geboekte berghut van Zwitserland.",
    },
  },
  {
    id: 54,
    velden: {
      link: "https://www.oficinadelperegrino.com/en/",
      tags: ["meerdaags", "pelgrimsroute", "spanje", "cultuur"],
      notities:
        "De pelgrimsroute naar Santiago de Compostela, waarvan de Camino Frances met bijna 800 km vanaf Saint-Jean-Pied-de-Port de bekendste is. Je slaapt in albergues, loopt dagetappes van twintig tot dertig kilometer en hoeft weinig vooruit te plannen - dat laatste maakt het een heel andere soort tocht dan een alpiene hut-tot-huttrek. JE HEBT EEN CREDENCIAL NODIG, het pelgrimspaspoort, en daar verzamel je onderweg stempels in; reken op twee per dag om geen gedoe te krijgen. VOOR DE COMPOSTELA MOET JE MINIMAAL HONDERD KILOMETER TE VOET LOPEN, of tweehonderd op de fiets, aaneengesloten op een erkende route en inclusief de laatste etappe naar Santiago. Op de Camino Frances is dat vanaf Sarria, en wie alleen dat laatste stuk doet heeft ongeveer vijf dagen nodig. Loop je in een ander land, dan moeten er alsnog zeventig kilometer in Spanje bij. Mei tot oktober is het seizoen; juli en augustus zijn heet en druk, mei en september zijn aangenamer. De regels rond de honderd kilometer zijn de afgelopen jaren veranderd, dus kijk ze na bij het pelgrimsbureau zelf.",
    },
  },
  {
    id: 55,
    velden: {
      link: "https://swedishtouristassociation.com/kungsleden",
      tags: ["meerdaags", "berghut", "zweden", "poolcirkel", "uitdagend"],
      notities:
        "De Koningsleden, ruim 450 km door Zweeds Lapland van Abisko naar Hemavan, grotendeels boven de poolcirkel. De meeste mensen lopen alleen het noordelijke stuk van Abisko naar Nikkaluokta, ongeveer een week, langs Kebnekaise - de hoogste berg van Zweden. De Zweedse Toeristenvereniging beheert zestien hutten op tien tot twintig kilometer van elkaar; tussen Kvikkjokk en Ammarnas staan er geen. EEN BOEKING IS GEEN GEGARANDEERD BED: de plaatsen in een berghut worden per dag vergeven op volgorde van aankomst, dus je boeking is in feite een voucher. Lid worden van de STF verdient zichzelf terug zodra je een paar nachten boekt. HET SEIZOEN LOOPT VAN EIND JUNI TOT HALVERWEGE SEPTEMBER en daarna gaan de hutten dicht, de meeste tussen 20 en 30 september. De regel hierboven zegt juli-augustus, maar dat is juist de muggentijd: na de eerste nachtvorst in augustus zijn ze vrijwel weg, en eind augustus tot half september is de rustigste en mooiste periode, met herfstkleuren erbij. Vanaf Nikkaluokta gaat er een paar keer per dag een bus naar Kiruna.",
    },
  },
];

// Vijfde ronde aanvullingen: de reizen. Drie bijzondere verblijven, acht
// roadtrips en drie verre vakanties.
//
// Bij een roadtrip is er geen entree en geen openingstijd, dus de nuttige
// feiten zijn andere: welke route, welk seizoen, en wat je aan de grens of bij
// de tolpoort tegenkomt. Dat laatste is het soort ding dat een dag kan kosten
// als je het niet weet - een vignet dat je niet hebt, een pas die dicht is,
// een reservering die niet op de dag zelf kan.
//
// Twee regels blijven leeg: "Drijfhuisje Vinkeveen" is niet thuis te brengen
// (er liggen tientallen drijvende huisjes op die plassen) en "Boomhut" is
// geen plek maar een soort, net als "Bowlen".
export const VERRIJKINGEN_NOV_2026_E = [
  {
    id: 32,
    velden: {
      link: "https://www.cabiner.com/",
      tags: ["off-grid", "bos", "wandelen", "stilte", "twee personen"],
      notities:
        "Houten hutjes diep in de natuur, die je alleen te voet bereikt: je parkeert aan de rand van het gebied en loopt het laatste stuk, en dat lopen hoort bij het concept. De hutten staan in tien natuurgebieden, waaronder het Dwingelderveld, de Drentsche Aa, de Sallandse Heuvelrug, de Noord-Veluwe, het Horsterwold, het Kuinderbos en het Lauwersmeer. ZE ZIJN OFF-GRID: je pompt je eigen water en stookt een houtkachel voor de warmte, dus reken niet op stopcontacten, verwarming of een douche zoals thuis. Dat is het punt, maar het is wel iets om te weten voordat je boekt met iemand die daar anders over denkt. Neem eten mee; er is geen winkel om de hoek en je kunt er niet even heen rijden. Een kanttekening uit de recensies: niet elke hut staat even afgelegen, eentje op de Veluwe bleek vlak langs een druk wandelpad te liggen - kijk dus even naar de ligging van de specifieke hut en niet alleen naar de foto's.",
    },
  },
  {
    id: 33,
    velden: {
      tags: ["winter", "joert", "bos", "drenthe", "kampvuur"],
      notities:
        "Winterkamp met Mongoolse joerten in het bos van Elp in Drenthe, opgezet als tijdelijk kamp door de mensen achter Travelbase. De joerten zijn gemaakt voor veel strengere winters dan de onze, met een kachel binnen, dus dit is kamperen in de kou zonder dat je het koud hebt - precies het soort overnachting waar in de rest van deze lijst weinig van staat. DIT IS EEN POP-UP EN GEEN VASTE ACCOMMODATIE: het kamp staat er alleen in het winterseizoen, grofweg van oktober tot eind maart, en daarbuiten is er niets te boeken. Of het elk jaar terugkomt is niet gegarandeerd, dus kijk in het najaar of het seizoen doorgaat. Populaire data zaten in eerdere jaren vol met wachtlijsten, dus vroeg boeken loont. Een eerdere editie vroeg vanaf EUR 190 per nacht voor twee tot vier personen. Adres Ieberen 1, 9442 TJ Elp. Een eigen website heb ik niet met zekerheid kunnen vaststellen; zoek via Travelbase.",
    },
  },
  {
    id: 34,
    velden: {
      link: "https://www.cabinanna.com/",
      tags: ["architectuur", "natuur", "twee personen", "bijzonder"],
      notities:
        "Een huisje dat je zelf openschuift: twee schillen om elkaar heen, waarvan je de buitenste met de hand wegrolt, zodat de glazen binnenkant in de open lucht komt te staan. Ontworpen door Caspar Schols, oorspronkelijk voor zijn moeder in een tuin in Eindhoven, en inmiddels een reeks. Het idee is dat je de verhouding tussen binnen en buiten per dag bijstelt, en dat maakt het meer een ervaring dan een overnachting. Overnachten kan onder andere op Camping Holenberg in Schaijk, in de Maashorst in Noord-Brabant; er staan er ook elders, onder meer in de Biesbosch. DE CABINS STAAN NIET ALLEMAAL OP EEN EIGEN SITE TE BOEKEN: per locatie loopt het via de camping of het landgoed waar hij staat, dus zoek op de plaats en niet alleen op de naam. Er zijn twee slaapkamers, een keuken en een badkamer. Prijzen staan nergens publiek vermeld en wisselen per locatie, dus reken op opvragen.",
    },
  },
  {
    id: 36,
    velden: {
      link: "https://www.visitzuidlimburg.nl/",
      tags: ["heuvels", "dagrit", "uitzicht", "dichtbij"],
      notities:
        "Het enige stuk Nederland met echte hellingen, en daarmee de enige roadtrip van deze lijst die je op een zaterdag kunt doen. De klassieke route is de Mergellandroute, die door het Heuvelland slingert langs het Geuldal en het Maasdal, met Valkenburg, Slenaken, Margraten en Vaals onderweg. Visit Zuid-Limburg heeft een autoroute van ongeveer 120 km van het Drielandenpunt op de Vaalserberg naar Maastricht, en een camperroute van ongeveer 111 km die de smalste weggetjes juist mijdt. Een langere variant van 248 km pakt er Thorn bij. DEZE WEGEN WORDEN GEDEELD MET FIETSERS EN WANDELAARS, en dat is geen bijzin: het is het drukste wielergebied van het land en de weggetjes zijn smal en onoverzichtelijk. Rij er rustig. Sommige hellingen gaan over de 16 procent, wat met een zwaar beladen auto of een camper iets is om te weten. Het hele jaar te rijden; het mooist in het voorjaar en in oktober.",
    },
  },
  {
    id: 37,
    velden: {
      link: "https://www.visitluxembourg.com/",
      periode: "apr-okt",
      tags: ["kastelen", "wandelen", "rotsen", "dichtbij"],
      notities:
        "Op ongeveer vier uur rijden, en daarmee het dichtstbijzijnde buitenland dat echt anders voelt. Twee gebieden dragen de reis: het Mullerthal in het oosten, bijgenaamd Klein Zwitserland, met zandsteenrotsen, kloven en grotten - de Schiessentumpel-waterval, de Hohllay-grot en de kloof Werschrummschluff zijn de bekendste. En Vianden in het noorden, met een van de best bewaarde middeleeuwse burchten van West-Europa boven de Our, een stadsmuur met wachttorens en de enige stoeltjeslift van het land. Tussen die twee zit een klein half uur rijden, dus een lang weekend is genoeg voor allebei. De wandelpaden van de Mullerthal Trail zijn het mooist van april tot en met oktober; daarom staat die periode er nu bij. TANKEN DOE JE IN LUXEMBURG EN NIET ERNAAST: brandstof is er structureel goedkoper dan in de buurlanden, dus vul vol voordat je de grens weer over gaat. Een tolvignet heb je er niet nodig.",
    },
  },
  {
    id: 38,
    velden: {
      tags: ["bergpassen", "uitzicht", "meerdaags", "vignet"],
      notities:
        "Een rondrit over de Alpenpassen, en de voorbereiding zit hem hier vooral in de papieren en de kalender. EEN VIGNET IS VERPLICHT IN ZWITSERLAND EN OOSTENRIJK, en dat regel je voor vertrek: Zwitserland kent alleen een jaarvignet, dat in 2026 CHF 40 kostte en geldig is van december tot en met januari van het jaar erna, dus ook voor een weekend betaal je het hele jaar. Oostenrijk heeft wel korte vignetten: in 2026 ongeveer EUR 9,60 voor een dag, EUR 12,80 voor tien dagen en EUR 32 voor twee maanden. Zonder vignet riskeer je een boete van EUR 120 in Oostenrijk en CHF 200 in Zwitserland. Vanaf 2027 is het Oostenrijkse vignet alleen nog digitaal. Bovenop het vignet komen losse tolwegen en tunnels, die apart afgerekend worden. DE HOGE PASSEN ZIJN NIET HET HELE JAAR OPEN: de meeste gaan pas in mei of juni sneeuwvrij en sluiten in oktober, dus een Alpenroadtrip is een zomerplan. Controleer de passtatus vlak voor vertrek, want ook in de zomer kan er sneeuw liggen.",
    },
  },
  {
    id: 39,
    velden: {
      link: "https://www.schwarzwald-tourismus.info/",
      tags: ["panoramaweg", "bos", "watervallen", "dichtbij"],
      notities:
        "De Schwarzwaldhochstrasse is de route waar het om draait: een panoramaweg over de bergkam van Baden-Baden naar Freiburg, met Freudenstadt, Triberg en de Titisee onderweg. Vier tot vijf dagen is comfortabel; wie er een week van maakt kan er een lus van maken met de Bodensee erbij, of vanuit Freiburg de Rijn oversteken naar Colmar in de Elzas - dat is een dagtrip. Uitzichtpunten langs de weg zijn de Windeckfelsen en de Huberfelsen, en de Mummelsee ligt pal aan de route. Triberg heeft de hoogste waterval van Duitsland en ligt aan de Duitse Klokkenroute; in Schonach ernaast staat de grootste koekoeksklok ter wereld. Anders dan de Alpen is dit géén zomerexclusief plan: de watervallen en kloven zijn er ook in de winter en de regio heeft een uitgesproken adventsseizoen. WEL KAN ER OP DE HOOGSTE DELEN SNEEUW LIGGEN, en over winterafsluitingen van de hoogstraat vond ik geen harde informatie - kijk dat na als je buiten het zomerseizoen gaat. Geen vignet nodig in Duitsland.",
    },
  },
  {
    id: 40,
    velden: {
      link: "https://www.brittanytourism.com/",
      tags: ["kust", "zee", "meerdaags", "getijden"],
      notities:
        "De ruige Atlantische kust van Frankrijk, en een route die bijna altijd bij de Mont Saint-Michel begint - die strikt genomen in Normandie ligt, net over de grens. De lange variant loopt van daar naar Saint-Nazaire en is ongeveer 870 km; een kortere noordelijke lus gaat via Cancale, bekend om de oesters, naar Saint-Malo, de Cote de Granit Rose en Roscoff, en is zo'n 350 km. Reken op een week tot twee weken. HET GETIJ IS HIER EXTREEM EN DAT IS GEEN FOLKLORE: in de baai van de Mont Saint-Michel komt het water met snelheden tot zes kilometer per uur op, en over het wad loop je alleen met een gids die de paden en de tijden kent. Kijk de getijdentabel na voordat je een dag vastlegt, want hij bepaalt of je het eiland over de dijk of omringd door water ziet. Het seizoen loopt van april tot eind september; juni en september zijn het aangenaamst, met minder drukte en zelden meer dan 25 graden. In Frankrijk betaal je tol per traject op de autoroutes, zonder vignet.",
    },
  },
  {
    id: 41,
    velden: {
      link: "https://www.visitwallonia.be/",
      tags: ["ardennen", "weekend", "dichtbij", "kastelen", "water"],
      notities:
        "De Ardennen op twee tot drie uur rijden, en daarmee het makkelijkste weekend weg van deze lijst. De klassieke lus is Dinant, La Roche-en-Ardenne en Durbuy, bij elkaar ongeveer honderd kilometer rijden, dus je zit meer buiten de auto dan erin. Dinant ligt tegen de rotswand aan de Maas, met een citadel en de Grotte la Merveilleuse, en is de geboorteplaats van Adolphe Sax - vandaar de saxofoons door de hele stad. La Roche-en-Ardenne is de buitensportplek van de drie: wandelen, mountainbiken en kajakken op de Ourthe, met een burchtruine boven het dorp. Durbuy afficheert zich als de kleinste stad ter wereld en bestaat vooral uit een geplaveid oud centrum. Wil je er meer dagen van maken, dan passen Bouillon en de grotten van Han-sur-Lesse erbij; Han ligt ongeveer een uur van Dinant. Geen vignet nodig in Belgie. Het hele jaar te doen, al is het water in het voorjaar het hoogst en de herfst het mooist.",
    },
  },
  {
    id: 43,
    velden: {
      link: "https://www.dolomiti.it/",
      tags: ["bergpassen", "uitzicht", "meerdaags", "italie"],
      notities:
        "Rijden over de Dolomietenpassen, met de Sella Ronda als bekendste rondje: Passo Pordoi, Passo Sella, Passo Gardena en Passo Campolongo in een lus om de Sellagroep heen. Daarnaast liggen de Passo Giau en de Passo Falzarego bij Cortina, en die eerste geldt als de mooiste van allemaal. Het zijn korte afstanden met heel veel bochten, dus reken niet op gemiddelde snelheden. LET OP WELKE PAS WANNEER OPEN IS, want dat verschilt per pas en niet per seizoen: de vier passen van de Sella Ronda blijven in de winter meestal gewoon bereikbaar omdat er skigebieden aan liggen, terwijl de Passo Giau en de Passo Fedaia van ongeveer oktober tot april dicht kunnen zijn. En ook een open pas gaat bij sneeuwval of lawinegevaar tijdelijk dicht, soms van de ene dag op de andere. Controleer de actuele status vlak voor vertrek bij Veneto Strade voor de Venetiaanse passen en bij Sudtirol voor Sella en Gardena. In Italie betaal je tol per traject op de autostrada, zonder vignet - maar Oostenrijk of Zwitserland onderweg betekent wel een vignet.",
    },
  },
  {
    id: 44,
    velden: {
      link: "https://www.visitnorway.com/",
      tags: ["fjorden", "meerdaags", "ver", "veerboten"],
      notities:
        "Fjorden, watervallen en de bekende routes: de Atlanterhavsveien die van eilandje naar eilandje springt, de elf haarspeldbochten van de Trollstigen, en de hoge Sognefjellet. De Atlantic Road zelf is tolvrij, maar daar houdt het goede nieuws over kosten op. TOL EN VEERBOTEN LOPEN VIA KENTEKENHERKENNING EN KOM JE PAS THUIS TEGEN: je rijdt gewoon door en krijgt later een factuur, met administratiekosten erbovenop. Registreer je kenteken vooraf bij AutoPASS of epass24, dan betaal je het juiste tarief en scheelt het geld. Een gewone fjordenrondrit kost al snel richting duizend Noorse kronen aan tol, en voor de veerboten bestaat een aparte AutoPASS-kaart die alleen loont als je er veel neemt. Onderzeese tunnels zijn het duurst. OP SMALLE PASWEGEN ALS DE TROLLSTIGEN HEEFT DALEND VERKEER VOORRANG, wat andersom is dan je gewend bent. De hoge passen gaan in de winter dicht, dus dit is een plan voor eind mei tot september; kijk de wegstatus na bij Statens vegvesen.",
    },
  },
  {
    id: 58,
    velden: {
      link: "https://www.tourismthailand.org/",
      tags: ["ver", "stranden", "eilanden", "lang weg"],
      notities:
        "Het koele droge seizoen loopt van november tot en met februari en dat is waarom die periode hierboven staat: dan is het in het hele land goed te doen, met Chiang Mai en het noorden op hun best. Maart en april zijn heet, en in het noorden hangt er dan rook van het brandseizoen. DE TWEE KUSTEN IN HET ZUIDEN HEBBEN VERSCHILLENDE REGENSEIZOENEN, en dat is de fout die mensen maken: aan de Andamanse kant, met Phuket en Krabi, regent het vooral van mei tot oktober, terwijl aan de Golfkust, met Koh Samui, Koh Phangan en Koh Tao, de regen juist in oktober tot december valt. Je kunt dus in november prachtig weer hebben op Phuket en tegelijk regen op Koh Samui. Kies de kust bij de maand en niet andersom. Het regenseizoen is overigens geen verloren tijd: hotels zijn dan veertig tot zestig procent goedkoper en het is veel rustiger, en de regen valt meestal in buien en niet de hele dag.",
    },
  },
  {
    id: 59,
    velden: {
      link: "https://www.jordanpass.jo/",
      tags: ["ver", "woestijn", "geschiedenis", "petra"],
      notities:
        "Petra, Wadi Rum en de Dode Zee in een land dat klein genoeg is om in anderhalve week rond te komen. Maart tot mei staat hierboven en dat klopt: daarna wordt het in de woestijn te heet. KOOP DE JORDAN PASS VOOR JE VERTREKT, want daar zit het toeristenvisum bij in en dat scheelt de 40 JOD die je anders bij aankomst betaalt. De pass dekt ook Petra en meer dan veertig andere plekken, en er zijn varianten naar het aantal dagen Petra dat je wil: in 2026 rond de 70, 75 en 80 JOD voor een, twee of drie dagen. Petra alleen kost al zo'n 50 JOD voor een dag, dus de pass verdient zich bijna meteen terug. TWEE VOORWAARDEN ZIJN MAKKELIJK TE MISSEN: je moet hem online kopen voordat je aankomt - aan de grens kan het niet - en je moet minimaal drie opeenvolgende nachten in het land blijven, anders vervalt het visumvoordeel. De pass is niet te ruilen en niet terug te geven. Petra by Night zit er niet bij en kost apart ongeveer 17 JOD.",
    },
  },
  {
    id: 60,
    velden: {
      link: "https://www.dolomiti.it/",
      tags: ["bergen", "wandelen", "italie", "uitzicht"],
      notities:
        "Niet rijdend maar blijvend: een week of twee in een dal, met wandelen vanuit de deur. De klassieke bases zijn Cortina d'Ampezzo, Alta Badia, Val Gardena en Val di Fassa, en vanuit elk daarvan kom je met kabelbanen hoog zonder dat je eerst duizend meter moet klimmen - dat maakt de Dolomieten ongewoon toegankelijk voor een hooggebergte. Juli en augustus staan hierboven, en dat is ook wanneer de berghutten en de liften draaien; half september gaat alles geleidelijk dicht. IN HET HOOGSEIZOEN IS HET ER VOL EN DUUR, augustus voorop, want dan heeft heel Italie vakantie - de laatste week van juni en de eerste helft van september zijn rustiger met hetzelfde weer. Combineer het eventueel met een stuk van de Alta Via 1 of de rondwandeling om de Tre Cime, die allebei ook los in deze lijst staan. Reken op ongeveer twaalf uur rijden vanuit Nederland, of vlieg naar Venetie of Innsbruck en huur daar een auto.",
    },
  },
];

// Velden die aantoonbaar FOUT stonden en dus overschreven moeten worden. Dit
// is het spiegelbeeld van een verrijking: die vult alleen lege velden en raakt
// nooit iets aan dat al ingevuld is, juist zodat jouw invoer veilig is. Maar
// daardoor kan een fout die vanaf het begin in de standaardlijst zat ook nooit
// meer weg op een telefoon die hem al heeft.
//
// Omdat dit wél overschrijft, zitten er dezelfde twee sloten op als bij
// INGETROKKEN: de naam moet nog kloppen, en de HUIDIGE waarde moet nog precies
// de foute waarde zijn. Heb jij het veld zelf al aangepast - naar wat dan ook,
// ook naar iets anders fouts - dan blijft jouw waarde staan. Zo kan dit nooit
// een keuze van jou terugdraaien.
//
// Hou deze lijst kort. Een correctie is voor een feit dat fout is, niet voor
// een mening over hoe iets beter kan.
export const CORRECTIES_NOV_2026 = [
  {
    // Overdekt en het hele jaar open, dus "zomer" hield hem in de winter weg
    // terwijl dat juist het seizoen is waarin je er wat aan hebt. Leeg betekent
    // hier "altijd", en de notitie vertelt de rest.
    id: 28,
    naam: "Rulantica Waterpark",
    veld: "periode",
    van: "zomer",
    naar: "",
  },
  {
    // Het hele jaar open, alleen van november t/m maart beperkt tot vrijdag,
    // zaterdag en zondag. Dat is een openingstijd en geen seizoen, dus het
    // hoort in de notitie en niet in dit veld - "lente/zomer" liet hem in de
    // herfst en winter helemaal niet zien, terwijl dat juist het mooiste bos is.
    id: 21,
    naam: "Boomkroonpad",
    veld: "periode",
    van: "lente/zomer",
    naar: "",
  },
  {
    // De notitie van Rulantica verwees naar het periodeveld hierboven ("staat
    // nog op zomer"), en dat klopt niet meer zodra die correctie gedraaid is.
    // Zonder deze regel zou een verse installatie de goede tekst hebben en een
    // bestaande telefoon de verouderde - precies de scheefgroei die dit
    // bestand elders juist probeert te voorkomen.
    id: 28,
    naam: "Rulantica Waterpark",
    veld: "notities",
    van: RULANTICA_NOTITIE_V1,
    naar: RULANTICA_NOTITIE,
  },
];

// Avonturen die achteraf zijn ingetrokken. Een verse installatie krijgt ze niet
// meer omdat ze uit de bundel zijn gehaald, maar een telefoon die de bundel al
// verwerkte heeft ze nog staan - en die markering is al gezet, dus daar gebeurt
// niets meer. Vandaar deze lijst.
//
// De `naam` is een CONTROLE, geen sierletter: hij moet overeenkomen met wat er
// staat voordat er iets verdwijnt. Anders zou een id dat jij inmiddels aan iets
// anders hebt gegeven zomaar weggegooid worden.
export const INGETROKKEN = [
  // Bubble Planet: de Utrechtse editie liep t/m 6 september 2026 en is voorbij.
  // Toegevoegd omdat het een rondreizende experience is, op verzoek weer
  // ingetrokken.
  { id: 69, naam: "Bubble Planet" },
];

// Vondsten van 19 september 2026, derde ronde: uit een post met een lijstje
// betaalbare uitjes. Speeltuin De Splinter stond in dat lijstje ook, maar die
// staat er al (id 74) en is hier dus niet herhaald.
export const EXTRA_SEPT_2026_D = [
  {id: 75, naam: "Jij Bouwt de Toekomst", locatie: "Harderwijk, Gelderland", categorie: "Cultuur", type: "Tijdelijk themapark over bouw en techniek", link: "https://www.wijbouwendetoekomst.nl/", notities: "JAARLIJKS ZOMEREVENEMENT, GEEN VASTE ATTRACTIE. De editie van 2026 liep van 18 juli t/m 16 augustus en is dus voorbij; het was de derde keer en het loopt elk jaar in de zomervakantie, dus kijk in het voorjaar wanneer de volgende is. Interactief themapark op het Bouw & Infra Park, waar kinderen van ongeveer 4 tot 12 kennismaken met bouw en techniek: een echte torenkraan, een elektriciteitsfabriek, een verkeersplein, workshops over slimme techniek, een theatervoorstelling over de familie Bouwer, en het grootste riooldoolhof ter wereld. EUR 7,50 p.p. Open van 10 tot 17 uur. Vorig jaar kwamen er bijna 10.000 bezoekers, een verdubbeling, dus reken op drukte.", gedaan: false, favoriet: false, periode: "juli-aug", tags: ["kids", "buiten", "hele dag"]},
  {id: 76, naam: "De Klimtuin", locatie: "Duiven, Gelderland", categorie: "Speelpark", type: "Gratis speeltuin bij een tuincentrum", link: "https://www.intratuinduiven.nl/de-klimtuin/", notities: "GRATIS binnen- en buitenspeeltuin bij Intratuin Duiven, en naar verluidt de grootste gratis speeltuin van het land. Binnen is het thema een oude fabriek: glijbanen, een klimtoren en trampolines. De overdekte speeltuin loopt door in een buitenspeeltuin, waar grotere kinderen tot negen meter hoog kunnen klimmen. Naast de speeltuin zit restaurant De Proeftuin. Voor EUR 3,50 per kind kun je twee uur meedoen aan Tag & Run, een tikspel met een activiteitenbandje door de hele speeltuin - dat is dus wel betaald. Het overdekte deel maakt dit een goede regendagbestemming.", gedaan: false, favoriet: false, periode: "", tags: ["gratis", "kids", "binnen", "regendag", "speeltuin"]},
  {id: 77, naam: "Kids Jungle Coppelmans", locatie: "Valkenswaard, Noord-Brabant", categorie: "Speelpark", type: "Indoor speeltuin bij een tuincentrum", link: "https://www.coppelmans.nl/coppelmans-valkenswaard/kidsjungle-valkenswaard", notities: "Nieuwe overdekte speeltuin bij tuincentrum Coppelmans: klimtoestellen, touwbruggen en spannende routes door een jungledecor, met een aparte peuterzone voor de kleinsten. Daarnaast een groot springkussen en een kinderspeelhal, en er worden regelmatig workshops gehouden. In het tuincentrum zit ook een ruime Maxi Zoo dierenafdeling. LET OP: de post zet dit in een rijtje uitjes van EUR 10 of minder, maar ik heb NERGENS bevestigd gekregen of de Kids Jungle gratis is of wat hij kost - dat staat niet op hun site. Bel of mail even voor je gaat als het je om de prijs te doen is.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "binnen", "regendag", "speeltuin"]},
  {id: 78, naam: "MegaPret", locatie: "Lievelde, Gelderland", categorie: "Speelpark", type: "Familiepretpark binnen en buiten", link: "https://megapret.nl/prijzen-en-arrangementen/", notities: "Familiepark in de Achterhoek met een binnenspeeltuin, een buitenspeeltuin, een waterspeeltuin en midgetgolf. Opvallend: KINDEREN BETALEN MEER DAN VOLWASSENEN - kind (1 t/m 15 jaar) EUR 7,25, volwassene EUR 3,50. Parkeren is gratis. Dinsdag t/m zondag 9:30-17:30, MAANDAG DICHT. WaterPret gaat alleen open bij mooi weer, vanaf ongeveer 23 graden, dus ga daar niet vanuit. De Stegge 23. Omdat er ook een flink overdekt deel is, werkt dit ook op een regendag.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "binnen", "buiten", "speeltuin", "regendag"]},
  {id: 79, naam: "Hof van Eckberge", locatie: "Eibergen, Gelderland", categorie: "Speelpark", type: "Belevingspark met dierentuin", link: "https://www.hofvaneckberge.nl/openingstijden", notities: "Belevingspark van 25.000 m2 in de Achterhoek: binnenspeeltuin, buitenspeeltuin en een dierentuin waar je onder andere prairiehonden, emoes en wasberen ziet. Verder bowlingbanen, midgetgolf en lasergamen, en een aparte rustruimte met een ontspanningsbed en rustige muziek. Ook hier betalen KINDEREN MEER DAN VOLWASSENEN: kind EUR 8,50, volwassene EUR 6,50, en onder de 90 cm gratis. De entree geldt voor het hele park inclusief de dierentuin. AAN DE KASSA BETAAL JE EUR 1 P.P. MEER dan online, dus koop vooraf. In schoolvakanties dagelijks 10-18 uur; daarbuiten wo t/m vr 10-18 en in het weekend 10-19 uur.", gedaan: false, favoriet: false, periode: "", tags: ["kids", "dieren", "binnen", "buiten", "speeltuin"]},
];

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
  // periode bewust leeg: het hele jaar open, in de winter alleen vr/za/zo.
  // Dat is een openingstijd en geen seizoen. Zie CORRECTIES_NOV_2026.
  { id: 21, naam: "Boomkroonpad", locatie: "Drenthe", categorie: "Natuur", type: "Natuur", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 22, naam: "Padel", locatie: "Nederland", categorie: "Sport", type: "Racketsport", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 23, naam: "Skien", locatie: "Alpen", categorie: "Sport", type: "Wintersport", link: null, notities: "", status: "favoriet", periode: "dec-maart", tags: [] },
  { id: 24, naam: "Mountainbiken", locatie: "Nederland/Europa", categorie: "Sport", type: "Fietssport", link: null, notities: "", status: "wil doen", periode: "", tags: [] },
  { id: 25, naam: "Adventure Valley", locatie: "Europa", categorie: "Pretpark", type: "Pretpark", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","hele dag"] },
  { id: 26, naam: "Efteling", locatie: "Kaatsheuvel, Noord-Brabant", categorie: "Pretpark", type: "Pretpark", link: null, notities: "", status: "gedaan", periode: "", tags: ["kids","hele dag"] },
  { id: 27, naam: "Phantasialand", locatie: "Bruhl, Duitsland", categorie: "Pretpark", type: "Pretpark", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","hele dag"] },
  // periode bewust leeg: overdekt en het hele jaar open, dus geen seizoen.
  // Zie CORRECTIES_NOV_2026.
  { id: 28, naam: "Rulantica Waterpark", locatie: "Rust, Duitsland", categorie: "Pretpark", type: "Waterpark", link: null, notities: "", status: "wil doen", periode: "", tags: ["kids","zwemmen","binnen"] },
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
  ...EXTRA_SEPT_2026,
  ...EXTRA_SEPT_2026_B,
  ...EXTRA_SEPT_2026_C,
  ...EXTRA_SEPT_2026_D,
  ...EXTRA_SEPT_2026_E,
  ...EXTRA_SEPT_2026_F,
  ...EXTRA_NOV_2026_G,
  ...EXTRA_NOV_2026_H,
];
