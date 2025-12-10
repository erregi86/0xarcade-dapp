import type { Metadata, Viewport } from 'next';
import { VT323, Share_Tech_Mono } from 'next/font/google'; // 🟢 FONT RIPRISTINATI
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers'; 

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

// 🟢 CONFIGURAZIONE VIEWPORT
export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// 🟢 CONFIGURAZIONE SEO AVANZATA (Manteniamo quella nuova)
export const metadata: Metadata = {
  metadataBase: new URL('https://0xarcade-dapp.vercel.app/'), // Sostituisci col dominio vero quando lo avrai
  
  title: {
    default: '0xArcade | DeFi Gaming Protocol',
    template: '%s | 0xArcade'
  },
  
  description: 'High-performance DeFi Gaming Protocol on Chiliz Chain. Compete in skill-based arcade games, wager CHZ, and climb the global leaderboard.',
  
  keywords: ['Chiliz', 'GameFi', 'Arcade', 'Crypto', 'P2E', 'DeFi', 'Web3', 'Blockchain'],
  
  authors: [{ name: '0xArcade Team Erregi' }],
  
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },

  openGraph: {
    title: '0xArcade | Play. Compete. Earn.',
    description: 'PvP Arcade Protocol on Chiliz Chain. Challenge players & wager CHZ.',
    url: 'https://0xarcade.gg',
    siteName: '0xArcade Protocol',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: '0xArcade Tactical Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: '0xArcade | DeFi Gaming Protocol',
    description: 'Skill-based crypto arcade on Chiliz Chain.',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 🟢 BODY MERGIATO: Font custom + Classi base tue + Providers */}
      <body className={`${vt323.variable} ${techMono.variable} antialiased bg-black text-[#00ff41] overflow-x-hidden selection:bg-[#00ff41] selection:text-black`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}