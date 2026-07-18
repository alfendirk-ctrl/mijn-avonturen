import { STATUSES } from "../data/seed.js";

// Eén bewaarde hike. Rijker dan een gewone activiteitkaart: toont seizoen,
// notities en link, met een afvink-knop om als "gedaan" te markeren.
export default function HikeCard({ hike, cat, onClick, onToggleDone }) {
  const done = hike.status === "gedaan";
  const fav = hike.status === "favoriet";
  return (
    <div
      className={`hcard${done ? " done" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    >
      <div className="hcard-glow" style={{ background: cat.kleur }} />
      <div className="hcard-top">
        <div className="hcard-ico">{cat.emoji}</div>
        <button
          className={`hcard-check${done ? " on" : ""}`}
          title={done ? "Markeer als nog te doen" : "Markeer als gedaan"}
          aria-label={done ? "Markeer als nog te doen" : "Markeer als gedaan"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone();
          }}
        >
          ✓
        </button>
      </div>

      <div className="hcard-name">{hike.naam}</div>
      <div className="hcard-loc">📍 {hike.locatie}</div>

      {hike.notities && (
        <div className="hcard-note">
          <span>📝</span>
          {hike.notities}
        </div>
      )}

      <div className="hcard-tags">
        {hike.periode && (
          <span className="htag season">🗓 {hike.periode}</span>
        )}
        {hike.type && <span className="htag">{hike.type}</span>}
        {hike.link && <span className="htag">🔗 route-info</span>}
        {fav && <span className="htag fav">{STATUSES.favoriet.emoji} Favoriet</span>}
      </div>
    </div>
  );
}
