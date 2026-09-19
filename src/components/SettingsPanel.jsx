import { useId, useRef, useState } from "react";
import { useDialoog } from "../useDialoog.js";
import {
  COLOR_PALETTE,
  EMOJI_OPTIONS,
  EMPTY_CATEGORY,
  SOORTEN,
} from "../data/seed.js";
import ThuisInstelling from "./ThuisInstelling.jsx";

// Zijpaneel voor categoriebeheer: aanmaken, verplaatsen tussen tabs, verwijderen.
export default function SettingsPanel({
  categories,
  counts,
  onAddCategory,
  onSetCategorySoort,
  onDeleteCategory,
  onClose,
  thuis,
  onZetThuis,
  onWisThuis,
  rijStatus,
  rijBerekend,
  rijPlaatsen,
}) {
  const vid = useId();
  const [draft, setDraft] = useState(EMPTY_CATEGORY);
  const namen = Object.keys(categories);
  const naam = draft.naam.trim();
  const kanToevoegen = naam.length > 0 && !categories[naam];
  const kleur = COLOR_PALETTE[draft.kleurIndex];

  const voegToe = () => {
    if (!kanToevoegen) return;
    onAddCategory({
      naam,
      emoji: draft.emoji,
      kleur: kleur.kleur,
      gradient: kleur.gradient,
      soort: draft.soort,
    });
    setDraft(EMPTY_CATEGORY);
  };

  const paneel = useRef(null);
  useDialoog(paneel);

  return (
    <div className="pov" onClick={onClose}>
      <div
        className="panel"
        ref={paneel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-kop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-hdr">
          <h2 className="p-title" id="cat-kop">Instellingen</h2>
          <button className="p-x" onClick={onClose} aria-label="Sluiten">
            ✕
          </button>
        </div>

        <div className="p-body">
          <ThuisInstelling
            thuis={thuis}
            onZet={onZetThuis}
            onWis={onWisThuis}
            rijStatus={rijStatus}
            berekend={rijBerekend}
            plaatsen={rijPlaatsen}
          />

          <div className="divider" />

          {/* De lijst staat boven het formulier. Andersom stond veertig emoji
              en een kleurenkiezer in de weg voor het enige wat je hier meestal
              komt doen: een categorie verplaatsen of weggooien. */}
          <h3 className="sec-h">Bestaande categorieën</h3>
          <div className="hint">
            Verplaats een categorie naar een andere tab met de knopjes rechts.
          </div>
          <div className="cat-list">
            {namen.map((c) => (
              <div className="cat-row" key={c}>
                <div className="cat-row-e">{categories[c].emoji}</div>
                <div className="cat-row-n">
                  {c}
                  <span className="cat-row-c"> · {counts[c] || 0}</span>
                </div>
                <div className="soort-kies">
                  {Object.entries(SOORTEN).map(([key, s]) => (
                    <button
                      key={key}
                      className={categories[c].soort === key ? "on" : ""}
                      title={s.tab}
                      aria-label={`Zet ${c} bij ${s.tab}`}
                      onClick={() => onSetCategorySoort(c, key)}
                    >
                      {s.emoji}
                    </button>
                  ))}
                </div>
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

          <div className="divider" />

          <h3 className="sec-h">Nieuwe categorie</h3>

          <div className="pf">
            <label className="lbl" htmlFor={`${vid}-catnaam`}>Naam</label>
            <input
              className="fi"
              id={`${vid}-catnaam`}
              value={draft.naam}
              onChange={(e) => setDraft((d) => ({ ...d, naam: e.target.value }))}
              placeholder="bijv. Festivals"
            />
          </div>

          <div className="pf">
            <label className="lbl">Hoort bij</label>
            <div className="hfilter breed">
              {Object.entries(SOORTEN).map(([key, s]) => (
                <button
                  key={key}
                  className={draft.soort === key ? "on" : ""}
                  onClick={() => setDraft((d) => ({ ...d, soort: key }))}
                >
                  {s.emoji} {s.tab}
                </button>
              ))}
            </div>
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
            <span className="prev-tag" style={{ background: kleur.kleur }}>
              {draft.emoji} {naam || "Voorbeeld"}
            </span>
          </div>

          <button className="save-btn" disabled={!kanToevoegen} onClick={voegToe}>
            Categorie toevoegen
          </button>
        </div>
      </div>
    </div>
  );
}
