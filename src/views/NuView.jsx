import { useMemo, useState } from "react";
import {
  huidigeMaand,
  seizoenVanMaand,
  MAAND_LABEL,
  pastInMaand,
} from "../lib/afleiden.js";
import { SOORTEN } from "../data/seed.js";
import ActivityCard from "../components/ActivityCard.jsx";

// Hoeveel suggesties we tonen voordat we naar de volledige lijst verwijzen.
const MAX_SUGGESTIES = 8;

const BEREIKEN = {
  dichtbij: { label: "Dichtbij", toont: ["dichtbij"] },
  europa: { label: "Ook verder", toont: ["dichtbij", "buurland", "europa"] },
  alles: { label: "Alles", toont: ["dichtbij", "buurland", "europa", "ver"] },
};

// "Wat doen we?" — het startscherm. Laat alleen zien wat nú kan: in dit
// seizoen, binnen het gekozen bereik, en nog niet gedaan.
export default function NuView({ items, catMeta, onOpen, onToggleDone, onGaNaar }) {
  const [bereik, setBereik] = useState("dichtbij");
  const [verrast, setVerrast] = useState(null);
  const [zichtbaar, setZichtbaar] = useState(false);

  const maand = huidigeMaand();
  const seizoen = seizoenVanMaand(maand);

  const passend = useMemo(() => {
    const toegestaan = BEREIKEN[bereik].toont;
    return items
      .filter(
        (a) =>
          !a.gedaan &&
          pastInMaand(a.maanden, maand) &&
          toegestaan.includes(a.afstand),
      )
      .sort((a, b) => {
        // Favorieten eerst, dan dingen die júist nu in het seizoen zijn.
        if (a.favoriet !== b.favoriet) return a.favoriet ? -1 : 1;
        const aSeizoen = a.maanden.length > 0;
        const bSeizoen = b.maanden.length > 0;
        if (aSeizoen !== bSeizoen) return aSeizoen ? -1 : 1;
        return a.naam.localeCompare(b.naam);
      });
  }, [items, bereik, maand]);

  const verrasMe = () => {
    if (!passend.length) return;
    setZichtbaar(false);
    setTimeout(() => {
      setVerrast(passend[Math.floor(Math.random() * passend.length)]);
      setZichtbaar(true);
    }, 40);
  };

  return (
    <div className="nu">
      <div className="nu-kop">
        <div className="nu-eye">Wat doen we?</div>
        <div className="nu-lead">
          Het is <strong>{MAAND_LABEL[maand]}</strong> — {seizoen}.{" "}
          {passend.length === 0
            ? "Niets gevonden binnen dit bereik."
            : `${passend.length} ${passend.length === 1 ? "idee past" : "ideeën passen"} nu.`}
        </div>
      </div>

      <div className="nu-bar">
        <button className="vbtn" onClick={verrasMe} disabled={!passend.length}>
          🎲 Verras me
        </button>
        <div className="hfilter">
          {Object.entries(BEREIKEN).map(([key, b]) => (
            <button
              key={key}
              className={bereik === key ? "on" : ""}
              onClick={() => {
                setBereik(key);
                setVerrast(null);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

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
            Kies een groter bereik, of voeg een nieuw idee toe.
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
                    {s.emoji} {s.tab}
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
