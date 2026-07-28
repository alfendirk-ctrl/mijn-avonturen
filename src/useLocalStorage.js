import { useState, useEffect } from "react";

// Houdt een state-waarde gesynchroniseerd met localStorage onder `key`.
// Zelfde gedrag/sleutels (av_db, av_cats) als de originele app, zodat
// bestaande data van gebruikers behouden blijft.
// Een optionele `validate`-functie mag een opgeschoonde waarde teruggeven of
// `null` om op de standaardwaarde terug te vallen (beschermt tegen kapotte data).
export function useLocalStorage(key, initial, validate) {
  const [value, setValue] = useState(() => {
    // De standaardwaarde gaat door dezelfde opschoning als opgeslagen data,
    // zodat beide altijd exact dezelfde vorm hebben.
    const schoonInitial = () => (validate ? validate(initial) ?? initial : initial);
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return schoonInitial();
      const parsed = JSON.parse(raw);
      if (validate) {
        const clean = validate(parsed);
        return clean == null ? schoonInitial() : clean;
      }
      return parsed;
    } catch {
      return schoonInitial();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* opslag vol of niet beschikbaar — negeren */
    }
  }, [key, value]);

  return [value, setValue];
}
