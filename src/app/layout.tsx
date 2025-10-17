// src/app/layout.tsx
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { SettingsProvider } from "../context/SettingsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "แอปเครื่องมือของฉัน",
  description: "รวมเครื่องมืออรรถประโยชน์",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="font-sans antialiased">
        <SettingsProvider>
          <ClientLayout>{children}</ClientLayout>
        </SettingsProvider>
      </body>
    </html>
  );
}
