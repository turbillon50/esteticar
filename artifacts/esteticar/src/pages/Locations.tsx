import { useState, useEffect } from "react";
import { useListLocations } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  BsGeoAlt, BsClock, BsTelephone, BsArrowRight,
  BsCheckCircleFill, BsStar, BsStarFill,
} from "react-icons/bs";
import "leaflet/dist/leaflet.css";

const CITY_COORDS: Record<string, [number, number]> = {
  "Cuernavaca": [18.9242, -99.2216],
  "Jiutepec":   [18.8861, -99.1708],
  "Cuautla":    [18.8064, -98.9456],
  "Temixco":    [18.8511, -99.2344],
  "Yautepec":   [18.8928, -99.0634],
  "Jojutla":    [18.6180, -99.1800],
  "Xochitepec": [18.8078, -99.2428],
};

const LOC_IMGS: string[] = [
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1594392175511-30eca83d51c8?w=600&q=80",
  "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
  "https://images.unsplash.com/photo-1599256621730-535171e28e50?w=600&q=80",
  "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
];

function getCoords(location: any): [number, number] {
  const city = location.city?.trim() ?? "";
  for (const [key, val] of Object.entries(CITY_COORDS)) {
    if (city.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return [18.9242, -99.2216];
}

function MapSection({ locations, selected, onSelect }: {
  locations: any[];
  selected: any;
  onSelect: (l: any) => void;
}) {
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarkerComp] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      const rl = await import("react-leaflet");
      const Lmod = leaflet.default ?? leaflet;

      delete (Lmod.Icon.Default.prototype as any)._getIconUrl;
      Lmod.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      setL(Lmod);
      setMapContainer(() => rl.MapContainer);
      setTileLayer(() => rl.TileLayer);
      setMarkerComp(() => rl.Marker);
      setReady(true);
    })();
  }, []);

  if (!ready || !MapContainer || !TileLayer || !Marker || !L) {
    return (
      <div style={{
        height: 260, borderRadius: 24, margin: "0 16px 24px",
        background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, border: "3px solid #48cae4", borderTopColor: "transparent", borderRadius: "50%" }}
            className="animate-spin" />
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>Cargando mapa...</p>
        </div>
      </div>
    );
  }

  const center: [number, number] = selected ? getCoords(selected) : [18.83, -99.15];

  const customIcon = (loc: any) => {
    const isSelected = selected?.id === loc.id;
    return L.divIcon({
      className: "",
      html: `<div style="
        width:${isSelected ? 40 : 32}px;
        height:${isSelected ? 40 : 32}px;
        border-radius:50% 50% 50% 4px;
        background:${isSelected ? "linear-gradient(135deg,#0077b6,#00b4d8)" : "linear-gradient(135deg,#03045e,#0077b6)"};
        border:${isSelected ? "3px solid #48cae4" : "2px solid rgba(255,255,255,0.8)"};
        box-shadow:0 4px 16px rgba(3,4,94,0.4);
        display:flex;align-items:center;justify-content:center;
        transform:${isSelected ? "scale(1.15)" : "scale(1)"};
        transition:all 0.2s;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>`,
      iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
      iconAnchor: [isSelected ? 20 : 16, isSelected ? 40 : 32],
    });
  };

  return (
    <div style={{ margin: "0 16px 24px", borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 32px rgba(3,4,94,0.2)" }}>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: 260, width: "100%" }}
        zoomControl={false}
        key={selected?.id ?? "all"}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.filter(l => l.isActive).map((loc) => {
          const coords = getCoords(loc);
          return (
            <Marker
              key={loc.id}
              position={coords}
              icon={customIcon(loc)}
              eventHandlers={{ click: () => onSelect(loc) }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

export default function Locations() {
  const { data: locations, isLoading } = useListLocations();
  const [selected, setSelected] = useState<any>(null);
  const [, navigate] = useLocation();

  const active = locations?.filter(l => l.isActive) ?? [];
  const displayed = selected ? [selected] : active;

  return (
    <div style={{ minHeight: "100dvh", background: "#f0f4f8" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(150deg,#020b1a 0%,#03045e 50%,#0077b6 90%)",
        padding: "54px 20px 24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -30, right: -20, width: 120, height: 120,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(0,180,216,0.1)", pointerEvents: "none",
        }} />
        <p style={{ color: "#48cae4", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>
          Dónde estamos
        </p>
        <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 28, lineHeight: 1.1, marginBottom: 4 }}>
          Sucursales Esteticar
        </h1>
        <p style={{ color: "rgba(144,224,239,0.7)", fontSize: 13, fontWeight: 500 }}>
          {active.length} autolavados en Morelos
        </p>
      </div>

      {/* Map */}
      <div style={{ marginTop: 20 }}>
        {isLoading ? (
          <div style={{
            height: 260, borderRadius: 24, margin: "0 16px 24px",
            background: "#e0e8f0",
          }} />
        ) : (
          <MapSection locations={active} selected={selected} onSelect={l => setSelected(selected?.id === l.id ? null : l)} />
        )}
      </div>

      {/* Filter chips */}
      {!isLoading && active.length > 0 && (
        <div style={{ padding: "0 16px 16px", overflowX: "auto", display: "flex", gap: 8, scrollbarWidth: "none" }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(null)}
            style={{
              flexShrink: 0, height: 34, paddingLeft: 14, paddingRight: 14,
              borderRadius: 12, fontWeight: 700, fontSize: 12,
              background: !selected ? "linear-gradient(135deg,#03045e,#0077b6)" : "#fff",
              color: !selected ? "#fff" : "#90a0b7",
              border: "none", cursor: "pointer", fontFamily: "inherit",
              boxShadow: !selected ? "0 3px 12px rgba(3,4,94,0.25)" : "0 1px 4px rgba(3,4,94,0.08)",
            }}>
            Todas
          </motion.button>
          {[...new Set(active.map(l => l.city))].map(city => (
            <motion.button
              key={city}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const found = active.find(l => l.city === city);
                setSelected(selected?.city === city ? null : found ?? null);
              }}
              style={{
                flexShrink: 0, height: 34, paddingLeft: 14, paddingRight: 14,
                borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: "nowrap",
                background: selected?.city === city ? "linear-gradient(135deg,#0077b6,#00b4d8)" : "#fff",
                color: selected?.city === city ? "#fff" : "#90a0b7",
                border: "none", cursor: "pointer", fontFamily: "inherit",
                boxShadow: selected?.city === city ? "0 3px 12px rgba(0,119,182,0.3)" : "0 1px 4px rgba(3,4,94,0.08)",
              }}>
              {city}
            </motion.button>
          ))}
        </div>
      )}

      {/* Cards */}
      <div style={{ padding: "0 16px 100px", display: "flex", flexDirection: "column", gap: 20 }}>
        {isLoading
          ? [1, 2, 3].map(i => <div key={i} style={{ height: 220, borderRadius: 24, background: "#e0e8f0" }} />)
          : displayed.map((loc, i) => {
            const img = LOC_IMGS[i % LOC_IMGS.length];
            const isSelected = selected?.id === loc.id;
            return (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                onClick={() => setSelected(isSelected ? null : loc)}
                style={{
                  borderRadius: 24, overflow: "hidden",
                  boxShadow: isSelected
                    ? "0 12px 40px rgba(3,4,94,0.25)"
                    : "0 4px 18px rgba(3,4,94,0.10)",
                  cursor: "pointer",
                  border: isSelected ? "2px solid rgba(0,180,216,0.4)" : "2px solid transparent",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
              >
                {/* Photo */}
                <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                  <img
                    src={img}
                    alt={loc.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, rgba(3,4,94,0.1) 0%, rgba(3,4,94,0.7) 100%)",
                  }} />
                  {/* City badge */}
                  <div style={{
                    position: "absolute", top: 12, left: 12,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 10, padding: "4px 10px",
                  }}>
                    <p style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{loc.city}</p>
                  </div>
                  {/* Open badge */}
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: "rgba(0,200,100,0.85)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 8, padding: "4px 10px",
                  }}>
                    <p style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>Abierto</p>
                  </div>
                  {/* Name overlay at bottom */}
                  <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                    <p style={{ color: "#fff", fontWeight: 900, fontSize: 20, lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                      {loc.name}
                    </p>
                  </div>
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div style={{
                      position: "absolute", bottom: 14, right: 16,
                    }}>
                      <BsCheckCircleFill style={{ color: "#48cae4", fontSize: 22 }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ background: "#fff", padding: "16px 18px 18px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <BsGeoAlt style={{ color: "#0077b6", fontSize: 15, flexShrink: 0, marginTop: 2 }} />
                      <p style={{ color: "#566170", fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
                        {loc.address}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <BsClock style={{ color: "#0077b6", fontSize: 13 }} />
                        <span style={{ color: "#03045e", fontSize: 13, fontWeight: 700 }}>
                          {loc.openTime} – {loc.closeTime}
                        </span>
                      </div>
                      {loc.phone && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <BsTelephone style={{ color: "#0077b6", fontSize: 13 }} />
                          <span style={{ color: "#03045e", fontSize: 13, fontWeight: 700 }}>{loc.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Stars */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {[1,2,3,4,5].map(s => (
                        s <= 4
                          ? <BsStarFill key={s} style={{ color: "#f59e0b", fontSize: 12 }} />
                          : <BsStar key={s} style={{ color: "#e5e7eb", fontSize: 12 }} />
                      ))}
                      <span style={{ color: "#90a0b7", fontSize: 12, fontWeight: 600, marginLeft: 4 }}>4.0 · 24 reseñas</span>
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={e => { e.stopPropagation(); navigate("/book"); }}
                      style={{
                        width: "100%", height: 46, borderRadius: 14,
                        background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)",
                        color: "#fff", fontWeight: 900, fontSize: 14,
                        border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        fontFamily: "inherit",
                        boxShadow: "0 4px 16px rgba(0,119,182,0.3)",
                        marginTop: 4,
                      }}>
                      Reservar aquí <BsArrowRight />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        }
      </div>
    </div>
  );
}
