// Delen met z'n tweeën via een geheime ruimte-link.
//
// Opzet: local-first. localStorage blijft de werkkopie, dus de app werkt
// volledig zonder internet (belangrijk onderweg). Zodra er verbinding is,
// wordt er samengevoegd: bij een conflict wint de versie die het laatst is
// bijgewerkt. De ruimte-id is het geheim — wie die niet heeft, ziet niets.

const URL_BASIS = "https://lnldkebuctpfxlccspga.supabase.co";

// Publieke sleutel van het Supabase-project. Deze mag in de app staan: de
// toegang tot gegevens loopt via de geheime ruimte-id, niet via deze sleutel.
const PUBLIEKE_SLEUTEL = "";

export const SLEUTEL_RUIMTE = "av_ruimte";
export const SLEUTEL_TOMBS = "av_verwijderd";

// Is delen geconfigureerd? Zonder sleutel draait de app gewoon lokaal door.
export const syncBeschikbaar = () =>
  /^(eyJ|sb_publishable_)/.test(PUBLIEKE_SLEUTEL);

const kop = (ruimte, extra = {}) => ({
  apikey: PUBLIEKE_SLEUTEL,
  Authorization: `Bearer ${PUBLIEKE_SLEUTEL}`,
  "x-ruimte": ruimte,
  "Content-Type": "application/json",
  ...extra,
});

export const maakRuimteId = () =>
  crypto.randomUUID?.() ??
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

export const deelLink = (ruimte) =>
  `${location.origin}${location.pathname}#ruimte=${ruimte}`;

// Leest een ruimte-id uit de URL (#ruimte=…) en haalt 'm daarna weg, zodat de
// geheime link niet in de adresbalk blijft staan.
export function ruimteUitUrl() {
  const gevonden = /[#&]ruimte=([0-9a-f-]{36})/i.exec(location.hash);
  if (!gevonden) return null;
  history.replaceState(null, "", location.pathname + location.search);
  return gevonden[1].toLowerCase();
}

const ITEM_VELDEN = [
  "naam", "locatie", "categorie", "type", "link", "notities",
  "gedaan", "favoriet", "periode",
];

// ---- Samenvoegen (pure functies, los te testen) -----------------------------

// Voegt externe rijen samen met de lokale lijst. Nieuwer wint; een rij met
// verwijderd=true haalt het lokale item weg.
export function voegItemsSamen(lokaal, extern) {
  const perId = new Map(lokaal.map((a) => [String(a.id), a]));
  const nieuweTombs = {};

  for (const rij of extern) {
    const sleutel = String(rij.id);
    const hier = perId.get(sleutel);
    const daar = Number(rij.bijgewerkt) || 0;
    const hierTijd = Number(hier?.bijgewerkt) || 0;
    if (hier && daar < hierTijd) continue;

    if (rij.verwijderd) {
      perId.delete(sleutel);
      nieuweTombs[sleutel] = daar;
    } else {
      const schoon = { id: Number(rij.id), bijgewerkt: daar };
      for (const v of ITEM_VELDEN) schoon[v] = rij[v] ?? (v === "link" ? null : "");
      schoon.gedaan = !!rij.gedaan;
      schoon.favoriet = !!rij.favoriet;
      perId.set(sleutel, schoon);
    }
  }
  return { items: [...perId.values()], tombs: nieuweTombs };
}

// Zelfde idee voor categorieën, die als object naam -> gegevens zijn opgeslagen.
export function voegCategorieenSamen(lokaal, extern) {
  const uit = { ...lokaal };
  for (const rij of extern) {
    const hier = uit[rij.naam];
    const daar = Number(rij.bijgewerkt) || 0;
    if (hier && daar < (Number(hier.bijgewerkt) || 0)) continue;
    if (rij.verwijderd) delete uit[rij.naam];
    else
      uit[rij.naam] = {
        emoji: rij.emoji || "✦",
        kleur: rij.kleur || "#6366F1",
        gradient: rij.gradient || "",
        soort: rij.soort || "uitje",
        bijgewerkt: daar,
      };
  }
  return uit;
}

// ---- Netwerk ---------------------------------------------------------------

async function verstuur(pad, opties) {
  const antwoord = await fetch(`${URL_BASIS}/rest/v1/${pad}`, opties);
  if (!antwoord.ok) {
    throw new Error(`${antwoord.status} ${await antwoord.text()}`);
  }
  return antwoord;
}

async function haalTabel(tabel, ruimte) {
  const antwoord = await verstuur(`${tabel}?ruimte_id=eq.${ruimte}&select=*`, {
    headers: kop(ruimte),
  });
  return antwoord.json();
}

async function zetWeg(tabel, ruimte, rijen) {
  if (!rijen.length) return;
  await verstuur(tabel, {
    method: "POST",
    headers: kop(ruimte, {
      Prefer: "resolution=merge-duplicates,return=minimal",
    }),
    body: JSON.stringify(rijen),
  });
}

// Haalt op, voegt samen, en zet het samengevoegde resultaat terug. Door pas na
// het samenvoegen te versturen, kan een oudere versie nooit een nieuwere
// overschrijven.
export async function synchroniseer({ ruimte, items, categorieen, tombs }) {
  const [externeItems, externeCats] = await Promise.all([
    haalTabel("item", ruimte),
    haalTabel("categorie", ruimte),
  ]);

  const samen = voegItemsSamen(items, externeItems);
  const cats = voegCategorieenSamen(categorieen, externeCats);
  const alleTombs = { ...tombs, ...samen.tombs };

  const nu = Date.now();
  const itemRijen = samen.items.map((a) => {
    const rij = { ruimte_id: ruimte, id: a.id, verwijderd: false, bijgewerkt: a.bijgewerkt || nu };
    for (const v of ITEM_VELDEN) rij[v] = a[v] ?? (v === "link" ? null : "");
    return rij;
  });
  const tombRijen = Object.entries(alleTombs).map(([id, tijd]) => ({
    ruimte_id: ruimte,
    id: Number(id),
    verwijderd: true,
    bijgewerkt: tijd || nu,
  }));
  const catRijen = Object.entries(cats).map(([naam, meta]) => ({
    ruimte_id: ruimte,
    naam,
    emoji: meta.emoji,
    kleur: meta.kleur,
    gradient: meta.gradient,
    soort: meta.soort,
    verwijderd: false,
    bijgewerkt: meta.bijgewerkt || nu,
  }));

  await Promise.all([
    zetWeg("item", ruimte, [...itemRijen, ...tombRijen]),
    zetWeg("categorie", ruimte, catRijen),
  ]);

  return { items: samen.items, categorieen: cats, tombs: alleTombs };
}
