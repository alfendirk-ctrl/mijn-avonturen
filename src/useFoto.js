import { useEffect, useState } from "react";
import { haalFoto } from "./lib/fotos.js";

// Geeft een weergave-URL voor de foto van een avontuur, of null.
// De URL wordt weer vrijgegeven zodra het onderdeel verdwijnt, anders blijft
// het geheugen vollopen naarmate je door de lijst scrollt.
export function useFoto(id, heeftFoto) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!heeftFoto) {
      setUrl(null);
      return;
    }
    let actief = true;
    let gemaakt = null;

    haalFoto(id).then((blob) => {
      if (!blob || !actief) return;
      gemaakt = URL.createObjectURL(blob);
      setUrl(gemaakt);
    });

    return () => {
      actief = false;
      if (gemaakt) URL.revokeObjectURL(gemaakt);
    };
  }, [id, heeftFoto]);

  return url;
}
