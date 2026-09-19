import { useId, useState } from "react";
import { zoekAdres } from "../lib/rijden.js";

// Het vertrekpunt waar "32 km · 28 min" vandaan gerekend wordt.
//
// Dit staat hier en niet in de broncode, en dat is geen toeval: deze app staat
// in een openbare repository, dus een adres dat in een bestand belandt is voor
// altijd openbaar. Het hoort van de gebruiker te zijn, op het toestel van de
// gebruiker. Het gaat ook niet mee in de synchronisatie.
//
// Standaard is dit één regel. Het paneel hoort open te gaan op de categorieën
// - dat is waarvoor je hier meestal komt - en een adresveld met drie regels
// uitleg erboven duwde die onder de vouw. Je adres zet je één keer.
export default function ThuisInstelling({
  thuis,
  onZet,
  onWis,
  rijStatus,
  berekend,
  plaatsen,
}) {
  const vid = useId();
  const [open, setOpen] = useState(false);
  const [tekst, setTekst] = useState(thuis?.adres ?? "");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);

  const opslaan = async () => {
    const schoon = tekst.trim();
    if (!schoon || bezig) return;
    setBezig(true);
    setFout(null);
    try {
      const gevonden = await zoekAdres(schoon);
      if (!gevonden) {
        setFout(
          "Dat adres kon ik niet vinden. Zet er de plaats bij, bijvoorbeeld “Dorpsstraat 1, Culemborg”.",
        );
      } else {
        onZet(gevonden);
        setOpen(false);
      }
    } catch {
      setFout(
        "Opzoeken lukte niet. Ben je offline? Een plaatsnaam die de app zelf al kent werkt ook zonder internet.",
      );
    } finally {
      setBezig(false);
    }
  };

  const samenvatting = !thuis
    ? "Niet ingesteld — zet je adres erbij voor afstand en rijtijd"
    : rijStatus === "mislukt"
      ? `${thuis.adres} · routedienst nu niet bereikbaar`
      : rijStatus === "bezig"
        ? `${thuis.adres} · rijtijden ophalen…`
        : `${thuis.adres} · ${berekend} van ${plaatsen} plaatsen berekend`;

  return (
    <div className="thuis">
      <button
        className="thuis-regel"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="thuis-ico" aria-hidden="true">
          🏠
        </span>
        <span className="thuis-tekst">
          <span className="thuis-kop">Thuis</span>
          <span className="thuis-sub">{samenvatting}</span>
        </span>
        <span className="thuis-pijl" aria-hidden="true">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div className="thuis-uit">
          <div className="pf">
            <label className="lbl" htmlFor={`${vid}-adres`}>
              Adres of plaats
            </label>
            <input
              className="fi"
              id={`${vid}-adres`}
              value={tekst}
              onChange={(e) => setTekst(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && opslaan()}
              placeholder="bijv. Dorpsstraat 1, Culemborg"
              autoComplete="street-address"
            />
          </div>

          {/* Een adres naar een dienst buiten de deur sturen is niets om als
              implementatiedetail te behandelen, dus staat het er gewoon. */}
          <div className="hint klein">
            Blijft op dit toestel: het gaat niet mee in de gedeelde lijst en de
            ander ziet het niet. Alleen bij opslaan gaat het één keer naar
            OpenStreetMap om er coördinaten bij te zoeken.
          </div>

          {fout && <div className="waarschuwing">{fout}</div>}

          <div className="thuis-knoppen">
            <button
              className="save-btn"
              disabled={!tekst.trim() || bezig}
              onClick={opslaan}
            >
              {bezig ? "Opzoeken…" : thuis ? "Adres bijwerken" : "Adres opslaan"}
            </button>
            {thuis && (
              <button
                className="btn"
                onClick={() => {
                  onWis();
                  setTekst("");
                  setFout(null);
                }}
              >
                Wissen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
