import { useEffect, useRef } from "react";

const FOCUSBAAR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Houdt de toetsenbordfocus binnen een venster of paneel, en geeft hem terug
// waar hij vandaan kwam zodra het sluit.
//
// Zonder dit liep je er na een stuk of achttien keer Tab gewoon uit: de focus
// belandde in de lijst áchter de donkere laag, waar je niets kon zien maar wel
// dingen kon aanzetten. Gemeten op het bewerkvenster: van veertig keer Tab
// stond de focus vijfentwintig keer buiten het venster.
//
// Terug naar het element waar je vandaan kwam is de tweede helft: sluit je het
// venster, dan sprong de focus anders naar het begin van de pagina en moest je
// je hele lijst opnieuw doorlopen om verder te gaan waar je was.
export function useDialoog(ref, open = true) {
  const kwamVan = useRef(null);

  useEffect(() => {
    if (!open || !ref.current) return;
    const venster = ref.current;
    kwamVan.current = document.activeElement;

    // Het eerste echte veld krijgt focus, niet de sluitknop: je opent dit om
    // iets in te vullen.
    const eersten = venster.querySelectorAll(FOCUSBAAR);
    const doel =
      venster.querySelector("input:not([type=file]), textarea, select") || eersten[0];
    doel?.focus?.();

    const opToets = (e) => {
      if (e.key !== "Tab") return;
      const lijst = [...venster.querySelectorAll(FOCUSBAAR)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!lijst.length) return;
      const eerste = lijst[0];
      const laatste = lijst[lijst.length - 1];
      // Shift+Tab op het eerste element gaat naar het laatste, en andersom.
      if (e.shiftKey && document.activeElement === eerste) {
        e.preventDefault();
        laatste.focus();
      } else if (!e.shiftKey && document.activeElement === laatste) {
        e.preventDefault();
        eerste.focus();
      } else if (!venster.contains(document.activeElement)) {
        // Focus is er op een andere manier uit geraakt (een klik ernaast,
        // of de browser die zelf verspringt). Haal hem terug.
        e.preventDefault();
        eerste.focus();
      }
    };

    venster.addEventListener("keydown", opToets);
    document.addEventListener("keydown", opToets, true);
    return () => {
      venster.removeEventListener("keydown", opToets);
      document.removeEventListener("keydown", opToets, true);
      kwamVan.current?.focus?.();
    };
  }, [ref, open]);
}
