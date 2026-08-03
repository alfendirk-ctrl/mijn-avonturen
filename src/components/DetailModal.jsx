import { useEffect, useRef, useState } from "react";
import { MARKERINGEN, EMPTY_ACTIVITY } from "../data/seed.js";
import { verkleinAfbeelding } from "../lib/fotos.js";
import { useFoto } from "../useFoto.js";

// Detail-/bewerkvenster voor één avontuur.
// mode "view" -> alleen lezen, met knoppen om te bewerken of te verwijderen
// mode "edit" -> formulier om toe te voegen of te wijzigen
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
          gedaan: !!activity.gedaan,
          favoriet: !!activity.favoriet,
          periode: activity.periode || "",
          foto: !!activity.foto,
        }
      : {
          ...EMPTY_ACTIVITY,
          categorie: initialCategory || categories[0] || EMPTY_ACTIVITY.categorie,
        },
  );

  const [nieuweFoto, setNieuweFoto] = useState(null);
  const [nieuweFotoUrl, setNieuweFotoUrl] = useState(null);
  const [bezigMetFoto, setBezigMetFoto] = useState(false);

  // Voorbeeld-URL weer vrijgeven als het venster sluit.
  useEffect(() => () => nieuweFotoUrl && URL.revokeObjectURL(nieuweFotoUrl), [nieuweFotoUrl]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggle = (k) => () => setForm((f) => ({ ...f, [k]: !f[k] }));
  const cat = catMeta(form.categorie);

  // Foto: de al bewaarde versie, of een zojuist gekozen nieuwe.
  const bewaardeFoto = useFoto(activity?.id, !!activity?.foto && !nieuweFotoUrl);
  const bestandKiezer = useRef(null);
  const toonFoto = nieuweFotoUrl || (form.foto ? bewaardeFoto : null);

  const kiesFoto = async (e) => {
    const bestand = e.target.files?.[0];
    e.target.value = "";
    if (!bestand) return;
    setBezigMetFoto(true);
    try {
      const klein = await verkleinAfbeelding(bestand);
      setNieuweFoto(klein);
      setNieuweFotoUrl((oud) => {
        if (oud) URL.revokeObjectURL(oud);
        return URL.createObjectURL(klein);
      });
      setForm((f) => ({ ...f, foto: true }));
    } catch {
      // Onleesbare afbeelding: laat het formulier gewoon staan.
    } finally {
      setBezigMetFoto(false);
    }
  };

  const wisFoto = () => {
    setNieuweFotoUrl((oud) => {
      if (oud) URL.revokeObjectURL(oud);
      return null;
    });
    setNieuweFoto(null);
    setForm((f) => ({ ...f, foto: false }));
  };

  // ---- Bewerken / toevoegen ----
  if (mode === "edit") {
    const kanOpslaan = form.naam.trim().length > 0;
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
              {isNew ? "Nieuw avontuur" : form.naam || "Naamloos"}
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
                placeholder="bijv. Drenthe of Italië"
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
                  placeholder="bijv. Dagwandeling"
                />
              </div>
            </div>
            <div>
              <label className="lbl">Beste periode</label>
              <input
                className="fi"
                value={form.periode}
                onChange={set("periode")}
                placeholder="bijv. juli-aug, zomer of okt-feb"
              />
              <div className="hint">
                Hiermee weet de app of dit nú in het seizoen valt.
              </div>
            </div>
            <div>
              <label className="lbl">Foto</label>
              {toonFoto ? (
                <div className="foto-voorbeeld">
                  <img src={toonFoto} alt="" />
                  <button type="button" className="foto-weg" onClick={wisFoto}>
                    ✕ Verwijder foto
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="foto-kies"
                  onClick={() => bestandKiezer.current?.click()}
                  disabled={bezigMetFoto}
                >
                  {bezigMetFoto ? "Bezig…" : "📷 Kies een foto of screenshot"}
                </button>
              )}
              <input
                ref={bestandKiezer}
                type="file"
                accept="image/*"
                hidden
                onChange={kiesFoto}
              />
              <div className="hint">
                Handig voor iets dat je op Instagram zag: maak er een
                schermafdruk van en bewaar die hier. Foto's blijven op dit
                toestel — ze gaan nog niet mee naar je partner.
              </div>
            </div>

            <div>
              <label className="lbl">Markeringen</label>
              <div className="mark-row">
                <button
                  className={`pil${form.favoriet ? " on fav" : ""}`}
                  onClick={toggle("favoriet")}
                  type="button"
                >
                  ★ Favoriet
                </button>
                <button
                  className={`pil${form.gedaan ? " on ok" : ""}`}
                  onClick={toggle("gedaan")}
                  type="button"
                >
                  ✓ Gedaan
                </button>
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
                placeholder="Tips, route-info, wat je wil onthouden…"
              />
            </div>
          </div>

          <button
            className="ef-save"
            disabled={!kanOpslaan}
            onClick={() => onSave(form, isNew ? null : activity.id, nieuweFoto)}
          >
            {isNew ? "Toevoegen" : "Wijzigingen opslaan"}
          </button>
        </div>
      </Overlay>
    );
  }

  // ---- Alleen lezen ----
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
          {toonFoto && (
            <div className="m-foto">
              <img src={toonFoto} alt={activity.naam} />
            </div>
          )}
          <Rij icoon="📍" label="Locatie" waarde={activity.locatie} />
          {activity.type && <Rij icoon="🏷" label="Type" waarde={activity.type} />}

          <div className="m-row">
            <div className="m-ico">
              {activity.gedaan ? MARKERINGEN.gedaan.emoji : MARKERINGEN.open.emoji}
            </div>
            <div className="m-info">
              <div className="m-lbl">Status</div>
              <div className="mark-row">
                <span
                  className="m-badge"
                  style={{
                    background: activity.gedaan
                      ? MARKERINGEN.gedaan.bg
                      : MARKERINGEN.open.bg,
                    color: activity.gedaan
                      ? MARKERINGEN.gedaan.kleur
                      : MARKERINGEN.open.kleur,
                  }}
                >
                  {activity.gedaan ? "✓ Gedaan" : "🔖 Wil doen"}
                </span>
                {activity.favoriet && (
                  <span
                    className="m-badge"
                    style={{
                      background: MARKERINGEN.favoriet.bg,
                      color: MARKERINGEN.favoriet.kleur,
                    }}
                  >
                    ★ Favoriet
                  </span>
                )}
              </div>
            </div>
          </div>

          {activity.periode && (
            <Rij icoon="🗓" label="Beste periode" waarde={activity.periode} />
          )}
          {activity.regio && (
            <Rij icoon="🧭" label="Regio" waarde={activity.regio} />
          )}
          {activity.notities && (
            <Rij icoon="📝" label="Notities" waarde={activity.notities} />
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

function Rij({ icoon, label, waarde }) {
  return (
    <div className="m-row">
      <div className="m-ico">{icoon}</div>
      <div className="m-info">
        <div className="m-lbl">{label}</div>
        <div className="m-val">{waarde}</div>
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
