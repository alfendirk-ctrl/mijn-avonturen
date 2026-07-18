// Toont de actieve toast-meldingen onderin het scherm.
export default function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type === "danger" ? "d" : "s"}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
