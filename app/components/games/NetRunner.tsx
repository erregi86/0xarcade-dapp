'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface NetRunnerProps {
  onGameOver: (score: number) => void;
}

export default function NetRunner({ onGameOver }: NetRunnerProps) {
  // --- LOGICA TURBO (Mantenuta) ---
  const INITIAL_SPEED = 9.0;
  const MAX_SPEED = 22.0;
  const SPEED_INCREMENT = 0.15;
  const GRAVITY = 0.9;
  const JUMP_STRENGTH = -13;
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
    // Dimensioni variabili (Gameplay)
    const newWidth = Math.floor(Math.random() * 20) + 25; 
    const newHeight = Math.floor(Math.random() * 50) + 30; 
    
    // Distanza spawn
    const minDistance = 400 + (speedRef.current * 10); 
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

    // 3. Collisione (Hitbox padding per essere fair)
    const dinoX = 50 + 5; 
    const dinoW = 40 - 10; 
    
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
      className="relative w-full h-[300px] bg-[#050505] border border-[#00ff41] overflow-hidden cursor-pointer select-none"
      onMouseDown={() => gameState === 'start' ? setGameState('playing') : jump()}
      onTouchStart={() => gameState === 'start' ? setGameState('playing') : jump()}
    >
      {/* UI Info */}
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

      {/* --- CLASSIC UI RESTORED --- */}

      {/* Ground Line (Semplice) */}
      <div className="absolute bottom-10 left-0 right-0 h-1 bg-[#00ff41]/50"></div>

      {/* Dino (Verde Semplice) */}
      <motion.div
        className="absolute bottom-10 left-[50px] w-10 h-10 bg-[#00ff41]"
        style={{ y: dinoY }}
      >
        {/* Piccolo dettaglio occhio */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-black"></div>
      </motion.div>

      {/* Obstacle (ROSSO, come l'originale) */}
      <div
        className="absolute bottom-10 border border-red-400 bg-red-500/80 shadow-[0_0_10px_red]"
        style={{ 
          left: obstData.x,
          width: obstData.w,
          height: obstData.h,
          // Glitch leggero ma mantenendo la forma a blocco
          clipPath: 'polygon(0 0, 100% 5%, 95% 100%, 5% 95%)'
        }} 
      />
    </div>
  );
}