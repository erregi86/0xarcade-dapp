"use client";

import { useEffect, useState } from 'react';
import useSound from 'use-sound';

interface GameAudioProps {
  isPlaying: boolean;      // Se il gioco è attivo
  isGameOver: boolean;     // Se il giocatore ha perso
}

export default function GameAudioController({ isPlaying, isGameOver }: GameAudioProps) {
  // Fix per l'idratazione (Next.js)
  const [isMounted, setIsMounted] = useState(false);

  // 1. Musica di sottofondo (Loop)
  // Assicurati che il file sia in: public/sounds/cyberpunk-bg.mp3
  const [playBgm, { stop: stopBgm }] = useSound('/sounds/cyberpunk-bg.mp3', { 
    volume: 0.3, 
    loop: true,
    interrupt: false 
  });

  // 2. Suono Game Over (Glitch)
  // Assicurati che il file sia in: public/sounds/glitch.mp3
  const [playGameOver] = useSound('/sounds/glitch.mp3', { volume: 0.5 });

  useEffect(() => {
    setIsMounted(true);
    return () => stopBgm();
  }, [stopBgm]);

  // Gestione Musica: Parte se giochi, si ferma se esci o perdi
  useEffect(() => {
    if (!isMounted) return;

    if (isPlaying && !isGameOver) {
      playBgm();
    } else {
      stopBgm();
    }
  }, [isPlaying, isGameOver, isMounted, playBgm, stopBgm]);

  // Gestione Game Over: Suona UNA volta quando perdi
  useEffect(() => {
    if (!isMounted) return;

    if (isGameOver) {
      stopBgm();      // Ferma la musica
      playGameOver(); // SUONA IL GLITCH
    }
  }, [isGameOver, isMounted, stopBgm, playGameOver]);

  return null; // Componente invisibile (solo logica)
}