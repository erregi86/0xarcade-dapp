'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface NetRunnerProps {
  onGameOver: (score: number) => void;
}

export default function NetRunner({ onGameOver }: NetRunnerProps) {
  // --- TUNING CONFIG (EASY START) ---
  const INITIAL_SPEED = 6.5;   // Molto più gestibile all'inizio
  const MAX_SPEED = 18.0;      // Cap ragionevole
  const SPEED_INCREMENT = 0.1; // Aumento più dolce
  
  const GRAVITY = 0.65;        // Salto meno "pesante", più floaty
  const JUMP_STRENGTH = -11;   // Salto bilanciato
  const FLOOR_Y = 0;

  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  
  // Refs
  const dinoRef = useRef({ y: 0, velocity: 0, isJumping: false });
  const obstacleRef = useRef({ x: 800, width: 30, height: 40 }); 
  const gameLoopRef = useRef<number | null>(null);
  const speedRef = useRef(INITIAL_SPEED);
  const scoreRef = useRef(0);

  // Render State
  const [dinoY, setDinoY] = useState(0);
  const [obstData, setObstData] = useState({ x: 800, w: 30, h: 40 });

  const resetObstacle = () => {
    const newWidth = Math.floor(Math.random() * 20) + 25; 
    const newHeight = Math.floor(Math.random() * 40) + 30; // Meno alti all'inizio
    
    // Distanza spawn più generosa
    const minDistance = 450 + (speedRef.current * 10); 
    const randomBuffer = Math.random() * 300;

    obstacleRef.current = {
      x: minDistance + randomBuffer,
      width: newWidth,
      height: newHeight,
    };
  };

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    // 1. Fisica Dino
    dinoRef.current.velocity += GRAVITY;
    dinoRef.current.y += dinoRef.current.velocity;

    if (dinoRef.current.y > FLOOR_Y) {
      dinoRef.current.y = FLOOR_Y;
      dinoRef.current.velocity = 0;
      dinoRef.current.isJumping = false;
    }

    // 2. Fisica Ostacolo
    obstacleRef.current.x -= speedRef.current;

    // Respawn
    if (obstacleRef.current.x < -100) {
      resetObstacle();
      scoreRef.current += 10;
      setScore(scoreRef.current);

      if (speedRef.current < MAX_SPEED) {
        speedRef.current += SPEED_INCREMENT;
      }
    }

    // 3. Collisione (Hitbox perdonante)
    const dinoX = 50 + 8; // Più margine
    const dinoW = 40 - 16; 
    
    if (
      dinoX < obstacleRef.current.x + obstacleRef.current.width - 5 &&
      dinoX + dinoW > obstacleRef.current.x + 5 &&
      dinoRef.current.y > -obstacleRef.current.height + 5 
    ) {
      handleGameOver();
      return;
    }

    // 4. Render
    setDinoY(dinoRef.current.y);
    setObstData({ 
      x: obstacleRef.current.x, 
      w: obstacleRef.current.width, 
      h: obstacleRef.current.height 
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      dinoRef.current = { y: 0, velocity: 0, isJumping: false };
      speedRef.current = INITIAL_SPEED;
      scoreRef.current = 0;
      setScore(0);
      obstacleRef.current = { x: 700, width: 30, height: 40 };
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [gameState, gameLoop]);

  const jump = useCallback(() => {
    if (gameState !== 'playing') return;
    if (!dinoRef.current.isJumping) {
      dinoRef.current.velocity = JUMP_STRENGTH;
      dinoRef.current.isJumping = true;
    }
  }, [gameState]);

  // Gestione Input Unificata (Mouse/Touch)
  const handleInput = (e: any) => {
    // Non prevenire default su touch per evitare blocchi
    if (gameState === 'start') setGameState('playing');
    else jump();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'start') setGameState('playing');
        else jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, jump]);

  const handleGameOver = () => {
    setGameState('gameover');
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    onGameOver(scoreRef.current);
  };

  return (
    <div 
      className="relative w-full h-[300px] bg-[#050505] border border-[#00ff41] overflow-hidden cursor-pointer select-none shadow-[0_0_20px_rgba(0,255,65,0.1)] touch-manipulation"
      onMouseDown={handleInput}
      onTouchStart={handleInput}
    >
      <div className="absolute top-4 right-4 text-right pointer-events-none z-10">
        <div className="text-2xl font-[Press Start 2P] text-[#00ff41]">{score}</div>
        <div className="text-[10px] font-mono text-[#00ff41]/60">SPEED: {(speedRef.current * 10).toFixed(0)}</div>
      </div>

      {gameState === 'start' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
          <div className="text-center animate-pulse">
            <p className="text-[#00ff41] font-[Press Start 2P] mb-2">TAP TO RUN</p>
            <p className="text-[#00ff41]/50 text-xs font-mono">AVOID FIREWALLS</p>
          </div>
        </div>
      )}

      {/* Classic Green Floor */}
      <div className="absolute bottom-10 left-0 right-0 h-1 bg-[#00ff41]/50"></div>

      {/* Classic Dino */}
      <motion.div
        className="absolute bottom-10 left-[50px] w-10 h-10 bg-[#00ff41]"
        style={{ y: dinoY }}
      >
        <div className="absolute top-2 right-2 w-2 h-2 bg-black"></div>
      </motion.div>

      {/* Classic Red Obstacle */}
      <div
        className="absolute bottom-10 border border-red-400 bg-red-500/80 shadow-[0_0_10px_red]"
        style={{ 
          left: obstData.x,
          width: obstData.w,
          height: obstData.h,
          clipPath: 'polygon(0 0, 100% 5%, 95% 100%, 5% 95%)'
        }} 
      />
    </div>
  );
}