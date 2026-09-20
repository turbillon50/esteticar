"use client";

import dynamic from "next/dynamic";
import type { Coord } from "@/lib/geo";
import type { Location } from "@/lib/types";

const Inner = dynamic(() => import("./BranchMap").then((m) => m.BranchMap), {
  ssr: false,
  loading: () => (
    <div
      className="grid h-[240px] place-items-center rounded-[24px]"
      style={{ background: "linear-gradient(180deg,#071428,#0a1a38)" }}
    >
      <p className="text-sm font-semibold text-white/80">Cargando mapa…</p>
    </div>
  ),
});

export function DynamicMap(props: {
  locations: Location[];
  origin: Coord;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  height?: number;
}) {
  return <Inner {...props} />;
}
