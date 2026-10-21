import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpotFinder — Учебные пространства Астаны",
  description: "Агрегатор библиотек, тихих кафе и коворкингов с фильтрами шума, розеток и Wi-Fi для студентов",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SpotFinder",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#F2F2F7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-[#F2F2F7] text-[#1C1C1E] antialiased min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
