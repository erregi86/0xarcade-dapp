"use client";

import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { Volume2, VolumeX } from 'lucide-react';

export default function CyberpunkBGM() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false); // Fix per idratazione
  
  // Assicurati di avere il file audio in public/sounds/cyberpunk-bg.mp3
  const [play, { stop }] = useSound('/sounds/cyberpunk-bg.mp3', { 
    volume: 0.3, 
    loop: true,
    interrupt: false,
  });

  // Evita errori di idratazione aspettando il mount del client
  useEffect(() => {
    setMounted(true);
    return () => stop();
  }, [stop]);

  const toggleMusic = () => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!mounted) return null;

  return (
    <button 
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 p-3 bg-black/90 border border-[#00ff41] rounded-full text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,65,0.5)] active:scale-95 cursor-pointer"
      aria-label="Toggle Background Music"
    >
      {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
    </button>
  );
}