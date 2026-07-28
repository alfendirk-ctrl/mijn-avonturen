import { useMemo, useState } from "react";
import { AFSTANDEN, huidigeMaand, pastInMaand } from "../lib/afleiden.js";
import { SOORTEN, lc } from "../data/seed.js";
import ActivityCard from "../components/ActivityCard.jsx";
import WishCard from "../components/WishCard.jsx";

// Eén lijstweergave voor alle drie de soorten. Uitjes tonen we compact in een
// raster; hikes en reizen zijn "bewaard voor later" en krijgen rijkere kaarten,
// gegroepeerd op afstand (Nederland → buurlanden → Europa → ver weg).
export default function LijstView({
  soort,
  items,
  catNames,
  catMeta,
  counts,
  onOpen,
  onToggleDone,
  onToggleFav,
  onAdd,
  onOpenSettings,
}) {
  const [zoek, setZoek] = useState("");
  const [categorie, setCategorie] = useState("Alle");
  const [alleenOpen, setAlleenOpen] = useState(false);
  const [alleenFav, setAlleenFav] = useState(false);
  const [alleenNu, setAlleenNu] = useState(false);

  const meta = SOORTEN[soort];
  const rijk = soort !== "uitje";
  const maand = huidigeMaand();

  const zichtbaar = useMemo(() => {
    const q = lc(zoek);
    return items
      .filter((a) => {
        if (categorie !== "Alle" && a.categorie !== categorie) return false;
        if (alleenOpen && a.gedaan) return false;
        if (alleenFav && !a.favoriet) return false;
        if (alleenNu && !pastInMaand(a.maanden, maand)) return false;
        if (!q) return true;
        return (
          lc(a.naam).includes(q) ||
          lc(a.locatie).includes(q) ||
          lc(a.type).includes(q) ||
          lc(a.notities).includes(q)
        );
      })
      .sort((a, b) => {
        if (a.gedaan !== b.gedaan) return a.gedaan ? 1 : -1;
        if (a.favoriet !== b.favoriet) return a.favoriet ? -1 : 1;
        return a.naam.localeCompare(b.naam);
      });
  }, [items, zoek, categorie, alleenOpen, alleenFav, alleenNu, maand]);

  // Voor hikes/reizen: groepeer op afstand, in oplopende volgorde.
  const groepen = useMemo(() => {
    if (!rijk) return null;
    const perAfstand = {};
    zichtbaar.forEach((a) => {
      (perAfstand[a.afstand] ||= []).push(a);
    });
    return Object.entries(perAfstand).sort(
      ([a], [b]) => AFSTANDEN[a].volgorde - AFSTANDEN[b].volgorde,
    );
  }, [zichtbaar, rijk]);

  const kaart = (a) =>
    rijk ? (
      <WishCard
        key={a.id}
        item={a}
        cat={catMeta(a.categorie)}
        onClick={() => onOpen(a)}
        onToggleDone={() => onToggleDone(a)}
        onToggleFav={() => onToggleFav(a)}
      />
    ) : (
      <ActivityCard
        key={a.id}
        activity={a}
        cat={catMeta(a.categorie)}
        onClick={() => onOpen(a)}
        onToggleDone={() => onToggleDone(a)}
      />
    );

  const gedaanAantal = items.filter((a) => a.gedaan).length;

  return (
    <div className="lijst">
      <div className="bar">
        <div className="srch">
          <span className="srch-ico">⌕</span>
          <input
            placeholder={`Zoek in ${meta.meervoud}…`}
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
          />
          {zoek && (
            <button className="srch-clr" onClick={() => setZoek("")}>
              ✕
            </button>
          )}
        </div>
        <button className="btn" onClick={onOpenSettings}>
          ⊞ <span>Categorieën</span>
        </button>
        <button className="btn acc" onClick={() => onAdd(soort)}>
          + <span>Toevoegen</span>
        </button>
      </div>

      {catNames.length > 1 && (
        <div className="cats">
          <div className="cats-row">
            <button
              className={`chip${categorie === "Alle" ? " on" : ""}`}
              style={
                categorie === "Alle"
                  ? { background: "#6366F1", borderColor: "#6366F1" }
                  : undefined
              }
              onClick={() => setCategorie("Alle")}
            >
              Alle <span className="chip-count">{items.length}</span>
            </button>
            {catNames.map((naam) => {
              const cm = catMeta(naam);
              const actief = categorie === naam;
              return (
                <button
                  key={naam}
                  className={`chip${actief ? " on" : ""}`}
                  style={
                    actief
                      ? { background: cm.kleur, borderColor: cm.kleur }
                      : undefined
                  }
                  onClick={() => setCategorie(naam)}
                >
                  {cm.emoji} {naam}{" "}
                  <span className="chip-count">{counts[naam] || 0}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="filters">
        <button
          className={`pil${alleenOpen ? " on" : ""}`}
          onClick={() => setAlleenOpen((v) => !v)}
        >
          Nog te doen
        </button>
        <button
          className={`pil${alleenFav ? " on" : ""}`}
          onClick={() => setAlleenFav((v) => !v)}
        >
          ★ Favoriet
        </button>
        <button
          className={`pil${alleenNu ? " on" : ""}`}
          onClick={() => setAlleenNu((v) => !v)}
        >
          Kan nu
        </button>
      </div>

      <div className="teller">
        {zichtbaar.length}{" "}
        {zichtbaar.length === 1 ? meta.enkelvoud : meta.meervoud}
        {gedaanAantal > 0 && ` · ${gedaanAantal} gedaan`}
      </div>

      {zichtbaar.length === 0 ? (
        <div className="empty los">
          <span className="empty-ico">{meta.emoji}</span>
          <div className="empty-h">
            {items.length === 0 ? `Nog geen ${meta.meervoud}` : "Niets gevonden"}
          </div>
          <div className="empty-p">
            {items.length === 0
              ? `Voeg je eerste ${meta.enkelvoud} toe`
              : "Pas je zoekopdracht of filters aan"}
          </div>
        </div>
      ) : rijk ? (
        groepen.map(([afstand, lijst]) => (
          <div className="hgroup" key={afstand}>
            <div className="hgroup-h">
              <div className="hgroup-t">
                {AFSTANDEN[afstand].emoji} {AFSTANDEN[afstand].label}
              </div>
              <div className="hgroup-c">{lijst.length}</div>
              <div className="hgroup-line" />
            </div>
            <div className="hgrid">{lijst.map(kaart)}</div>
          </div>
        ))
      ) : (
        <div className="grid">{zichtbaar.map(kaart)}</div>
      )}
    </div>
  );
}
