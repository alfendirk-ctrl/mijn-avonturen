import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import {
  SEED_ACTIVITIES,
  SEED_CATEGORIES,
  FALLBACK_CATEGORY,
  HIKE_CATEGORIES,
  lc,
  sanitizeActivities,
  sanitizeCategories,
} from "./data/seed.js";
import Header from "./components/Header.jsx";
import ActivityCard from "./components/ActivityCard.jsx";
import HikesView from "./components/HikesView.jsx";
import DetailModal from "./components/DetailModal.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import Toast from "./components/Toast.jsx";

const isHike = (a) => HIKE_CATEGORIES.includes(a.categorie);

export default function App() {
  const [activities, setActivities] = useLocalStorage(
    "av_db",
    SEED_ACTIVITIES,
    sanitizeActivities,
  );
  const [categories, setCategories] = useLocalStorage(
    "av_cats",
    SEED_CATEGORIES,
    sanitizeCategories,
  );

  const [view, setView] = useState("activiteiten"); // "activiteiten" | "hikes"
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Alle");
  const [surpriseScope, setSurpriseScope] = useState("Alle");
  const [surprise, setSurprise] = useState(null);
  const [surpriseOn, setSurpriseOn] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [modal, setModal] = useState(null); // { activity, mode: "view" | "edit" }
  const [adding, setAdding] = useState(null); // null | "activity" | "hike"
  const [confirmActivity, setConfirmActivity] = useState(null);
  const [confirmCategory, setConfirmCategory] = useState(null);
  const [moveTarget, setMoveTarget] = useState("");
  const [popId, setPopId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const gridRef = useRef(null);

  const catNames = useMemo(() => Object.keys(categories), [categories]);
  // Categorieën die in de activiteiten-planner horen (hikes uitgesloten).
  const activityCatNames = useMemo(
    () => catNames.filter((c) => !HIKE_CATEGORIES.includes(c)),
    [catNames],
  );
  const catMeta = useCallback(
    (name) => categories[name] || FALLBACK_CATEGORY,
    [categories],
  );

  // Splits activiteiten en bewaarde hikes.
  const plannerActivities = useMemo(
    () => activities.filter((a) => !isHike(a)),
    [activities],
  );
  const hikeList = useMemo(() => activities.filter(isHike), [activities]);

  // Aantal per categorie (over alle activiteiten; activiteit-categorieën bevatten
  // alleen planner-items, dus dit klopt ook voor de chips).
  const counts = useMemo(() => {
    const m = {};
    activities.forEach((a) => {
      m[a.categorie] = (m[a.categorie] || 0) + 1;
    });
    return m;
  }, [activities]);

  // Gefilterde planner-lijst (categorie + zoekterm).
  const filtered = useMemo(() => {
    const q = lc(search);
    return plannerActivities.filter((a) => {
      const catOk = catFilter === "Alle" || a.categorie === catFilter;
      const searchOk =
        !q ||
        lc(a.naam).includes(q) ||
        lc(a.locatie).includes(q) ||
        lc(a.type).includes(q);
      return catOk && searchOk;
    });
  }, [plannerActivities, catFilter, search]);

  // Weergave-afhankelijke statistieken voor de kop.
  const stats = useMemo(() => {
    if (view === "hikes") {
      return [
        { value: hikeList.length, label: "hikes bewaard", color: "#6366F1" },
        {
          value: hikeList.filter((h) => h.status === "gedaan").length,
          label: "gedaan",
          color: "#3DBE8A",
        },
        {
          value: hikeList.filter((h) => h.status === "favoriet").length,
          label: "favoriet",
          color: "#F5A623",
        },
      ];
    }
    return [
      { value: plannerActivities.length, label: "activiteiten", color: "#6366F1" },
      {
        value: plannerActivities.filter((a) => a.status === "favoriet").length,
        label: "favorieten",
        color: "#F5A623",
      },
      {
        value: plannerActivities.filter((a) => a.status === "wil doen").length,
        label: "op de lijst",
        color: "#4A90D9",
      },
    ];
  }, [view, plannerActivities, hikeList]);

  // Sluit alles met Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setModal(null);
        setAdding(null);
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

  // ---- Activiteiten / hikes opslaan ----
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
      const addedHike = HIKE_CATEGORIES.includes(clean.categorie);
      setAdding(null);
      if (!addedHike) {
        setCatFilter("Alle");
        setSearch("");
        setTimeout(
          () => gridRef.current?.scrollIntoView({ behavior: "smooth" }),
          60,
        );
      }
      pushToast(addedHike ? "Hike bewaard" : "Activiteit toegevoegd");
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
    pushToast("Verwijderd", "danger");
  };

  // Hike afvinken als gedaan (en weer terug).
  const toggleHikeDone = (hike) => {
    const next = hike.status === "gedaan" ? "wil doen" : "gedaan";
    setActivities((list) =>
      list.map((a) => (a.id === hike.id ? { ...a, status: next } : a)),
    );
    pushToast(next === "gedaan" ? "Afgevinkt als gedaan ✓" : "Weer op de lijst");
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

  const requestDeleteCategory = (name) => {
    if ((counts[name] || 0) > 0) {
      const others = catNames.filter((c) => c !== name);
      setMoveTarget(others[0] || "");
      setConfirmCategory(name);
    } else {
      removeCategory(name, null);
    }
  };

  // ---- Verras me (alleen planner) ----
  const doSurprise = () => {
    const pool =
      surpriseScope === "Alle"
        ? plannerActivities
        : plannerActivities.filter((a) => a.categorie === surpriseScope);
    if (!pool.length) return;
    setSurpriseOn(false);
    setTimeout(() => {
      setSurprise(pool[Math.floor(Math.random() * pool.length)]);
      setSurpriseOn(true);
    }, 40);
  };

  const switchView = (v) => {
    setView(v);
    setSurprise(null);
  };

  return (
    <div>
      <Header stats={stats} />

      {/* Weergave-schakelaar */}
      <div className="tabs">
        <button
          className={`tab${view === "activiteiten" ? " on" : ""}`}
          onClick={() => switchView("activiteiten")}
        >
          🗺️ Activiteiten
          <span className="tab-count">{plannerActivities.length}</span>
        </button>
        <button
          className={`tab${view === "hikes" ? " on" : ""}`}
          onClick={() => switchView("hikes")}
        >
          🥾 Hikes<span className="tab-count">{hikeList.length}</span>
        </button>
      </div>

      {view === "hikes" ? (
        <HikesView
          hikes={hikeList}
          catMeta={catMeta}
          onOpen={(h) => setModal({ activity: h, mode: "view" })}
          onToggleDone={toggleHikeDone}
          onAdd={() => setAdding("hike")}
        />
      ) : (
        <>
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
            <button className="btn acc" onClick={() => setAdding("activity")}>
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
                Alle <span className="chip-count">{plannerActivities.length}</span>
              </button>
              {activityCatNames.map((name) => {
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
              {activityCatNames.map((name) => (
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
        </>
      )}

      {/* Detail / bewerk-venster */}
      {modal && (
        <DetailModal
          activity={modal.activity}
          mode={modal.mode}
          categories={isHike(modal.activity) ? HIKE_CATEGORIES : activityCatNames}
          catMeta={catMeta}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ ...modal, mode: "edit" })}
          onDelete={() => setConfirmActivity(modal.activity)}
          onSave={saveActivity}
        />
      )}

      {/* Nieuwe activiteit of hike */}
      {adding && (
        <DetailModal
          activity={null}
          mode="edit"
          categories={adding === "hike" ? HIKE_CATEGORIES : activityCatNames}
          initialCategory={adding === "hike" ? "Hike" : activityCatNames[0]}
          catMeta={catMeta}
          onClose={() => setAdding(null)}
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

      {/* Item verwijderen */}
      {confirmActivity && (
        <ConfirmDialog
          title="Verwijderen?"
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
              {counts[confirmCategory] || 0} items. Verplaats ze of verwijder ze
              mee.
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
