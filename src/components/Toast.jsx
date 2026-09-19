// Toont de actieve meldingen onderin het scherm.
//
// role="status" met aria-live="polite": een melding als "Toegevoegd" of
// "Verwijderd" was hiervoor alleen te zien. Wie de app met een schermlezer
// gebruikt kreeg geen enkele bevestiging dat zijn actie gelukt was.
export default function Toast({ toasts }) {
  return (
    <div className="toast-wrap" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type === "danger" ? "d" : "s"}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
