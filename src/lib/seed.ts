import type { Booking, Location, Service } from "./types";

export const SERVICES: Service[] = [
  {
    id: "basico",
    name: "Lavado Básico",
    description:
      "Lavado exterior con espuma activa de alta presión, enjuague multi-etapa y secado manual con microfibra premium.",
    price: 120,
    durationMinutes: 30,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    features: ["Espuma activa", "Enjuague a presión", "Secado manual"],
  },
  {
    id: "camioneta",
    name: "Lavado Camioneta",
    description:
      "Servicio especializado para SUVs y pickups. Espuma activa en techo, llantas y rines. Incluye aspirado de interiores.",
    price: 180,
    durationMinutes: 45,
    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=900&q=80",
    features: ["Para SUVs y pickups", "Llantas y rines", "Aspirado incluido"],
  },
  {
    id: "completo",
    name: "Lavado Completo con Interiores",
    description:
      "Lavado exterior completo + limpieza profunda de interiores, aspirado, pulido y aromatizante premium.",
    price: 800,
    durationMinutes: 90,
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80",
    features: ["Pulido de carnauba", "Interior profundo", "Aromatizante premium"],
  },
];

export const LOCATIONS: Location[] = [
  {
    id: "spa-cuernavaca",
    name: "Auto Spa Cuernavaca",
    address: "Av. Plan de Ayala 128, Col. Lomas de la Selva",
    city: "Cuernavaca",
    phone: "777-314-0001",
    openTime: "08:00",
    closeTime: "20:00",
    lat: 18.9242,
    lng: -99.2216,
    rating: 4.9,
  },
  {
    id: "express-palmas",
    name: "Lavado Express Las Palmas",
    address: "Blvd. Las Palmas 45, Fracc. Las Palmas",
    city: "Cuernavaca",
    phone: "777-314-0002",
    openTime: "08:00",
    closeTime: "20:00",
    lat: 18.918,
    lng: -99.23,
    rating: 4.7,
  },
  {
    id: "premium-tres-marias",
    name: "Premium Wash Tres Marías",
    address: "Carr. México-Cuernavaca Km 23, Tres Marías",
    city: "Huitzilac",
    phone: "777-314-0003",
    openTime: "09:00",
    closeTime: "19:00",
    lat: 19.01,
    lng: -99.205,
    rating: 4.8,
  },
  {
    id: "wash-jiutepec",
    name: "Wash & Go Jiutepec",
    address: "Av. Benito Juárez 340",
    city: "Jiutepec",
    phone: "777-410-1001",
    openTime: "08:00",
    closeTime: "19:00",
    lat: 18.8861,
    lng: -99.1708,
    rating: 4.6,
  },
  {
    id: "spa-cuautla",
    name: "Auto Spa Cuautla",
    address: "Calle Galeana 88",
    city: "Cuautla",
    phone: "735-352-2001",
    openTime: "08:00",
    closeTime: "19:00",
    lat: 18.8064,
    lng: -98.9456,
    rating: 4.7,
  },
  {
    id: "clean-temixco",
    name: "Clean Car Temixco",
    address: "Blvd. Forjadores 210",
    city: "Temixco",
    phone: "777-325-3001",
    openTime: "08:00",
    closeTime: "18:00",
    lat: 18.8511,
    lng: -99.2344,
    rating: 4.5,
  },
  {
    id: "splash-yautepec",
    name: "Splash Yautepec",
    address: "Av. Hidalgo 45",
    city: "Yautepec",
    phone: "735-468-4001",
    openTime: "09:00",
    closeTime: "18:00",
    lat: 18.8928,
    lng: -99.0634,
    rating: 4.6,
  },
  {
    id: "express-jojutla",
    name: "Express Wash Jojutla",
    address: "Calle Morelos 12",
    city: "Jojutla",
    phone: "734-342-5001",
    openTime: "08:00",
    closeTime: "17:00",
    lat: 18.618,
    lng: -99.18,
    rating: 4.4,
  },
  {
    id: "premium-xochitepec",
    name: "Premium Auto Xochitepec",
    address: "Carretera Alpuyeca Km 3",
    city: "Xochitepec",
    phone: "777-398-6001",
    openTime: "08:00",
    closeTime: "19:00",
    lat: 18.8078,
    lng: -99.2428,
    rating: 4.8,
  },
];

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const SEED_BOOKINGS: Booking[] = [
  {
    id: "bk-incoming",
    folio: "EST-180326",
    serviceId: "basico",
    locationId: "spa-cuernavaca",
    date: todayISO(),
    time: "10:00",
    payment: "tarjeta",
    status: "pendiente",
    customerName: "María López",
    createdAt: new Date().toISOString(),
    notes: "Honda Civic blanco, placas MOR-4821",
  },
];

export const SLOT_HOURS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];

export function slotsForLocation(location: Location): string[] {
  const open = location.openTime;
  const close = location.closeTime;
  return SLOT_HOURS.filter((h) => h >= open && h < close);
}

export function makeFolio(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `EST-${n}`;
}

export const CITIES = [
  "Cuernavaca",
  "Jiutepec",
  "Cuautla",
  "Temixco",
  "Yautepec",
  "Jojutla",
  "Huitzilac",
  "Xochitepec",
];
