import type { Metadata } from "next";
import { VT323, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; 

// 1. Setup Font Pixelato (Titoli)
const vt323 = VT323({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-vt323" 
});

// 2. Setup Font Tecnico (Testi)
const techMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tech"
});

export const metadata: Metadata = {
  title: "0xArcade",
  description: "DeFi Gaming Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Applichiamo le variabili CSS e lo sfondo base nero */}
      <body className={`${vt323.variable} ${techMono.variable} antialiased bg-black text-green-500 overflow-x-hidden`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}