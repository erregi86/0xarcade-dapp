'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Wallet } from 'lucide-react';

interface TacticalAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
  type?: 'error' | 'warning' | 'success';
}

export default function TacticalAlert({ 
  isOpen, 
  title, 
  message, 
  onClose, 
  onAction,
  actionLabel = "ACKNOWLEDGE",
  type = 'error' 
}: TacticalAlertProps) {
  
  // Colori dinamici in base al tipo
  const colors = {
    error: 'border-[#ff003c] text-[#ff003c]',
    warning: 'border-[#ff9d00] text-[#ff9d00]',
    success: 'border-[#00ff41] text-[#00ff41]',
  };

  const themeColor = colors[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop con blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Alert Box */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-md bg-[#050505] border-2 ${themeColor} shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden`}
          >
            {/* Header Barra Strisciata */}
            <div className={`h-1 w-full ${type === 'error' ? 'bg-[#ff003c]' : type === 'warning' ? 'bg-[#ff9d00]' : 'bg-[#00ff41]'}`}></div>
            
            <div className="p-6 relative z-10">
              {/* Scanline di sfondo leggera */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[size:100%_4px]"></div>

              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 border ${themeColor} bg-black/50`}>
                  {type === 'error' ? <XCircle size={32} /> : <AlertTriangle size={32} />}
                </div>
                <div>
                  <h3 className={`font-[Press Start 2P] text-lg font-bold mb-2 ${themeColor} tracking-widest leading-relaxed`}>
                    {title}
                  </h3>
                  <p className="font-mono text-gray-400 text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              {/* Bottoni Azione */}
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-700 text-gray-400 font-mono text-xs hover:bg-gray-800 hover:text-white transition-colors"
                >
                  CLOSE
                </button>
                
                {onAction && (
                  <button 
                    onClick={() => { onAction(); onClose(); }}
                    className={`flex-1 py-3 border ${themeColor} bg-${type === 'error' ? 'red' : 'green'}-900/10 hover:bg-${type === 'error' ? 'red' : 'green'}-900/30 text-white font-mono text-xs font-bold tracking-widest flex items-center justify-center gap-2 transition-all`}
                  >
                    {actionLabel} {type === 'error' && <Wallet size={14} />}
                  </button>
                )}
              </div>
            </div>

            {/* Decorazioni Angoli */}
            <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${themeColor}`}></div>
            <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${themeColor}`}></div>
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${themeColor}`}></div>
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${themeColor}`}></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}