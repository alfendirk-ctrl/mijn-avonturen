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
  ...EXTRA_SEPT_2026,
  ...EXTRA_SEPT_2026_B,
  ...EXTRA_SEPT_2026_C,
  ...EXTRA_SEPT_2026_D,
];
