import { MAX_STERREN } from "../data/seed.js";

// Waardering van een avontuur dat je gedaan hebt: hoe was het, voor de
// volgende keer? Dezelfde component leest en zet, want het verschil is één
// prop: zonder `onKies` is het een plaatje, met `onKies` zijn het knoppen.
//
// Nul sterren betekent "nog geen oordeel" en is dus geen slechte beoordeling.
// Daarom staat er bij nul geen rij lege sterren maar een uitnodiging; een rij
// grijze sterren leest als "dit was waardeloos".
export default function Sterren({ waarde = 0, onKies, label = "Waardering" }) {
  const sterren = Array.from({ length: MAX_STERREN }, (_, i) => i + 1);

  if (!onKies) {
    if (!waarde) return null;
    return (
      <span className="sterren" aria-label={`${waarde} van ${MAX_STERREN} sterren`}>
        <span aria-hidden="true">
          {sterren.map((n) => (
            <span key={n} className={n <= waarde ? "ster aan" : "ster"}>
              ★
            </span>
          ))}
        </span>
      </span>
    );
  }

  return (
    <div className="sterren kies" role="group" aria-label={label}>
      {sterren.map((n) => (
        <button
          key={n}
          type="button"
          // Nog een keer op dezelfde ster tikken haalt het oordeel weg. Zonder
          // dat kun je een misklik nooit meer ongedaan maken: je kunt wel naar
          // een ander cijfer, maar niet terug naar "nog niets gezegd".
          onClick={() => onKies(n === waarde ? 0 : n)}
          className={`ster-knop${n <= waarde ? " aan" : ""}`}
          aria-pressed={n <= waarde}
          aria-label={`${n} ${n === 1 ? "ster" : "sterren"}`}
        >
          ★
        </button>
      ))}
      <span className="sterren-uitleg">
        {waarde ? `${waarde}/${MAX_STERREN}` : "Hoe was het?"}
      </span>
    </div>
  );
}
