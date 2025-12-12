'use client';

import { Wallet, ChevronRight, AlertTriangle, Bell } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { formatEther } from 'viem';
import { Logo0x } from './Logo0x'; 

interface HeaderProps {
  page?: string;
  onMenuClick?: () => void;
  notificationCount?: number;
  onOpenNotifications?: () => void;
}

export function Header({ page = 'HOME', onMenuClick, notificationCount = 0, onOpenNotifications }: HeaderProps) {
  const { address, isConnected, chain } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { data: balance } = useBalance({ address, chainId: 88882 });

  const displayBalance = balance ? Number(formatEther(balance.value)).toFixed(2) : '0.00';
  const isWrongNetwork = isConnected && chain?.unsupported;

  return (
    // 🟢 FIX: Padding ridotto su mobile (px-4) e h-auto per evitare tagli
    <div className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-md border-b border-[#00ff41] px-4 md:px-8 h-16 md:h-20 flex items-center justify-between shadow-[0_4px_20px_-10px_rgba(0,255,65,0.1)] transition-all duration-300">
      
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
           <Logo0x className="text-[#00ff41] h-5 w-5" />
           <span className="text-[#00ff41] tracking-widest font-bold text-lg font-[Press Start 2P] truncate max-w-[120px]">
             ARCADE
           </span>
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-[#00ff41] font-mono text-sm opacity-0 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-forwards" style={{animationDelay: '100ms'}}>
          <span className="opacity-70">SYSTEM</span>
          <ChevronRight size={14} className="opacity-50" />
          <span className="opacity-70">0xArcade</span>
          <ChevronRight size={14} className="opacity-50" />
          <span className="whitespace-nowrap font-bold tracking-wider">{page.toUpperCase()}</span>
        </div>
      </div>

      {/* Right Side (Wallet & Actions) */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {isConnected ? (
          <>
             {/* 🟢 NOTIFICATION BELL (Sempre visibile, padding ottimizzato) */}
             <button 
               onClick={onOpenNotifications}
               className="relative p-2 text-[#00ff41] hover:text-white hover:bg-[#00ff41]/10 rounded-sm transition-all duration-300 group mr-1 active:scale-95"
             >
               <Bell size={20} className={notificationCount > 0 ? "animate-swing" : ""} />
               
               {notificationCount > 0 && (
                 <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-black"></span>
                 </span>
               )}
             </button>

             {/* Balance (Nascosto su schermi piccolissimi, visibile da 'sm') */}
             {!isWrongNetwork && (
               <div className="hidden sm:flex flex-col items-end mr-2 animate-in fade-in duration-500">
                  <span className="text-[10px] text-[#00ff41]/70 leading-none mb-1">CREDITS</span>
                  <span className="font-mono text-[#00ff41] text-sm leading-none">{displayBalance} CHZ</span>
               </div>
             )}
             
             {/* Network / Account Button */}
             {isWrongNetwork ? (
               <button onClick={openChainModal} className="px-3 py-2 border border-red-500 text-red-500 text-xs font-bold animate-pulse hover:bg-red-500 hover:text-black transition-colors">
                 WRONG NET
               </button>
             ) : (
               <button 
                 onClick={openAccountModal}
                 className="flex items-center gap-2 px-3 py-2 border border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#003d1a] font-mono transition-all duration-300 text-xs md:text-sm"
               >
                 <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
                 <span className="hidden sm:inline">{address?.slice(0,6)}...</span>
                 <span className="sm:hidden">ID</span>
               </button>
             )}
          </>
        ) : (
          <button 
            onClick={openConnectModal}
            className="flex items-center gap-2 px-3 py-2 border border-[#00ff41] bg-transparent text-[#00ff41] hover:bg-[#00ff41] hover:text-[#050505] font-mono transition-all duration-300 text-xs md:text-sm"
          >
            <Wallet size={16} />
            <span className="hidden sm:inline">CONNECT</span>
            <span className="sm:hidden">LOGIN</span>
          </button>
        )}
      </div>
    </div>
  );
}