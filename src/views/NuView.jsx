import { useMemo, useState } from "react";
import {
  AFSTANDEN,
  huidigeMaand,
  MAAND_LABEL,
  pastInMaand,
  themaVanMaand,
} from "../lib/afleiden.js";
import { SOORTEN } from "../data/seed.js";
import ActivityCard from "../components/ActivityCard.jsx";
import AfstandSlider from "../components/AfstandSlider.jsx";

// Hoeveel suggesties we tonen voordat we naar de volledige lijst verwijzen.
const MAX_SUGGESTIES = 8;

// Hoeveel tagknoppen er hoogstens onder de schuif staan. Dit is het
// startscherm: elke rij knoppen erbij duwt het eerste avontuur verder naar
// beneden, en de tagbalk groeit mee met elke tag die de gebruiker verzint.
// Zes is ongeveer één regel op een telefoon. Een gekozen tag staat er altijd
// bij, ook als hij niet in de top zes valt - anders verdwijnt je eigen filter
// uit beeld terwijl hij wel werkt.
const MAX_TAGKNOPPEN = 6;

// Waar "Verras me" uit put. Standaard alleen uitjes: dat zijn de dingen die je
// zomaar kunt doen. Hikes en reizen vragen planning en horen in hun eigen tab.
const BRONNEN = {
  uitje: { label: "Uitjes", soorten: ["uitje"] },
  alles: { label: "Alles", soorten: ["uitje", "hike", "reis"] },
};

