/**
 * UnifiedMap — switches between Google Maps and Leaflet.
 * Set VITE_GOOGLE_MAPS_API_KEY in environment to activate Google Maps.
 * Falls back to OpenStreetMap via Leaflet when no key is present.
 */
import { useEffect, useState, useCallback } from "react";
import { makeDivIcon, makePinUrl, PinState } from "@/lib/esteticarPin";
import "leaflet/dist/leaflet.css";

export interface MapLocation {
  id: string | number;
  lat: number;
  lng: number;
  name?: string;
  state?: PinState;
}

export interface UnifiedMapProps {
  center: [number, number];
  zoom?: number;
  height?: number | string;
  locations: MapLocation[];
  userPosition?: [number, number] | null;
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (loc: MapLocation) => void;
  pendingPin?: [number, number] | null;
  editMode?: boolean;
}

// ─── Leaflet implementation ─────────────────────────────────────────────────
function LeafletMap({
  center, zoom = 13, height = 260, locations, userPosition,
  onMapClick, onMarkerClick, pendingPin, editMode,
}: UnifiedMapProps) {
  const [ready, setReady] = useState(false);
  const [Comps, setComps] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      const rl = await import("react-leaflet");
      const Lmod = leaflet.default ?? leaflet;
      setL(Lmod);
      setComps(rl);
      setReady(true);
    })();
  }, []);

  const userIcon = useCallback(() => {
    if (!L) return null;
    return L.divIcon({
      className: "",
      html: `<div style="
        width:18px;height:18px;border-radius:50%;
        background:radial-gradient(circle,#00b4d8 25%,rgba(0,180,216,0.25) 75%);
        border:2.5px solid #fff;
        box-shadow:0 0 0 5px rgba(0,180,216,0.22),0 2px 8px rgba(0,0,0,0.25);
      "></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  }, [L]);

  if (!ready || !Comps || !L) {
    return (
      <div style={{ height, background: "linear-gradient(135deg,#03045e,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 22, height: 22, border: "3px solid #48cae4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, useMapEvents } = Comps;

  function MapEvents() {
    useMapEvents({
      click(e: any) {
        if (onMapClick && editMode) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      },
    });
    return null;
  }

  return (
    <MapContainer
      key={`${center[0]}-${center[1]}`}
      center={center}
      zoom={zoom}
      style={{ height, width: "100%", cursor: editMode ? "crosshair" : "grab" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents />

      {/* User dot */}
      {userPosition && userIcon() && (
        <Marker position={userPosition} icon={userIcon()} />
      )}

      {/* Pending pin (add mode) */}
      {pendingPin && (
        <Marker
          position={pendingPin}
          icon={makeDivIcon(L, "new", 44)}
        />
      )}

      {/* Location pins */}
      {locations.map(loc => {
        const icon = makeDivIcon(L, loc.state ?? "normal", loc.state === "selected" ? 50 : 44);
        return (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={icon}
            eventHandlers={{ click: () => onMarkerClick?.(loc) }}
          />
        );
      })}
    </MapContainer>
  );
}

// ─── Google Maps implementation ─────────────────────────────────────────────
function GoogleMapsMap({
  center, zoom = 13, height = 260, locations, userPosition,
  onMapClick, onMarkerClick, pendingPin, editMode,
}: UnifiedMapProps) {
  const [ready, setReady] = useState(false);
  const [Comps, setComps] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const gm = await import("@react-google-maps/api");
      setComps(gm);
      setReady(true);
    })();
  }, []);

  if (!ready || !Comps) {
    return (
      <div style={{ height, background: "linear-gradient(135deg,#03045e,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 22, height: 22, border: "3px solid #48cae4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const { useLoadScript, GoogleMap, Marker, Circle } = Comps;

  function Inner() {
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ?? "",
    });

    const mapOptions = {
      disableDefaultUI: true,
      zoomControl: false,
      gestureHandling: "greedy",
      mapTypeId: "roadmap",
      styles: [
        { elementType: "geometry", stylers: [{ color: "#f0f4f8" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#caf0f8" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#03045e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
      ],
    };

    if (!isLoaded) return (
      <div style={{ height, background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 22, height: 22, border: "3px solid #0077b6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );

    return (
      <GoogleMap
        mapContainerStyle={{ width: "100%", height }}
        center={{ lat: center[0], lng: center[1] }}
        zoom={zoom}
        options={mapOptions}
        onClick={(e: any) => {
          if (editMode && onMapClick && e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        }}
      >
        {/* User position */}
        {userPosition && (
          <Circle
            center={{ lat: userPosition[0], lng: userPosition[1] }}
            radius={60}
            options={{ fillColor: "#00b4d8", fillOpacity: 0.35, strokeColor: "#0077b6", strokeWeight: 2 }}
          />
        )}

        {/* Pending pin */}
        {pendingPin && (
          <Marker
            position={{ lat: pendingPin[0], lng: pendingPin[1] }}
            icon={{ url: makePinUrl("new", 44), anchor: new google.maps.Point(22, 59) }}
          />
        )}

        {/* Location pins */}
        {locations.map(loc => (
          <Marker
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            icon={{ url: makePinUrl(loc.state ?? "normal", loc.state === "selected" ? 50 : 44), anchor: new google.maps.Point(25, 59) }}
            onClick={() => onMarkerClick?.(loc)}
          />
        ))}
      </GoogleMap>
    );
  }

  return <Inner />;
}

// ─── Main export — auto-selects map provider ────────────────────────────────
export default function UnifiedMap(props: UnifiedMapProps) {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  if (apiKey) return <GoogleMapsMap {...props} />;
  return <LeafletMap {...props} />;
}
