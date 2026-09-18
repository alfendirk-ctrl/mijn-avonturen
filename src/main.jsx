import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import { huidigeMaand, themaVanMaand } from "./lib/afleiden.js";

// Het seizoensaccent wordt hier gezet, vóór de eerste keer tekenen. Stond dit
// alleen in een effect in App, dan verscheen de app eerst één beeld lang in de
// indigo uit styles.css om daarna naar de seizoenskleur te springen. Ook het
// crashscherm leest deze variabelen, en dat draait juist als App niet werkt.
try {
  const thema = themaVanMaand(huidigeMaand());
  const stijl = document.documentElement.style;
  stijl.setProperty("--accent", thema.accent);
  stijl.setProperty("--accent2", thema.accent2);
  stijl.setProperty("--glow", thema.glow);
} catch {
  /* dan blijven de standaardwaarden uit styles.css staan */
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

// Maakt de app offline bruikbaar. Mislukt dit, dan werkt alles gewoon door.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/mijn-avonturen/sw.js", { scope: "/mijn-avonturen/" })
      .catch(() => {});
  });
}
