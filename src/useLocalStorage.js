import { useState, useEffect, useRef } from "react";

// Houdt een state-waarde gesynchroniseerd met localStorage onder `key`.
// Zelfde gedrag/sleutels (av_db, av_cats) als de originele app, zodat
// bestaande data van gebruikers behouden blijft.
// Een optionele `validate`-functie mag een opgeschoonde waarde teruggeven of
// `null` om op de standaardwaarde terug te vallen (beschermt tegen kapotte data).
//
// Geeft `[waarde, zetWaarde, opslagFout]` terug. Die derde waarde is het punt:
// hier werd een mislukte schrijfactie eerder stilzwijgend genegeerd. Je voegde
// een avontuur toe, de app zei "Toegevoegd", en na de eerstvolgende keer laden
// was het weg. Voor een app waarvan de hele belofte "er raakt geen vondst meer
// kwijt" is, is dat de ergste fout die er bestaat - en juist degene die je nooit
// ziet gebeuren. Nu komt hij naar boven en kan de app het zeggen.
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

  const [opslagFout, setOpslagFout] = useState(null);
  // De allereerste schrijfactie is het terugschrijven van wat we net gelezen
  // hebben. Mislukt díe, dan is er niets van de gebruiker verloren gegaan - maar
  // het is wel het vroegste signaal dat opslaan niet gaat werken.
  const eersteRonde = useRef(true);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setOpslagFout((vorig) => (vorig ? null : vorig));
    } catch (e) {
      // QuotaExceededError (opslag vol) of een browser die opslag blokkeert,
      // bijvoorbeeld in een privévenster.
      setOpslagFout({
        sleutel: key,
        vol: e?.name === "QuotaExceededError" || e?.code === 22,
        bijHetLaden: eersteRonde.current,
      });
    } finally {
      eersteRonde.current = false;
    }
  }, [key, value]);

  return [value, setValue, opslagFout];
}
