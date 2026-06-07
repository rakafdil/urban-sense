import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UrbanSense",
  description: "Platform pelaporan kota inklusif & cerdas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased h-screen">{children}</body>
    </html>
  );
}