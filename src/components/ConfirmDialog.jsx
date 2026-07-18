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
    <div className="ov" onClick={onCancel}>
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
