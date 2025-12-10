import type { Metadata, Viewport } from 'next';
import { VT323, Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers'; 

const vt323 = VT323({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-vt323" 
});

const techMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tech"
});

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://0xarcade.gg'),
  title: {
    default: '0xArcade | DeFi Gaming Protocol',
    template: '%s | 0xArcade'
  },
  description: 'High-performance DeFi Gaming Protocol on Chiliz Chain.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 🟢 AGGIUNTO: tactical-grid e scanlines qui, così sono GLOBALI */}
      <body className={`${vt323.variable} ${techMono.variable} antialiased bg-black text-[#00ff41] overflow-x-hidden selection:bg-[#00ff41] selection:text-black tactical-grid scanlines`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}