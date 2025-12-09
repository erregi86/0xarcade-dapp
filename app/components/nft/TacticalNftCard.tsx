'use client';

import { useState } from 'react';
import { Lock, Check, Hexagon, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TacticalNftCardProps {
  id: number;
  name: string;
  type: string;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY';
  imageIcon: React.ReactNode;
  isOwned: boolean;
  isLocked: boolean;
  price?: string;
  onMint?: () => void;
}

export default function TacticalNftCard({
  id, name, type, rarity, imageIcon, isOwned, isLocked, price, onMint
}: TacticalNftCardProps) {
  const [isMinting, setIsMinting] = useState(false);

  // Mappa Colori e Stili per Rarità
  // Aggiunto 'buttonHover' per garantire lo stile solido su hover (Verde/Ciano/Oro -> Nero)
  const rarityConfig = {
    COMMON: { 
      text: 'text-[#00ff41]', 
      border: 'border-[#00ff41]', 
      bg: 'bg-[#00ff41]/10', 
      buttonHover: 'hover:bg-[#00ff41] hover:text-black',
      icon: Hexagon 
    },
    RARE: { 
      text: 'text-cyan-400', 
      border: 'border-cyan-400', 
      bg: 'bg-cyan-400/10', 
      buttonHover: 'hover:bg-cyan-400 hover:text-black',
      icon: Shield 
    },
    LEGENDARY: { 
      text: 'text-amber-400', 
      border: 'border-amber-400', 
      bg: 'bg-amber-400/10', 
      buttonHover: 'hover:bg-amber-400 hover:text-black',
      icon: Zap 
    },
  };

  const config = rarityConfig[rarity];
  const RarityIcon = config.icon;

  const handleClick = () => {
    if (isMinting || isLocked || isOwned) return;
    setIsMinting(true);
    setTimeout(() => {
        setIsMinting(false);
        if (onMint) onMint();
    }, 2500); 
  };

  return (
    <div className={`relative group overflow-hidden ${isLocked ? 'opacity-70' : ''}`}>
      
      {/* SFONDO TATTICO & BORDO ESTERNO */}
      <div className={`absolute inset-0 bg-[#0a0a0a] clip-path-polygon-tactical border-2 ${config.border} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
      
      {/* CONTENUTO CARTA */}
      <div className="relative p-4 h-full flex flex-col z-10">
        
        {/* HEADER: Tipo e ID */}
        <div className={`flex justify-between items-center mb-2 pb-2 border-b border-dashed border-opacity-30 ${config.border}`}>
          <div className="flex items-center gap-2">
            <RarityIcon size={14} className={config.text} />
            <span className={`text-[10px] font-bold tracking-widest ${config.text}`}>{type}</span>
          </div>
          <span className="text-[10px] font-mono text-gray-500">ID::{String(id).padStart(4, '0')}</span>
        </div>

        {/* VISUALIZZATORE OLOGRAFICO */}
        <div className={`relative aspect-square my-4 ${config.bg} border ${config.border} flex items-center justify-center overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]`}>
           
           {/* Griglia Sfondo */}
           <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.02)_25%,rgba(255,255,255,.02)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.02)_75%,rgba(255,255,255,.02)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.02)_25%,rgba(255,255,255,.02)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.02)_75%,rgba(255,255,255,.02)_76%,transparent_77%,transparent)] bg-[length:20px_20px]"></div>
           
           {/* Icona */}
           <div className={`relative z-10 scale-125 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${isLocked ? 'grayscale brightness-50' : ''} ${isMinting ? 'animate-pulse' : ''}`}>
              {imageIcon}
           </div>

           {/* Overlay Lock */}
           <AnimatePresence>
             {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20">
                    <Lock className="mb-2 text-gray-500" size={24} />
                    <span className="text-[10px] text-gray-400 font-mono border border-gray-600 px-2 py-1 bg-black">LOCKED</span>
                </div>
             )}
             {isMinting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
                    <div className={`w-12 h-12 border-4 border-t-transparent ${config.border} rounded-full animate-spin mb-4`}></div>
                    <span className={`text-xs font-bold ${config.text} animate-pulse`}>MINTING...</span>
                </div>
             )}
           </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="mt-auto">
          <h3 className={`text-sm font-bold truncate mb-3 text-white group-hover:${config.text} transition-colors`}>{name}</h3>
          
          {isOwned ? (
              <div className={`w-full py-3 flex items-center justify-center gap-2 ${config.bg} border ${config.border} text-xs font-bold text-white clip-path-slant-button cursor-default`}>
                  <Check size={16} className={config.text} /> ACQUIRED
              </div>
          ) : (
              // 🟢 BOTTONE CORRETTO: Stile Standard (Trasparente -> Solido su Hover)
              <button 
                  onClick={handleClick}
                  disabled={isLocked || isMinting}
                  className={`
                      w-full py-3 text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden clip-path-slant-button border
                      ${isLocked 
                          ? 'bg-gray-900 text-gray-600 cursor-not-allowed border-gray-800' 
                          : `bg-transparent ${config.text} ${config.border} ${config.buttonHover}`
                      }
                  `}
              >
                  <span className="relative z-10">{isLocked ? 'LOCKED' : `MINT [${price}]`}</span>
              </button>
          )}
        </div>
      </div>

      {/* Barra Laterale Decorativa */}
      <div className={`absolute top-0 right-0 bottom-0 w-1 ${config.bg} border-l ${config.border}`}></div>
    </div>
  );
}