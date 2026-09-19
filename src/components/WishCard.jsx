import { useFoto } from "../useFoto.js";
import { metBreekpunten } from "../lib/tekst.jsx";
import { eersteAlinea } from "../lib/notities.js";

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

      <div className="hcard-name">{metBreekpunten(item.naam)}</div>
      <div className="hcard-loc">📍 {item.locatie}</div>

      {/* Alleen de openingsalinea, geknipt op drie regels. De notities bij de
          hikes en reizen zijn nu nog één regel, dus dit knipt vandaag niets
          weg - maar bij de uitjes staan er al van negenhonderd tekens, en die
          zouden hier een kaart van een halve schermhoogte maken. Het hele
          verhaal staat in het detailvenster. */}
      {item.notities && (
        <div className="hcard-note">
          <span>📝</span>
          <span className="hcard-note-tekst">{eersteAlinea(item.notities)}</span>
        </div>
      )}

      <div className="hcard-tags">
        {item.periode && <span className="htag season">🗓 {item.periode}</span>}
        {/* Zelfde reden als bij ActivityCard: niet alles even zwaar tonen.
            Hier is meer ruimte, dus er passen er drie. */}
        {item.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="htag tag">
            {tag}
          </span>
        ))}
        {item.tags?.length > 3 && (
          <span className="htag tag">+{item.tags.length - 3}</span>
        )}
      </div>
    </div>
  );
}
