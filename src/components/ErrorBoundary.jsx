import { Component } from "react";

// Vangt render-fouten op zodat de app nooit een leeg scherm toont, maar een
// duidelijke melding met herstelmogelijkheden.
//
// Dit scherm draait juist wanneer de rest stuk is, dus het leunt nergens op:
// geen hooks, geen afgeleide gegevens, alleen CSS-variabelen die styles.css al
// heeft staan voordat er ook maar iets van JavaScript gedraaid heeft.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, wilWissen: false, gekopieerd: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  // Je gegevens meenemen vóórdat je ze weggooit. De hele belofte van deze app
  // is dat er niets kwijtraakt; dan mag de laatste uitweg niet een knop zijn
  // die dat in één tik ongedaan maakt.
  kopieer = async () => {
    try {
      const alles = JSON.stringify({
        av_db: JSON.parse(localStorage.getItem("av_db") || "[]"),
        av_cats: JSON.parse(localStorage.getItem("av_cats") || "{}"),
      });
      await navigator.clipboard.writeText(alles);
      this.setState({ gekopieerd: true });
    } catch {
      this.setState({ gekopieerd: false });
    }
  };

  wis = () => {
    try {
      localStorage.removeItem("av_db");
      localStorage.removeItem("av_cats");
    } catch {
      /* negeren */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    const { wilWissen, gekopieerd } = this.state;

    const box = {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "#0A0A12",
      color: "#E8E8F0",
      fontFamily: "system-ui, -apple-system, sans-serif",
      textAlign: "center",
    };
    const btn = {
      padding: "13px 20px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: 600,
      minHeight: "46px",
    };
    const gevaar = {
      ...btn,
      background: "rgba(239,68,68,0.12)",
      color: "#FCA5A5",
      border: "1px solid rgba(239,68,68,0.28)",
    };
    const stil = {
      ...btn,
      background: "rgba(255,255,255,0.05)",
      color: "#B6B6D0",
      border: "1px solid rgba(255,255,255,0.08)",
      fontWeight: 500,
    };

    return (
      <div style={box}>
        <div style={{ maxWidth: 360 }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🧭</div>
          <h1 style={{ fontSize: 22, marginBottom: 10 }}>Er ging iets mis</h1>

          {!wilWissen ? (
            <>
              <p style={{ color: "#8A8AA8", fontSize: 14, lineHeight: 1.6, marginBottom: 22 }}>
                De app kon niet goed laden. Probeer het eerst met opnieuw laden —
                meestal is dat genoeg.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* var(--accent) staat in styles.css en wordt bij het opstarten
                    op de seizoenskleur gezet. Hier een hexcode overtypen gaf een
                    knop die het hele jaar winterindigo bleef. */}
                <button
                  style={{ ...btn, background: "var(--accent)", color: "var(--op-accent)" }}
                  onClick={() => window.location.reload()}
                >
                  Opnieuw laden
                </button>
                <button style={stil} onClick={() => this.setState({ wilWissen: true })}>
                  Blijft het misgaan?
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ color: "#8A8AA8", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
                Je kunt de opgeslagen gegevens wissen. Dat lost een kapotte opslag
                op, maar <strong style={{ color: "#FCA5A5" }}>al je avonturen zijn
                dan weg</strong> en dat is niet terug te draaien. Kopieer ze eerst,
                dan heb je ze nog.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  style={{ ...btn, background: "var(--accent)", color: "var(--op-accent)" }}
                  onClick={this.kopieer}
                >
                  {gekopieerd === true
                    ? "✓ Gekopieerd naar je klembord"
                    : gekopieerd === false
                      ? "Kopiëren lukte niet — probeer opnieuw"
                      : "Kopieer mijn gegevens eerst"}
                </button>
                <button style={gevaar} onClick={this.wis}>
                  Ja, wis alles en begin opnieuw
                </button>
                <button style={stil} onClick={() => this.setState({ wilWissen: false })}>
                  Terug
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
