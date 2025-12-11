'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Swords, Terminal, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function IntroModal({ isOpen, onClose, onComplete }: IntroModalProps) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Salva il flag che l'utente ha accettato
      localStorage.setItem('0xarcade_terms_accepted', 'true');
      onComplete(); // Esegue l'azione successiva (apre il betting)
      onClose();    // Chiude il modale
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg border-2 border-[#00ff41] bg-[#050505] shadow-[0_0_50px_rgba(0,255,65,0.2)] relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-[#00ff41] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />

        <div className="p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WELCOME */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 text-[#00ff41]">
                  <Terminal size={40} />
                  <h2 className="text-2xl font-[Press Start 2P] leading-relaxed">INITIALIZING<br/>WAGER PROTOCOL</h2>
                </div>
                <p className="font-mono text-sm leading-relaxed text-[#00ff41]/80">
                  You are entering the <span className="font-bold text-white">PvP Zone</span>.
                  <br/><br/>
                  Smart Contracts will govern your funds. This is a high-stakes environment on the <span className="font-bold text-[#d600ff]">Chiliz Chain</span>.
                </p>
                <div className="p-4 border border-[#00ff41]/30 bg-[#00ff41]/5 text-xs font-mono">
                  {'>'} VERIFY WALLET<br/>
                  {'>'} ACCEPT RISKS<br/>
                  {'>'} EXECUTE CONTRACT
                </div>
              </motion.div>
            )}

            {/* STEP 2: RULES */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 text-[#00ff41]">
                  <Swords size={40} />
                  <h2 className="text-2xl font-[Press Start 2P]">RULES OF<br/>ENGAGEMENT</h2>
                </div>
                
                <ul className="space-y-4 font-mono text-xs text-[#00ff41]/80">
                  <li className="flex gap-3">
                    <CheckCircle2 className="shrink-0" size={16} />
                    <span>
                      <strong className="text-white block mb-1">SMART CONTRACT ESCROW</strong>
                      Funds are locked on-chain immediately. Winner takes all.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="shrink-0" size={16} />
                    <span>
                      <strong className="text-white block mb-1">NO REFUNDS</strong>
                      Blockchain transactions are irreversible. Ensure stable connection before wagering.
                    </span>
                  </li>
                </ul>
              </motion.div>
            )}

            {/* STEP 3: RISK DISCLAIMER */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 text-yellow-500">
                  <AlertTriangle size={40} />
                  <h2 className="text-2xl font-[Press Start 2P]">RISK<br/>WARNING</h2>
                </div>
                
                <div className="font-mono text-xs text-[#00ff41]/70 space-y-4">
                  <p>
                    <span className="text-yellow-500 font-bold">WARNING:</span> This protocol is currently in <span className="text-white">BETA</span>.
                  </p>
                  <div className="p-3 border border-yellow-500/30 bg-yellow-500/5 text-yellow-200">
                    By clicking ACCEPT, you acknowledge that 0xArcade is not responsible for fund loss due to user error, network latency, or browser incompatibility.
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-[#00ff41]/30 bg-[#00ff41]/5 flex justify-between items-center">
           <button onClick={onClose} className="text-xs text-[#00ff41]/50 hover:text-white underline">CANCEL</button>
           
           <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-[#00ff41] text-black font-bold font-mono text-sm hover:bg-white transition-all group shadow-[0_0_15px_rgba(0,255,65,0.4)]"
            >
              {step === 3 ? 'I ACCEPT // ENTER PVP' : 'NEXT SEQUENCE'}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

      </div>
    </div>
  );
}