import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import {
  SEED_ACTIVITIES,
  SEED_CATEGORIES,
  STATUSES,
  FALLBACK_CATEGORY,
} from "./data/seed.js";
import Header from "./components/Header.jsx";
import ActivityCard from "./components/ActivityCard.jsx";
import DetailModal from "./components/DetailModal.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import Toast from "./components/Toast.jsx";

export default function App() {
  const [activities, setActivities] = useLocalStorage("av_db", SEED_ACTIVITIES);
  const [categories, setCategories] = useLocalStorage("av_cats", SEED_CATEGORIES);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Alle");
  const [surpriseScope, setSurpriseScope] = useState("Alle");
  const [surprise, setSurprise] = useState(null);
  const [surpriseOn, setSurpriseOn] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [modal, setModal] = useState(null); // { activity, mode: "view" | "edit" }
  const [adding, setAdding] = useState(false); // nieuwe activiteit
  const [confirmActivity, setConfirmActivity] = useState(null);
  const [confirmCategory, setConfirmCategory] = useState(null);
  const [moveTarget, setMoveTarget] = useState("");
  const [popId, setPopId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const gridRef = useRef(null);

  const catNames = useMemo(() => Object.keys(categories), [categories]);
  const catMeta = useCallback(
    (name) => categories[name] || FALLBACK_CATEGORY,
    [categories],
  );

  // Aantal activiteiten per categorie.
  const counts = useMemo(() => {
    const m = {};
    activities.forEach((a) => {
      m[a.categorie] = (m[a.categorie] || 0) + 1;
    });
    return m;
  }, [activities]);

  // Gefilterde lijst (categorie + zoekterm).
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return activities.filter((a) => {
      const catOk = catFilter === "Alle" || a.categorie === catFilter;
      const searchOk =
        !q ||
        a.naam.toLowerCase().includes(q) ||
        a.locatie.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [activities, catFilter, search]);

  const stats = useMemo(
    () => ({
      totaal: activities.length,
      gedaan: activities.filter((a) => a.status === "gedaan").length,
      fav: activities.filter((a) => a.status === "favoriet").length,
      wil: activities.filter((a) => a.status === "wil doen").length,
    }),
    [activities],
  );

  // Sluit alles met Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setModal(null);
        setAdding(false);
        setPanelOpen(false);
        setConfirmActivity(null);
        setConfirmCategory(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pushToast = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);

  // ---- Activiteiten ----
  const saveActivity = (form, id) => {
    const clean = {
      naam: form.naam.trim(),
      locatie: form.locatie.trim(),
      categorie: form.categorie,
      type: form.type.trim() || form.categorie,
      link: form.link.trim() || null,
      notities: form.notities,
      status: form.status,
      periode: form.periode.trim(),
    };
    if (id == null) {
      const newId = Date.now();
      setActivities((list) => [{ id: newId, ...clean }, ...list]);
      setPopId(newId);
      setTimeout(() => setPopId(null), 1800);
      setCatFilter("Alle");
      setSearch("");
      setAdding(false);
      setTimeout(
        () => gridRef.current?.scrollIntoView({ behavior: "smooth" }),
        60,
      );
      pushToast("Activiteit toegevoegd");
    } else {
      setActivities((list) =>
        list.map((a) => (a.id === id ? { id, ...clean } : a)),
      );
      setModal(null);
      pushToast("Wijzigingen opgeslagen");
    }
  };

  const deleteActivity = (id) => {
    setActivities((list) => list.filter((a) => a.id !== id));
    setConfirmActivity(null);
    setModal(null);
    pushToast("Activiteit verwijderd", "danger");
  };

  // ---- Categorieën ----
  const addCategory = (cat) => {
    setCategories((c) => ({
      ...c,
      [cat.naam]: { emoji: cat.emoji, kleur: cat.kleur, gradient: cat.gradient },
    }));
    pushToast("Categorie aangemaakt");
  };

  const removeCategory = (name, moveTo) => {
    setCategories((c) => {
      const next = { ...c };
      delete next[name];
      return next;
    });
    setActivities((list) =>
      moveTo
        ? list.map((a) => (a.categorie === name ? { ...a, categorie: moveTo } : a))
        : list.filter((a) => a.categorie !== name),
    );
    if (catFilter === name) setCatFilter("Alle");
    if (surpriseScope === name) setSurpriseScope("Alle");
    setConfirmCategory(null);
    pushToast("Categorie verwijderd", "danger");
  };

  // Categorie verwijderen: met activiteiten -> bevestigen (+ verplaats-optie).
  const requestDeleteCategory = (name) => {
    if ((counts[name] || 0) > 0) {
      const others = catNames.filter((c) => c !== name);
      setMoveTarget(others[0] || "");
      setConfirmCategory(name);
    } else {
      removeCategory(name, null);
    }
  };

  // ---- Verras me ----
  const doSurprise = () => {
    const pool =
      surpriseScope === "Alle"
        ? activities
        : activities.filter((a) => a.categorie === surpriseScope);
    if (!pool.length) return;
    setSurpriseOn(false);
    setTimeout(() => {
      setSurprise(pool[Math.floor(Math.random() * pool.length)]);
      setSurpriseOn(true);
    }, 40);
  };

  return (
    <div>
      <Header stats={stats} />

      {/* Zoekbalk + knoppen */}
      <div className="bar">
        <div className="srch">
          <span className="srch-ico">⌕</span>
          <input
            placeholder="Zoek activiteit, locatie of type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="srch-clr" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        <button className="btn" onClick={() => setPanelOpen(true)}>
          ⊞ <span>Categorieën</span>
        </button>
        <button className="btn acc" onClick={() => setAdding(true)}>
          + <span>Toevoegen</span>
        </button>
      </div>

      {/* Categorie-chips */}
      <div className="cats">
        <div className="cats-row">
          <button
            className={`chip${catFilter === "Alle" ? " on" : ""}`}
            style={
              catFilter === "Alle"
                ? { background: "#6366F1", borderColor: "#6366F1" }
                : undefined
            }
            onClick={() => setCatFilter("Alle")}
          >
            Alle <span className="chip-count">{activities.length}</span>
          </button>
          {catNames.map((name) => {
            const meta = catMeta(name);
            const active = catFilter === name;
            return (
              <button
                key={name}
                className={`chip${active ? " on" : ""}`}
                style={
                  active
                    ? { background: meta.kleur, borderColor: meta.kleur }
                    : undefined
                }
                onClick={() => setCatFilter(name)}
              >
                {meta.emoji} {name}{" "}
                <span className="chip-count">{counts[name] || 0}</span>
                <span
                  className="x"
                  onClick={(e) => {
                    e.stopPropagation();
                    requestDeleteCategory(name);
                  }}
                >
                  ✕
                </span>
              </button>
            );
          })}
          <button className="chip-add" onClick={() => setPanelOpen(true)}>
            + Nieuwe categorie
          </button>
        </div>
      </div>

      {/* Verras me */}
      <div className="vbar">
        <button className="vbtn" onClick={doSurprise}>
          🎲 Verras me
        </button>
        <select
          className="vsel"
          value={surpriseScope}
          onChange={(e) => {
            setSurpriseScope(e.target.value);
            setSurprise(null);
          }}
        >
          <option value="Alle">Alle categorieën</option>
          {catNames.map((name) => (
            <option key={name} value={name}>
              {catMeta(name).emoji} {name}
            </option>
          ))}
        </select>
      </div>

      {surprise && (
        <div className="vcard">
          <div
            className={`vcard-in${surpriseOn ? " on" : ""}`}
            onClick={() => setModal({ activity: surprise, mode: "view" })}
          >
            <div className="vcard-eye">
              Jouw volgende avontuur — tik voor details
            </div>
            <div className="vcard-naam">{surprise.naam}</div>
            <div className="vcard-meta">
              {catMeta(surprise.categorie).emoji} {surprise.categorie} ·{" "}
              {surprise.locatie}
            </div>
          </div>
        </div>
      )}

      {/* Teller */}
      <div className="teller">
        {filtered.length} {filtered.length === 1 ? "resultaat" : "resultaten"}
        {search && ` — "${search}"`}
        {catFilter !== "Alle" && ` — ${catFilter}`}
      </div>

      {/* Raster */}
      <div className="grid" ref={gridRef}>
        {filtered.length === 0 ? (
          <div className="empty">
            <span className="empty-ico">
              {catFilter !== "Alle" ? catMeta(catFilter).emoji : "🗺️"}
            </span>
            <div className="empty-h">
              {search ? "Niets gevonden" : `Geen activiteiten in ${catFilter}`}
            </div>
            <div className="empty-p">
              {search
                ? `Geen resultaten voor "${search}"`
                : "Voeg je eerste activiteit toe"}
            </div>
          </div>
        ) : (
          filtered.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              cat={catMeta(a.categorie)}
              popping={popId === a.id}
              onClick={() => setModal({ activity: a, mode: "view" })}
            />
          ))
        )}
      </div>

      {/* Detail / bewerk-venster */}
      {modal && (
        <DetailModal
          activity={modal.activity}
          mode={modal.mode}
          categories={catNames}
          catMeta={catMeta}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ ...modal, mode: "edit" })}
          onDelete={() => setConfirmActivity(modal.activity)}
          onSave={saveActivity}
        />
      )}

      {/* Nieuwe activiteit */}
      {adding && (
        <DetailModal
          activity={null}
          mode="edit"
          categories={catNames}
          catMeta={catMeta}
          onClose={() => setAdding(false)}
          onSave={saveActivity}
        />
      )}

      {/* Instellingen-paneel */}
      {panelOpen && (
        <SettingsPanel
          categories={categories}
          counts={counts}
          onAddCategory={addCategory}
          onDeleteCategory={requestDeleteCategory}
          onClose={() => setPanelOpen(false)}
        />
      )}

      {/* Activiteit verwijderen */}
      {confirmActivity && (
        <ConfirmDialog
          title="Activiteit verwijderen?"
          message={
            <>
              Weet je zeker dat je <strong>{confirmActivity.naam}</strong> wil
              verwijderen?
            </>
          }
          onConfirm={() => deleteActivity(confirmActivity.id)}
          onCancel={() => setConfirmActivity(null)}
        />
      )}

      {/* Categorie verwijderen (met verplaats-optie) */}
      {confirmCategory && (
        <ConfirmDialog
          title="Categorie verwijderen?"
          message={
            <>
              <strong>{confirmCategory}</strong> heeft{" "}
              {counts[confirmCategory] || 0} activiteiten. Verplaats ze of
              verwijder ze mee.
            </>
          }
          moveOptions={catNames.filter((c) => c !== confirmCategory)}
          moveValue={moveTarget}
          onMoveChange={setMoveTarget}
          confirmLabel="Verwijder categorie"
          onConfirm={() => removeCategory(confirmCategory, moveTarget || null)}
          onCancel={() => setConfirmCategory(null)}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
