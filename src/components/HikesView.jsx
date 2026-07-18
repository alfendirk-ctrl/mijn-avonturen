import { useMemo, useState } from "react";
import HikeCard from "./HikeCard.jsx";

// De "bewaard voor later"-sectie voor hikes. Gegroepeerd op Nederland en
// internationaal/meerdaags, met een filter op nog-te-doen / gedaan.
const GROUPS = [
  { key: "Hike NL", titel: "In Nederland", emoji: "🇳🇱" },
  { key: "Hike", titel: "Internationaal & meerdaags", emoji: "🏔️" },
];

export default function HikesView({ hikes, catMeta, onOpen, onToggleDone, onAdd }) {
  const [filter, setFilter] = useState("alle"); // alle | todo | done
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const term = q.toLowerCase();
    return hikes.filter((h) => {
      const statusOk =
        filter === "alle" ||
        (filter === "done" && h.status === "gedaan") ||
        (filter === "todo" && h.status !== "gedaan");
      const searchOk =
        !term ||
        h.naam.toLowerCase().includes(term) ||
        h.locatie.toLowerCase().includes(term);
      return statusOk && searchOk;
    });
  }, [hikes, filter, q]);

  const doneCount = hikes.filter((h) => h.status === "gedaan").length;

  return (
    <div className="hikes">
      <div className="hikes-intro">
        <div className="hikes-eye">Bewaard voor later</div>
        <div className="hikes-lead">
          Jouw droomroutes — bewaar ze, verzamel route-info en het beste seizoen,
          en vink af wat je gelopen hebt. {hikes.length} bewaard · {doneCount} gedaan.
        </div>
      </div>

      <div className="hikes-bar">
        <div className="srch" style={{ flex: 1, minWidth: 180 }}>
          <span className="srch-ico">⌕</span>
          <input
            placeholder="Zoek een hike…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button className="srch-clr" onClick={() => setQ("")}>
              ✕
            </button>
          )}
        </div>
        <div className="hfilter">
          {[
            ["alle", "Alle"],
            ["todo", "Nog te doen"],
            ["done", "Gedaan"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={filter === key ? "on" : ""}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="btn acc" onClick={onAdd}>
          + <span>Hike bewaren</span>
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="hikes-empty">
          <span className="hikes-empty-ico">🥾</span>
          <div className="hikes-empty-h">
            {hikes.length === 0 ? "Nog geen hikes bewaard" : "Niets gevonden"}
          </div>
          <div className="hikes-empty-p">
            {hikes.length === 0
              ? "Bewaar je eerste droomroute"
              : "Pas je zoekopdracht of filter aan"}
          </div>
        </div>
      ) : (
        GROUPS.map((g) => {
          const items = shown.filter((h) => h.categorie === g.key);
          if (!items.length) return null;
          return (
            <div className="hgroup" key={g.key}>
              <div className="hgroup-h">
                <div className="hgroup-t">
                  {g.emoji} {g.titel}
                </div>
                <div className="hgroup-c">{items.length}</div>
                <div className="hgroup-line" />
              </div>
              <div className="hgrid">
                {items.map((h) => (
                  <HikeCard
                    key={h.id}
                    hike={h}
                    cat={catMeta(h.categorie)}
                    onClick={() => onOpen(h)}
                    onToggleDone={() => onToggleDone(h)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
