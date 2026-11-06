import { useMemo, useState } from "react";
import {
  huidigeMaand,
  MAAND_LABEL,
  pastInMaand,
  themaVanMaand,
} from "../lib/afleiden.js";
import { SOORTEN } from "../data/seed.js";
import ActivityCard from "../components/ActivityCard.jsx";
import AfstandSlider, { binnenBereik, KM_ALLES } from "../components/AfstandSlider.jsx";
import { beschrijfRit } from "../lib/rijden.js";

// Hoeveel suggesties we tonen voordat we naar de volledige lijst verwijzen.
const MAX_SUGGESTIES = 8;

// Hoeveel tagknoppen er hoogstens onder de schuif staan. Dit is het
// startscherm: elke rij knoppen erbij duwt het eerste avontuur verder naar
// beneden, en de tagbalk groeit mee met elke tag die de gebruiker verzint.
// Zes is ongeveer één regel op een telefoon. Een gekozen tag staat er altijd
// bij, ook als hij niet in de top zes valt - anders verdwijnt je eigen filter
// uit beeld terwijl hij wel werkt.
const MAX_TAGKNOPPEN = 6;

// Vanaf hoeveel sterren een avontuur dat je al gedaan hebt weer meedoet. Een
// plek waar het goed was is geen afgehandeld punt maar een plek om terug te
// gaan; drie is "het was prima". Zonder oordeel (0 sterren) doet hij niet mee,
// want dan weten we niet of het de moeite was.
const TERUG_VANAF = 3;

