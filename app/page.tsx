'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import TacticalAlert from './components/TacticalAlert';
// 🟢 IMPORT NUOVE FUNZIONI DB
import { getLeaderboard, getPendingChallenges, respondToChallenge, createChallengeDB } from './lib/db'; 
import { ARCADE_CONTRACT_ADDRESS, ARCADE_ABI } from './lib/contracts';
import { NotificationsModal } from './components/NotificationsModal'; 

import { 
  X, Share2, Copy, Trophy, Medal, Award, Target, MessageCircle, Send,
  Gamepad2, Cpu, Shield, Zap, Loader2 
} from 'lucide-react';

// Import Pagine
import { HomePage } from './components/pages/HomePage';
import { StatsPage } from './components/pages/StatsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { GamePage } from './components/pages/GamePage';
import { InventoryPage } from './components/pages/InventoryPage';

// --- TYPES & DATA ---
const GAMES = [
  { id: 1, name: 'NET RUNNER', code: 'NR_01', desc: 'EVADE FIREWALLS', icon: <Gamepad2 /> },
  { id: 2, name: 'CYBER FLAP', code: 'CF_99', desc: 'PRECISION FLIGHT', icon: <Zap /> },
  { id: 3, name: 'DATA BREAKER', code: 'DB_X', desc: 'DECRYPT BLOCKS', icon: <Cpu /> },
  { id: 4, name: '0xBREACH', code: 'ZX_B', desc: 'HYBRID PUZZLE RUNNER', icon: <Shield /> }, 
];

type Page = 'home' | 'stats' | 'leaderboard' | 'settings' | 'game' | 'inventory';

interface Player {
  rank: number;
  address: string;
  username?: string;
  score: string;
  winRate: string;
  status: 'online' | 'offline' | 'busy';
}

interface ChallengeNotification {
  id: string;
  challenger: string;
  game: string;
  wager: string;
  timestamp: string;
}

// --- SHARE MODAL ---
const ShareModal = ({ data, onClose }: { data: { score: string, rank: number } | null, onClose: () => void }) => {
  if (!data) return null;
  const shareText = `I am Rank #${data.rank} on 0xArcade with ${data.score} PTS. Can you beat the Chiliz Elite? 🌶️🕹️ #0xArcade #GameFi $CHZ`;
  const url = "https://0xarcade.gg"; 

  const handleShare = (platform: 'x' | 'wa' | 'tg' | 'copy') => {
    switch (platform) {
      case 'x': window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank'); break;
      case 'wa': window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}`, '_blank'); break;
      case 'tg': window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`, '_blank'); break;
      case 'copy': navigator.clipboard.writeText(`${shareText} ${url}`); break;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm border-2 border-[#00ff41] bg-[#050505] p-6 shadow-[0_0_30px_rgba(0,255,65,0.2)] tactical-grid relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#00ff41] hover:text-white transition-colors"><X size={20} /></button>
        <h3 className="text-xl font-[Press Start 2P] text-[#00ff41] mb-6 text-center">BROADCAST_DATA</h3>
        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
          <button onClick={() => handleShare('x')} className="flex flex-col items-center justify-center p-4 border border-[#00ff41]/50 hover:bg-[#00ff41] hover:text-black transition-all group gap-2"><Share2 size={24} /><span>X / TWITTER</span></button>
          <button onClick={() => handleShare('wa')} className="flex flex-col items-center justify-center p-4 border border-[#00ff41]/50 hover:bg-[#00ff41] hover:text-black transition-all group gap-2"><MessageCircle size={24} /><span>WHATSAPP</span></button>
          <button onClick={() => handleShare('tg')} className="flex flex-col items-center justify-center p-4 border border-[#00ff41]/50 hover:bg-[#00ff41] hover:text-black transition-all group gap-2"><Send size={24} /><span>TELEGRAM</span></button>
          <button onClick={() => handleShare('copy')} className="flex flex-col items-center justify-center p-4 border border-[#00ff41]/50 hover:bg-[#00ff41] hover:text-black transition-all group gap-2"><Copy size={24} /><span>COPY LINK</span></button>
        </div>
      </div>
    </div>
  );
};

