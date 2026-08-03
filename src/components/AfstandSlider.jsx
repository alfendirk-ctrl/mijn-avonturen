import { AFSTANDEN } from "../lib/afleiden.js";

// De vier afstandsklassen op volgorde: hoe verder je schuift, hoe meer erbij
// komt. De waarde is dus "tot en met", niet "precies deze".
export const AFSTAND_STAPPEN = Object.entries(AFSTANDEN)
  .sort(([, a], [, b]) => a.volgorde - b.volgorde)
  .map(([sleutel, meta]) => ({ sleutel, ...meta }));

const BIJSCHRIFT = [
  "Alleen in Nederland",
  "Tot en met de buurlanden",
  "Tot en met heel Europa",
  "Overal ter wereld",
];

// Schuif om te kiezen hoe ver je wil reizen. Toont meteen hoeveel er binnen
// dat bereik valt.
export default function AfstandSlider({ waarde, onChange, aantal }) {
  return (
    <div className="afstand">
      <div className="afstand-kop">
        <span className="afstand-vraag">Hoe ver mag het zijn?</span>
        {aantal != null && (
          <span className="afstand-aantal">
            {aantal} {aantal === 1 ? "idee" : "ideeën"}
          </span>
        )}
      </div>

      <input
        className="afstand-schuif"
        type="range"
        min="0"
        max={AFSTAND_STAPPEN.length - 1}
        step="1"
        value={waarde}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Hoe ver mag het zijn?"
        aria-valuetext={BIJSCHRIFT[waarde]}
        style={{
          // Vult het deel links van de knop met de accentkleur.
          "--vulling": `${(waarde / (AFSTAND_STAPPEN.length - 1)) * 100}%`,
        }}
      />

      <div className="afstand-schaal">
        {AFSTAND_STAPPEN.map((stap, i) => (
          <button
            key={stap.sleutel}
            type="button"
            className={`afstand-stap${i <= waarde ? " aan" : ""}`}
            onClick={() => onChange(i)}
            title={stap.label}
            aria-label={stap.label}
          >
            {stap.emoji}
          </button>
        ))}
      </div>

      <div className="afstand-bijschrift">{BIJSCHRIFT[waarde]}</div>
    </div>
  );
}
