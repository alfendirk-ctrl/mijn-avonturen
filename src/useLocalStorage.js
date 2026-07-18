import { useState, useEffect } from "react";

// Houdt een state-waarde gesynchroniseerd met localStorage onder `key`.
// Zelfde gedrag/sleutels (av_db, av_cats) als de originele app, zodat
// bestaande data van gebruikers behouden blijft.
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
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