// "Wat doen we?" — het startscherm. Laat alleen zien wat nú kan: in dit
// seizoen, binnen het gekozen bereik, en nog niet gedaan.
export default function NuView({ items, catMeta, onOpen, onToggleDone, onToggleFav, onGaNaar, rijInfo }) {
  // Zodra er rijafstanden bekend zijn gaat de schuif in kilometers. Die staat
  // dan standaard op "alles": pas als je hem zelf verzet raak je iets kwijt.
  const kmModus = useMemo(
    () => items.some((a) => rijInfo?.(a.locatie)),
    [items, rijInfo],
  );
  const [bereikKlasse, setBereikKlasse] = useState(0); // 0 = alleen Nederland
  const [bereikKm, setBereikKm] = useState(KM_ALLES);
  const bereik = kmModus ? bereikKm : bereikKlasse;
  const setBereik = kmModus ? setBereikKm : setBereikKlasse;
  // "alles", of de naam van één categorie. Hier stonden twee knoppen,
  // "Uitjes" en "Alles", die bepaalden of hikes en reizen meededen in de
  // dobbelsteen. Dat leverde op een scherm dat "wat doen we nú?" vraagt een
  // Pacific Crest Trail op. Weg; de plek is naar de categorieën gegaan, want
  // dat is wat je wél wil kiezen: zin in eten, of in een speeltuin.
  const [categorie, setCategorie] = useState("alles");
  // Gekozen tags, kleine letters. Meerdere tags betekent "alle van deze",
  // net als in de lijst: het punt van tags is de overlap vinden.
  const [tags, setTags] = useState([]);
  const [verrast, setVerrast] = useState(null);
  const [zichtbaar, setZichtbaar] = useState(false);

  const maand = huidigeMaand();
  const thema = themaVanMaand(maand);

  // Wat er nú kan, los van categorie en tags. Hikes en reizen doen niet mee:
  // dit scherm gaat over vanmiddag, niet over volgend jaar - daar zijn hun
  // eigen tabbladen voor.
  const kanNu = useMemo(
    () =>
      items.filter(
        (a) =>
          a.soort === "uitje" &&
          // Gedaan valt af, behalve als je het goed vond. Dan is het geen
          // afgevinkt punt meer maar een tip van jezelf.
          (!a.gedaan || a.waardering >= TERUG_VANAF) &&
          pastInMaand(a.maanden, maand) &&
          binnenBereik(a, bereik, kmModus, rijInfo),
      ),
    [items, bereik, kmModus, rijInfo, maand],
  );

  // Welke categorieën leveren nu iets op, en hoeveel? Een categorie die niets
  // oplevert hoort er niet te staan: dan tik je op een knop en krijg je niets.
  const catTelling = useMemo(() => {
    const m = new Map();
    for (const a of kanNu) m.set(a.categorie, (m.get(a.categorie) ?? 0) + 1);
    return [...m.entries()]
      .map(([naam, aantal]) => ({ naam, aantal }))
      .sort((a, b) => b.aantal - a.aantal || a.naam.localeCompare(b.naam));
  }, [kanNu]);

  // Alles wat nú kan binnen de gekozen categorie, nog zonder tagfilter.
  // Hieruit komen ook de tagknoppen: een tag die niets zou opleveren hoort er
  // niet te staan.
  const basis = useMemo(
    () => (categorie === "alles" ? kanNu : kanNu.filter((a) => a.categorie === categorie)),
    [kanNu, categorie],
  );

  const tagTelling = useMemo(() => {
    const telling = new Map();
    basis.forEach((a) =>
      (a.tags || []).forEach((t) => {
        const sleutel = t.toLowerCase();
        const vorig = telling.get(sleutel);
        telling.set(sleutel, {
          sleutel,
          tag: vorig?.tag ?? t,
          aantal: (vorig?.aantal ?? 0) + 1,
        });
      }),
    );
    const alle = [...telling.values()].sort(
      (a, b) => b.aantal - a.aantal || a.tag.localeCompare(b.tag),
    );
    const top = alle.slice(0, MAX_TAGKNOPPEN);
    const gekozen = alle.filter(
      (t) => tags.includes(t.sleutel) && !top.includes(t),
    );
    return [...top, ...gekozen];
  }, [basis, tags, rijInfo]);

  const passend = useMemo(() => {
    return basis
      .filter((a) => {
        if (!tags.length) return true;
        const eigen = (a.tags || []).map((t) => t.toLowerCase());
        return tags.every((t) => eigen.includes(t));
      })
      .sort((a, b) => {
        // Favorieten eerst, dan dingen die júist nu in het seizoen zijn, en
        // daarbinnen het dichtstbijzijnde bovenaan - er worden er maar acht
        // getoond, dus dat bepaalt welke acht je ziet. Zonder thuisadres valt
        // die stap vanzelf weg en blijft de volgorde precies zoals hij was.
        if (a.favoriet !== b.favoriet) return a.favoriet ? -1 : 1;
        const aSeizoen = a.maanden.length > 0;
        const bSeizoen = b.maanden.length > 0;
        if (aSeizoen !== bSeizoen) return aSeizoen ? -1 : 1;
        const va = rijInfo?.(a.locatie)?.km ?? Infinity;
        const vb = rijInfo?.(b.locatie)?.km ?? Infinity;
        if (va !== vb) return va - vb;
        return a.naam.localeCompare(b.naam);
      });
  }, [basis, tags]);

  const verrasMe = () => {
    if (!passend.length) return;
    // Nogmaals dobbelen en hetzelfde uitje terugkrijgen leest als een kapotte
    // knop. Zolang er iets anders te kiezen valt, sluiten we de huidige uit.
    const keuze =
      passend.length > 1 && verrast
        ? passend.filter((a) => a.id !== verrast.id)
        : passend;
    setZichtbaar(false);
    setTimeout(() => {
      setVerrast(keuze[Math.floor(Math.random() * keuze.length)]);
      setZichtbaar(true);
    }, 40);
  };

  const wissel = (zetter) => (waarde) => {
    zetter(waarde);
    setVerrast(null);
  };

  const wisselTag = (sleutel) => {
    setTags((huidig) =>
      huidig.includes(sleutel)
        ? huidig.filter((t) => t !== sleutel)
        : [...huidig, sleutel],
    );
    setVerrast(null);
  };

  return (
    <div className="nu">
      <div className="nu-kop">
        <div className="nu-watermerk" aria-hidden="true">
          {MAAND_LABEL[maand]}
        </div>
        <div className="nu-seizoen">
          {thema.emoji} {thema.naam} — {thema.stemming}
        </div>
        <h2 className="nu-eye">Wat doen we?</h2>
        <div className="nu-lead">
          {items.length === 0
            ? "Nog niets om uit te kiezen."
            : passend.length === 0
              ? "Niets gevonden binnen dit bereik."
              : `${passend.length} ${passend.length === 1 ? "idee past" : "ideeën passen"} bij ${MAAND_LABEL[maand]}.`}
        </div>
      </div>

      <div className="nu-bar">
        <button className="vbtn" onClick={verrasMe} disabled={!passend.length}>
          🎲 Verras me
        </button>
      </div>

      {/* Waar de dobbelsteen uit put. Eén rij die zichzelf schuift, zoals in
          de lijst - zodat een categorie er overal hetzelfde uitziet. */}
      {catTelling.length > 1 && (
        <div className="cats-row nu-cats">
          <button
            className={`chip${categorie === "alles" ? " on" : ""}`}
            style={
              categorie === "alles"
                ? { background: "var(--accent)", borderColor: "var(--accent)" }
                : undefined
            }
            onClick={() => wissel(setCategorie)("alles")}
          >
            Alles <span className="chip-count">{kanNu.length}</span>
          </button>
          {catTelling.map(({ naam, aantal }) => {
            const cm = catMeta(naam);
            const actief = categorie === naam;
            return (
              <button
                key={naam}
                className={`chip${actief ? " on" : ""}`}
                style={actief ? { background: cm.kleur, borderColor: cm.kleur } : undefined}
                onClick={() => wissel(setCategorie)(naam)}
              >
                {cm.emoji} {naam} <span className="chip-count">{aantal}</span>
              </button>
            );
          })}
        </div>
      )}

      <AfstandSlider
        waarde={bereik}
        onChange={wissel(setBereik)}
        aantal={passend.length}
        kmModus={kmModus}
      />

      {tagTelling.length > 0 && (
        <div className="nu-tags">
          <span className="nu-tags-lbl">Met</span>
          {tagTelling.map(({ sleutel, tag, aantal }) => (
            <button
              key={sleutel}
              className={`tag-knop${tags.includes(sleutel) ? " on" : ""}`}
              aria-pressed={tags.includes(sleutel)}
              onClick={() => wisselTag(sleutel)}
            >
              {tag} <span className="chip-count">{aantal}</span>
            </button>
          ))}
          {tags.length > 0 && (
            <button className="tag-knop wis" onClick={() => { setTags([]); setVerrast(null); }}>
              Wis
            </button>
          )}
        </div>
      )}

      {verrast && (
        <div className="vcard">
          {/* Was een kale div met een onClick: met een toetsenbord of
              schermlezer was de uitkomst van de dobbelsteen niet te openen,
              terwijl elke gewone kaart dat wel is. */}
          <div
            className={`vcard-in${zichtbaar ? " on" : ""}`}
            onClick={() => onOpen(verrast)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && onOpen(verrast)
            }
          >
            <div className="vcard-eye">Doe dit</div>
            <div className="vcard-naam">{verrast.naam}</div>
            <div className="vcard-meta">
              {catMeta(verrast.categorie).emoji} {verrast.categorie} ·{" "}
              {verrast.locatie}
              {verrast.periode && ` · 🗓 ${verrast.periode}`}
            </div>
            {rijInfo?.(verrast.locatie) && (
              <div className="vcard-rit">🚗 {beschrijfRit(rijInfo(verrast.locatie))}</div>
            )}
          </div>
        </div>
      )}

      {passend.length === 0 ? (
        // Een lege lijst en een te krap bereik zien er hetzelfde uit maar
        // vragen om iets heel anders. "Schuif de afstand verder open" is een
        // loos advies als er helemaal niets ís: dan helpt geen enkele afstand.
        <div className="nu-leeg">
          <span className="empty-ico">{items.length === 0 ? "✨" : "🗺️"}</span>
          <div className="empty-h">
            {items.length === 0
              ? "Nog niets verzameld"
              : tags.length > 0
                ? "Niets met deze tags"
                : categorie !== "alles"
                  ? `Niets in ${categorie}`
                  : "Niets binnen dit bereik"}
          </div>
          <div className="empty-p">
            {items.length === 0
              ? "Voeg je eerste avontuur toe, dan staat hier wat er nú kan."
              : tags.length > 0
                ? `Geen enkel idee heeft ${tags.length === 1 ? "deze tag" : "al deze tags"} én past bij dit bereik.`
                : categorie !== "alles"
                  ? "Kies een andere categorie, of schuif de afstand verder open."
                  : "Schuif de afstand verder open, of kijk later nog eens."}
          </div>
          {items.length > 0 && tags.length > 0 && (
            <button className="btn empty-knop" onClick={() => { setTags([]); setVerrast(null); }}>
              Tagfilter wissen
            </button>
          )}
          {items.length === 0 && (
            /* De eerste keer met een lege lijst. Geen rondleiding: drie regels
               die zeggen waar dit voor is, en één knop die je meteen op de
               plek zet waar het gebeurt. Wie al weet hoe het werkt, scrollt er
               in één blik overheen. */
            <div className="eerstekeer">
              <ul className="eerstekeer-lijst">
                <li>
                  <span aria-hidden="true">✨</span>
                  Zie je iets leuks voorbijkomen? Maak een screenshot en laat de
                  app naam, plaats en seizoen eruit halen.
                </li>
                <li>
                  <span aria-hidden="true">🗓</span>
                  Vul je een periode in, dan weet dit scherm vanzelf wat er nú
                  kan.
                </li>
                <li>
                  <span aria-hidden="true">📍</span>
                  Vul je een plaats in, dan verschijnt het op de kaart. Verder
                  hoef je niets bij te houden.
                </li>
              </ul>
              <button className="btn acc nu-leeg-knop" onClick={() => onGaNaar("uitje")}>
                + Eerste avontuur toevoegen
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid nu-grid">
            {passend.slice(0, MAX_SUGGESTIES).map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                cat={catMeta(a.categorie)}
                onClick={() => onOpen(a)}
                onToggleDone={() => onToggleDone(a)}
                onToggleFav={onToggleFav ? () => onToggleFav(a) : undefined}
                rit={rijInfo?.(a.locatie)}
              />
            ))}
          </div>
          {passend.length > MAX_SUGGESTIES && (
            <div className="nu-meer">
              <span>
                Nog {passend.length - MAX_SUGGESTIES} meer die nu passen
              </span>
              <div className="nu-meer-knoppen">
                {Object.entries(SOORTEN).map(([key, s]) => (
                  <button key={key} className="btn" onClick={() => onGaNaar(key)}>
                    {s.emoji} {s.kort}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