// "Wat doen we?" — het startscherm. Laat alleen zien wat nú kan: in dit
// seizoen, binnen het gekozen bereik, en nog niet gedaan.
export default function NuView({ items, catMeta, onOpen, onToggleDone, onToggleFav, onGaNaar }) {
  const [bereik, setBereik] = useState(0); // 0 = alleen Nederland
  const [bron, setBron] = useState("uitje");
  // Gekozen tags, kleine letters. Meerdere tags betekent "alle van deze",
  // net als in de lijst: het punt van tags is de overlap vinden.
  const [tags, setTags] = useState([]);
  const [verrast, setVerrast] = useState(null);
  const [zichtbaar, setZichtbaar] = useState(false);

  const maand = huidigeMaand();
  const thema = themaVanMaand(maand);

  // Alles wat nú kan, nog zonder tagfilter. Hieruit komen ook de tagknoppen:
  // een tag die niets zou opleveren hoort er niet te staan.
  const basis = useMemo(() => {
    const soorten = BRONNEN[bron].soorten;
    return items.filter(
      (a) =>
        !a.gedaan &&
        soorten.includes(a.soort) &&
        pastInMaand(a.maanden, maand) &&
        AFSTANDEN[a.afstand].volgorde <= bereik,
    );
  }, [items, bron, bereik, maand]);

  const tagTelling = useMemo(() => {
    const telling = new Map();
    basis.forEach((a) =>
      (a.tags || []).forEach((t) => {
        const sleutel = t.toLowerCase();
        const vorig = telling.get(sleutel);
        telling.set(sleutel, {
          sleutel,
          tag: vorig?.tag ?? t,
          aantal: (vorig?.aantal ?? 0) + 1,
        });
      }),
    );
    const alle = [...telling.values()].sort(
      (a, b) => b.aantal - a.aantal || a.tag.localeCompare(b.tag),
    );
    const top = alle.slice(0, MAX_TAGKNOPPEN);
    const gekozen = alle.filter(
      (t) => tags.includes(t.sleutel) && !top.includes(t),
    );
    return [...top, ...gekozen];
  }, [basis, tags]);

  const passend = useMemo(() => {
    return basis
      .filter((a) => {
        if (!tags.length) return true;
        const eigen = (a.tags || []).map((t) => t.toLowerCase());
        return tags.every((t) => eigen.includes(t));
      })
      .sort((a, b) => {
        // Favorieten eerst, dan dingen die júist nu in het seizoen zijn.
        if (a.favoriet !== b.favoriet) return a.favoriet ? -1 : 1;
        const aSeizoen = a.maanden.length > 0;
        const bSeizoen = b.maanden.length > 0;
        if (aSeizoen !== bSeizoen) return aSeizoen ? -1 : 1;
        return a.naam.localeCompare(b.naam);
      });
  }, [basis, tags]);

  const verrasMe = () => {
    if (!passend.length) return;
    // Nogmaals dobbelen en hetzelfde uitje terugkrijgen leest als een kapotte
    // knop. Zolang er iets anders te kiezen valt, sluiten we de huidige uit.
    const keuze =
      passend.length > 1 && verrast
        ? passend.filter((a) => a.id !== verrast.id)
        : passend;
    setZichtbaar(false);
    setTimeout(() => {
      setVerrast(keuze[Math.floor(Math.random() * keuze.length)]);
      setZichtbaar(true);
    }, 40);
  };

  const wissel = (zetter) => (waarde) => {
    zetter(waarde);
    setVerrast(null);
  };

  const wisselTag = (sleutel) => {
    setTags((huidig) =>
      huidig.includes(sleutel)
        ? huidig.filter((t) => t !== sleutel)
        : [...huidig, sleutel],
    );
    setVerrast(null);
  };

  return (
    <div className="nu">
      <div className="nu-kop">
        <div className="nu-watermerk" aria-hidden="true">
          {MAAND_LABEL[maand]}
        </div>
        <div className="nu-seizoen">
          {thema.emoji} {thema.naam} — {thema.stemming}
        </div>
        <h2 className="nu-eye">Wat doen we?</h2>
        <div className="nu-lead">
          {items.length === 0
            ? "Nog niets om uit te kiezen."
            : passend.length === 0
              ? "Niets gevonden binnen dit bereik."
              : `${passend.length} ${passend.length === 1 ? "idee past" : "ideeën passen"} bij ${MAAND_LABEL[maand]}.`}
        </div>
      </div>

      <div className="nu-bar">
        <button className="vbtn" onClick={verrasMe} disabled={!passend.length}>
          🎲 Verras me
        </button>
        <div className="hfilter">
          {Object.entries(BRONNEN).map(([key, b]) => (
            <button
              key={key}
              className={bron === key ? "on" : ""}
              onClick={() => wissel(setBron)(key)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <AfstandSlider
        waarde={bereik}
        onChange={wissel(setBereik)}
        aantal={passend.length}
      />

      {tagTelling.length > 0 && (
        <div className="nu-tags">
          <span className="nu-tags-lbl">Met</span>
          {tagTelling.map(({ sleutel, tag, aantal }) => (
            <button
              key={sleutel}
              className={`tag-knop${tags.includes(sleutel) ? " on" : ""}`}
              aria-pressed={tags.includes(sleutel)}
              onClick={() => wisselTag(sleutel)}
            >
              {tag} <span className="chip-count">{aantal}</span>
            </button>
          ))}
          {tags.length > 0 && (
            <button className="tag-knop wis" onClick={() => { setTags([]); setVerrast(null); }}>
              Wis
            </button>
          )}
        </div>
      )}

      {verrast && (
        <div className="vcard">
          {/* Was een kale div met een onClick: met een toetsenbord of
              schermlezer was de uitkomst van de dobbelsteen niet te openen,
              terwijl elke gewone kaart dat wel is. */}
          <div
            className={`vcard-in${zichtbaar ? " on" : ""}`}
            onClick={() => onOpen(verrast)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && onOpen(verrast)
            }
          >
            <div className="vcard-eye">Doe dit</div>
            <div className="vcard-naam">{verrast.naam}</div>
            <div className="vcard-meta">
              {catMeta(verrast.categorie).emoji} {verrast.categorie} ·{" "}
              {verrast.locatie}
              {verrast.periode && ` · 🗓 ${verrast.periode}`}
            </div>
          </div>
        </div>
      )}

      {passend.length === 0 ? (
        // Een lege lijst en een te krap bereik zien er hetzelfde uit maar
        // vragen om iets heel anders. "Schuif de afstand verder open" is een
        // loos advies als er helemaal niets ís: dan helpt geen enkele afstand.
        <div className="nu-leeg">
          <span className="empty-ico">{items.length === 0 ? "✨" : "🗺️"}</span>
          <div className="empty-h">
            {items.length === 0
              ? "Nog niets verzameld"
              : tags.length > 0
                ? "Niets met deze tags"
                : "Niets binnen dit bereik"}
          </div>
          <div className="empty-p">
            {items.length === 0
              ? "Voeg je eerste avontuur toe, dan staat hier wat er nú kan."
              : tags.length > 0
                ? `Geen enkel idee heeft ${tags.length === 1 ? "deze tag" : "al deze tags"} én past bij dit bereik.`
                : "Schuif de afstand verder open, of kies een andere bron."}
          </div>
          {items.length > 0 && tags.length > 0 && (
            <button className="btn empty-knop" onClick={() => { setTags([]); setVerrast(null); }}>
              Tagfilter wissen
            </button>
          )}
          {items.length === 0 && (
            /* De eerste keer met een lege lijst. Geen rondleiding: drie regels
               die zeggen waar dit voor is, en één knop die je meteen op de
               plek zet waar het gebeurt. Wie al weet hoe het werkt, scrollt er
               in één blik overheen. */
            <div className="eerstekeer">
              <ul className="eerstekeer-lijst">
                <li>
                  <span aria-hidden="true">✨</span>
                  Zie je iets leuks voorbijkomen? Maak een screenshot en laat de
                  app naam, plaats en seizoen eruit halen.
                </li>
                <li>
                  <span aria-hidden="true">🗓</span>
                  Vul je een periode in, dan weet dit scherm vanzelf wat er nú
                  kan.
                </li>
                <li>
                  <span aria-hidden="true">📍</span>
                  Vul je een plaats in, dan verschijnt het op de kaart. Verder
                  hoef je niets bij te houden.
                </li>
              </ul>
              <button className="btn acc nu-leeg-knop" onClick={() => onGaNaar("uitje")}>
                + Eerste avontuur toevoegen
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid nu-grid">
            {passend.slice(0, MAX_SUGGESTIES).map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                cat={catMeta(a.categorie)}
                onClick={() => onOpen(a)}
                onToggleDone={() => onToggleDone(a)}
                onToggleFav={onToggleFav ? () => onToggleFav(a) : undefined}
              />
            ))}
          </div>
          {passend.length > MAX_SUGGESTIES && (
            <div className="nu-meer">
              <span>
                Nog {passend.length - MAX_SUGGESTIES} meer die nu passen
              </span>
              <div className="nu-meer-knoppen">
                {Object.entries(SOORTEN).map(([key, s]) => (
                  <button key={key} className="btn" onClick={() => onGaNaar(key)}>
                    {s.emoji} {s.kort}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
