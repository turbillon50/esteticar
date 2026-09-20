import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Esteticar — Autolavado a domicilio en Morelos",
  description:
    "Agenda tu lavado en 9 autolavados de Morelos. Básico $120, camioneta $180, completo $800. Pago por adelantado.",
  applicationName: "Esteticar",
  appleWebApp: { capable: true, title: "Esteticar", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0077b6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX">
      <body className={jakarta.variable}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
