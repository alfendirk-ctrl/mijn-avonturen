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

// Waar "Verras me" uit put. Standaard alleen uitjes: dat zijn de dingen die je
// zomaar kunt doen. Hikes en reizen vragen planning en horen in hun eigen tab.
const BRONNEN = {
  uitje: { label: "Uitjes", soorten: ["uitje"] },
  alles: { label: "Alles", soorten: ["uitje", "hike", "reis"] },
};

// "Wat doen we?" — het startscherm. Laat alleen zien wat nú kan: in dit
// seizoen, binnen het gekozen bereik, en nog niet gedaan.
export default function NuView({ items, catMeta, onOpen, onToggleDone, onGaNaar }) {
  const [bereik, setBereik] = useState(0); // 0 = alleen Nederland
  const [bron, setBron] = useState("uitje");
  const [verrast, setVerrast] = useState(null);
  const [zichtbaar, setZichtbaar] = useState(false);

  const maand = huidigeMaand();
  const thema = themaVanMaand(maand);

  const passend = useMemo(() => {
    const soorten = BRONNEN[bron].soorten;
    return items
      .filter(
        (a) =>
          !a.gedaan &&
          soorten.includes(a.soort) &&
          pastInMaand(a.maanden, maand) &&
          AFSTANDEN[a.afstand].volgorde <= bereik,
      )
      .sort((a, b) => {
        // Favorieten eerst, dan dingen die júist nu in het seizoen zijn.
        if (a.favoriet !== b.favoriet) return a.favoriet ? -1 : 1;
        const aSeizoen = a.maanden.length > 0;
        const bSeizoen = b.maanden.length > 0;
        if (aSeizoen !== bSeizoen) return aSeizoen ? -1 : 1;
        return a.naam.localeCompare(b.naam);
      });
  }, [items, bron, bereik, maand]);

  const verrasMe = () => {
    if (!passend.length) return;
    setZichtbaar(false);
    setTimeout(() => {
      setVerrast(passend[Math.floor(Math.random() * passend.length)]);
      setZichtbaar(true);
    }, 40);
  };

  const wissel = (zetter) => (waarde) => {
    zetter(waarde);
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
          {passend.length === 0
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

      {verrast && (
        <div className="vcard">
          <div
            className={`vcard-in${zichtbaar ? " on" : ""}`}
            onClick={() => onOpen(verrast)}
          >
            <div className="vcard-eye">Doe dit — tik voor details</div>
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
        <div className="nu-leeg">
          <span className="empty-ico">🗺️</span>
          <div className="empty-h">Niets binnen dit bereik</div>
          <div className="empty-p">
            Schuif de afstand verder open, of kies een andere bron.
          </div>
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
