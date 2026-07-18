import { Component } from "react";

// Vangt render-fouten op zodat de app nooit een leeg scherm toont, maar een
// duidelijke melding met herstelmogelijkheden.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

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
    };

    return (
      <div style={box}>
        <div style={{ maxWidth: 360 }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🧭</div>
          <h1 style={{ fontSize: 22, marginBottom: 10 }}>Er ging iets mis</h1>
          <p style={{ color: "#8888B0", fontSize: 14, lineHeight: 1.6, marginBottom: 22 }}>
            De app kon niet goed laden. Probeer eerst opnieuw te laden. Blijft het
            misgaan, dan kun je de lokale gegevens herstellen (je opgeslagen
            activiteiten worden dan gewist).
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              style={{ ...btn, background: "#6366F1", color: "#fff" }}
              onClick={() => window.location.reload()}
            >
              Opnieuw laden
            </button>
            <button
              style={{
                ...btn,
                background: "rgba(239,68,68,0.12)",
                color: "#FCA5A5",
                border: "1px solid rgba(239,68,68,0.28)",
              }}
              onClick={() => {
                try {
                  localStorage.removeItem("av_db");
                  localStorage.removeItem("av_cats");
                } catch {
                  /* negeren */
                }
                window.location.reload();
              }}
            >
              Lokale gegevens herstellen
            </button>
          </div>
        </div>
      </div>
    );
  }
}
