import { useState, useEffect } from "react";
import { useListLocations, getListLocationsQueryKey, useCreateLocation, useDeleteLocation } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  BsPlus, BsTrash, BsGeoAlt, BsXLg, BsPencilFill,
  BsCheckLg, BsMap, BsList, BsToggleOn, BsToggleOff,
  BsArrowLeft, BsClock, BsTelephone,
} from "react-icons/bs";
import UnifiedMap from "@/components/UnifiedMap";
import type { MapLocation } from "@/components/UnifiedMap";

const CITY_COORDS: Record<string, [number, number]> = {
  Cuernavaca:  [18.9242, -99.2216],
  Jiutepec:   [18.8861, -99.1708],
  Cuautla:    [18.8064, -98.9456],
  Temixco:    [18.8511, -99.2344],
  Yautepec:   [18.8928, -99.0634],
  Jojutla:    [18.618,  -99.18],
  Xochitepec: [18.8078, -99.2428],
  Huitzilac:  [19.01,   -99.205],
};

function getCoords(loc: any): [number, number] {
  if (loc.lat && loc.lng) return [parseFloat(loc.lat), parseFloat(loc.lng)];
  for (const [k, v] of Object.entries(CITY_COORDS)) {
    if (loc.city?.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return [18.9242, -99.2216];
}

// ─── Location form bottom sheet ──────────────────────────────────────────────
function LocationFormSheet({
  initialLat, initialLng, onClose, onSave, isSaving,
}: {
  initialLat?: number;
  initialLng?: number;
  onClose: () => void;
  onSave: (data: any) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    name: "", address: "", city: "", phone: "",
    openTime: "08:00", closeTime: "20:00",
    lat: initialLat?.toFixed(6) ?? "",
    lng: initialLng?.toFixed(6) ?? "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const fields = [
    { key: "name",      label: "Nombre del autolavado", type: "text",  required: true },
    { key: "address",   label: "Dirección",              type: "text",  required: true },
    { key: "city",      label: "Ciudad",                 type: "text",  required: true },
    { key: "phone",     label: "Teléfono",               type: "tel",   required: false },
    { key: "openTime",  label: "Abre",                   type: "time",  required: true },
    { key: "closeTime", label: "Cierra",                 type: "time",  required: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(3,4,94,0.55)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: "28px 28px 0 0", padding: "0 0 40px", maxHeight: "88dvh", overflowY: "auto" }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: "#e0e8f0" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 16px" }}>
          <div>
            <p style={{ fontWeight: 900, fontSize: 18, color: "#03045e" }}>Nueva sucursal</p>
            {initialLat && initialLng && (
              <p style={{ fontSize: 11, color: "#90a0b7", fontWeight: 600, marginTop: 2 }}>
                {initialLat.toFixed(5)}, {initialLng.toFixed(5)}
              </p>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0f4f8", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <BsXLg style={{ color: "#03045e", fontSize: 13 }} />
          </motion.button>
        </div>

        {/* Fields */}
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {fields.map(({ key, label, type }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#90a0b7", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                {label}{key !== "phone" ? " *" : ""}
              </label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={e => update(key, e.target.value)}
                style={{
                  width: "100%", height: 48, padding: "0 16px", borderRadius: 14,
                  background: "#f0f4f8", color: "#03045e", fontSize: 14, fontWeight: 700,
                  border: "2px solid transparent", outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
          ))}

          {/* Coords display */}
          {(form.lat || form.lng) && (
            <div style={{ display: "flex", gap: 8 }}>
              {["lat", "lng"].map(k => (
                <div key={k} style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#90a0b7", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    {k === "lat" ? "Latitud" : "Longitud"}
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form[k as "lat" | "lng"]}
                    onChange={e => update(k, e.target.value)}
                    style={{ width: "100%", height: 48, padding: "0 14px", borderRadius: 14, background: "#f0f4f8", color: "#03045e", fontSize: 13, fontWeight: 700, border: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Save button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isSaving || !form.name || !form.address || !form.city}
            onClick={() => onSave({
              ...form,
              lat: form.lat ? parseFloat(form.lat) : undefined,
              lng: form.lng ? parseFloat(form.lng) : undefined,
              isActive: true,
            })}
            style={{
              width: "100%", height: 54, borderRadius: 18, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#0077b6,#00b4d8)", color: "#fff",
              fontWeight: 900, fontSize: 16, fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              opacity: isSaving || !form.name || !form.address || !form.city ? 0.6 : 1,
              boxShadow: "0 6px 20px rgba(0,119,182,0.35)",
              marginTop: 8,
            }}
          >
            <BsGeoAlt style={{ fontSize: 17 }} />
            {isSaving ? "Guardando..." : "Crear autolavado"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Location info panel (shown when pin is tapped) ──────────────────────────
function LocationInfoPanel({
  location, onClose, onDelete, isDeleting,
}: {
  location: any;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 340 }}
      style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 500,
        background: "#fff", borderRadius: "24px 24px 0 0",
        padding: "6px 20px 36px",
        boxShadow: "0 -8px 32px rgba(3,4,94,0.15)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 10 }}>
        <div style={{ width: 36, height: 4, borderRadius: 4, background: "#e0e8f0" }} />
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {/* Esteticar mini pin badge */}
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <BsGeoAlt style={{ color: "#fff", fontSize: 14 }} />
            </div>
            <p style={{ fontWeight: 900, fontSize: 17, color: "#03045e" }}>{location.name}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <BsGeoAlt style={{ color: "#90a0b7", fontSize: 11 }} />
            <p style={{ fontSize: 12, color: "#90a0b7", fontWeight: 600 }}>{location.address}, {location.city}</p>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <BsClock style={{ color: "#0077b6", fontSize: 11 }} />
              <p style={{ fontSize: 12, color: "#0077b6", fontWeight: 700 }}>{location.openTime} – {location.closeTime}</p>
            </div>
            {location.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <BsTelephone style={{ color: "#0077b6", fontSize: 11 }} />
                <p style={{ fontSize: 12, color: "#0077b6", fontWeight: 700 }}>{location.phone}</p>
              </div>
            )}
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
          style={{ width: 34, height: 34, borderRadius: "50%", background: "#f0f4f8", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <BsXLg style={{ fontSize: 12, color: "#03045e" }} />
        </motion.button>
      </div>

      {/* Active badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 20, marginBottom: 14,
        background: location.isActive ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)",
        border: `1px solid ${location.isActive ? "rgba(22,163,74,0.25)" : "rgba(239,68,68,0.25)"}`,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: location.isActive ? "#16a34a" : "#ef4444" }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: location.isActive ? "#16a34a" : "#ef4444" }}>
          {location.isActive ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Delete controls */}
      {!confirmDelete ? (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setConfirmDelete(true)}
          style={{
            width: "100%", height: 50, borderRadius: 16,
            background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.2)",
            color: "#ef4444", fontWeight: 800, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: "inherit",
          }}
        >
          <BsTrash style={{ fontSize: 15 }} />
          Eliminar sucursal
        </motion.button>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setConfirmDelete(false)}
            style={{ flex: 1, height: 50, borderRadius: 16, background: "#f0f4f8", border: "none", color: "#03045e", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
          >
            Cancelar
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={isDeleting}
            onClick={onDelete}
            style={{ flex: 2, height: 50, borderRadius: 16, background: "linear-gradient(135deg,#b91c1c,#ef4444)", border: "none", color: "#fff", fontWeight: 900, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: isDeleting ? 0.7 : 1 }}
          >
            <BsTrash style={{ fontSize: 15 }} />
            {isDeleting ? "Eliminando..." : "Confirmar eliminar"}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main AdminLocations ──────────────────────────────────────────────────────
type ViewMode = "map" | "list";

export default function AdminLocations() {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [editMode, setEditMode] = useState(false);
  const [pendingPin, setPendingPin] = useState<[number, number] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState<any>(null);

  const queryClient = useQueryClient();
  const { data: locations, isLoading } = useListLocations({
    query: { queryKey: getListLocationsQueryKey() },
  });

  const createLocation = useCreateLocation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListLocationsQueryKey() });
        setPendingPin(null);
        setShowForm(false);
        setEditMode(false);
        toast.success("Sucursal creada");
      },
      onError: () => toast.error("Error al crear sucursal"),
    },
  });

  const deleteLocation = useDeleteLocation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListLocationsQueryKey() });
        setSelectedLoc(null);
        toast.success("Sucursal eliminada");
      },
      onError: () => toast.error("Error al eliminar"),
    },
  });

  // Map locations data
  const mapLocations: MapLocation[] = (locations ?? []).map(loc => {
    const [lat, lng] = getCoords(loc);
    return {
      id: loc.id,
      lat, lng,
      name: loc.name,
      state: selectedLoc?.id === loc.id ? "selected" : "normal",
    };
  });

  const mapCenter: [number, number] = mapLocations.length > 0
    ? [mapLocations[0].lat, mapLocations[0].lng]
    : [18.9242, -99.2216];

  const handleMapClick = (lat: number, lng: number) => {
    if (!editMode) return;
    setSelectedLoc(null);
    setPendingPin([lat, lng]);
    setShowForm(true);
  };

  const handleMarkerClick = (mapLoc: MapLocation) => {
    if (editMode) return;
    const loc = locations?.find(l => l.id === mapLoc.id);
    if (loc) setSelectedLoc(loc);
  };

  const exitEdit = () => {
    setEditMode(false);
    setPendingPin(null);
    setShowForm(false);
  };

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#f0f4f8", position: "relative" }}>

      {/* ─── Header ─── */}
      <div style={{
        background: "linear-gradient(150deg,#020b1a 0%,#03045e 55%,#0077b6 100%)",
        padding: "52px 20px 16px", flexShrink: 0, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,180,216,0.08)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "rgba(72,202,228,0.8)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>
            Admin · Modo creador
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>Sucursales</p>
              <p style={{ color: "rgba(144,224,239,0.7)", fontSize: 12, fontWeight: 600 }}>
                {locations?.length ?? 0} autolavados registrados
              </p>
            </div>

            {/* Map / List toggle */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: 3, gap: 2 }}>
              {([["map", BsMap, "Mapa"], ["list", BsList, "Lista"]] as const).map(([mode, Icon, label]) => (
                <motion.button
                  key={mode}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setViewMode(mode)}
                  style={{
                    height: 34, padding: "0 14px", borderRadius: 11, border: "none", cursor: "pointer",
                    background: viewMode === mode ? "rgba(255,255,255,0.9)" : "transparent",
                    color: viewMode === mode ? "#03045e" : "rgba(255,255,255,0.65)",
                    fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "inherit",
                  }}
                >
                  <Icon style={{ fontSize: 13 }} />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAP VIEW ─── */}
      {viewMode === "map" && (
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

          {/* Edit mode instruction banner */}
          <AnimatePresence>
            {editMode && !pendingPin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: "absolute", top: 12, left: 12, right: 12, zIndex: 400,
                  background: "linear-gradient(135deg,#0077b6,#00b4d8)",
                  borderRadius: 14, padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                  boxShadow: "0 4px 20px rgba(0,119,182,0.4)",
                }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: "#48cae4", boxShadow: "0 0 0 3px rgba(72,202,228,0.3)",
                  animation: "pulse 1.2s ease-in-out infinite",
                  flexShrink: 0,
                }} />
                <p style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>
                  Toca el mapa para colocar un nuevo autolavado
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map */}
          <UnifiedMap
            center={mapCenter}
            zoom={12}
            height="100%"
            locations={mapLocations}
            onMapClick={handleMapClick}
            onMarkerClick={handleMarkerClick}
            pendingPin={pendingPin}
            editMode={editMode}
          />

          {/* Info panel for selected location */}
          <AnimatePresence>
            {selectedLoc && !editMode && (
              <LocationInfoPanel
                location={selectedLoc}
                onClose={() => setSelectedLoc(null)}
                onDelete={() => deleteLocation.mutate({ id: selectedLoc.id })}
                isDeleting={deleteLocation.isPending}
              />
            )}
          </AnimatePresence>

          {/* FAB controls */}
          <div style={{ position: "absolute", bottom: 28, right: 16, zIndex: 400, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
            {editMode ? (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.93 }}
                onClick={exitEdit}
                style={{
                  height: 48, padding: "0 20px", borderRadius: 24, border: "none", cursor: "pointer",
                  background: "#fff", color: "#03045e", fontWeight: 900, fontSize: 14,
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 4px 20px rgba(3,4,94,0.2)",
                  fontFamily: "inherit",
                }}
              >
                <BsXLg style={{ fontSize: 13 }} />
                Salir del modo edición
              </motion.button>
            ) : (
              <>
                {/* Add FAB */}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => { setEditMode(true); setSelectedLoc(null); }}
                  style={{
                    width: 60, height: 60, borderRadius: 22, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 6px 24px rgba(0,119,182,0.45), 0 0 0 1px rgba(72,202,228,0.3)",
                    position: "relative",
                  }}
                >
                  <BsPlus style={{ color: "#fff", fontSize: 30 }} />
                  {/* Glow ring */}
                  <div style={{
                    position: "absolute", inset: -3, borderRadius: 25,
                    border: "2px solid rgba(72,202,228,0.4)", pointerEvents: "none",
                  }} />
                </motion.button>

                {/* Edit FAB */}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => { setEditMode(true); setSelectedLoc(null); }}
                  style={{
                    height: 44, padding: "0 18px", borderRadius: 22, border: "none", cursor: "pointer",
                    background: "#fff", color: "#0077b6", fontWeight: 800, fontSize: 13,
                    display: "flex", alignItems: "center", gap: 7,
                    boxShadow: "0 4px 16px rgba(3,4,94,0.15)",
                    fontFamily: "inherit",
                  }}
                >
                  <BsPencilFill style={{ fontSize: 12 }} />
                  Modo creador
                </motion.button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── LIST VIEW ─── */}
      {viewMode === "list" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1,2,3].map(i => <div key={i} style={{ height: 80, borderRadius: 20, background: "#e0e8f0" }} />)}
            </div>
          ) : (locations ?? []).map((loc, i) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                borderRadius: 20, overflow: "hidden", marginBottom: 12,
                background: "#fff", boxShadow: "0 2px 12px rgba(3,4,94,0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "stretch" }}>
                {/* Color stripe */}
                <div style={{ width: 5, background: "linear-gradient(180deg,#03045e,#00b4d8)", flexShrink: 0 }} />

                <div style={{ flex: 1, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Mini pin icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 14, flexShrink: 0,
                    background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <BsGeoAlt style={{ color: "#fff", fontSize: 16 }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <p style={{ fontWeight: 900, fontSize: 14, color: "#03045e" }}>{loc.name}</p>
                      <div style={{
                        padding: "1px 8px", borderRadius: 20,
                        background: loc.isActive ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)",
                        border: `1px solid ${loc.isActive ? "rgba(22,163,74,0.25)" : "rgba(239,68,68,0.25)"}`,
                      }}>
                        <span style={{ fontSize: 9, fontWeight: 900, color: loc.isActive ? "#16a34a" : "#ef4444" }}>
                          {loc.isActive ? "ACTIVO" : "INACTIVO"}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: "#90a0b7", fontWeight: 600, marginBottom: 2 }}>
                      {loc.address}, {loc.city}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <BsClock style={{ color: "#0077b6", fontSize: 9 }} />
                      <span style={{ fontSize: 11, color: "#0077b6", fontWeight: 700 }}>{loc.openTime} – {loc.closeTime}</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteLocation.mutate({ id: loc.id })}
                    style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >
                    <BsTrash style={{ color: "#ef4444", fontSize: 13 }} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Add FAB (list view) ─── */}
      {viewMode === "list" && (
        <div style={{ position: "fixed", bottom: 90, right: 20, zIndex: 300 }}>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => { setShowForm(true); setPendingPin(undefined as any); }}
            style={{
              width: 60, height: 60, borderRadius: 22, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#03045e,#0077b6,#00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 24px rgba(0,119,182,0.45), 0 0 0 1px rgba(72,202,228,0.3)",
              position: "relative",
            }}
          >
            <BsPlus style={{ color: "#fff", fontSize: 30 }} />
            <div style={{ position: "absolute", inset: -3, borderRadius: 25, border: "2px solid rgba(72,202,228,0.4)", pointerEvents: "none" }} />
          </motion.button>
        </div>
      )}

      {/* ─── Form sheet ─── */}
      <AnimatePresence>
        {showForm && (
          <LocationFormSheet
            initialLat={pendingPin?.[0]}
            initialLng={pendingPin?.[1]}
            onClose={() => { setShowForm(false); setPendingPin(null); }}
            onSave={data => createLocation.mutate({ data })}
            isSaving={createLocation.isPending}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.15)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
