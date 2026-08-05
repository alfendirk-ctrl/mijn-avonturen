// Service worker: maakt de app offline bruikbaar (handig onderweg, in de
// bergen, zonder bereik).
//
// Bewust "netwerk eerst": online krijg je altijd de nieuwste versie, en pas als
// het netwerk niet lukt komt de cache eraan te pas. Dat is iets trager dan
// cache-first, maar voorkomt het ergste scenario — een oude versie die blijft
// hangen en een leeg scherm oplevert.

const VERSIE = "v2";
const CACHE = `avonturen-${VERSIE}`;
const BASIS = "/mijn-avonturen/";

// De bestanden die de app nodig heeft om te starten.
const SCHIL = [
  BASIS,
  `${BASIS}index.html`,
  `${BASIS}assets/main.js`,
  `${BASIS}assets/main.css`,
  `${BASIS}manifest.json`,
  `${BASIS}icons/icon-192.png`,
  `${BASIS}icons/icon-512.png`,
];

// Lettertypen veranderen nooit; die mogen wel uit de cache komen.
const LETTERTYPE_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      // Losse verzoeken: één ontbrekend bestand mag de installatie niet slopen.
      .then((cache) =>
        Promise.all(SCHIL.map((pad) => cache.add(pad).catch(() => null))),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((namen) =>
        Promise.all(
          namen.filter((n) => n !== CACHE).map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const verzoek = e.request;
  if (verzoek.method !== "GET") return;

  const url = new URL(verzoek.url);

  // Lettertypen: cache eerst, daarna pas het netwerk.
  if (LETTERTYPE_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(verzoek).then(
        (uitCache) =>
          uitCache ||
          fetch(verzoek).then((antwoord) => {
            const kopie = antwoord.clone();
            caches.open(CACHE).then((c) => c.put(verzoek, kopie));
            return antwoord;
          }),
      ),
    );
    return;
  }

  // Alles van andere servers (zoals de gedeelde database) laten we met rust.
  if (url.origin !== self.location.origin) return;

  // "no-cache" laat de browser wél zijn eigen kopie gebruiken, maar pas nadat
  // de server bevestigt dat die nog klopt. Zonder dit kan een oude versie
  // blijven hangen terwijl er allang een nieuwe uitstaat.
  const versVerzoek = new Request(verzoek.url, {
    cache: "no-cache",
    credentials: "same-origin",
    headers: verzoek.headers,
    mode: verzoek.mode === "navigate" ? "same-origin" : verzoek.mode,
    redirect: "follow",
  });

  e.respondWith(
    fetch(versVerzoek)
      .then((antwoord) => {
        if (antwoord.ok) {
          const kopie = antwoord.clone();
          caches.open(CACHE).then((c) => c.put(verzoek, kopie));
        }
        return antwoord;
      })
      .catch(async () => {
        const uitCache = await caches.match(verzoek);
        if (uitCache) return uitCache;
        // Zonder verbinding een pagina openen: geef de opgeslagen app terug.
        if (verzoek.mode === "navigate") {
          return (
            (await caches.match(`${BASIS}index.html`)) ||
            (await caches.match(BASIS)) ||
            Response.error()
          );
        }
        return Response.error();
      }),
  );
});
