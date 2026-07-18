// Kop van de pagina: titel + drie statistieken (totaal / favorieten / op de lijst).
export default function Header({ stats }) {
  return (
    <header className="hdr">
      <div className="hdr-glow" />
      <div className="hdr-noise" />
      <div className="hdr-inner">
        <div className="hdr-eye">Persoonlijke Database</div>
        <h1 className="hdr-h1">
          Mijn <em>Avonturen</em>
        </h1>
        <div className="hdr-stats">
          <div className="stat">
            <span className="dot" style={{ background: "#6366F1" }} />
            <strong>{stats.totaal}</strong> activiteiten
          </div>
          <div className="stat">
            <span className="dot" style={{ background: "#F5A623" }} />
            <strong>{stats.fav}</strong> favorieten
          </div>
          <div className="stat">
            <span className="dot" style={{ background: "#4A90D9" }} />
            <strong>{stats.wil}</strong> op de lijst
          </div>
        </div>
      </div>
    </header>
  );
}
