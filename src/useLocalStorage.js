import { useState, useEffect } from "react";

// Houdt een state-waarde gesynchroniseerd met localStorage onder `key`.
// Zelfde gedrag/sleutels (av_db, av_cats) als de originele app, zodat
// bestaande data van gebruikers behouden blijft.
// Een optionele `validate`-functie mag een opgeschoonde waarde teruggeven of
// `null` om op de standaardwaarde terug te vallen (beschermt tegen kapotte data).
export function useLocalStorage(key, initial, validate) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return initial;
      const parsed = JSON.parse(raw);
      if (validate) {
        const clean = validate(parsed);
        return clean == null ? initial : clean;
      }
      return parsed;
    } catch {
      return initial;
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
