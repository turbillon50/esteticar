"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Coord } from "@/lib/geo";
import type { Location } from "@/lib/types";

function pinIcon(selected: boolean) {
  const size = selected ? 40 : 32;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:50% 50% 50% 4px;
      background:${selected ? "linear-gradient(135deg,#0077b6,#00b4d8)" : "linear-gradient(135deg,#03045e,#0077b6)"};
      border:${selected ? "3px solid #48cae4" : "2px solid rgba(255,255,255,0.85)"};
      box-shadow:0 4px 16px rgba(3,4,94,0.4);
      display:flex;align-items:center;justify-content:center;
      transform:rotate(-45deg);
    "><span style="transform:rotate(45deg);color:#fff;font-size:11px;font-weight:900;">E</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

function Recenter({ center, zoom }: { center: Coord; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom, map]);
  return null;
}

export function BranchMap({
  locations,
  origin,
  selectedId,
  onSelect,
  height = 240,
}: {
  locations: Location[];
  origin: Coord;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  height?: number;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] shadow-[0_8px_32px_rgba(3,4,94,0.2)]">
      <MapContainer
        center={[origin.lat, origin.lng]}
        zoom={11}
        style={{ height, width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <Recenter center={origin} zoom={11} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CircleMarker
          center={[origin.lat, origin.lng]}
          radius={9}
          pathOptions={{
            color: "#fff",
            weight: 3,
            fillColor: "#00b4d8",
            fillOpacity: 1,
          }}
        />
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={pinIcon(selectedId === loc.id)}
            eventHandlers={{
              click: () => onSelect?.(loc.id),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
