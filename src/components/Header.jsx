// Compacte kop: merknaam links, tellers rechts, en een knop om samen bij te
// houden. Bewust klein zodat de inhoud van de actieve tab meteen in beeld staat.
// Wat het bolletje op de deelknop betekent, in woorden. Een kleurverschil van
// zeven pixels is het enige signaal dat synchroniseren mislukt is - onzichtbaar
// als je kleuren slecht onderscheidt, en al helemaal voor een schermlezer.
const SYNC_TEKST = {
  ok: "Samen bijhouden — bijgewerkt",
  bezig: "Samen bijhouden — bezig met bijwerken",
  fout: "Samen bijhouden — bijwerken mislukt",
};

export default function Header({
  stats,
  gedeeld,
  syncStatus,
  onDelen,
  onInstellingen,
}) {
  const deelLabel = gedeeld
    ? SYNC_TEKST[syncStatus] || "Samen bijhouden"
    : "Deel met je partner";
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
            {/* De instellingen zaten in de filterbalk van een lijst, wat
                klopte toen er alleen categorieën in stonden. Sinds je
                thuisadres er ook staat hoort het niet meer bereikbaar te zijn
                vanuit drie van de vijf tabbladen; vanaf "Nu" en "Kaart" kwam
                je er domweg niet bij. */}
            <button
              className="deel-knop"
              onClick={onInstellingen}
              title="Instellingen"
              aria-label="Instellingen openen"
            >
              ⚙
            </button>
            <button
              className={`deel-knop${gedeeld ? " aan" : ""}`}
              onClick={onDelen}
              title={deelLabel}
              aria-label={deelLabel}
            >
              {gedeeld ? "👥" : "＋👤"}
              {gedeeld && (
                <span className={`sync-stip ${syncStatus}`} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
