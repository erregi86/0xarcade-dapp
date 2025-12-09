'use client';

import { X, Check, XCircle, Gamepad2, Zap, Cpu, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mappa icone giochi
const GameIcons: Record<string, React.ReactNode> = {
  'NET RUNNER': <Gamepad2 size={16} />,
  'CYBER FLAP': <Zap size={16} />,
  'DATA BREAKER': <Cpu size={16} />,
  '0xBREACH': <Shield size={16} />,
};

interface Challenge {
  id: string;
  challenger: string;
  game: string;
  wager: string; // in CHZ
  timestamp: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Challenge[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export function NotificationsModal({ isOpen, onClose, notifications, onAccept, onDecline }: NotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-end p-4 md:p-8 pointer-events-none">
      {/* Backdrop invisibile */}
      <div className="absolute inset-0 bg-transparent pointer-events-none" />

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="relative w-full max-w-sm bg-[#050505] border-2 border-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.3)] pointer-events-auto tactical-grid overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#00ff41]/50 bg-[#00ff41]/10">
              <h3 className="text-sm font-bold font-[Press Start 2P] text-[#00ff41] animate-pulse">
                INBOX [{notifications.length}]
              </h3>
              <button onClick={onClose} className="text-[#00ff41] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8 opacity-50 font-mono text-xs text-[#00ff41]">
                  NO NEW TRANSMISSIONS
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map((notif) => (
                    <motion.div 
                      key={notif.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-[#00ff41]/30 p-3 bg-[#00ff41]/5 hover:bg-[#00ff41]/10 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono opacity-60 bg-[#00ff41]/20 text-[#00ff41] px-1">INCOMING CHALLENGE</span>
                        <span className="text-[10px] font-mono opacity-40 text-[#00ff41]">{notif.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded bg-[#00ff41]/20 flex items-center justify-center text-[#00ff41]">
                           {GameIcons[notif.game] || <Gamepad2 size={16} />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#00ff41]">{notif.challenger}</div>
                          <div className="text-[10px] opacity-80 font-mono text-[#00ff41]">
                            wants to play <span className="text-white font-bold">{notif.game}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-black/50 p-2 border border-[#00ff41]/20 mb-3 text-[#00ff41]">
                        <span className="text-[10px] tracking-widest">WAGER:</span>
                        <span className="text-sm font-bold text-[#00ff41]">{notif.wager} CHZ</span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => onDecline(notif.id)}
                          className="flex-1 py-2 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black text-[10px] font-bold font-mono transition-all flex items-center justify-center gap-1"
                        >
                          <XCircle size={12} /> DECLINE
                        </button>
                        <button 
                          onClick={() => onAccept(notif.id)}
                          className="flex-1 py-2 bg-[#00ff41] text-black hover:bg-white text-[10px] font-bold font-mono transition-all flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(0,255,65,0.4)]"
                        >
                          <Check size={12} /> ACCEPT
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}