import { useEffect, useState } from "react";
import { STATUSES, EMPTY_ACTIVITY } from "../data/seed.js";

// Detail-/bewerk-venster voor een activiteit.
// mode "view"  -> alleen-lezen weergave met Bewerken/Verwijder-knoppen
// mode "edit"  -> formulier om toe te voegen of te wijzigen
export default function DetailModal({
  activity,
  mode,
  categories,
  catMeta,
  initialCategory,
  onClose,
  onEdit,
  onDelete,
  onSave,
}) {
  const isNew = !activity;
  const [form, setForm] = useState(
    activity
      ? {
          naam: activity.naam,
          locatie: activity.locatie,
          categorie: activity.categorie,
          type: activity.type,
          link: activity.link || "",
          notities: activity.notities || "",
          status: activity.status,
          periode: activity.periode || "",
        }
      : { ...EMPTY_ACTIVITY, categorie: initialCategory || EMPTY_ACTIVITY.categorie },
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const cat = catMeta(form.categorie);

  // ---- Bewerk-/toevoeg-formulier ----
  if (mode === "edit") {
    const canSave = form.naam.trim().length > 0;
    return (
      <Overlay onClose={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="m-hero" style={{ background: cat.gradient }}>
            <div className="m-hero-bg" />
            <button className="m-close" onClick={onClose} aria-label="Sluiten">
              ✕
            </button>
            <div className="m-cat">
              {cat.emoji} {form.categorie}
            </div>
            <div className="m-title">
              {isNew ? "Nieuwe activiteit" : form.naam || "Naamloos"}
            </div>
          </div>

          <div className="ef">
            <div>
              <label className="lbl">Naam</label>
              <input
                className="fi"
                value={form.naam}
                onChange={set("naam")}
                placeholder="Wat wil je doen?"
                autoFocus
              />
            </div>
            <div>
              <label className="lbl">Locatie</label>
              <input
                className="fi"
                value={form.locatie}
                onChange={set("locatie")}
                placeholder="Waar?"
              />
            </div>
            <div className="ef-g2">
              <div>
                <label className="lbl">Categorie</label>
                <select className="fi" value={form.categorie} onChange={set("categorie")}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="lbl">Type</label>
                <input
                  className="fi"
                  value={form.type}
                  onChange={set("type")}
                  placeholder="bijv. Wandeling"
                />
              </div>
            </div>
            <div className="ef-g2">
              <div>
                <label className="lbl">Status</label>
                <select className="fi" value={form.status} onChange={set("status")}>
                  {Object.entries(STATUSES).map(([k, s]) => (
                    <option key={k} value={k}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="lbl">Beste periode</label>
                <input
                  className="fi"
                  value={form.periode}
                  onChange={set("periode")}
                  placeholder="bijv. juli-aug"
                />
              </div>
            </div>
            <div>
              <label className="lbl">Website / Link</label>
              <input
                className="fi"
                value={form.link}
                onChange={set("link")}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="lbl">Notities</label>
              <textarea
                className="fi"
                value={form.notities}
                onChange={set("notities")}
                placeholder="Tips..."
              />
            </div>
          </div>

          <button
            className="ef-save"
            disabled={!canSave}
            onClick={() => onSave(form, isNew ? null : activity.id)}
          >
            {isNew ? "Toevoegen" : "Wijzigingen opslaan"}
          </button>
        </div>
      </Overlay>
    );
  }

  // ---- Alleen-lezen weergave ----
  const st = STATUSES[activity.status] || STATUSES["wil doen"];
  return (
    <Overlay onClose={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="m-hero" style={{ background: cat.gradient }}>
          <div className="m-hero-bg" />
          <button className="m-close" onClick={onClose} aria-label="Sluiten">
            ✕
          </button>
          <div className="m-cat">
            {cat.emoji} {activity.categorie}
          </div>
          <div className="m-title">{activity.naam}</div>
          <div className="m-actions">
            <button className="m-act m-edit" onClick={onEdit}>
              ✎ Bewerken
            </button>
            <button className="m-act m-del" onClick={onDelete}>
              🗑 Verwijder
            </button>
          </div>
        </div>

        <div className="m-body">
          <Row icon="📍" label="Locatie" value={activity.locatie} />
          {activity.type && <Row icon="🏷" label="Type" value={activity.type} />}
          <div className="m-row">
            <div className="m-ico">{st.emoji}</div>
            <div className="m-info">
              <div className="m-lbl">Status</div>
              <span
                className="m-badge"
                style={{ background: st.bg, color: st.kleur }}
              >
                {st.label}
              </span>
            </div>
          </div>
          {activity.periode && (
            <Row icon="🗓" label="Beste periode" value={activity.periode} />
          )}
          {activity.notities && (
            <Row icon="📝" label="Notities" value={activity.notities} />
          )}
          {activity.link && (
            <div className="m-row">
              <div className="m-ico">🔗</div>
              <div className="m-info">
                <div className="m-lbl">Website</div>
                <a
                  className="m-link"
                  href={activity.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Bekijk website ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="m-row">
      <div className="m-ico">{icon}</div>
      <div className="m-info">
        <div className="m-lbl">{label}</div>
        <div className="m-val">{value}</div>
      </div>
    </div>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div className="ov" onClick={onClose}>
      {children}
    </div>
  );
}
