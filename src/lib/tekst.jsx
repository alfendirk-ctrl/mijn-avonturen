import { Fragment } from "react";

// Waar mag een lange naam afbreken?
//
// "BatensteinBuiten" past op een telefoon niet op één regel in een kaart van
// 131px. De browser kent geen breekpunt in dat woord, dus met
// `overflow-wrap:anywhere` kapte hij het af tot "BatensteinBuite" en "n" — wat
// leest als een rendeerfout, niet als een afbreking.
//
// Maar er ís een breekpunt: de hoofdletter middenin. Samengestelde namen van
// horeca en attracties worden bijna altijd zo geschreven. We zetten daar een
// <wbr> neer: een plek waar de browser MAG afbreken, zonder ooit een streepje
// of spatie toe te voegen als het niet nodig is.
//
// `overflow-wrap:anywhere` blijft als laatste redmiddel staan voor een woord
// dat écht nergens een grens heeft — dan is lelijk afbreken nog altijd beter
// dan horizontaal buiten de kaart lopen.
const GRENS = /(?<=\p{Ll})(?=\p{Lu})/gu;

export function metBreekpunten(naam) {
  const tekst = String(naam ?? "");
  // Woorden met een spatie erin breken al netjes; alleen de aaneengeschreven
  // stukken hebben hulp nodig.
  const delen = tekst.split(GRENS);
  if (delen.length < 2) return tekst;
  return delen.map((deel, i) => (
    <Fragment key={i}>
      {i > 0 && <wbr />}
      {deel}
    </Fragment>
  ));
}
