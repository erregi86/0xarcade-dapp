'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getUserProfile } from '../../lib/db';
import TacticalNftCard from '../nft/TacticalNftCard';
import { RunnerIcon, UFOIcon, BrickIcon } from '../PixelIcons';
import { Box } from 'lucide-react';

export function InventoryPage() {
  const { address, isConnected } = useAccount();
  
  // Stato Utente
  const [userLevel, setUserLevel] = useState<number>(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Per ora simuliamo gli oggetti posseduti in locale
  const [ownedIds, setOwnedIds] = useState<number[]>([]);

  // Carica Livello Utente
  useEffect(() => {
    if (address) {
      getUserProfile(address).then(({ data }) => {
        if (data) setUserLevel(data.level || 1);
        setLoadingProfile(false);
      });
    }
  }, [address]);

  // Lista NFT e Requisiti
  const nfts = [
    {
      id: 101,
      name: "ROOKIE ID",
      type: "BADGE",
      rarity: "COMMON" as const,
      price: "FREE",
      requiredLevel: 1, // Sbloccato subito
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#00ff41]">
           <rect x="3" y="4" width="18" height="16" rx="2" />
           <circle cx="12" cy="10" r="3" />
           <path d="M7 20v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        </svg>
      )
    },
    {
      id: 201,
      name: "GHOST RUNNER",
      type: "SKIN",
      rarity: "RARE" as const,
      price: "250 CHZ",
      requiredLevel: 5, // Richiede Lv 5
      icon: <RunnerIcon />
    },
    {
      id: 301,
      name: "THE CUBE",
      type: "ITEM",
      rarity: "LEGENDARY" as const,
      price: "1000 CHZ",
      requiredLevel: 10, // Richiede Lv 10
      icon: <BrickIcon />
    },
    {
      id: 999,
      name: "MASTER KEY",
      type: "ACCESS",
      rarity: "LEGENDARY" as const,
      price: "SOULBOUND",
      requiredLevel: 50,
      icon: <UFOIcon />
    },
  ];

  const handleSimulatedMint = (id: number, name: string) => {
    if (!confirm(`Simulazione: Vuoi mintare "${name}"?`)) return;
    
    // Aggiungi ai posseduti (Simulazione)
    setOwnedIds([...ownedIds, id]);
    alert("Asset aggiunto all'inventario (Locale)");
  };

  if (!isConnected) return null;

  return (
    <div className="p-6 md:p-10 animate-[fadeIn_0.5s_ease-out]">
      
      {/* HEADER PAGINA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 border-b-2 border-[#00ff41]/30 pb-6 gap-4">
         <div>
            <h2 className="text-2xl md:text-3xl font-[Press Start 2P] mb-3 flex items-center gap-3">
                <Box size={32} className="text-[#00ff41]" /> ARMORY
            </h2>
            <p className="text-xs text-[#00ff41] font-mono opacity-70 tracking-widest">
               {loadingProfile ? 'SYNCING...' : `OPERATIVE LEVEL: ${userLevel} // REWARDS AVAILABLE`}
            </p>
         </div>
         
         <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] text-gray-500 tracking-widest">CLEARANCE</span>
             <div className="flex items-center gap-2">
                 <span className="text-2xl text-white font-mono font-bold">LVL {userLevel}</span>
                 <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_10px_#00ff41]"></div>
             </div>
         </div>
      </div>

      {/* GRIGLIA NFT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {nfts.map(nft => {
            const isLocked = userLevel < nft.requiredLevel;
            const isOwned = ownedIds.includes(nft.id);

            return (
                <div key={nft.id} className="h-80">
                    <TacticalNftCard 
                        id={nft.id}
                        name={nft.name}
                        type={nft.type}
                        rarity={nft.rarity}
                        imageIcon={nft.icon}
                        price={isLocked ? `LVL ${nft.requiredLevel}` : nft.price}
                        isLocked={isLocked}
                        isOwned={isOwned}
                        onMintClick={() => handleSimulatedMint(nft.id, nft.name)}
                    />
                </div>
            );
         })}
      </div>

    </div>
  );
}