'use client';

// 🟢 FIX: Aggiunto 'Bell' agli import
import { Wallet, ChevronRight, Menu, AlertTriangle, Bell } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { formatEther } from 'viem';
import { Logo0x } from './Logo0x'; 

interface HeaderProps {
  page?: string;
  onMenuClick?: () => void;
  // 🟢 NUOVI PROPS per le notifiche
  notificationCount?: number;
  onOpenNotifications?: () => void;
}

export function Header({ page = 'HOME', onMenuClick, notificationCount = 0, onOpenNotifications }: HeaderProps) {
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
    <div className="sticky top-0 z-10 bg-[#050505]/90 backdrop-blur-md border-b border-[#00ff41] px-4 md:px-8 py-4 flex items-center justify-between shadow-[0_4px_20px_-10px_rgba(0,255,65,0.2)]">
      <div className="flex items-center gap-4">

        {/* 🟢 MOBILE LOGO */}
        <div className="md:hidden flex items-center gap-2">
           <Logo0x className="text-[#00ff41] h-6 w-6" />
           <h1 className="text-[#00ff41] tracking-widest font-bold text-xl font-[Press Start 2P]">
             ARCADE
           </h1>
        </div>

        {/* 🟢 DESKTOP BREADCRUMBS */}
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
        <div className="flex items-center gap-3 md:gap-4">
           
           {/* 🟢 NOTIFICATION BELL (Nuovo) */}
           {/* Appare solo se connesso, prima del saldo */}
           <button 
             onClick={onOpenNotifications}
             className="relative p-2 text-[#00ff41] hover:text-white hover:bg-[#00ff41]/10 rounded-sm transition-all group mr-1 border border-transparent hover:border-[#00ff41]/30"
           >
             <Bell size={20} className={notificationCount > 0 ? "animate-swing" : ""} />
             
             {/* Badge Rosso Pulsante */}
             {notificationCount > 0 && (
               <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-black"></span>
               </span>
             )}
           </button>

           {/* Balance Display */}
           {!isWrongNetwork && (
             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] text-[#00ff41]/70 leading-none mb-1">CREDITS</span>
                <span className="font-mono text-[#00ff41] text-sm leading-none">{displayBalance} CHZ</span>
             </div>
           )}
           
           {/* Network / Account Button */}
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