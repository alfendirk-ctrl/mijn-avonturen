import { useMemo, useState } from "react";
import { AFSTANDEN, huidigeMaand, pastInMaand } from "../lib/afleiden.js";
import AfstandSlider, { AFSTAND_STAPPEN } from "../components/AfstandSlider.jsx";
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
  rijInfo,
}) {
  const [zoek, setZoek] = useState("");
  const [categorie, setCategorie] = useState("Alle");
  const [alleenOpen, setAlleenOpen] = useState(false);
  const [alleenFav, setAlleenFav] = useState(false);
  const [alleenNu, setAlleenNu] = useState(false);
  const [bereik, setBereik] = useState(AFSTAND_STAPPEN.length - 1);
  // Gekozen tags, kleine letters. Meerdere tags betekent "alle van deze",
  // niet "een van deze": zo kun je juist naar de kruising zoeken — het is
  // tenslotte bedoeld voor dingen die twee dingen tegelijk zijn.
  const [tags, setTags] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Hoeveel filters staan er aan? Bepaalt het bolletje op de knop, zodat je
  // ook met het paneel dicht ziet dat je lijst geknepen is — anders zoek je je
  // suf naar een avontuur dat er wel is maar wegvalt.
  const actieveFilters =
    (alleenOpen ? 1 : 0) +
    (alleenFav ? 1 : 0) +
    (alleenNu ? 1 : 0) +
    tags.length +
    (bereik < AFSTAND_STAPPEN.length - 1 ? 1 : 0);

  const wisFilters = () => {
    setAlleenOpen(false);
    setAlleenFav(false);
    setAlleenNu(false);
    setTags([]);
    setBereik(AFSTAND_STAPPEN.length - 1);
  };

  const wisselTag = (tag) =>
    setTags((huidig) =>
      huidig.includes(tag) ? huidig.filter((t) => t !== tag) : [...huidig, tag],
    );

  // Welke tags komen in deze lijst voor, en hoe vaak.
  const tagTelling = useMemo(() => {
    const m = new Map();
    items.forEach((a) =>
      (a.tags || []).forEach((t) => {
        const sleutel = t.toLowerCase();
        const vorig = m.get(sleutel);
        m.set(sleutel, { tag: vorig?.tag ?? t, aantal: (vorig?.aantal ?? 0) + 1 });
      }),
    );
    return [...m.entries()]
      .map(([sleutel, v]) => ({ sleutel, ...v }))
      .sort((a, b) => b.aantal - a.aantal || a.tag.localeCompare(b.tag));
  }, [items]);

  const meta = SOORTEN[soort];
  const rijk = soort !== "uitje";
  const maand = huidigeMaand();

  // De schuif heeft alleen zin als deze lijst meerdere afstanden bevat.
  const afstandenAanwezig = useMemo(
    () => new Set(items.map((a) => a.afstand)).size,
    [items],
  );

  const zichtbaar = useMemo(() => {
    const q = lc(zoek);
    return items
      .filter((a) => {
        if (categorie !== "Alle" && a.categorie !== categorie) return false;
        if (tags.length) {
          const eigen = (a.tags || []).map((t) => t.toLowerCase());
          if (!tags.every((t) => eigen.includes(t))) return false;
        }
        if (alleenOpen && a.gedaan) return false;
        if (alleenFav && !a.favoriet) return false;
        if (alleenNu && !pastInMaand(a.maanden, maand)) return false;
        if (AFSTANDEN[a.afstand].volgorde > bereik) return false;
        if (!q) return true;
        return (
          lc(a.naam).includes(q) ||
          lc(a.locatie).includes(q) ||
          lc(a.type).includes(q) ||
          lc(a.notities).includes(q) ||
          (a.tags || []).some((t) => lc(t).includes(q))
        );
      })
      .sort((a, b) => {
        if (a.gedaan !== b.gedaan) return a.gedaan ? 1 : -1;
        if (a.favoriet !== b.favoriet) return a.favoriet ? -1 : 1;
        return a.naam.localeCompare(b.naam);
      });
  }, [items, zoek, categorie, tags, alleenOpen, alleenFav, alleenNu, bereik, maand]);

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
        rit={rijInfo?.(a.locatie)}
      />
    ) : (
      <ActivityCard
        key={a.id}
        activity={a}
        cat={catMeta(a.categorie)}
        onClick={() => onOpen(a)}
        onToggleDone={() => onToggleDone(a)}
        onToggleFav={() => onToggleFav(a)}
        rit={rijInfo?.(a.locatie)}
      />
    );

  const gedaanAantal = items.filter((a) => a.gedaan).length;

  // Voor de lege staat telt de categoriechip óók als knijpend filter, ook al
  // zit hij niet in het filterpaneel: anders staat er "0 filters verbergen ze"
  // terwijl je op één categorie hebt geklikt die niets oplevert.
  const knijpers = actieveFilters + (categorie !== "Alle" ? 1 : 0);

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
        {/* Onder 520px valt het woord weg en blijft alleen het teken over.
            Een ⊞ of een + zegt een schermlezer niets, dus het label staat er
            hoe dan ook - zichtbaar of niet. */}
        <button className="btn" onClick={onOpenSettings} aria-label="Instellingen openen">
          ⚙ <span>Instellingen</span>
        </button>
        <button
          className="btn acc"
          onClick={() => onAdd(soort)}
          aria-label={`${meta.enkelvoud.charAt(0).toUpperCase()}${meta.enkelvoud.slice(1)} toevoegen`}
        >
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
                  ? { background: "var(--accent)", borderColor: "var(--accent)" }
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

      {/* Eén knop in plaats van drie rijen filters. Tags, status en afstand
          stonden alle drie uitgeklapt boven de lijst; op een telefoon was dat
          zeshonderd pixels bediening voordat je het eerste avontuur zag, en de
          tagbalk groeide mee met elke tag die erbij kwam. */}
      <div className="filterbalk">
        <button
          className={`filterknop${filtersOpen ? " open" : ""}${actieveFilters ? " actief" : ""}`}
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
        >
          Filters
          {actieveFilters > 0 && <span className="filter-bolletje">{actieveFilters}</span>}
          <span className="filter-pijl">{filtersOpen ? "▲" : "▼"}</span>
        </button>
        {actieveFilters > 0 && (
          <button className="filterknop wis" onClick={wisFilters}>
            Wis alles
          </button>
        )}
        <span className="filter-telling">
          {zichtbaar.length}{" "}
          {zichtbaar.length === 1 ? meta.enkelvoud : meta.meervoud}
          {gedaanAantal > 0 && ` · ${gedaanAantal} gedaan`}
        </span>
      </div>

      {filtersOpen && (
        <div className="filterpaneel">
          <div className="filtergroep">
            <div className="filterkop">Status</div>
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
          </div>

          {tagTelling.length > 0 && (
            <div className="filtergroep">
              <div className="filterkop">Tags</div>
              <div className="tag-balk">
                {tagTelling.map(({ sleutel, tag, aantal }) => (
                  <button
                    key={sleutel}
                    className={`tag-knop${tags.includes(sleutel) ? " on" : ""}`}
                    onClick={() => wisselTag(sleutel)}
                  >
                    {tag} <span className="chip-count">{aantal}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {afstandenAanwezig > 1 && (
            <div className="filtergroep">
              <AfstandSlider
                waarde={bereik}
                onChange={setBereik}
                aantal={zichtbaar.length}
              />
            </div>
          )}
        </div>
      )}

      {zichtbaar.length === 0 ? (
        /* Drie verschillende situaties zagen er hetzelfde uit: je hebt nog
           niets, je zoekterm levert niets op, of je filters knijpen de lijst
           dicht. "Pas je zoekopdracht of filters aan" was een gok naar allebei
           terwijl de app precies weet welke het is - en in het laatste geval is
           er ook iets aan te klikken in plaats van alleen advies. */
        <div className="empty los">
          <span className="empty-ico" aria-hidden="true">{meta.emoji}</span>
          <h2 className="empty-h">
            {items.length === 0
              ? `Nog geen ${meta.meervoud}`
              : zoek.trim()
                ? `Niets met "${zoek.trim()}"`
                : "Alles weggefilterd"}
          </h2>
          <div className="empty-p">
            {items.length === 0
              ? `Voeg je eerste ${meta.enkelvoud} toe met de knop hierboven.`
              : zoek.trim()
                ? `Geen ${meta.meervoud} waarin dat voorkomt${knijpers ? ", en er staan ook nog filters aan" : ""}.`
                : `Je ${meta.meervoud} staan er nog; ${knijpers === 1 ? "één filter verbergt" : `${knijpers} filters verbergen`} ze.`}
          </div>
          {zoek.trim() && (
            <button className="btn empty-knop" onClick={() => setZoek("")}>
              Wis de zoekopdracht
            </button>
          )}
          {!zoek.trim() && knijpers > 0 && (
            <button
              className="btn empty-knop"
              onClick={() => {
                wisFilters();
                setCategorie("Alle");
              }}
            >
              Zet de filters uit
            </button>
          )}
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
