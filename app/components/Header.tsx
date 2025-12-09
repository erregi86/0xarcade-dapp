'use client';

import { Wallet, ChevronRight, Menu } from 'lucide-react';
import { useAccount, useConnect, useBalance, useDisconnect } from 'wagmi';
import { formatEther } from 'viem';

interface HeaderProps {
  page?: string;
  onMenuClick?: () => void;
}

export function Header({ page = 'HOME', onMenuClick }: HeaderProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  // Fetch balance su Spicy Chain (88882)
  const { data: balance } = useBalance({ address, chainId: 88882 });

  const displayBalance = balance ? Number(formatEther(balance.value)).toFixed(2) : '0.00';

  return (
    <div className="sticky top-0 z-10 bg-[#050505]/90 backdrop-blur-md border-b border-[#00ff41] px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden text-[#00ff41] hover:text-[#00ff41]/70 transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[#00ff41] font-mono text-sm">
          <span className="opacity-70 hidden sm:inline">SYSTEM</span>
          <ChevronRight size={14} className="hidden sm:inline opacity-50" />
          <span className="opacity-70 hidden xs:inline">NETRUNNER</span>
          <ChevronRight size={14} className="hidden xs:inline opacity-50" />
          <span className="whitespace-nowrap font-bold tracking-wider">{page.toUpperCase()}</span>
        </div>
      </div>

      {/* Wallet Connection */}
      {isConnected ? (
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] text-[#00ff41]/70 leading-none mb-1">CREDITS</span>
              <span className="font-mono text-[#00ff41] text-sm leading-none">{displayBalance} CHZ</span>
           </div>
           
           <button 
             onClick={() => disconnect()}
             className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 border border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#003d1a] font-mono transition-all duration-150 group"
           >
             <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
             <span className="text-xs md:text-sm tracking-wide hidden sm:inline">{address?.slice(0,6)}...</span>
             <span className="text-xs md:text-sm tracking-wide sm:hidden">EXIT</span>
           </button>
        </div>
      ) : (
        <div className="flex gap-2">
          {connectors.slice(0, 1).map(c => (
            <button 
              key={c.uid}
              onClick={() => connect({ connector: c })}
              className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 border border-[#00ff41] bg-transparent text-[#00ff41] hover:bg-[#00ff41] hover:text-[#050505] font-mono transition-all duration-150"
            >
              <Wallet size={18} />
              <span className="text-xs md:text-sm tracking-wide hidden sm:inline">CONNECT WALLET</span>
              <span className="text-xs md:text-sm tracking-wide sm:hidden">CONNECT</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}