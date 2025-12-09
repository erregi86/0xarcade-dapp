'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit'; // Hook per aprire il wallet manualmente
import { formatEther } from 'viem';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './components/pages/HomePage';
import { StatsPage } from './components/pages/StatsPage';
import { LeaderboardPage } from './components/pages/LeaderboardPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { GamePage } from './components/pages/GamePage';
import { CyberConnect } from './components/CyberConnect'; // Importiamo il bottone custom

type Page = 'home' | 'stats' | 'leaderboard' | 'settings' | 'game';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Wagmi & RainbowKit Logic
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal(); // Funzione magica per aprire il popup

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // 1. Logica Selezione Gioco (SEMPRE APERTA)
  // L'utente può vedere i dettagli del gioco anche senza wallet
  const handleGameSelect = (gameId: number) => {
    setSelectedGameId(gameId);
    setCurrentPage('game');
  };

  // 2. Logica Accesso Sezioni Protette (Leaderboard/Stats)
  const handleProtectedNavigation = (page: Page) => {
    // Se vuole vedere la leaderboard o le stats, deve connettersi
    if ((page === 'leaderboard' || page === 'stats') && !isConnected) {
      if (openConnectModal) openConnectModal(); // Apre RainbowKit
      return;
    }
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const handleBackToHome = () => {
    setSelectedGameId(null);
    setCurrentPage('home');
  };

  const getPageTitle = (page: Page) => {
    switch(page) {
      case 'home': return 'ARCADE MODULES';
      case 'stats': return 'NEURAL STATS';
      case 'leaderboard': return 'GLOBAL RANKING';
      case 'settings': return 'SYSTEM CONFIG';
      case 'game': return 'ACTIVE SIMULATION';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] tactical-grid scanlines text-[#00ff41] font-mono selection:bg-[#00ff41] selection:text-black overflow-hidden relative">
      
      {/* Sidebar */}
      <Sidebar 
        activePage={currentPage === 'game' ? 'home' : currentPage} 
        onNavigate={handleProtectedNavigation} // Usa la navigazione protetta
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="md:ml-[250px] flex flex-col min-h-screen transition-all duration-300 relative z-10">
        
        {/* Header con bottone RainbowKit integrato */}
        <div className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-[#00ff41] px-4 md:px-8 py-4 flex items-center justify-between h-20">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-[#00ff41] text-2xl border border-[#00ff41] px-2 pb-1">☰</button>
              <div className="hidden md:flex items-center gap-2 text-[#00ff41] font-mono text-sm">
                 <span className="opacity-70">SYSTEM</span>
                 <span className="opacity-50">/</span>
                 <span className="font-bold tracking-wider">{getPageTitle(currentPage)}</span>
              </div>
           </div>
           
           {/* Componente Custom RainbowKit */}
           <CyberConnect />
        </div>

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden p-0">
          <AnimatePresence mode="wait">
            
            {currentPage === 'home' && (
              <HomePage key="home" onGameSelect={handleGameSelect} />
            )}
            
            {currentPage === 'stats' && (
              <StatsPage key="stats" />
            )}
            
            {currentPage === 'leaderboard' && (
              <LeaderboardPage key="leaderboard" />
            )}
            
            {currentPage === 'settings' && (
              <SettingsPage key="settings" />
            )}
            
            {currentPage === 'game' && selectedGameId && (
              <GamePage 
                key="game" 
                gameId={selectedGameId} 
                onBack={handleBackToHome} 
                // Passiamo la funzione per aprire il wallet se provano a scommettere
                onConnectRequest={() => { if(openConnectModal) openConnectModal(); }}
              />
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}