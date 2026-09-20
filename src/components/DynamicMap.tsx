"use client";

import dynamic from "next/dynamic";

export const DynamicMap = dynamic(
  () => import("./BranchMap").then((m) => m.BranchMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid h-[240px] place-items-center rounded-[24px]"
        style={{
          background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)",
        }}
      >
        <p className="text-sm font-semibold text-white/80">Cargando mapa…</p>
      </div>
    ),
  },
);
