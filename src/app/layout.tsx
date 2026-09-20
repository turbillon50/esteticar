import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Esteticar — Autolavado a domicilio en Morelos",
  description:
    "Agenda tu lavado en 9 autolavados de Morelos. Básico $120, camioneta $180, completo $800. Pago por adelantado.",
  applicationName: "Esteticar",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Esteticar",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
    apple: "/icons/apple-touch.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#071428",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX">
      <body className={`${jakarta.variable} ${serif.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
