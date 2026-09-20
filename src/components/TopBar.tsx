"use client";

export function TopBar({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className={`burger ${open ? "is-open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
      </button>
      <img
        src="/brand/wordmark.jpg"
        alt="Esteticar"
        className="h-9 w-[148px] rounded-lg object-cover object-center ring-1 ring-white/10"
      />
      <span className="icon-btn text-[10px] font-extrabold tracking-[0.12em] text-[#b8ecf6]">
        MX
      </span>
    </header>
  );
}
