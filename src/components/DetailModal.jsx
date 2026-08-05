import { useEffect, useRef, useState } from "react";
import { MARKERINGEN, EMPTY_ACTIVITY } from "../data/seed.js";
import { haalFoto, verkleinAfbeelding } from "../lib/fotos.js";
import { leesTekst, veldenUitTekst } from "../lib/lezen.js";
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

  // Tekstherkenning: voortgang (0-100, of null als hij niet loopt) en het
  // bericht dat achteraf vertelt wat er is ingevuld.
  const [lezen, setLezen] = useState(null);
  const [leesBericht, setLeesBericht] = useState("");
  // De onverkleinde afbeelding leest beter dan de opgeslagen 900px-versie.
  const origineel = useRef(null);
  // Zodra je zelf een categorie kiest, laat de herkenning die met rust.
  const categorieGekozen = useRef(false);

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
    setLeesBericht("");
    try {
      const klein = await verkleinAfbeelding(bestand);
      origineel.current = bestand;
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
    origineel.current = null;
    setLeesBericht("");
    setForm((f) => ({ ...f, foto: false }));
  };

  // Leest de tekst uit de screenshot en vult daarmee de velden die nog leeg
  // zijn. Wat je zelf al hebt ingetypt blijft staan — herkenning raadt, jij weet.
  const vulInVanafFoto = async () => {
    if (lezen !== null) return;
    setLezen(0);
    setLeesBericht("");
    try {
      // Net gekozen foto, anders die van de vorige keer uit IndexedDB.
      const bron =
        origineel.current || nieuweFoto || (activity?.id ? await haalFoto(activity.id) : null);
      if (!bron) {
        setLeesBericht("Er is geen foto om te lezen.");
        return;
      }
      const tekst = await leesTekst(bron, setLezen);
      const gevonden = veldenUitTekst(tekst, categories);

      // Buiten setForm uitgerekend: de melding mag niet meetellen hoe vaak
      // React de bijwerkfunctie toevallig aanroept.
      const wijziging = {};
      const ingevuld = [];
      for (const veld of ["naam", "locatie", "periode"]) {
        if (gevonden[veld] && !String(form[veld] ?? "").trim()) {
          wijziging[veld] = gevonden[veld];
          ingevuld.push(veld);
        }
      }
      if (
        gevonden.categorie &&
        !categorieGekozen.current &&
        gevonden.categorie !== form.categorie
      ) {
        wijziging.categorie = gevonden.categorie;
        ingevuld.push("categorie");
      }
      if (ingevuld.length) setForm((f) => ({ ...f, ...wijziging }));

      setLeesBericht(
        ingevuld.length
          ? `Ingevuld vanaf de foto: ${ingevuld.join(", ")}. Controleer het even.`
          : tekst.trim()
            ? "Tekst gelezen, maar er viel niets bruikbaars uit op te maken."
            : "Geen tekst gevonden in deze afbeelding.",
      );
    } catch {
      setLeesBericht("Het lezen lukte niet. Probeer het opnieuw met internet aan.");
    } finally {
      setLezen(null);
    }
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
                <select
                  className="fi"
                  value={form.categorie}
                  onChange={(e) => {
                    categorieGekozen.current = true;
                    set("categorie")(e);
                  }}
                >
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

              {toonFoto && (
                <button
                  type="button"
                  className="foto-lees"
                  onClick={vulInVanafFoto}
                  disabled={lezen !== null}
                >
                  {lezen === null
                    ? "✨ Vul de velden in vanaf deze foto"
                    : `Tekst lezen… ${lezen}%`}
                </button>
              )}
              {lezen !== null && (
                <div className="lees-balk">
                  <span style={{ width: `${Math.max(4, lezen)}%` }} />
                </div>
              )}
              {leesBericht && <div className="lees-bericht">{leesBericht}</div>}

              <div className="hint">
                Handig voor iets dat je op Instagram zag: maak er een
                schermafdruk van en bewaar die hier. De app kan de tekst uit de
                schermafdruk lezen en er zelf de lege velden mee invullen. Het
                lezen gebeurt op je eigen toestel — de foto wordt nergens naartoe
                gestuurd — maar de eerste keer duurt het wat langer, omdat de
                tekstherkenning dan nog gedownload wordt. Foto's blijven op dit
                toestel; je partner ziet het avontuur wel, de foto niet.
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
