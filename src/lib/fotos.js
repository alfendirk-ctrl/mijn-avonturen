// Foto's (bijv. screenshots uit Instagram) horen bij een avontuur.
//
// Ze gaan in IndexedDB en niet in localStorage: localStorage heeft maar zo'n
// 5 MB voor de hele app, en dat is na een handjevol screenshots vol. IndexedDB
// heeft die beperking niet en kan met blobs overweg, dus er hoeft niets naar
// base64 omgezet te worden.

const DB_NAAM = "avonturen-fotos";
const WINKEL = "fotos";

function openDb() {
  return new Promise((klaar, mis) => {
    const verzoek = indexedDB.open(DB_NAAM, 1);
    verzoek.onupgradeneeded = () => {
      const db = verzoek.result;
      if (!db.objectStoreNames.contains(WINKEL)) db.createObjectStore(WINKEL);
    };
    verzoek.onsuccess = () => klaar(verzoek.result);
    verzoek.onerror = () => mis(verzoek.error);
  });
}

// Alle bewerkingen falen stil: een ontbrekende foto mag de app nooit breken.
async function metWinkel(modus, werk) {
  try {
    const db = await openDb();
    return await new Promise((klaar, mis) => {
      const t = db.transaction(WINKEL, modus);
      const uitkomst = werk(t.objectStore(WINKEL));
      t.oncomplete = () => klaar(uitkomst?.result ?? null);
      t.onerror = () => mis(t.error);
      t.onabort = () => mis(t.error);
    });
  } catch {
    return null;
  }
}

export const bewaarFoto = (id, blob) =>
  metWinkel("readwrite", (w) => w.put(blob, String(id)));

export const haalFoto = (id) =>
  metWinkel("readonly", (w) => w.get(String(id)));

export const verwijderFoto = (id) =>
  metWinkel("readwrite", (w) => w.delete(String(id)));

// Verkleint en comprimeert een gekozen afbeelding. Een schermafdruk van een
// telefoon is al gauw 2–3 MB; zo blijft er ongeveer 100–200 kB over, wat ruim
// genoeg is om scherp te tonen.
export async function verkleinAfbeelding(bestand, maxZijde = 900, kwaliteit = 0.72) {
  // "from-image" respecteert de draairichting uit de foto zelf, anders komen
  // liggende telefoonfoto's op hun kant terecht.
  const plaatje = await createImageBitmap(bestand, {
    imageOrientation: "from-image",
  });
  const schaal = Math.min(1, maxZijde / Math.max(plaatje.width, plaatje.height));
  const breedte = Math.max(1, Math.round(plaatje.width * schaal));
  const hoogte = Math.max(1, Math.round(plaatje.height * schaal));

  const doek = document.createElement("canvas");
  doek.width = breedte;
  doek.height = hoogte;
  doek.getContext("2d").drawImage(plaatje, 0, 0, breedte, hoogte);
  plaatje.close?.();

  return new Promise((klaar) =>
    doek.toBlob((blob) => klaar(blob || bestand), "image/jpeg", kwaliteit),
  );
}
