'use client';

import { motion } from 'framer-motion';
import { GameCard } from '../GameCard';
import { RunnerIcon, UFOIcon, BrickIcon } from '../PixelIcons';

interface HomePageProps {
  onGameSelect: (gameId: number) => void;
}

export function HomePage({ onGameSelect }: HomePageProps) {
  const games = [
    {
      id: 1,
      icon: <RunnerIcon />,
      title: 'NET RUNNER',
      description: 'TERMINAL-BASED ENDLESS RUNNER // NAVIGATE THROUGH NEON GRIDS // AVOID DIGITAL HAZARDS',
    },
    {
      id: 2,
      icon: <UFOIcon />,
      title: 'CYBER FLAP',
      description: 'TACTICAL FLIGHT PROTOCOL // AVOID DATA CABLES // PRECISION REQUIRED',
    },
    {
      id: 3,
      icon: <BrickIcon />,
      title: 'DATA BREAKER',
      description: 'LEGACY DESTRUCTION MODULE // DEMOLISH BLOCKCHAIN ENCRYPTION // ARCADE ENGINE',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 flex flex-col h-full justify-between"
    >
      <div>
        <div className="mb-8 border-l-4 border-[#00ff41] pl-6 py-2">
          <h2 className="text-[#00ff41] text-2xl mb-2 tracking-wider font-bold">
            ARCADE MODULES
          </h2>
          <p className="text-[#00ff41] text-xs opacity-70 font-mono">
            SELECT A CARTRIDGE TO INITIALIZE // SPICY TESTNET: 88882
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} onClick={() => onGameSelect(game.id)}>
              <GameCard
                icon={game.icon}
                title={game.title}
                description={game.description}
                onClick={() => onGameSelect(game.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- STATUS BAR (Ripristinata) --- */}
      <div className="mt-12 w-full border-2 border-[#00ff41] bg-black p-3 flex flex-col md:flex-row items-center justify-between text-[10px] md:text-xs font-mono text-[#00ff41] tracking-widest shadow-[0_0_10px_rgba(0,255,65,0.2)]">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00ff41] animate-pulse"></span>
          {'>'} SYSTEM STATUS: OPERATIONAL
        </span>
        <span className="hidden md:inline">NETWORK: CHILIZ SPICY</span>
        <span className="hidden md:inline">LATENCY: 12ms</span>
        <span>UPTIME: 99.97%</span>
      </div>
    </motion.div>
  );
}