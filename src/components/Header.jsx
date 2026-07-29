// Compacte kop: merknaam links, tellers rechts, en een knop om samen bij te
// houden. Bewust klein zodat de inhoud van de actieve tab meteen in beeld staat.
export default function Header({ stats, gedeeld, syncStatus, onDelen }) {
  return (
    <header className="hdr">
      <div className="hdr-glow" />
      <div className="hdr-noise" />
      <div className="hdr-inner">
        <div className="hdr-top">
          <h1 className="hdr-h1">
            Mijn <em>Avonturen</em>
          </h1>
          <div className="hdr-rechts">
            <div className="hdr-stats">
              {stats.map((s, i) => (
                <div className="stat" key={i}>
                  <span className="dot" style={{ background: s.color }} />
                  <strong>{s.value}</strong> {s.label}
                </div>
              ))}
            </div>
            <button
              className={`deel-knop${gedeeld ? " aan" : ""}`}
              onClick={onDelen}
              title={gedeeld ? "Samen bijhouden" : "Deel met je partner"}
              aria-label={gedeeld ? "Samen bijhouden" : "Deel met je partner"}
            >
              {gedeeld ? "👥" : "＋👤"}
              {gedeeld && <span className={`sync-stip ${syncStatus}`} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
