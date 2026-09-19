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
  schoonTags,
} from "./data/seed.js";
import { verrijk, huidigeMaand, themaVanMaand } from "./lib/afleiden.js";
import { useRijden } from "./useRijden.js";
import { THUIS_SLEUTEL, wisRoutes } from "./lib/rijden.js";
import Header from "./components/Header.jsx";
import NuView from "./views/NuView.jsx";
import LijstView from "./views/LijstView.jsx";
import KaartView from "./views/KaartView.jsx";
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
import { bewaarFoto, verwijderFoto } from "./lib/fotos.js";
import {
  SLEUTEL_GEMIGREERD,
  BUNDELS,
  SLEUTEL_VERRIJKING,
  SLEUTEL_INGETROKKEN,
  verrijkAvonturen,
  trekIn,
  migreerAvonturen,
  migreerCategorieen,
  vulAanMetBundel,
} from "./lib/migratie.js";

// Elke wijziging krijgt een tijdstempel; daarmee bepaalt de synchronisatie
// welke versie wint als jullie allebei iets veranderd hebben.
const stempel = (obj) => ({ ...obj, bijgewerkt: Date.now() });

const normaliseerLink = (ruw) => {
  const t = String(ruw ?? "").trim();
  if (!t) return null;
  return /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`;
};

const TABS = [
  { key: "nu", tab: "Nu", kort: "Nu", emoji: "✨" },
  ...Object.entries(SOORTEN).map(([key, s]) => ({ key, tab: s.tab, kort: s.kort, emoji: s.emoji })),
  { key: "kaart", tab: "Kaart", kort: "Kaart", emoji: "📍" },
];

export default function App() {
  const [activities, setActivities, foutAvonturen] = useLocalStorage(
    "av_db",
    SEED_ACTIVITIES,
    sanitizeActivities,
  );
  const [categories, setCategories, foutCategorieen] = useLocalStorage(
    "av_cats",
    SEED_CATEGORIES,
    sanitizeCategories,
  );

  // Kan er nog opgeslagen worden? Zolang dit niet null is, gaat elke wijziging
  // verloren zodra de app opnieuw laadt.
  const opslagFout = foutAvonturen || foutCategorieen;
  // pushToast is een useCallback zonder afhankelijkheden; via een ref ziet hij
  // toch altijd de actuele stand.
  const opslagFoutRef = useRef(null);
  opslagFoutRef.current = opslagFout;

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

  // Het thuisadres waar de rijafstanden vandaan gerekend worden. Eigen
  // sleutel, en met opzet BUITEN de synchronisatie: `synchroniseer()` raakt
  // alleen av_db en av_cats aan. Het adres van de een is niet iets om op het
  // toestel van de ander te zetten.
  const [thuis, setThuis] = useLocalStorage(THUIS_SLEUTEL, null);

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

  const { rijInfo, status: rijStatus, berekend, plaatsen } = useRijden(items, thuis);

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

  // Alle tags die ergens al in gebruik zijn, van vaak naar zelden. Het
  // bewerkvenster biedt ze aan om uit te kiezen, zodat "kids" en "Kids" en
  // "kinderen" niet naast elkaar ontstaan.
  const bekendeTags = useMemo(() => {
    const telling = new Map();
    activities.forEach((a) =>
      (a.tags || []).forEach((t) => {
        const sleutel = t.toLowerCase();
        const vorig = telling.get(sleutel);
        telling.set(sleutel, { tag: vorig?.tag ?? t, aantal: (vorig?.aantal ?? 0) + 1 });
      }),
    );
    return [...telling.values()]
      .sort((a, b) => b.aantal - a.aantal || a.tag.localeCompare(b.tag))
      .map((v) => v.tag);
  }, [activities]);

  const stats = useMemo(() => {
    // "nu" en "kaart" gaan over alles; alleen de drie soort-tabbladen knijpen.
    const bron = perSoort[tab] || items;
    return [
      // Niet de hexcode van het accent overtypen: dat accent verschuift met het
      // seizoen, en dit bolletje bleef dan achter op de indigo van de winter.
      { value: bron.length, label: SOORTEN[tab]?.meervoud || "avonturen", color: "var(--accent)" },
      { value: bron.filter((a) => a.favoriet).length, label: "favoriet", color: "#F5A623" },
      { value: bron.filter((a) => a.gedaan).length, label: "gedaan", color: "#3DBE8A" },
    ];
  }, [tab, items, perSoort]);

  // Het huidige seizoen kleurt de hele app. main.jsx zet deze variabelen al
  // vóór de eerste keer tekenen (anders flitst de app één beeld lang in de
  // standaardkleur uit styles.css); dit is de vangnetversie voor het geval dat
  // daar iets misging.
  const thema = useMemo(() => themaVanMaand(huidigeMaand()), []);
  useEffect(() => {
    const stijl = document.documentElement.style;
    stijl.setProperty("--accent", thema.accent);
    stijl.setProperty("--accent2", thema.accent2);
    stijl.setProperty("--glow", thema.glow);
  }, [thema]);

  // Eenmalige omzetting naar categorieën op één as (zie lib/migratie.js).
  // Draait bij het opstarten over de al opgeschoonde opgeslagen data en zet
  // daarna een markering, zodat hij nooit een tweede keer iets verplaatst.
  useEffect(() => {
    let gedaan = false;
    try {
      gedaan = !!localStorage.getItem(SLEUTEL_GEMIGREERD);
    } catch {
      // Geen opslag beschikbaar: dan ook niet migreren, want we kunnen niet
      // onthouden dat het gebeurd is.
      return;
    }
    if (gedaan) return;

    const { avonturen, nogInGebruik } = migreerAvonturen(activities);
    if (JSON.stringify(avonturen) !== JSON.stringify(activities)) {
      // Stempelen, zodat de omzetting bij het synchroniseren wint van een
      // toestel dat nog de oude indeling heeft.
      setActivities(avonturen.map(stempel));
    }
    const nieuweCats = migreerCategorieen(categories, nogInGebruik);
    if (JSON.stringify(nieuweCats) !== JSON.stringify(categories)) {
      setCategories(nieuweCats);
    }
    try {
      localStorage.setItem(SLEUTEL_GEMIGREERD, "1");
    } catch {
      /* niets te doen */
    }
    // Bewust alleen bij het opstarten; de markering voorkomt herhaling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nieuwe vondsten eenmalig bijzetten. Nodig omdat de standaardlijst alleen
  // gelezen wordt op een toestel waar nog niets staat. Elke bundel heeft zijn
  // eigen markering, dus een telefoon die de vorige ronde al kent krijgt alleen
  // wat er nieuw bij is.
  useEffect(() => {
    for (const { sleutel, items } of BUNDELS) {
      try {
        if (localStorage.getItem(sleutel)) continue;
      } catch {
        return; // geen opslag: dan ook niet bijzetten, want we kunnen het niet onthouden
      }
      // Functioneel bijwerken, niet vanuit `activities`: het effect hierboven
      // heeft in dezelfde ronde misschien al een nieuwe lijst gezet, en die zou
      // anders overschreven worden met de versie van vóór de omzetting.
      setActivities((lijst) => {
        const aangevuld = vulAanMetBundel(lijst, items);
        return aangevuld ? aangevuld.map(stempel) : lijst;
      });
      try {
        localStorage.setItem(sleutel, "1");
      } catch {
        /* niets te doen */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Avonturen die er al staan maar als kale regel: naam en verder niets. Alleen
  // lege velden worden bijgewerkt, dus wat je zelf hebt ingevuld blijft staan.
  useEffect(() => {
    try {
      if (localStorage.getItem(SLEUTEL_VERRIJKING)) return;
    } catch {
      return;
    }
    setActivities((lijst) => {
      const verrijkt = verrijkAvonturen(lijst);
      return verrijkt ? verrijkt.map(stempel) : lijst;
    });
    try {
      localStorage.setItem(SLEUTEL_VERRIJKING, "1");
    } catch {
      /* niets te doen */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Avonturen die achteraf zijn ingetrokken weghalen. Draait een keer, en laat
  // staan wat jij hernoemd hebt (zie trekIn). De grafsteen is nodig omdat het
  // item anders bij de eerstvolgende synchronisatie terugkomt van het andere
  // toestel.
  useEffect(() => {
    try {
      if (localStorage.getItem(SLEUTEL_INGETROKKEN)) return;
    } catch {
      return;
    }
    setActivities((lijst) => {
      const uitkomst = trekIn(lijst);
      if (!uitkomst) return lijst;
      const nu = Date.now();
      setTombs((t) => {
        const volgende = { ...t };
        uitkomst.verwijderdeIds.forEach((id) => {
          volgende[id] = nu;
        });
        return volgende;
      });
      uitkomst.verwijderdeIds.forEach((id) => verwijderFoto(id));
      return uitkomst.lijst;
    });
    try {
      localStorage.setItem(SLEUTEL_INGETROKKEN, "1");
    } catch {
      /* niets te doen */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Geen "Toegevoegd" melden terwijl de waarschuwing erboven zegt dat er
    // niets bewaard wordt. Twee tegenstrijdige berichten is erger dan een.
    if (opslagFoutRef.current && type === "success") return;
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);

  // ---- Avonturen ----
  const saveActivity = async (form, id, nieuweFoto) => {
    const schoon = {
      naam: form.naam.trim(),
      locatie: form.locatie.trim(),
      categorie: form.categorie,
      type: form.type.trim(),
      // Zonder schema maakt de browser er een relatief pad van, dat onder
      // /mijn-avonturen/ een 404 oplevert. "www.foo.nl" hoort een echte link
      // te worden, geen kapotte.
      link: normaliseerLink(form.link),
      notities: form.notities,
      gedaan: !!form.gedaan,
      favoriet: !!form.favoriet,
      periode: form.periode.trim(),
      tags: schoonTags(form.tags),
      foto: !!form.foto,
    };
    if (id == null) {
      const nieuweId = Date.now();
      // De afbeelding pas wegschrijven als het item een id heeft.
      if (nieuweFoto) await bewaarFoto(nieuweId, nieuweFoto);
      setActivities((lijst) => [stempel({ id: nieuweId, ...schoon }), ...lijst]);
      setAdding(null);
      setTab(soortVanCategorie(schoon.categorie));
      pushToast(`${form.naam.trim()} toegevoegd`);
    } else {
      if (nieuweFoto) await bewaarFoto(id, nieuweFoto);
      else if (!schoon.foto) await verwijderFoto(id);
      setActivities((lijst) =>
        lijst.map((a) => (a.id === id ? stempel({ id, ...schoon }) : a)),
      );
      setModal(null);
      pushToast(`${form.naam.trim()} opgeslagen`);
    }
  };

  const deleteActivity = (id) => {
    // De naam vóór het verwijderen oppakken; daarna staat hij nergens meer en
    // zou de melding "Avontuur verwijderd" zijn in plaats van welk avontuur.
    const naam = activities.find((a) => a.id === id)?.naam;
    verwijderFoto(id);
    setActivities((lijst) => lijst.filter((a) => a.id !== id));
    // Grafsteen bewaren, anders komt het item bij de volgende synchronisatie
    // gewoon weer terug van het andere apparaat.
    setTombs((t) => ({ ...t, [id]: Date.now() }));
    setConfirmItem(null);
    setModal(null);
    pushToast(`${naam || "Avontuur"} verwijderd`, "danger");
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
    pushToast(`Categorie ${naam} aangemaakt`);
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
    pushToast(`Categorie ${naam} verwijderd`, "danger");
  };

  const requestDeleteCategory = (naam) => {
    if ((counts[naam] || 0) > 0) {
      // Leeg: de standaard is nu "verwijder de items mee", wat het dialoog
      // ook zegt. Stond hier de eerste andere categorie voorgeselecteerd, dan
      // verplaatste een argeloze tik de items naar een willekeurig ander
      // tabblad - en dat is niet terug te draaien.
      setMoveTarget("");
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
      {/* Opslaan lukt niet meer. Dit moet blijven staan, niet als melding die na
          twee seconden verdwijnt: de toestand houdt aan, en elke volgende
          wijziging gaat er ook aan. Stil negeren was wat het hiervoor deed. */}
      {opslagFout && (
        <div className="opslag-waarschuwing" role="alert">
          <span className="ow-ico" aria-hidden="true">⚠</span>
          <div>
            <strong>Je wijzigingen worden niet bewaard.</strong>{" "}
            {opslagFout.vol
              ? "De opslag van deze browser zit vol. Verwijder een paar foto's bij je avonturen om ruimte te maken."
              : "Deze browser laat geen opslag toe — in een privévenster gebeurt dat bijvoorbeeld."}{" "}
            Wat je nu toevoegt of aanpast is weg zodra je de app opnieuw opent.
          </div>
        </div>
      )}

      <Header
        stats={stats}
        gedeeld={!!ruimte}
        syncStatus={syncStatus}
        onDelen={() => setDeelOpen(true)}
        onInstellingen={() => setPanelOpen(true)}
      />

      {/* Een echte navigatie-oriëntatiepunt: een schermlezer kan hier nu
          rechtstreeks naartoe springen in plaats van de hele kop door te lopen. */}
      <nav className="tabs" aria-label="Soorten avonturen">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab${tab === t.key ? " on" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <span className="tab-emo">{t.emoji}</span>
            <span className="tab-tekst lang">{t.tab}</span>
            <span className="tab-tekst kort">{t.kort}</span>
            {/* Alleen de drie soort-tabbladen hebben een eigen aantal; "Nu" en
                "Kaart" gaan over alles en krijgen er dus geen. */}
            {perSoort[t.key] && (
              <span className="tab-count">{perSoort[t.key].length}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Het hoofdgebied als oriëntatiepunt. Een schermlezer kan nu de kop en
          de tabbalk overslaan en meteen bij de avonturen beginnen. */}
      <main id="inhoud">
      {tab === "nu" ? (
        <NuView
          items={items}
          catMeta={catMeta}
          onOpen={openItem}
          onToggleDone={toggleGedaan}
          onToggleFav={toggleFavoriet}
          onGaNaar={setTab}
          rijInfo={rijInfo}
        />
      ) : tab === "kaart" ? (
        <KaartView items={items} catMeta={catMeta} onOpen={openItem} />
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
          rijInfo={rijInfo}
        />
      )}
      </main>

      {modal && (
        <DetailModal
          activity={modal.activity}
          mode={modal.mode}
          categories={catNamen}
          catMeta={catMeta}
          bekendeTags={bekendeTags}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ ...modal, mode: "edit" })}
          onDelete={() => setConfirmItem(modal.activity)}
          onSave={saveActivity}
          rit={rijInfo(modal.activity?.locatie)}
        />
      )}

      {adding && (
        <DetailModal
          activity={null}
          mode="edit"
          categories={catNamen}
          initialCategory={catNamenPerSoort[adding]?.[0]}
          catMeta={catMeta}
          bekendeTags={bekendeTags}
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
          thuis={thuis}
          onZetThuis={(gevonden) => {
            setThuis(gevonden);
            pushToast("Thuisadres opgeslagen");
          }}
          onWisThuis={() => {
            setThuis(null);
            wisRoutes();
            pushToast("Thuisadres gewist");
          }}
          rijStatus={rijStatus}
          rijBerekend={berekend}
          rijPlaatsen={plaatsen}
        />
      )}

      {confirmItem && (
        <ConfirmDialog
          title="Dit avontuur verwijderen?"
          message={
            <>
              <strong>{confirmItem.naam}</strong> verdwijnt van dit apparaat
              {confirmItem.foto ? ", inclusief de foto die erbij staat" : ""}.
              Dat is niet terug te draaien.
            </>
          }
          confirmLabel="Verwijder avontuur"
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
              {counts[confirmCategory] || 0} items. Kies of ze mee verdwijnen of
              naar een andere categorie gaan — verplaatsen kan ze in een ander
              tabblad zetten.
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
