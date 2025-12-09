'use client';

import { Wallet, ChevronRight, Menu, AlertTriangle } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { formatEther } from 'viem';
// 🟢 FIX: Aggiunto l'import mancante per il logo
import { Logo0x } from './Logo0x'; 

interface HeaderProps {
  page?: string;
  onMenuClick?: () => void;
}

export function Header({ page = 'HOME', onMenuClick }: HeaderProps) {
  const { address, isConnected, chain } = useAccount();
  
  // RainbowKit Hooks
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  
  // Fetch balance su Spicy Chain (88882)
  const { data: balance } = useBalance({ address, chainId: 88882 });

  const displayBalance = balance ? Number(formatEther(balance.value)).toFixed(2) : '0.00';
  
  // Verifica se la catena è sbagliata
  const isWrongNetwork = isConnected && chain?.unsupported;

  return (
    <div className="sticky top-0 z-10 bg-[#050505]/90 backdrop-blur-md border-b border-[#00ff41] px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">

        {/* 🟢 MOBILE LOGO (Visibile solo su Mobile) */}
        <div className="md:hidden flex items-center gap-2">
           <Logo0x className="text-[#00ff41] h-6 w-6" />
           <h1 className="text-[#00ff41] tracking-widest font-bold text-xl font-[Press Start 2P]">
                 ARCADE
               </h1>
        </div>

        {/* 🟢 DESKTOP BREADCRUMBS (Nascosti su Mobile: hidden md:flex) */}
        <div className="hidden md:flex items-center gap-2 text-[#00ff41] font-mono text-sm">
          <span className="opacity-70">SYSTEM</span>
          <ChevronRight size={14} className="opacity-50" />
          <span className="opacity-70">0xArcade</span>
          <ChevronRight size={14} className="opacity-50" />
          <span className="whitespace-nowrap font-bold tracking-wider">{page.toUpperCase()}</span>
        </div>
      </div>

      {/* Wallet Connection Logic */}
      {isConnected ? (
        <div className="flex items-center gap-4">
           {!isWrongNetwork && (
             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] text-[#00ff41]/70 leading-none mb-1">CREDITS</span>
                <span className="font-mono text-[#00ff41] text-sm leading-none">{displayBalance} CHZ</span>
             </div>
           )}
           
           {isWrongNetwork ? (
             <button 
               onClick={openChainModal}
               className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 border border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black font-mono transition-all duration-150 animate-pulse"
             >
               <AlertTriangle size={18} />
               <span className="text-xs md:text-sm tracking-wide font-bold">WRONG NET</span>
             </button>
           ) : (
             <button 
               onClick={openAccountModal}
               className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 border border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#003d1a] font-mono transition-all duration-150 group"
             >
               <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
               <span className="text-xs md:text-sm tracking-wide hidden sm:inline">{address?.slice(0,6)}...</span>
               <span className="text-xs md:text-sm tracking-wide sm:hidden">ID</span>
             </button>
           )}
        </div>
      ) : (
        <div className="flex gap-2">
          <button 
            onClick={openConnectModal}
            className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 border border-[#00ff41] bg-transparent text-[#00ff41] hover:bg-[#00ff41] hover:text-[#050505] font-mono transition-all duration-150"
          >
            <Wallet size={18} />
            <span className="text-xs md:text-sm tracking-wide hidden sm:inline">CONNECT WALLET</span>
            <span className="text-xs md:text-sm tracking-wide sm:hidden">CONNECT</span>
          </button>
        </div>
      )}
    </div>
  );
}