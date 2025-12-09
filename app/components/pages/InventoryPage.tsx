'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Lock, CheckCircle, Box } from 'lucide-react';
import TacticalAlert from '../TacticalAlert';

export function InventoryPage() {
  // Stato simulato per vedere l'effetto "Minted"
  const [mintedItems, setMintedItems] = useState<number[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [alert, setAlert] = useState(false);

  const nftCollection = [
    {
      id: 1,
      name: "AGENT CARD LVL.1",
      type: "SOULBOUND BADGE",
      desc: "Proof of participation in 0xArcade Alpha.",
      price: "FREE MINT",
      image: "🆔",
      req: "Level 1 Reached",
      isLocked: false // Questo è sbloccabile
    },
    {
      id: 2,
      name: "GOLDEN RUNNER",
      type: "GAME SKIN",
      desc: "Legendary skin for Net Runner module. +10% XP Boost.",
      price: "500 CHZ",
      image: "🏃",
      req: "Win 10 Wager Matches",
      isLocked: true // Questo è bloccato (esempio)
    }
  ];

  const handleMint = (id: number) => {
    setLoadingId(id);
    // Simuliamo la transazione blockchain (2 secondi)
    setTimeout(() => {
      setLoadingId(null);
      setMintedItems([...mintedItems, id]);
      setAlert(true); // Mostra popup successo
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 md:p-8 text-[#00ff41] font-mono max-w-6xl mx-auto relative"
    >
      <TacticalAlert 
        isOpen={alert}
        title="ASSET ACQUIRED"
        message="NFT SUCCESSFULLY MINTED TO WALLET ADDRESS. INVENTORY UPDATED."
        type="success"
        onClose={() => setAlert(false)}
        actionLabel="VIEW ON CHILISCAN"
        onAction={() => window.open('https://testnet.chiliscan.com', '_blank')}
      />

      <div className="mb-8 border-l-4 border-[#00ff41] pl-6 py-2">
        <h2 className="mb-2 tracking-wider font-bold text-2xl">DIGITAL ASSETS</h2>
        <p className="text-xs opacity-70">BADGES // SKINS // COLLECTIBLES</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nftCollection.map((nft) => {
          const isOwned = mintedItems.includes(nft.id);
          const isMinting = loadingId === nft.id;

          return (
            <div key={nft.id} className={`border ${isOwned ? 'border-[#00ff41] bg-[#00ff41]/5' : 'border-gray-800 bg-black'} p-1 relative group`}>
              {/* Header Card */}
              <div className="flex justify-between items-center p-2 bg-[#00ff41]/10 mb-1">
                <span className="text-[10px] font-bold tracking-widest">{nft.type}</span>
                {isOwned ? <CheckCircle size={14} /> : <Box size={14} />}
              </div>

              {/* Image Container */}
              <div className="h-48 border border-[#00ff41]/20 flex items-center justify-center relative overflow-hidden bg-tactical-grid">
                <div className="text-8xl filter drop-shadow-[0_0_10px_#00ff41]">
                  {nft.image}
                </div>
                {nft.isLocked && !isOwned && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
                    <Lock className="mb-2 text-gray-500" />
                    <span className="text-xs text-gray-500">LOCKED</span>
                    <span className="text-[10px] text-gray-600 mt-1">{nft.req}</span>
                  </div>
                )}
              </div>

              {/* Info & Action */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-1">{nft.name}</h3>
                <p className="text-xs text-gray-400 mb-4 h-8">{nft.desc}</p>
                
                <div className="flex justify-between items-center border-t border-[#00ff41]/20 pt-4">
                  <span className="text-sm font-bold">{nft.price}</span>
                  
                  {isOwned ? (
                    <button disabled className="px-4 py-2 bg-[#00ff41] text-black font-bold text-xs cursor-default">
                      OWNED
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleMint(nft.id)}
                      disabled={nft.isLocked || isMinting}
                      className={`
                        px-6 py-2 border text-xs font-bold transition-all uppercase
                        ${nft.isLocked 
                          ? 'border-gray-700 text-gray-600 cursor-not-allowed' 
                          : 'border-[#00ff41] hover:bg-[#00ff41] hover:text-black text-[#00ff41]'
                        }
                      `}
                    >
                      {isMinting ? 'MINTING...' : 'MINT NFT'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}