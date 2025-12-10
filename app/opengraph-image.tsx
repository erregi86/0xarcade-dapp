import { ImageResponse } from 'next/og';

// Configurazione Immagine
export const runtime = 'edge';
export const alt = '0xArcade Protocol Dashboard';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Font (Opzionale: qui uso un sans-serif di sistema per velocità, ma puoi caricare font custom)
  
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050505', // Sfondo Nero
          backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Overlay scuro per leggibilità */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(5,5,5,0.9)' }} />

        {/* Bordo Tattico */}
        <div 
          style={{
            position: 'absolute',
            top: '20px', left: '20px', right: '20px', bottom: '20px',
            border: '2px solid #00ff41',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />

        {/* Contenuto Centrale */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          {/* Logo / Titolo */}
          <h1
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: '#00ff41',
              margin: 0,
              letterSpacing: '-0.05em',
              textShadow: '0 0 20px rgba(0, 255, 65, 0.5)',
            }}
          >
            0xARCADE
          </h1>

          {/* Sottotitolo */}
          <div
            style={{
              fontSize: 30,
              color: '#00ff41',
              opacity: 0.8,
              marginTop: 20,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            DeFi Gaming Protocol
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              marginTop: 40,
              gap: 20,
            }}
          >
            <div style={{ padding: '10px 20px', backgroundColor: '#00ff41', color: '#000', fontSize: 20, fontWeight: 'bold' }}>
              PVP WAGERS
            </div>
            <div style={{ padding: '10px 20px', border: '2px solid #00ff41', color: '#00ff41', fontSize: 20, fontWeight: 'bold' }}>
              CHILIZ CHAIN
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}