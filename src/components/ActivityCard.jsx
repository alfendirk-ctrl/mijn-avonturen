import { MARKERINGEN } from "../data/seed.js";
import { useFoto } from "../useFoto.js";

// Compacte kaart voor uitjes: snel scannen in een raster.
export default function ActivityCard({ activity, cat, popping, onClick, onToggleDone }) {
  const { gedaan, favoriet } = activity;
  const foto = useFoto(activity.id, activity.foto);
  return (
    <div
      className={`card${popping ? " pop" : ""}${gedaan ? " af" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    >
      <div className="card-glow" style={{ background: cat.kleur }} />
      {foto && (
        <div className="kaart-foto">
          <img src={foto} alt="" loading="lazy" />
        </div>
      )}
      <div className="card-top">
        <div className="card-ico">{cat.emoji}</div>
        <button
          className={`vink${gedaan ? " on" : ""}`}
          title={gedaan ? "Toch nog niet gedaan" : "Markeer als gedaan"}
          aria-label={gedaan ? "Toch nog niet gedaan" : "Markeer als gedaan"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone();
          }}
        >
          ✓
        </button>
      </div>
      <div className="card-name">
        {favoriet && <span className="ster">★</span>}
        {activity.naam}
      </div>
      <div className="card-loc">{activity.locatie}</div>
      <div className="card-onder">
        {activity.type && <span className="card-type">{activity.type}</span>}
        {activity.periode && <span className="card-per">🗓 {activity.periode}</span>}
      </div>
      {gedaan && (
        <span className="card-af-badge" style={{ color: MARKERINGEN.gedaan.kleur }}>
          ✓ gedaan
        </span>
      )}
    </div>
  );
}
