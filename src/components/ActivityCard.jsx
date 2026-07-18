import { STATUSES } from "../data/seed.js";

// Eén activiteit als kaart in het raster.
export default function ActivityCard({ activity, cat, popping, onClick }) {
  const st = STATUSES[activity.status] || STATUSES["wil doen"];
  return (
    <div
      className={`card${popping ? " pop" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    >
      <div className="card-glow" style={{ background: cat.kleur }} />
      <div className="card-top">
        <div className="card-ico">{cat.emoji}</div>
        <span
          className="card-badge"
          style={{ background: st.bg, color: st.kleur }}
        >
          {st.emoji} {st.label}
        </span>
      </div>
      <div className="card-name">{activity.naam}</div>
      <div className="card-loc">{activity.locatie}</div>
      {activity.type && <span className="card-type">{activity.type}</span>}
      {activity.periode && <div className="card-per">🗓 {activity.periode}</div>}
    </div>
  );
}
