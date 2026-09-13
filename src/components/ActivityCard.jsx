import { MARKERINGEN } from "../data/seed.js";
import { useFoto } from "../useFoto.js";

// Hoeveel tags er op een compacte kaart passen zonder dat het rommelig wordt.
// De rest wordt samengevat als "+2"; het volledige lijstje staat in het detail.
const MAX_KAART_TAGS = 2;

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
      {/* Eén rustige regel in plaats van drie rijen identieke pillen. Type,
          alle tags én de periode stonden hier als even zware badges onder
          elkaar; op een smalle kaart werd dat een lappendeken waar het oog
          niets uit kon halen. Het volledige verhaal staat in het detailvenster.
          De periode is het enige dat hier echt beslist of iets nú kan, dus die
          krijgt als enige een eigen accent. */}
      <div className="card-onder">
        {activity.periode && <span className="card-per">{activity.periode}</span>}
        {activity.tags?.slice(0, MAX_KAART_TAGS).map((tag) => (
          <span key={tag} className="card-tag">
            {tag}
          </span>
        ))}
        {activity.tags?.length > MAX_KAART_TAGS && (
          <span className="card-tag meer">+{activity.tags.length - MAX_KAART_TAGS}</span>
        )}
      </div>
      {gedaan && (
        <span className="card-af-badge" style={{ color: MARKERINGEN.gedaan.kleur }}>
          ✓ gedaan
        </span>
      )}
    </div>
  );
}
