import { useFoto } from "../useFoto.js";

// Rijkere kaart voor bewaarde dromen (hikes en reizen): toont het beste
// seizoen, notities en of er route-info bewaard is.
export default function WishCard({ item, cat, onClick, onToggleDone, onToggleFav }) {
  const { gedaan, favoriet } = item;
  const foto = useFoto(item.id, item.foto);
  return (
    <div
      className={`hcard${gedaan ? " done" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    >
      <div className="hcard-glow" style={{ background: cat.kleur }} />
      {foto && (
        <div className="kaart-foto groot">
          <img src={foto} alt="" loading="lazy" />
        </div>
      )}
      <div className="hcard-top">
        <div className="hcard-ico">{cat.emoji}</div>
        <div className="hcard-acties">
          <button
            className={`rond${favoriet ? " fav" : ""}`}
            title={favoriet ? "Uit favorieten" : "Als favoriet markeren"}
            aria-label={favoriet ? "Uit favorieten" : "Als favoriet markeren"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav();
            }}
          >
            ★
          </button>
          <button
            className={`rond${gedaan ? " on" : ""}`}
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
      </div>

      <div className="hcard-name">{item.naam}</div>
      <div className="hcard-loc">📍 {item.locatie}</div>

      {item.notities && (
        <div className="hcard-note">
          <span>📝</span>
          {item.notities}
        </div>
      )}

      <div className="hcard-tags">
        {item.periode && <span className="htag season">🗓 {item.periode}</span>}
        {item.type && <span className="htag">{item.type}</span>}
        {item.link && <span className="htag">🔗 info</span>}
      </div>
    </div>
  );
}
