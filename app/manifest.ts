import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '0xArcade Protocol',
    short_name: '0xArcade',
    description: 'DeFi Arcade Gaming on Chiliz Chain',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#00ff41',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}