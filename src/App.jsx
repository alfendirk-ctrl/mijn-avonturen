import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import {
  SEED_ACTIVITIES,
  SEED_CATEGORIES,
  FALLBACK_CATEGORY,
  SOORTEN,
  soortVoorNaam,
  sanitizeActivities,
  sanitizeCategories,
} from "./data/seed.js";
import { verrijk } from "./lib/afleiden.js";
import Header from "./components/Header.jsx";
import NuView from "./views/NuView.jsx";
import LijstView from "./views/LijstView.jsx";
import DetailModal from "./components/DetailModal.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import Toast from "./components/Toast.jsx";

const TABS = [
  { key: "nu", tab: "Nu", emoji: "✨" },
  ...Object.entries(SOORTEN).map(([key, s]) => ({ key, tab: s.tab, emoji: s.emoji })),
];

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

  const [tab, setTab] = useState("nu");
  const [panelOpen, setPanelOpen] = useState(false);
  const [modal, setModal] = useState(null); // { activity, mode }
  const [adding, setAdding] = useState(null); // soort-sleutel
  const [confirmItem, setConfirmItem] = useState(null);
  const [confirmCategory, setConfirmCategory] = useState(null);
  const [moveTarget, setMoveTarget] = useState("");
  const [toasts, setToasts] = useState([]);

  const catMeta = useCallback(
    (naam) => categories[naam] || FALLBACK_CATEGORY,
    [categories],
  );
  const soortVanCategorie = useCallback(
    (naam) => categories[naam]?.soort || soortVoorNaam(naam),
    [categories],
  );

  const catNamen = useMemo(() => Object.keys(categories), [categories]);
  const catNamenPerSoort = useMemo(() => {
    const m = { uitje: [], hike: [], reis: [] };
    catNamen.forEach((naam) => {
      (m[soortVanCategorie(naam)] || m.uitje).push(naam);
    });
    return m;
  }, [catNamen, soortVanCategorie]);

  // Alle items met afgeleide gegevens (seizoen, afstand, soort).
  const items = useMemo(
    () => activities.map((a) => verrijk(a, soortVanCategorie)),
    [activities, soortVanCategorie],
  );

  const perSoort = useMemo(
    () => ({
      uitje: items.filter((a) => a.soort === "uitje"),
      hike: items.filter((a) => a.soort === "hike"),
      reis: items.filter((a) => a.soort === "reis"),
    }),
    [items],
  );

  const counts = useMemo(() => {
    const m = {};
    activities.forEach((a) => {
      m[a.categorie] = (m[a.categorie] || 0) + 1;
    });
    return m;
  }, [activities]);

  const stats = useMemo(() => {
    const bron = tab === "nu" ? items : perSoort[tab] || items;
    return [
      { value: bron.length, label: tab === "nu" ? "avonturen" : SOORTEN[tab].meervoud, color: "#6366F1" },
      { value: bron.filter((a) => a.favoriet).length, label: "favoriet", color: "#F5A623" },
      { value: bron.filter((a) => a.gedaan).length, label: "gedaan", color: "#3DBE8A" },
    ];
  }, [tab, items, perSoort]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setModal(null);
        setAdding(null);
        setPanelOpen(false);
        setConfirmItem(null);
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

  // ---- Avonturen ----
  const saveActivity = (form, id) => {
    const schoon = {
      naam: form.naam.trim(),
      locatie: form.locatie.trim(),
      categorie: form.categorie,
      type: form.type.trim(),
      link: form.link.trim() || null,
      notities: form.notities,
      gedaan: !!form.gedaan,
      favoriet: !!form.favoriet,
      periode: form.periode.trim(),
    };
    if (id == null) {
      const nieuweId = Date.now();
      setActivities((lijst) => [{ id: nieuweId, ...schoon }, ...lijst]);
      setAdding(null);
      setTab(soortVanCategorie(schoon.categorie));
      pushToast("Toegevoegd");
    } else {
      setActivities((lijst) =>
        lijst.map((a) => (a.id === id ? { id, ...schoon } : a)),
      );
      setModal(null);
      pushToast("Wijzigingen opgeslagen");
    }
  };

  const deleteActivity = (id) => {
    setActivities((lijst) => lijst.filter((a) => a.id !== id));
    setConfirmItem(null);
    setModal(null);
    pushToast("Verwijderd", "danger");
  };

  const toggleVeld = (item, veld, melding) => {
    setActivities((lijst) =>
      lijst.map((a) => (a.id === item.id ? { ...a, [veld]: !a[veld] } : a)),
    );
    pushToast(melding(!item[veld]));
  };

  const toggleGedaan = (item) =>
    toggleVeld(item, "gedaan", (aan) =>
      aan ? "Afgevinkt als gedaan ✓" : "Weer op de lijst",
    );
  const toggleFavoriet = (item) =>
    toggleVeld(item, "favoriet", (aan) =>
      aan ? "Toegevoegd aan favorieten ★" : "Uit favorieten",
    );

  // ---- Categorieën ----
  const addCategory = (cat) => {
    setCategories((c) => ({
      ...c,
      [cat.naam]: {
        emoji: cat.emoji,
        kleur: cat.kleur,
        gradient: cat.gradient,
        soort: cat.soort,
      },
    }));
    pushToast("Categorie aangemaakt");
  };

  const setCategorySoort = (naam, soort) => {
    setCategories((c) => ({ ...c, [naam]: { ...c[naam], soort } }));
    pushToast(`${naam} staat nu bij ${SOORTEN[soort].tab}`);
  };

  const removeCategory = (naam, verplaatsNaar) => {
    setCategories((c) => {
      const volgende = { ...c };
      delete volgende[naam];
      return volgende;
    });
    setActivities((lijst) =>
      verplaatsNaar
        ? lijst.map((a) =>
            a.categorie === naam ? { ...a, categorie: verplaatsNaar } : a,
          )
        : lijst.filter((a) => a.categorie !== naam),
    );
    setConfirmCategory(null);
    pushToast("Categorie verwijderd", "danger");
  };

  const requestDeleteCategory = (naam) => {
    if ((counts[naam] || 0) > 0) {
      setMoveTarget(catNamen.find((c) => c !== naam) || "");
      setConfirmCategory(naam);
    } else {
      removeCategory(naam, null);
    }
  };

  const openItem = (item) => setModal({ activity: item, mode: "view" });

  return (
    <div>
      <Header stats={stats} />

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab${tab === t.key ? " on" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <span className="tab-emo">{t.emoji}</span>
            <span className="tab-tekst">{t.tab}</span>
            {t.key !== "nu" && (
              <span className="tab-count">{perSoort[t.key].length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "nu" ? (
        <NuView
          items={items}
          catMeta={catMeta}
          onOpen={openItem}
          onToggleDone={toggleGedaan}
          onGaNaar={setTab}
        />
      ) : (
        <LijstView
          key={tab}
          soort={tab}
          items={perSoort[tab]}
          catNames={catNamenPerSoort[tab]}
          catMeta={catMeta}
          counts={counts}
          onOpen={openItem}
          onToggleDone={toggleGedaan}
          onToggleFav={toggleFavoriet}
          onAdd={setAdding}
          onOpenSettings={() => setPanelOpen(true)}
        />
      )}

      {modal && (
        <DetailModal
          activity={modal.activity}
          mode={modal.mode}
          categories={catNamen}
          catMeta={catMeta}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ ...modal, mode: "edit" })}
          onDelete={() => setConfirmItem(modal.activity)}
          onSave={saveActivity}
        />
      )}

      {adding && (
        <DetailModal
          activity={null}
          mode="edit"
          categories={catNamen}
          initialCategory={catNamenPerSoort[adding]?.[0]}
          catMeta={catMeta}
          onClose={() => setAdding(null)}
          onSave={saveActivity}
        />
      )}

      {panelOpen && (
        <SettingsPanel
          categories={categories}
          counts={counts}
          onAddCategory={addCategory}
          onSetCategorySoort={setCategorySoort}
          onDeleteCategory={requestDeleteCategory}
          onClose={() => setPanelOpen(false)}
        />
      )}

      {confirmItem && (
        <ConfirmDialog
          title="Verwijderen?"
          message={
            <>
              Weet je zeker dat je <strong>{confirmItem.naam}</strong> wil
              verwijderen?
            </>
          }
          onConfirm={() => deleteActivity(confirmItem.id)}
          onCancel={() => setConfirmItem(null)}
        />
      )}

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
          moveOptions={catNamen.filter((c) => c !== confirmCategory)}
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
