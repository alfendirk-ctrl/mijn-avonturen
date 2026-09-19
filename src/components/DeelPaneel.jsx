import { useRef, useState } from "react";
import { useDialoog } from "../useDialoog.js";
import { deelLink, syncBeschikbaar } from "../lib/sync.js";

// Paneel om de lijst te delen met je partner via een geheime link.
export default function DeelPaneel({
  ruimte,
  status,
  laatstGesynct,
  onStartDelen,
  onStopDelen,
  onNuSynchroniseren,
  onClose,
}) {
  const [gekopieerd, setGekopieerd] = useState(false);
  const link = ruimte ? deelLink(ruimte) : "";

  const kopieer = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Kopiëren geweigerd: de link staat er ook uitgeschreven.
    }
    setGekopieerd(true);
    setTimeout(() => setGekopieerd(false), 2000);
  };

  const statusTekst = {
    bezig: "Bezig met synchroniseren…",
    ok: laatstGesynct
      ? `Bijgewerkt om ${new Date(laatstGesynct).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}`
      : "Bijgewerkt",
    fout: "Geen verbinding — je wijzigingen staan veilig op dit apparaat",
    uit: "",
  }[status];

  const paneel = useRef(null);
  useDialoog(paneel);

  return (
    <div className="pov" onClick={onClose}>
      <div
        className="panel"
        ref={paneel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="deel-kop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-hdr">
          <h2 className="p-title" id="deel-kop">Samen bijhouden</h2>
          <button className="p-x" onClick={onClose} aria-label="Sluiten">
            ✕
          </button>
        </div>

        <div className="p-body">
          {!syncBeschikbaar() ? (
            <div className="deel-uit">
              <span className="deel-ico">🔌</span>
              <div className="empty-h">Delen staat nog niet aan</div>
              <div className="hint">
                De verbinding met de database is nog niet ingesteld. De app werkt
                gewoon door; je gegevens staan veilig op dit apparaat.
              </div>
            </div>
          ) : !ruimte ? (
            <>
              <div className="deel-uit">
                <span className="deel-ico">👋</span>
                <div className="empty-h">Deel je lijst</div>
                <div className="hint">
                  Je krijgt een geheime link. Stuur die één keer naar je partner
                  en jullie zien en bewerken daarna dezelfde lijst — op elk
                  apparaat, ook zonder internet.
                </div>
              </div>
              <div className="waarschuwing">
                Let op: iedereen met die link kan bij jullie lijst. Er is geen
                wachtwoord, dus deel 'm alleen met elkaar.
              </div>
              <button className="save-btn" onClick={onStartDelen}>
                Maak een deel-link
              </button>
            </>
          ) : (
            <>
              <div className="sec-h">Jullie link</div>
              <div className="link-doos">{link}</div>
              <button className="save-btn" onClick={kopieer}>
                {gekopieerd ? "Gekopieerd ✓" : "Kopieer link"}
              </button>
              <div className="hint">
                Open deze link één keer op het toestel van je partner. Daarna is
                het delen actief en hoeft niemand meer iets in te vullen.
              </div>

              <div className="divider" />

              <div className="sec-h">Status</div>
              <div className={`sync-status ${status}`}>
                <span className="sync-stip" />
                {statusTekst || "Klaar"}
              </div>
              <button className="btn" onClick={onNuSynchroniseren}>
                ↻ Nu synchroniseren
              </button>

              <div className="divider" />
              <button className="cfm-yes" onClick={onStopDelen}>
                Stop met delen op dit apparaat
              </button>
              <div className="hint">
                Je lijst blijft gewoon op dit apparaat staan; hij wordt alleen
                niet meer bijgewerkt vanaf de gedeelde versie.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
