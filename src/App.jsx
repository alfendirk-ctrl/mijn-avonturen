import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { verrijk, huidigeMaand, themaVanMaand } from "./lib/afleiden.js";
import Header from "./components/Header.jsx";
import NuView from "./views/NuView.jsx";
import LijstView from "./views/LijstView.jsx";
import DetailModal from "./components/DetailModal.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import Toast from "./components/Toast.jsx";
import DeelPaneel from "./components/DeelPaneel.jsx";
import {
  SLEUTEL_RUIMTE,
  SLEUTEL_TOMBS,
  maakRuimteId,
  ruimteUitUrl,
  synchroniseer,
  syncBeschikbaar,
} from "./lib/sync.js";

// Elke wijziging krijgt een tijdstempel; daarmee bepaalt de synchronisatie
// welke versie wint als jullie allebei iets veranderd hebben.
const stempel = (obj) => ({ ...obj, bijgewerkt: Date.now() });

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

  const [ruimte, setRuimte] = useLocalStorage(SLEUTEL_RUIMTE, null);
  const [tombs, setTombs] = useLocalStorage(SLEUTEL_TOMBS, {});
  const [deelOpen, setDeelOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState("uit");
  const [laatstGesynct, setLaatstGesynct] = useState(null);
  const laatsteMomentopname = useRef("");
  const bezig = useRef(false);

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

  // Het huidige seizoen kleurt de hele app.
  const thema = useMemo(() => themaVanMaand(huidigeMaand()), []);
  useEffect(() => {
    const stijl = document.documentElement.style;
    stijl.setProperty("--accent", thema.accent);
    stijl.setProperty("--accent2", thema.accent2);
    stijl.setProperty("--glow", thema.glow);
  }, [thema]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setModal(null);
        setAdding(null);
        setPanelOpen(false);
        setDeelOpen(false);
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
      setActivities((lijst) => [stempel({ id: nieuweId, ...schoon }), ...lijst]);
      setAdding(null);
      setTab(soortVanCategorie(schoon.categorie));
      pushToast("Toegevoegd");
    } else {
      setActivities((lijst) =>
        lijst.map((a) => (a.id === id ? stempel({ id, ...schoon }) : a)),
      );
      setModal(null);
      pushToast("Wijzigingen opgeslagen");
    }
  };

  const deleteActivity = (id) => {
    setActivities((lijst) => lijst.filter((a) => a.id !== id));
    // Grafsteen bewaren, anders komt het item bij de volgende synchronisatie
    // gewoon weer terug van het andere apparaat.
    setTombs((t) => ({ ...t, [id]: Date.now() }));
    setConfirmItem(null);
    setModal(null);
    pushToast("Verwijderd", "danger");
  };

  const toggleVeld = (item, veld, melding) => {
    setActivities((lijst) =>
      lijst.map((a) => (a.id === item.id ? stempel({ ...a, [veld]: !a[veld] }) : a)),
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
      [cat.naam]: stempel({
        emoji: cat.emoji,
        kleur: cat.kleur,
        gradient: cat.gradient,
        soort: cat.soort,
      }),
    }));
    pushToast("Categorie aangemaakt");
  };

  const setCategorySoort = (naam, soort) => {
    setCategories((c) => ({ ...c, [naam]: stempel({ ...c[naam], soort }) }));
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
            a.categorie === naam ? stempel({ ...a, categorie: verplaatsNaar }) : a,
          )
        : lijst.filter((a) => a.categorie !== naam),
    );
    if (!verplaatsNaar) {
      const weg = activities.filter((a) => a.categorie === naam);
      setTombs((t) => {
        const volgende = { ...t };
        weg.forEach((a) => (volgende[a.id] = Date.now()));
        return volgende;
      });
    }
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

  // ---- Delen met je partner ----

  // Een gedeelde link openen zet dit apparaat meteen in die ruimte.
  useEffect(() => {
    const uitLink = ruimteUitUrl();
    if (uitLink) {
      setRuimte(uitLink);
      pushToast("Gedeelde lijst gekoppeld");
    }
  }, [setRuimte, pushToast]);

  const doeSync = useCallback(async () => {
    if (!ruimte || !syncBeschikbaar() || bezig.current) return;
    bezig.current = true;
    setSyncStatus("bezig");
    try {
      const uit = await synchroniseer({
        ruimte,
        items: activities,
        categorieen: categories,
        tombs,
      });
      // Momentopname bijwerken vóór het wegschrijven, zodat het opslaan van
      // het resultaat niet meteen een nieuwe synchronisatie uitlokt.
      laatsteMomentopname.current = JSON.stringify([uit.items, uit.categorieen]);
      setActivities(uit.items);
      setCategories(uit.categorieen);
      setTombs(uit.tombs);
      setLaatstGesynct(Date.now());
      setSyncStatus("ok");
    } catch {
      // Geen verbinding is geen fout: lokaal werkt alles gewoon door.
      setSyncStatus("fout");
    } finally {
      bezig.current = false;
    }
  }, [ruimte, activities, categories, tombs, setActivities, setCategories, setTombs]);

  // Synchroniseer kort na een wijziging, en verder bij openen, terugkeren naar
  // het scherm, en periodiek.
  useEffect(() => {
    if (!ruimte || !syncBeschikbaar()) return;
    const nu = JSON.stringify([activities, categories]);
    if (nu === laatsteMomentopname.current) return;
    const timer = setTimeout(doeSync, 1200);
    return () => clearTimeout(timer);
  }, [ruimte, activities, categories, doeSync]);

  useEffect(() => {
    if (!ruimte || !syncBeschikbaar()) return;
    const bijTerugkeer = () => document.visibilityState === "visible" && doeSync();
    window.addEventListener("focus", doeSync);
    document.addEventListener("visibilitychange", bijTerugkeer);
    const klok = setInterval(doeSync, 30000);
    return () => {
      window.removeEventListener("focus", doeSync);
      document.removeEventListener("visibilitychange", bijTerugkeer);
      clearInterval(klok);
    };
  }, [ruimte, doeSync]);

  const startDelen = () => {
    setRuimte(maakRuimteId());
    // Alles krijgt een verse tijdstempel, zodat deze lijst de basis wordt.
    const nu = Date.now();
    setActivities((lijst) => lijst.map((a) => ({ ...a, bijgewerkt: nu })));
    setCategories((c) =>
      Object.fromEntries(
        Object.entries(c).map(([naam, meta]) => [naam, { ...meta, bijgewerkt: nu }]),
      ),
    );
    pushToast("Deel-link aangemaakt");
  };

  const stopDelen = () => {
    setRuimte(null);
    setSyncStatus("uit");
    setDeelOpen(false);
    pushToast("Delen gestopt op dit apparaat");
  };

  return (
    <div>
      <Header
        stats={stats}
        gedeeld={!!ruimte}
        syncStatus={syncStatus}
        onDelen={() => setDeelOpen(true)}
      />

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

      {deelOpen && (
        <DeelPaneel
          ruimte={ruimte}
          status={syncStatus}
          laatstGesynct={laatstGesynct}
          onStartDelen={startDelen}
          onStopDelen={stopDelen}
          onNuSynchroniseren={doeSync}
          onClose={() => setDeelOpen(false)}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
