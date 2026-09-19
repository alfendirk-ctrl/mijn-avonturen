import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { coordinatenVoor } from "./lib/kaart.js";
import {
  bewaarRoutes,
  haalRijtijden,
  leesRoutes,
  puntSleutel,
  routeSleutel,
} from "./lib/rijden.js";

// Houdt de rijafstanden bij die bij het ingestelde thuisadres horen.
//
// De afstanden hangen aan een PLAATS, niet aan een avontuur: twintig uitjes in
// Rotterdam delen één berekening. Daarom is het ook maar één verzoek voor de
// hele lijst, en niet één per kaartje.
export function useRijden(items, thuis) {
  const [routes, setRoutes] = useState(leesRoutes);
  const [status, setStatus] = useState("rust"); // rust | bezig | mislukt
  // Wat we deze sessie al gevraagd hebben. Zonder dit zou een mislukt verzoek
  // meteen opnieuw geprobeerd worden - en nog eens, en nog eens.
  const gevraagd = useRef(new Set());

  // Alle plaatsen die in de lijst voorkomen, elk één keer.
  const punten = useMemo(() => {
    const perSleutel = new Map();
    for (const a of items) {
      const punt = coordinatenVoor(a.locatie);
      if (punt) perSleutel.set(puntSleutel(punt), punt);
    }
    return perSleutel;
  }, [items]);

  useEffect(() => {
    if (!thuis) return;
    const ontbreekt = [...punten.entries()]
      .filter(
        ([sleutel, punt]) =>
          routes[routeSleutel(thuis, punt)] === undefined &&
          !gevraagd.current.has(routeSleutel(thuis, punt)),
      )
      .map(([, punt]) => punt);
    if (!ontbreekt.length) return;

    let afgebroken = false;
    ontbreekt.forEach((p) => gevraagd.current.add(routeSleutel(thuis, p)));
    setStatus("bezig");
    haalRijtijden(thuis, ontbreekt)
      .then((nieuw) => {
        if (afgebroken) return;
        setRoutes((vorig) => {
          const samen = { ...vorig };
          for (const [sleutel, rit] of Object.entries(nieuw)) {
            samen[`${puntSleutel([thuis.lat, thuis.lon])}>${sleutel}`] = rit;
          }
          bewaarRoutes(samen);
          return samen;
        });
        setStatus("rust");
      })
      .catch(() => {
        // Offline, of de dienst ligt eruit. Er verschijnt dan gewoon geen
        // rijtijd; alles wat al berekend was blijft staan.
        if (!afgebroken) setStatus("mislukt");
      });
    return () => {
      afgebroken = true;
    };
  }, [punten, thuis, routes]);

  const rijInfo = useCallback(
    (locatie) => {
      if (!thuis) return null;
      const punt = coordinatenVoor(locatie);
      if (!punt) return null;
      return routes[routeSleutel(thuis, punt)] ?? null;
    },
    [routes, thuis],
  );

  const berekend = useMemo(() => {
    if (!thuis) return 0;
    let n = 0;
    for (const punt of punten.values()) {
      if (routes[routeSleutel(thuis, punt)]) n += 1;
    }
    return n;
  }, [punten, routes, thuis]);

  return { rijInfo, status, berekend, plaatsen: punten.size };
}
