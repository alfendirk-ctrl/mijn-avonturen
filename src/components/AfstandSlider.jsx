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

// Zodra er een thuisadres staat is "Nederland / buurlanden / Europa" een
// grovere maat dan nodig: dan weten we de echte rijafstand en kun je gewoon
// zeggen hoe ver je wil rijden. De laatste stap is bewust geen getal maar
// "alles".
export const KM_STAPPEN = [15, 30, 50, 75, 120, null];
export const KM_ALLES = KM_STAPPEN.length - 1;

/**
 * Valt dit avontuur binnen het gekozen bereik?
 *
 * In kilometers geldt: op de hoogste stand doet alles mee, ook wat geen
 * bekende rijafstand heeft (alles in het buitenland, alles met een vage
 * plaats). Schuif je terug, dan vallen die eruit - "tot 50 km" kan niet
 * anders betekenen, en ze stilletjes laten staan zou de schuif een belofte
 * laten doen die hij niet waarmaakt. Daarom staat de schuif standaard op de
 * hoogste stand: pas als je hem zelf verzet raak je iets kwijt.
 */
export function binnenBereik(avontuur, waarde, kmModus, rijInfo) {
  if (!kmModus) return AFSTANDEN[avontuur.afstand].volgorde <= waarde;
  const grens = KM_STAPPEN[waarde];
  if (grens == null) return true;
  const km = rijInfo?.(avontuur.locatie)?.km;
  return km != null && km <= grens;
}

// Schuif om te kiezen hoe ver je wil reizen. Toont meteen hoeveel er binnen
// dat bereik valt.
export default function AfstandSlider({ waarde, onChange, aantal, kmModus = false }) {
  const stappen = kmModus ? KM_STAPPEN : AFSTAND_STAPPEN;
  const laatste = stappen.length - 1;
  const bijschrift = kmModus
    ? KM_STAPPEN[waarde] == null
      ? "Overal, ook zonder bekende rijafstand"
      : `Tot ${KM_STAPPEN[waarde]} km rijden`
    : BIJSCHRIFT[waarde];

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
        max={laatste}
        step="1"
        value={waarde}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Hoe ver mag het zijn?"
        aria-valuetext={bijschrift}
        style={{
          // Vult het deel links van de knop met de accentkleur.
          "--vulling": `${(waarde / laatste) * 100}%`,
        }}
      />

      {kmModus ? (
        // Geen knoppen maar labels. De emoji hieronder zijn kleiner dan de
        // 44px die deze app overal aanhoudt; dat was te verdedigen zolang het
        // er vier waren naast een schuif die het echte werk doet, maar er zes
        // bijmaken zou die uitzondering verdubbelen. De schuif zelf is de
        // bediening.
        <div className="afstand-schaal km" aria-hidden="true">
          {KM_STAPPEN.map((km, i) => (
            <span key={km ?? "alles"} className={`afstand-tik${i === waarde ? " aan" : ""}`}>
              {km ?? "∞"}
            </span>
          ))}
        </div>
      ) : (
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
      )}

      <div className="afstand-bijschrift">{bijschrift}</div>
    </div>
  );
}
