import { useEffect, useMemo, useRef, useState } from "react";
import { splitsOpKaart } from "../lib/kaart.js";
import { SOORTEN } from "../data/seed.js";

// Alles op één kaart. Leaflet wordt pas opgehaald als je dit tabblad opent,
// net als de tekstherkenning: wie de kaart nooit gebruikt downloadt hem ook niet.
//
// De kaarttegels komen van OpenStreetMap en hebben dus internet nodig. Offline
// werkt de rest van de app gewoon door; alleen hier blijft het grijs.

const SOORT_FILTERS = [
  { key: "alles", label: "Alles" },
  ...Object.entries(SOORTEN).map(([key, s]) => ({ key, label: s.kort })),
];

export default function KaartView({ items, catMeta, onOpen }) {
  const doel = useRef(null);
  const kaart = useRef(null);
  const laag = useRef(null);
  const [soort, setSoort] = useState("alles");
  const [status, setStatus] = useState("laden");
  const [buitenBeeld, setBuitenBeeld] = useState(0);

  const zichtbaar = useMemo(
    () => (soort === "alles" ? items : items.filter((a) => a.soort === soort)),
    [items, soort],
  );
  const { op, zonder } = useMemo(() => splitsOpKaart(zichtbaar), [zichtbaar]);

  // Kaart één keer opbouwen.
  useEffect(() => {
    let afgebroken = false;
    (async () => {
      try {
        const L = (await import("leaflet")).default;
        if (afgebroken || !doel.current || kaart.current) return;
        kaart.current = L.map(doel.current, { scrollWheelZoom: false }).setView(
          [52.1, 5.3],
          7,
        );
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "&copy; OpenStreetMap",
        }).addTo(kaart.current);
        laag.current = L.layerGroup().addTo(kaart.current);
        setStatus("klaar");
      } catch {
        setStatus("mislukt");
      }
    })();
    return () => {
      afgebroken = true;
      kaart.current?.remove();
      kaart.current = null;
    };
  }, []);

  // Spelden bijwerken als het filter verandert.
  useEffect(() => {
    if (status !== "klaar" || !laag.current) return;
    let afgebroken = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (afgebroken || !laag.current) return;
      laag.current.clearLayers();

      // Meerdere avonturen op dezelfde plaats zouden elkaar bedekken; die
      // waaieren we een paar meter uit zodat je ze allemaal kunt aanklikken.
      const perPunt = new Map();
      for (const a of op) {
        const sleutel = a.punt.join(",");
        const rang = perPunt.get(sleutel) ?? 0;
        perPunt.set(sleutel, rang + 1);
        const hoek = rang * 2.4;
        const straal = rang === 0 ? 0 : 0.012 + rang * 0.002;
        const lat = a.punt[0] + Math.sin(hoek) * straal;
        const lon = a.punt[1] + Math.cos(hoek) * straal * 1.6;

        const cat = catMeta(a.categorie);
        const speld = L.divIcon({
          className: "",
          html: `<div class="speld${a.gedaan ? " af" : ""}" style="--speld:${cat.kleur}">
                   <span>${cat.emoji}</span>
                 </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
        L.marker([lat, lon], { icon: speld, title: a.naam })
          .addTo(laag.current)
          .on("click", () => onOpen(a));
      }

      // Waarop richten we de kaart? Uitzoomen tot ook Thailand en de Pacific
      // Crest Trail passen maakt van heel Europa één hoop spelden die elkaar
      // bedekken - op een telefoonscherm zelfs al bij Europa alleen. Daarom
      // richten we op wat dichtbij is (de afstandsklasse die de app zelf al
      // afleidt uit de locatie), en vertellen we hoeveel er verder weg liggen.
      // Uitzoomen laat de rest gewoon zien; er wordt niets verborgen.
      const dichtbij = op.filter((a) => a.afstand === "dichtbij");
      const richtOp = dichtbij.length ? dichtbij : op;
      // Zonder spelden is er niets om op te richten: L.latLngBounds van een lege
      // lijst gooit "Bounds are not valid" en daarmee lag het hele tabblad eruit
      // - precies in de situatie waarin iemand de app voor het eerst opent en
      // nog niets heeft toegevoegd. Dan houden we gewoon het beginbeeld aan.
      if (richtOp.length) {
        const grenzen = L.latLngBounds(richtOp.map((a) => a.punt));
        kaart.current.fitBounds(grenzen, { padding: [40, 40], maxZoom: 10 });
      }
      setBuitenBeeld(op.length - richtOp.length);
    })();
    return () => {
      afgebroken = true;
    };
  }, [op, status, catMeta, onOpen]);

  return (
    <div className="kaart-wrap">
      <div className="kaart-balk">
        {SOORT_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`pil${soort === f.key ? " on" : ""}`}
            onClick={() => setSoort(f.key)}
          >
            {f.label}
          </button>
        ))}
        <span className="kaart-telling">
          {op.length} op de kaart
          {zonder.length > 0 && ` · ${zonder.length} zonder plaats`}
        </span>
      </div>

      {buitenBeeld > 0 && (
        <div className="kaart-hint">
          {buitenBeeld} {buitenBeeld === 1 ? "avontuur ligt" : "avonturen liggen"}{" "}
          verder weg — zoom uit om {buitenBeeld === 1 ? "het" : "ze"} te zien.
        </div>
      )}

      <div className="kaart-doos">
        <div ref={doel} className="kaart" />
        {status === "laden" && <div className="kaart-melding">Kaart laden…</div>}
        {status === "mislukt" && (
          <div className="kaart-melding">
            De kaart kon niet geladen worden. Werkt alleen met internet.
          </div>
        )}
      </div>

      {zonder.length > 0 && (
        <div className="kaart-rest">
          <div className="kaart-rest-kop">Zonder plek op de kaart</div>
          <div className="kaart-rest-uitleg">
            Deze staan op iets algemeens als “Nederland” of “Europa”. Zet er een
            plaats of provincie bij en ze verschijnen vanzelf.
          </div>
          <div className="kaart-rest-lijst">
            {zonder.map((a) => (
              <button key={a.id} className="kaart-rest-item" onClick={() => onOpen(a)}>
                {catMeta(a.categorie).emoji} {a.naam}
                <span>{a.locatie}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
