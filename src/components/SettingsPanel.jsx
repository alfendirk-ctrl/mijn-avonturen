import { useState } from "react";
import { COLOR_PALETTE, EMOJI_OPTIONS, EMPTY_CATEGORY } from "../data/seed.js";

// Zijpaneel voor het beheren van categorieën: nieuwe aanmaken + bestaande verwijderen.
export default function SettingsPanel({
  categories,
  counts,
  onAddCategory,
  onDeleteCategory,
  onClose,
}) {
  const [draft, setDraft] = useState(EMPTY_CATEGORY);
  const names = Object.keys(categories);
  const naam = draft.naam.trim();
  const canAdd = naam.length > 0 && !categories[naam];
  const color = COLOR_PALETTE[draft.kleurIndex];

  const add = () => {
    if (!canAdd) return;
    onAddCategory({
      naam,
      emoji: draft.emoji,
      kleur: color.kleur,
      gradient: color.gradient,
    });
    setDraft(EMPTY_CATEGORY);
  };

  return (
    <div className="pov" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="p-hdr">
          <div className="p-title">Categorieën</div>
          <button className="p-x" onClick={onClose} aria-label="Sluiten">
            ✕
          </button>
        </div>

        <div className="p-body">
          <div className="sec-h">Nieuwe categorie</div>

          <div className="pf">
            <label className="lbl">Naam</label>
            <input
              className="fi"
              value={draft.naam}
              onChange={(e) => setDraft((d) => ({ ...d, naam: e.target.value }))}
              placeholder="bijv. Festivals"
            />
          </div>

          <div className="pf">
            <label className="lbl">Emoji</label>
            <div className="egrid">
              {EMOJI_OPTIONS.map((em, i) => (
                <button
                  key={`${em}-${i}`}
                  className={`eopt${draft.emoji === em ? " on" : ""}`}
                  onClick={() => setDraft((d) => ({ ...d, emoji: em }))}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="pf">
            <label className="lbl">Kleur</label>
            <div className="kgrid">
              {COLOR_PALETTE.map((c, i) => (
                <button
                  key={c.naam}
                  className={`kopt${draft.kleurIndex === i ? " on" : ""}`}
                  style={{ background: c.kleur }}
                  title={c.naam}
                  onClick={() => setDraft((d) => ({ ...d, kleurIndex: i }))}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="prev-tag" style={{ background: color.kleur }}>
              {draft.emoji} {naam || "Voorbeeld"}
            </span>
          </div>

          <div className="divider" />

          <div className="sec-h">Bestaande categorieën</div>
          <div className="cat-list">
            {names.map((c) => (
              <div className="cat-row" key={c}>
                <div className="cat-row-e">{categories[c].emoji}</div>
                <div className="cat-row-n">{c}</div>
                <div className="cat-row-c">{counts[c] || 0}</div>
                <button
                  className="cat-row-x"
                  onClick={() => onDeleteCategory(c)}
                  aria-label={`Verwijder ${c}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-foot">
          <button className="save-btn" disabled={!canAdd} onClick={add}>
            Categorie toevoegen
          </button>
        </div>
      </div>
    </div>
  );
}