// --- BETTING MODAL ---
const BettingModal = ({ opponent, onClose, myAddress }: { opponent: Player | null, onClose: () => void, myAddress?: string }) => {
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);
  const [wager, setWager] = useState("10"); 
  const { writeContract, isPending, isSuccess } = useWriteContract();

  if (!opponent) return null;
  const displayName = opponent.username || `${opponent.address.substring(0,6)}...${opponent.address.slice(-4)}`;

  const handleChallenge = async () => {
    if (!wager || isPending || !myAddress) return;
    
    // 1. Scrivi su Blockchain (Lasciamo questo come "Intent" per ora)
    writeContract({
      address: ARCADE_CONTRACT_ADDRESS,
      abi: ARCADE_ABI,
      functionName: 'createChallenge',
      args: [opponent.address as `0x${string}`, BigInt(selectedGame)],
      value: parseEther(wager), 
    });

    // 2. 🟢 Salva su DB Supabase (Così l'altro utente la vede)
    // Nota: In produzione questo dovrebbe farlo il backend ascoltando gli eventi blockchain
    // Ma per Web2.5 veloce, lo facciamo qui.
    const gameName = GAMES.find(g => g.id === selectedGame)?.name || 'UNKNOWN';
    await createChallengeDB(myAddress, opponent.address, gameName, wager);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md border-2 border-[#00ff41] bg-[#050505] p-6 shadow-[0_0_30px_rgba(0,255,65,0.2)] tactical-grid">
        <div className="flex justify-between items-start mb-6 border-b border-[#00ff41]/30 pb-4">
          <div>
            <h3 className="text-xl font-[Press Start 2P] text-[#00ff41] mb-2">INIT_CHALLENGE</h3>
            <p className="font-mono text-xs text-[#00ff41]/70">Target: {displayName}</p>
          </div>
          <button onClick={onClose} className="text-[#00ff41] hover:text-red-500 transition-colors"><X size={24} /></button>
        </div>

        {isSuccess ? (
          <div className="text-center py-10 space-y-4">
             <div className="text-[#00ff41] text-4xl animate-bounce">✓</div>
             <p className="text-[#00ff41] font-bold">TRANSACTION SENT!</p>
             <p className="text-xs text-[#00ff41]/70">Challenge signal broadcasted to network.</p>
             <button onClick={onClose} className="mt-4 px-6 py-2 bg-[#00ff41] text-black font-bold">CLOSE</button>
          </div>
        ) : (
          <>
            <div className="space-y-6 font-mono">
              <div className="space-y-2">
                <label className="text-xs tracking-widest text-[#00ff41]/80">WAGER AMOUNT ($CHZ)</label>
                <div className="flex items-center border border-[#00ff41] bg-[#00ff41]/5 p-3">
                  <span className="text-[#00ff41] mr-2 font-bold">CHZ</span>
                  <input 
                    type="number" 
                    value={wager}
                    onChange={(e) => setWager(e.target.value)}
                    className="bg-transparent border-none outline-none text-[#00ff41] w-full placeholder-[#00ff41]/30 focus:ring-0 text-right font-bold"
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs tracking-widest text-[#00ff41]/80">SELECT PROTOCOL</label>
                <div className="grid grid-cols-1 gap-2">
                  {GAMES.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      className={`flex items-center gap-3 p-2 border transition-all text-xs text-left
                        ${selectedGame === game.id 
                          ? 'border-[#00ff41] bg-[#00ff41] text-black font-bold' 
                          : 'border-[#00ff41]/30 text-[#00ff41]/60 hover:border-[#00ff41]'
                        }
                      `}
                    >
                      <span className="scale-75">{game.icon}</span>
                      <span>{game.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={onClose} className="flex-1 py-3 border border-[#00ff41]/50 text-[#00ff41]/50 font-mono text-xs hover:bg-[#00ff41]/10 hover:text-[#00ff41] transition-all">CANCEL</button>
              <button onClick={handleChallenge} disabled={isPending} className="flex-1 py-3 bg-[#00ff41] text-black font-bold font-mono text-xs hover:bg-[#00ff41]/90 transition-all animate-pulse disabled:opacity-50 disabled:animate-none">
                {isPending ? 'SIGNING...' : `SEND ${wager} CHZ >`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- LEADERBOARD SOCIAL HUB ---
const LeaderboardSection = ({ onChallenge, onShare }: { onChallenge: (p: Player) => void, onShare: (p: Player) => void }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data, error } = await getLeaderboard();
        if (error) { console.error('Supabase Error:', error); setPlayers([]); } 
        else if (data) {
          const mappedPlayers: Player[] = data.map((user: any, index: number) => ({
            rank: index + 1,
            address: user.wallet_address || user.id,
            username: user.username, 
            score: user.score?.toLocaleString() || '0',
            winRate: user.win_rate ? `${user.win_rate}%` : '0%',
            status: user.status || 'online' 
          }));
          setPlayers(mappedPlayers);
        }
      } catch (err) { console.error('Fetch Error:', err); } finally { setLoading(false); }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-400" size={24} />;
      case 2: return <Medal className="text-gray-300" size={24} />;
      case 3: return <Award className="text-orange-400" size={24} />;
      default: return <span className="font-mono text-[#00ff41] text-xl">#{rank}</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-[#00ff41] pb-4 mb-8 gap-4">
        <div><h2 className="text-3xl font-[Press Start 2P] mb-2 text-[#00ff41]">LEADERBOARD</h2><p className="font-mono text-xs text-[#00ff41]/60 tracking-widest">// GLOBAL CHILIZ ELITE</p></div>
        <div className="font-mono text-xs text-[#00ff41] border border-[#00ff41] px-3 py-1 bg-[#00ff41]/10">SEASON 1: ACTIVE</div>
      </div>
      <div className="space-y-4">
        {loading ? ( <div className="flex justify-center items-center py-20 text-[#00ff41]"><Loader2 className="animate-spin mr-2" /> ACCESSING DATABASE...</div> ) : players.length === 0 ? ( <div className="text-center py-10 border border-[#00ff41]/30 text-[#00ff41]/50 font-mono">NO DATA FOUND ON CHAIN</div> ) : (
          players.map((player) => {
            const displayName = player.username ? player.username : `${player.address.substring(0,6)}...${player.address.slice(-4)}`;
            return (
              <div key={player.rank} className="flex flex-col md:flex-row items-center justify-between border border-[#00ff41]/30 bg-[#050505] p-4 hover:border-[#00ff41] hover:bg-[#00ff41]/5 transition-all group">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-12 flex justify-center">{getRankIcon(player.rank)}</div>
                  <div>
                    <div className="flex items-center gap-2"><span className="font-mono font-bold text-[#00ff41] text-lg">{displayName}</span><span className={`w-2 h-2 rounded-full ${player.status === 'online' ? 'bg-[#00ff41] animate-pulse' : 'bg-gray-600'}`} /></div>
                    <div className="text-[10px] font-mono opacity-60 text-[#00ff41] mt-1">WIN RATE: {player.winRate} // SCORE: {player.score} PTS</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
                  <button onClick={() => onShare(player)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-[#00ff41]/30 text-[#00ff41]/70 hover:text-[#00ff41] hover:border-[#00ff41] font-mono text-[10px] transition-all"><Share2 size={14} /> SHARE</button>
                  {player.status !== 'offline' && ( <button onClick={() => onChallenge(player)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#00ff41] text-black font-bold font-mono text-[10px] hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,255,65,0.4)]"><Target size={14} /> CHALLENGE</button> )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [selectedOpponent, setSelectedOpponent] = useState<Player | null>(null);
  const [shareData, setShareData] = useState<Player | null>(null);
  
  // 🟢 STATI NOTIFICHE (REALI)
  const [notifications, setNotifications] = useState<ChallengeNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { isConnected, address } = useAccount();
  const connectModal = useConnectModal();
  const openConnectModal = connectModal?.openConnectModal;

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'warning' | 'success';
    actionLabel?: string;
    onAction?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'error' });

  useEffect(() => { setMounted(true); }, []);

  // 🟢 FETCH NOTIFICHE REALI (POLLING OGNI 10s)
  useEffect(() => {
    if (isConnected && address) {
      const checkInbox = async () => {
        const { data, error } = await getPendingChallenges(address);
        if (data && data.length > 0) {
          // Mappa i dati DB nel formato Notification
          const realNotifs: ChallengeNotification[] = data.map((c: any) => ({
            id: c.id,
            challenger: `${c.challenger_address.substring(0,6)}...`,
            game: c.game_id,
            wager: c.wager_amount,
            timestamp: 'NEW'
          }));
          
          setNotifications(realNotifs);
          
          // Se ci sono nuove notifiche e non l'abbiamo ancora visto, alert
          // (Logica semplificata: mostra alert se c'è almeno 1 notifica e inbox chiuso)
          if (!isNotificationsOpen) {
            setAlertState({
              isOpen: true,
              title: 'INCOMING TRANSMISSION',
              message: `${realNotifs.length} Combat requests pending.`,
              type: 'warning',
              actionLabel: 'OPEN INBOX',
              onAction: () => setIsNotificationsOpen(true)
            });
          }
        }
      };

      // Controllo immediato e poi intervallo
      checkInbox();
      const interval = setInterval(checkInbox, 10000); // 10 secondi
      return () => clearInterval(interval);
    }
  }, [isConnected, address, isNotificationsOpen]);

  // 🟢 LOGICA ACCEPT (INIZIA IL GIOCO)
  const handleAcceptChallenge = async (id: string) => {
    // 1. Trova la sfida nella lista locale
    const challenge = notifications.find(n => n.id === id);
    if (!challenge) return;

    // 2. Aggiorna DB (Accetta)
    await respondToChallenge(id, 'accepted');

    // 3. Rimuovi dalla lista locale
    setNotifications(prev => prev.filter(n => n.id !== id));
    setIsNotificationsOpen(false); // Chiudi modal

    // 4. Trova ID del gioco
    // Cerchiamo nell'array GAMES quale gioco ha il nome della sfida
    const gameObj = GAMES.find(g => g.name === challenge.game);
    
    if (gameObj) {
      setAlertState({
        isOpen: true,
        title: 'MATCH INITIALIZED',
        message: `Connecting to ${gameObj.name} server. Good luck.`,
        type: 'success'
      });
      
      // 5. REDIRECT AL GIOCO
      // Aspettiamo un attimo per far leggere l'alert
      setTimeout(() => {
        setAlertState(prev => ({ ...prev, isOpen: false })); // Chiudi alert
        setSelectedGameId(gameObj.id);
        setCurrentPage('game');
      }, 1500);

    } else {
      console.error("Game not found for:", challenge.game);
    }
  };

  const handleDeclineChallenge = async (id: string) => {
    await respondToChallenge(id, 'declined');
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!mounted) return null;

  const handleNavigation = (page: string) => {
    const targetPage = page as Page;
    const protectedPages = ['leaderboard', 'stats', 'inventory', 'settings'];
    if (protectedPages.includes(targetPage) && !isConnected) {
      setAlertState({
        isOpen: true, title: 'ACCESS RESTRICTED', message: 'Encrypted Data. Connect Wallet to decrypt user assets.', type: 'error',
        actionLabel: 'CONNECT IDENTITY', onAction: () => { if (openConnectModal) openConnectModal(); }
      });
      return;
    }
    setCurrentPage(targetPage);
    setIsSidebarOpen(false);
  };

  const handleGameSelect = (gameId: number) => { setSelectedGameId(gameId); setCurrentPage('game'); };
  const handleBackToHome = () => { setSelectedGameId(null); setCurrentPage('home'); };
  
  const getPageTitle = (page: Page) => {
    switch(page) {
      case 'home': return 'ARCADE MODULES';
      case 'stats': return 'NEURAL STATS';
      case 'leaderboard': return 'SOCIAL HUB'; 
      case 'settings': return 'SYSTEM CONFIG';
      case 'game': return 'ACTIVE SIMULATION';
      case 'inventory': return 'DIGITAL ARMORY';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-[#00ff41] font-mono overflow-hidden tactical-grid scanlines">
      <TacticalAlert 
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        actionLabel={alertState.actionLabel}
        onAction={alertState.onAction}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
      />
      
      {/* Notifications Modal */}
      <NotificationsModal 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onAccept={handleAcceptChallenge}
        onDecline={handleDeclineChallenge}
      />

      <AnimatePresence>
        {selectedOpponent && <BettingModal key="betting" opponent={selectedOpponent} onClose={() => setSelectedOpponent(null)} myAddress={address} />}
        {shareData && <ShareModal key="share" data={shareData} onClose={() => setShareData(null)} />}
      </AnimatePresence>
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-[#00ff41] transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar activePage={currentPage === 'game' ? 'home' : currentPage} onNavigate={handleNavigation} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-black/80 backdrop-blur-sm relative z-10">
        <div className="h-20 flex-shrink-0 border-b border-[#00ff41] bg-black/90 px-6 flex items-center">
           <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-2xl border border-[#00ff41] px-2 text-[#00ff41]">☰</button>
           <div className="flex-1">
             <Header 
               page={getPageTitle(currentPage)} 
               notificationCount={notifications.length} 
               onOpenNotifications={() => setIsNotificationsOpen(true)} 
             />
           </div>
        </div>
        <main className="flex-1 overflow-y-auto p-0 scroll-smooth">
          <AnimatePresence mode="wait">
            {currentPage === 'home' && <HomePage key="home" onGameSelect={handleGameSelect} gamesList={GAMES} />}
            {currentPage === 'stats' && <StatsPage key="stats" />}
            {currentPage === 'leaderboard' && <LeaderboardSection key="leaderboard" onChallenge={setSelectedOpponent} onShare={setShareData} />}
            {currentPage === 'settings' && <SettingsPage key="settings" />}
            {currentPage === 'inventory' && <InventoryPage key="inventory" />}
            {currentPage === 'game' && selectedGameId && <GamePage key="game" gameId={selectedGameId} onBack={handleBackToHome} onConnectRequest={() => { if(openConnectModal) openConnectModal(); }} />}
          </AnimatePresence>
        </main>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}