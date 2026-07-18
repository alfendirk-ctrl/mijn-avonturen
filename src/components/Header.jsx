// Kop van de pagina: titel + statistieken (afhankelijk van de actieve weergave).
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
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <span className="dot" style={{ background: s.color }} />
              <strong>{s.value}</strong> {s.label}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
