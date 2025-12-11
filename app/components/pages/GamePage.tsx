'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowLeft, Swords, Cpu } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi'; 
import NetRunner from '../games/NetRunner';
import CyberFlap from '../games/CyberFlap';
import DataBreaker from '../games/DataBreaker';
import ZeroXBreach from '../games/ZeroXBreach';
import { BettingControls } from '../BettingControls';
import { saveGameScore } from '../../lib/db';
import TacticalAlert from '../TacticalAlert';
import { ARCADE_CONTRACT_ADDRESS, ARCADE_ABI } from '../../lib/contracts';
import { IntroModal } from '../IntroModal'; // 🟢 1. IMPORTA MODALE QUI

interface GamePageProps {
  gameId: number;
  onBack: () => void;
  onConnectRequest: () => void;
}

type GameMode = 'menu' | 'free' | 'bet' | 'playing';

export function GamePage({ gameId, onBack, onConnectRequest }: GamePageProps) {
  const [mode, setMode] = useState<GameMode>('menu');
  const [playType, setPlayType] = useState<'free' | 'paid'>('free');
  
  // 🟢 2. STATO VISIBILITÀ INTRO
  const [showIntro, setShowIntro] = useState(false);

  const { writeContract, isPending: isClaiming } = useWriteContract();

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error';
    actionLabel?: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const { address, isConnected } = useAccount();

  const getGameTitle = (id: number) => {
    switch(id) {
      case 1: return 'NET RUNNER';
      case 2: return 'CYBER FLAP';
      case 3: return 'DATA BREAKER';
      case 4: return '0xBREACH';
      default: return 'UNKNOWN MODULE';
    }
  };

  const handleStartGame = (type: 'free' | 'paid') => {
    if (type === 'paid' && !isConnected) {
      onConnectRequest();
      return; 
    }
    setPlayType(type);
    setMode('playing');
  };

  // 🟢 3. GESTORE CLICK "PVP WAGER"
  const handleBetModeClick = () => {
    // Controlla se l'utente ha già accettato i termini
    const hasAccepted = localStorage.getItem('0xarcade_terms_accepted');
    
    if (hasAccepted) {
      // Se già accettato, vai diretto
      setMode('bet');
    } else {
      // Altrimenti apri il modale
      setShowIntro(true);
    }
  };

  const handleClaimReward = () => {
    const mockChallengeId = BigInt(1); 
    writeContract({
      address: ARCADE_CONTRACT_ADDRESS,
      abi: ARCADE_ABI,
      functionName: 'claimReward',
      args: [mockChallengeId], 
    });
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  const handleGameOver = async (score: number) => {
    const xpEarned = 10 + Math.floor(score / 10);
    
    if (isConnected && address) {
      saveGameScore(address, gameId, score).catch(console.error);
    }

    let outcomeType: 'error' | 'warning' | 'success' = 'success';
    let outcomeTitle = 'MISSION ACCOMPLISHED';
    let outcomeMsg = 'EXCELLENT PERFORMANCE.';
    let showClaimButton = false;

    if (score < 50) {
        outcomeType = 'error';
        outcomeTitle = 'MISSION FAILED';
        outcomeMsg = 'SUBOPTIMAL PERFORMANCE DETECTED.';
    } else if (score < 200) {
        outcomeType = 'warning';
        outcomeTitle = 'MISSION ENDED';
        outcomeMsg = 'ADEQUATE PERFORMANCE.';
    } else {
        outcomeType = 'success';
        outcomeTitle = 'ELITE PERFORMANCE';
        outcomeMsg = 'TARGET DESTROYED. REWARD AVAILABLE.';
        showClaimButton = true;
    }

    setAlertState({
      isOpen: true,
      title: outcomeTitle,
      message: `REPORT:\n> FINAL SCORE: ${score}\n> XP GAINED: +${xpEarned}\n> STATUS: ${outcomeMsg}`,
      type: outcomeType,
      actionLabel: (playType === 'paid' && showClaimButton) 
        ? (isClaiming ? 'PROCESSING...' : 'CLAIM REWARD ($CHZ)') 
        : 'RETURN TO BASE',
      onAction: (playType === 'paid' && showClaimButton) 
        ? handleClaimReward 
        : () => setMode('menu')
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 md:p-8 text-[#00ff41] font-mono h-full flex flex-col relative"
    >
      {/* 🟢 4. RENDERIZZA MODALE INTRO */}
      <IntroModal 
        isOpen={showIntro} 
        onClose={() => setShowIntro(false)} 
        onComplete={() => setMode('bet')} // Quando finisce, vai al betting
      />

      <TacticalAlert 
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        actionLabel={alertState.actionLabel}
        onAction={alertState.onAction}
        onClose={() => {
            setAlertState(prev => ({ ...prev, isOpen: false }));
            if (!isClaiming) setMode('menu');
        }}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-[#00ff41] pb-4 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={mode === 'menu' ? onBack : () => setMode('menu')}
            className="p-2 border border-[#00ff41] hover:bg-[#00ff41] hover:text-[#050505] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl tracking-wider font-bold">{getGameTitle(gameId)}</h2>
            <p className="text-xs opacity-70">SYSTEM STATUS: {mode === 'playing' ? 'RUNNING' : 'STANDBY'}</p>
          </div>
        </div>
        <div className="text-xs border border-[#00ff41] px-3 py-1 bg-[#050505] self-start md:self-auto">
          MODE: {mode.toUpperCase()}
        </div>
      </div>

      <div className="flex-1 relative min-h-[500px] border border-[#00ff41] bg-[#050505] overflow-hidden">
        <AnimatePresence mode="wait">
          
          {mode === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center justify-center"
            >
              <div 
                onClick={() => handleStartGame('free')}
                className="group border border-[#00ff41] p-8 h-64 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#00ff41]/10 transition-colors relative overflow-hidden"
              >
                <Cpu size={48} className="group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold tracking-widest">FREE PLAY</h3>
                <p className="text-center text-xs opacity-60 max-w-[200px]">
                  PRACTICE MODE // NO RISK
                </p>
              </div>

              {/* 🟢 5. AGGIORNATO CLICK HANDLER */}
              <div 
                onClick={handleBetModeClick} 
                className="group border border-[#00ff41] p-8 h-64 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#00ff41]/10 transition-colors relative overflow-hidden"
              >
                <Swords size={48} className="group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold tracking-widest">PVP WAGER</h3>
                <p className="text-center text-xs opacity-60 max-w-[200px]">
                  STAKE CHZ // WINNER TAKES ALL
                </p>
              </div>
            </motion.div>
          )}

          {mode === 'bet' && (
            <motion.div
              key="bet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4"
            >
              <div className="max-w-md w-full border border-[#00ff41] p-8 bg-[#050505] relative shadow-[0_0_50px_rgba(0,255,65,0.1)]">
                <h3 className="text-xl md:text-2xl mb-6 flex items-center gap-3 font-bold border-b border-[#00ff41] pb-4">
                  <Coins /> WAGER PROTOCOL
                </h3>
                
                <BettingControls onRunGame={() => handleStartGame('paid')} />
                
                <button onClick={() => setMode('menu')} className="mt-6 w-full text-center text-xs hover:underline text-[#00ff41]/60">
                   CANCEL SETUP
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'playing' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black flex items-center justify-center"
            >
               {gameId === 1 && <NetRunner onGameOver={handleGameOver} />}
               {gameId === 2 && <CyberFlap onGameOver={handleGameOver} />}
               {gameId === 3 && <DataBreaker onGameOver={handleGameOver} />}
               {gameId === 4 && <ZeroXBreach onGameOver={handleGameOver} />}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}