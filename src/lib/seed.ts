import type { Booking, Location, PaymentMethod, Service, Staff } from "./types";

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

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Cuernavaca: { lat: 18.9242, lng: -99.2216 },
  Jiutepec: { lat: 18.8861, lng: -99.1708 },
  Cuautla: { lat: 18.8064, lng: -98.9456 },
  Temixco: { lat: 18.8511, lng: -99.2344 },
  Yautepec: { lat: 18.8928, lng: -99.0634 },
  Jojutla: { lat: 18.618, lng: -99.18 },
  Huitzilac: { lat: 19.01, lng: -99.205 },
  Xochitepec: { lat: 18.8078, lng: -99.2428 },
};

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
    active: true,
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
    active: true,
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
    active: true,
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
    active: true,
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
    active: true,
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
    active: true,
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
    active: true,
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
    active: true,
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
    active: true,
  },
];

export function isoDay(offset = 0): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function bk(
  id: string,
  folio: string,
  serviceId: string,
  locationId: string,
  day: number,
  time: string,
  payment: PaymentMethod,
  status: Booking["status"],
  customerName: string,
  notes?: string,
  staffId?: string,
): Booking {
  return {
    id,
    folio,
    serviceId,
    locationId,
    date: isoDay(day),
    time,
    payment,
    status,
    customerName,
    createdAt: new Date().toISOString(),
    notes,
    staffId,
  };
}

export const STAFF: Staff[] = [
  { id: "st-hector", name: "Héctor Morales", role: "supervisor", locationId: "spa-cuernavaca", status: "en_turno", phone: "777-100-0101" },
  { id: "st-ivan", name: "Iván Cruz", role: "lavador", locationId: "spa-cuernavaca", status: "en_turno", phone: "777-100-0102" },
  { id: "st-lalo", name: "Eduardo Peña", role: "lavador", locationId: "express-palmas", status: "en_turno", phone: "777-100-0103" },
  { id: "st-rosa", name: "Rosa Jiménez", role: "caja", locationId: "spa-cuernavaca", status: "en_turno", phone: "777-100-0104" },
  { id: "st-beto", name: "Alberto Nava", role: "lavador", locationId: "wash-jiutepec", status: "en_turno", phone: "777-100-0105" },
  { id: "st-karla", name: "Karla Soto", role: "lavador", locationId: "spa-cuautla", status: "libre", phone: "735-100-0106" },
  { id: "st-memo", name: "Guillermo Díaz", role: "lavador", locationId: "premium-tres-marias", status: "en_turno", phone: "777-100-0107" },
  { id: "st-lucia", name: "Lucía Vargas", role: "supervisor", locationId: "premium-xochitepec", status: "descanso", phone: "777-100-0108" },
];

export const SEED_BOOKINGS: Booking[] = [
  bk("bk-incoming", "EST-180326", "basico", "spa-cuernavaca", 0, "10:00", "tarjeta", "pendiente", "María López", "Honda Civic blanco, placas MOR-4821", "st-ivan"),
  bk("bk-juan", "EST-180401", "camioneta", "wash-jiutepec", 0, "11:30", "oxxo", "pendiente", "Juan Hernández", "Ford Ranger gris", "st-beto"),
  bk("bk-ana", "EST-180402", "completo", "spa-cuernavaca", 0, "09:00", "tarjeta", "confirmada", "Ana García", "BMW X3 negro — interiores", "st-hector"),
  bk("bk-luis", "EST-180403", "basico", "express-palmas", 0, "12:00", "transferencia", "confirmada", "Luis Ramírez", undefined, "st-lalo"),
  bk("bk-patri", "EST-180404", "basico", "spa-cuernavaca", 0, "08:00", "tarjeta", "completada", "Patricia Solís", undefined, "st-ivan"),
  bk("bk-carlos", "EST-180405", "camioneta", "premium-tres-marias", 0, "16:00", "tarjeta", "confirmada", "Carlos Méndez", "Toyota Hilux", "st-memo"),
  bk("bk-fer", "EST-180406", "completo", "premium-xochitepec", 0, "13:30", "transferencia", "pendiente", "Fernanda Ríos", "Mercedes C200"),
  bk("bk-diego", "EST-180310", "basico", "clean-temixco", -1, "10:30", "oxxo", "completada", "Diego Ortega"),
  bk("bk-sofia", "EST-180311", "camioneta", "spa-cuautla", -1, "12:00", "tarjeta", "completada", "Sofía Nava"),
  bk("bk-robe", "EST-180312", "completo", "spa-cuernavaca", -1, "15:00", "tarjeta", "completada", "Roberto Cruz", undefined, "st-hector"),
  bk("bk-elena", "EST-180313", "basico", "splash-yautepec", -1, "09:00", "transferencia", "completada", "Elena Vargas"),
  bk("bk-miguel", "EST-180314", "basico", "express-jojutla", -2, "11:00", "oxxo", "completada", "Miguel Ángel Ruiz"),
  bk("bk-paola", "EST-180315", "camioneta", "express-palmas", -2, "17:00", "tarjeta", "completada", "Paola Mendoza"),
  bk("bk-tomas", "EST-180501", "basico", "spa-cuernavaca", 1, "09:30", "tarjeta", "pendiente", "Tomás Aguilar", "Nissan Versa rojo"),
  bk("bk-irene", "EST-180502", "completo", "wash-jiutepec", 1, "11:00", "transferencia", "confirmada", "Irene Salgado"),
  bk("bk-hugo", "EST-180280", "basico", "spa-cuernavaca", -3, "08:30", "tarjeta", "completada", "Hugo Beltrán"),
];

export const SLOT_HOURS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

export function slotsForLocation(location: Location): string[] {
  return SLOT_HOURS.filter((h) => h >= location.openTime && h < location.closeTime);
}

export function makeFolio(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `EST-${n}`;
}

export const CITIES = Object.keys(CITY_COORDS);
