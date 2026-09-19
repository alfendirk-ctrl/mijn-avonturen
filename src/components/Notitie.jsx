import { leesNotitie } from "../lib/notities.js";

// Een notitie zoals hij leest, niet zoals hij is opgeslagen. `leesNotitie`
// haalt de alinea's en de waarschuwingen eruit; hier krijgen ze een vorm.
//
// De geschreeuwde aanhef wordt vet in plaats van hoofdletters, en de zin
// loopt gewoon door: kop, het leesteken dat er stond, en de rest. Er wordt
// dus niets weggelaten of herschreven, alleen anders gezet.
export default function Notitie({ tekst }) {
  const blokken = leesNotitie(tekst);
  if (!blokken.length) return null;
  return (
    <div className="notitie">
      {blokken.map((blok, i) =>
        blok.soort === "letop" ? (
          <p key={i} className="notitie-letop">
            <span className="notitie-letop-ico" aria-hidden="true">
              ⚠️
            </span>
            <span>
              <strong>{blok.kop}</strong>
              {blok.scheiding}
              {blok.tekst}
            </span>
          </p>
        ) : (
          <p key={i} className="notitie-alinea">
            {blok.tekst}
          </p>
        ),
      )}
    </div>
  );
}
