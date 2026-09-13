// Bevestigingsvenster. Optioneel met een keuzelijst (bijv. activiteiten
// verplaatsen naar een andere categorie voordat de categorie verwijderd wordt).
export default function ConfirmDialog({
  icon = "🗑",
  title,
  message,
  moveOptions,
  moveValue,
  onMoveChange,
  confirmLabel = "Verwijder",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="ov ov-boven" onClick={onCancel}>
      <div className="cfm" onClick={(e) => e.stopPropagation()}>
        <span className="cfm-ico">{icon}</span>
        <div className="cfm-h">{title}</div>
        <div className="cfm-p">{message}</div>
        {moveOptions && moveOptions.length > 0 && (
          <select
            className="cfm-sel"
            value={moveValue}
            onChange={(e) => onMoveChange(e.target.value)}
          >
            {/* De lege keuze hoort er expliciet in EN als standaard. Zonder
                haar beloofde de tekst "verplaats ze of verwijder ze mee" iets
                wat je niet kon kiezen, en stond er alvast een categorie
                voorgeselecteerd - de eerste uit de lijst. Eén tik verplaatste
                dan dertien hikes naar Water, en dus naar een ander tabblad. */}
            <option value="">Verwijder de items mee</option>
            {moveOptions.map((c) => (
              <option key={c} value={c}>
                Verplaats naar: {c}
              </option>
            ))}
          </select>
        )}
        <div className="cfm-row">
          <button className="cfm-no" onClick={onCancel}>
            Annuleer
          </button>
          <button className="cfm-yes" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
