'use client';

import { Gamepad2, Trophy, BarChart3, Settings, Power, X } from 'lucide-react';
import { useDisconnect, useAccount } from 'wagmi';
import { Logo0x } from './Logo0x'; // 🟢 Importiamo il Logo

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activePage, onNavigate, isOpen = false, onClose }: SidebarProps) {
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const menuItems = [
    { id: 'home', icon: Gamepad2, label: 'ARCADE' },
    { id: 'leaderboard', icon: Trophy, label: 'LEADERBOARD' },
    { id: 'stats', icon: BarChart3, label: 'STATS' },
    { id: 'settings', icon: Settings, label: 'SETTINGS' },
  ];

  return (
    <>
      <div className={`
        w-[250px] h-screen fixed left-0 top-0 bg-[#050505] border-r border-[#00ff41] flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        {/* LOGO & HEADER AGGIORNATI */}
        <div className="border-b border-[#00ff41] p-6 flex justify-between items-start">
          <div 
            onClick={() => { onNavigate('home'); onClose?.(); }} 
            className="cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-1">
               {/* Icona 0x */}
               <Logo0x className="text-[#00ff41] group-hover:scale-110 transition-transform" />
               {/* Testo Arcade */}
               <h1 className="text-[#00ff41] tracking-widest font-bold text-xl font-[Press Start 2P]">
                 ARCADE
               </h1>
            </div>
            <div className="text-[9px] text-[#00ff41] mt-1 opacity-60 font-mono tracking-[0.2em] pl-1">
              {'>'} DeFi Gaming Protocol
            </div>
          </div>
          
          <button onClick={onClose} className="md:hidden text-[#00ff41] hover:text-[#00ff41]/70">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose?.();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 
                    border font-mono transition-all duration-150
                    ${isActive 
                      ? 'bg-[#00ff41] text-[#050505] border-[#00ff41] font-bold' 
                      : 'bg-transparent text-[#00ff41] border-transparent hover:border-[#00ff41]/50 hover:bg-[#00ff41]/10'}
                  `}
                >
                  <Icon size={16} />
                  <span className="text-xs tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#00ff41] p-4">
          {isConnected ? (
            <button 
              onClick={() => disconnect()}
              className="w-full flex items-center gap-3 px-4 py-3 border border-[#00ff41] bg-transparent text-[#00ff41] hover:bg-[#003d1a] font-mono transition-all duration-150 group"
            >
              <Power size={16} className="group-hover:text-red-500 transition-colors" />
              <span className="text-xs tracking-wide group-hover:text-red-500 transition-colors">DISCONNECT</span>
            </button>
          ) : (
            <div className="text-center text-[#00ff41] text-xs font-mono opacity-50 border border-[#00ff41]/30 p-2">
              WALLET OFFLINE
            </div>
          )}
          <div className="text-[8px] text-[#00ff41] mt-3 opacity-50 text-center font-mono">
            SYSTEM ONLINE :: 88882
          </div>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
}