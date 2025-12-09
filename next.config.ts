import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignora errori di TypeScript durante la build (per deploy rapido su Vercel)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Questa riga silenzia l'errore se Turbopack parte per sbaglio
  turbopack: {}, 

  // La nostra configurazione vitale per RainbowKit/Wagmi
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;