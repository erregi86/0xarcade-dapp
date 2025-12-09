'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAccount, useConnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import TacticalAlert from './components/TacticalAlert';

// Import Icone
import { RunnerIcon, UFOIcon, BrickIcon, VirusIcon } from './components/PixelIcons';

// Import Pagine
import { HomePage } from './components/pages/HomePage';
import { StatsPage } from './components/pages/StatsPage';
import { LeaderboardPage } from './components/pages/LeaderboardPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { GamePage } from './components/pages/GamePage';
import { InventoryPage } from './components/pages/InventoryPage'; // 🟢 FIX: ECCO L'IMPORT CHE MANCAVA

// Dati Giochi (4 Giochi)
const GAMES = [
  { id: 1, name: 'NET RUNNER', code: 'NR_01', desc: 'EVADE FIREWALLS', icon: <RunnerIcon /> },
  { id: 2, name: 'CYBER FLAP', code: 'CF_99', desc: 'PRECISION FLIGHT', icon: <UFOIcon /> },
  { id: 3, name: 'DATA BREAKER', code: 'DB_X', desc: 'DECRYPT BLOCKS', icon: <BrickIcon /> },
  { id: 4, name: '0xBREACH', code: 'ZX_B', desc: 'HYBRID PUZZLE RUNNER', icon: <VirusIcon /> }, 
];

type Page = 'home' | 'stats' | 'leaderboard' | 'settings' | 'game' | 'inventory';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'warning' | 'success';
    actionLabel?: string;
    onAction?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'error' });

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // Navigazione Protetta
  const handleNavigation = (page: string) => {
    const targetPage = page as Page;
    const protectedPages = ['leaderboard', 'stats', 'inventory', 'settings'];

    if (protectedPages.includes(targetPage) && !isConnected) {
      setAlertState({
        isOpen: true,
        title: 'ACCESS RESTRICTED',
        message: 'Encrypted Data. Connect Wallet to decrypt user assets.',
        type: 'error',
        actionLabel: 'CONNECT IDENTITY',
        onAction: () => { if (openConnectModal) openConnectModal(); }
      });
      return;
    }
    setCurrentPage(targetPage);
    setIsSidebarOpen(false);
  };

  const handleGameSelect = (gameId: number) => {
    setSelectedGameId(gameId);
    setCurrentPage('game');
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
      case 'inventory': return 'DIGITAL ARMORY';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-[#00ff41] font-mono overflow-hidden tactical-grid scanlines">
      
      {/* Alert Globale */}
      <TacticalAlert 
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        actionLabel={alertState.actionLabel}
        onAction={alertState.onAction}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-[#00ff41] transform transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          activePage={currentPage === 'game' ? 'home' : currentPage} 
          onNavigate={handleNavigation} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-black/80 backdrop-blur-sm relative z-10">
        
        {/* Header */}
        <div className="h-20 flex-shrink-0 border-b border-[#00ff41] bg-black/90 px-6 flex items-center">
           <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-2xl border border-[#00ff41] px-2 text-[#00ff41]">☰</button>
           <div className="flex-1">
             <Header page={getPageTitle(currentPage)} />
           </div>
        </div>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-0 scroll-smooth">
          <AnimatePresence mode="wait">
            
            {/* HomePage riceve la lista GAMES aggiornata */}
            {currentPage === 'home' && <HomePage key="home" onGameSelect={handleGameSelect} gamesList={GAMES} />}
            
            {currentPage === 'stats' && <StatsPage key="stats" />}
            {currentPage === 'leaderboard' && <LeaderboardPage key="leaderboard" />}
            {currentPage === 'settings' && <SettingsPage key="settings" />}
            {currentPage === 'inventory' && <InventoryPage key="inventory" />}
            
            {currentPage === 'game' && selectedGameId && (
              <GamePage 
                key="game" 
                gameId={selectedGameId} 
                onBack={handleBackToHome} 
                onConnectRequest={() => { if(openConnectModal) openConnectModal(); }}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}