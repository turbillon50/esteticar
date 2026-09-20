export type Coord = { lat: number; lng: number };

export const CUERNAVACA_CENTRO: Coord = { lat: 18.9242, lng: -99.2216 };

/** Bounding box de Morelos. Cubre las 6 ciudades de operación. */
export const MORELOS_BOUNDS = {
  minLat: 18.32,
  maxLat: 19.15,
  minLng: -99.5,
  maxLng: -98.62,
};

/** Velocidad urbana promedio en Morelos (incluye semáforos). Nunca se muestra km. */
const URBAN_KMH = 22;

export function isInMorelos(lat: number, lng: number): boolean {
  return (
    lat >= MORELOS_BOUNDS.minLat &&
    lat <= MORELOS_BOUNDS.maxLat &&
    lng >= MORELOS_BOUNDS.minLng &&
    lng <= MORELOS_BOUNDS.maxLng
  );
}

export function haversineKm(a: Coord, b: Coord): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function travelMinutes(km: number): number {
  return Math.max(1, Math.round((km / URBAN_KMH) * 60));
}

export function formatTravelTime(minutes: number): string {
  return `a ${Math.max(1, minutes)} min`;
}

export type OriginResolution = {
  origin: Coord;
  snapped: boolean;
  notice: string | null;
};

export function resolveUserOrigin(coords: Coord | null): OriginResolution {
  if (!coords) {
    return {
      origin: CUERNAVACA_CENTRO,
      snapped: true,
      notice:
        "No pudimos leer tu ubicación. Mostramos tiempos de traslado desde Cuernavaca centro.",
    };
  }
  if (!isInMorelos(coords.lat, coords.lng)) {
    return {
      origin: CUERNAVACA_CENTRO,
      snapped: true,
      notice:
        "Estás fuera de Morelos. Anclamos el mapa a Cuernavaca centro para calcular tiempos de traslado.",
    };
  }
  return { origin: coords, snapped: false, notice: null };
}

export type Ranked<T> = T & { minutes: number; eta: string };

export function rankByTravelTime<T extends Coord>(
  origin: Coord,
  items: T[],
): Ranked<T>[] {
  return items
    .map((item) => {
      const minutes = travelMinutes(haversineKm(origin, item));
      return { ...item, minutes, eta: formatTravelTime(minutes) };
    })
    .sort((a, b) => a.minutes - b.minutes);
}
