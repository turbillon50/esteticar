"use client";

import Link from "next/link";

export function AdminTopBar({
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
      <div className="text-center">
        <p className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#2ec4e0]">
          <span className="ops-dot" style={{ width: 6, height: 6 }} /> Ops
        </p>
        <p className="text-[13px] font-extrabold tracking-[0.12em] text-white">ESTETICAR</p>
      </div>
      <Link
        href="/"
        className="icon-btn text-[9px] font-extrabold tracking-[0.08em] text-[#b8ecf6]"
      >
        APP
      </Link>
    </header>
  );
}
