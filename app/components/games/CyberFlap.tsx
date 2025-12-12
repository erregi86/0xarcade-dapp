'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Zap } from 'lucide-react';
// 👇 1. Importo il controller audio
import GameAudioController from '../GameAudioController';

interface CyberFlapProps {
  onGameOver: (score: number) => void;
}

export default function CyberFlap({ onGameOver }: CyberFlapProps) {
  // --- TUNING CONFIG ---
  const GRAVITY = 0.45;       
  const JUMP = -7.5;          
  const PIPE_WIDTH = 60;
  const PIPE_SPACING = 350;   
  const INITIAL_GAP = 230;    
  const MIN_GAP = 140;        
  const INITIAL_SPEED = 2.2;  
  const MAX_SPEED = 7.0;      
  const PRIMARY_COLOR = '#00f3ff'; 

  // Refs
  const birdRef = useRef({ y: 250, velocity: 0 });
  const pipesRef = useRef<{ x: number; topHeight: number; passed: boolean }[]>([]);
  const reqRef = useRef<number>();
  const scoreRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);
  const gapRef = useRef(INITIAL_GAP);

  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [birdY, setBirdY] = useState(250);
  const [pipes, setPipes] = useState<{ x: number; topHeight: number }[]>([]);
  const [score, setScore] = useState(0);

  const initGame = () => {
    birdRef.current = { y: 250, velocity: 0 };
    pipesRef.current = [];
    scoreRef.current = 0;
    speedRef.current = INITIAL_SPEED;
    gapRef.current = INITIAL_GAP;
    
    for (let i = 0; i < 3; i++) {
      addPipe(500 + i * PIPE_SPACING);
    }
    setScore(0);
    setGameState('playing');
  };

  const addPipe = (xOffset: number) => {
    const minPipe = 50;
    const maxPipe = 500 - gapRef.current - minPipe;
    const topHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;
    pipesRef.current.push({ x: xOffset, topHeight, passed: false });
  };

  const loop = useCallback(() => {
    if (gameState !== 'playing') return;

    // Fisica Bird
    birdRef.current.velocity += GRAVITY;
    birdRef.current.y += birdRef.current.velocity;

    if (birdRef.current.y > 490 || birdRef.current.y < 0) {
      handleGameOver();
      return;
    }

    // Fisica Tubi
    pipesRef.current.forEach(pipe => {
      pipe.x -= speedRef.current;

      const birdLeft = 50 + 8;
      const birdRight = 50 + 30 - 8;
      const birdTop = birdRef.current.y + 8;
      const birdBottom = birdRef.current.y + 30 - 8;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + gapRef.current) {
          handleGameOver();
          return;
        }
      }

      if (!pipe.passed && birdLeft > pipeRight) {
        pipe.passed = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);

        if (speedRef.current < MAX_SPEED) speedRef.current += 0.05;
        if (gapRef.current > MIN_GAP) gapRef.current -= 1.5;
      }
    });

    if (pipesRef.current.length > 0 && pipesRef.current[0].x < -PIPE_WIDTH) {
      pipesRef.current.shift();
      const lastPipeX = pipesRef.current[pipesRef.current.length - 1].x;
      addPipe(lastPipeX + PIPE_SPACING);
    }

    setBirdY(birdRef.current.y);
    setPipes([...pipesRef.current]);
    reqRef.current = requestAnimationFrame(loop);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') reqRef.current = requestAnimationFrame(loop);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [gameState, loop]);

  const handleInput = () => {
    if (gameState === 'start') initGame();
    else if (gameState === 'playing') birdRef.current.velocity = JUMP;
  };

  // 👇 QUESTA È LA SEZIONE CHE DAVA ERRORE (ORA È CORRETTA)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleInput();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]); // AGGIUNTO IL CLOSING BRACKET CORRETTO

  const handleGameOver = () => {
    setGameState('gameover');
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    onGameOver(scoreRef.current);
  };

  return (
    <div 
      className="relative w-full h-[500px] bg-[#050505] overflow-hidden border cursor-pointer select-none shadow-[0_0_20px_rgba(0,243,255,0.1)] touch-manipulation"
      style={{ borderColor: PRIMARY_COLOR }}
      onMouseDown={handleInput}
      onTouchStart={handleInput}
    >
      {/* 👇 2. Inserisco il controller audio qui */}
      <GameAudioController 
        isPlaying={gameState === 'playing'} 
        isGameOver={gameState === 'gameover'} 
      />

      <div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
        <div className="text-2xl font-[Press Start 2P]" style={{ color: PRIMARY_COLOR }}>{score}</div>
        <div className="text-[10px] font-mono opacity-50" style={{ color: PRIMARY_COLOR }}>SPEED: {speedRef.current.toFixed(1)}</div>
      </div>

      {gameState === 'start' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 pointer-events-none">
          <p className="font-[Press Start 2P] animate-pulse" style={{ color: PRIMARY_COLOR }}>TAP TO FLY</p>
        </div>
      )}

      <div 
        className="absolute left-[50px] w-[30px] h-[30px] flex items-center justify-center rounded-sm shadow-[0_0_15px_#00f3ff]"
        style={{ 
          top: birdY, 
          backgroundColor: PRIMARY_COLOR,
          transform: `rotate(${Math.min(Math.max(birdRef.current.velocity * 5, -30), 90)}deg)` 
        }}
      >
        <Zap size={20} className="text-black fill-current" />
      </div>

      {pipes.map((pipe, i) => (
        <div key={i}>
          <div 
            className="absolute border-b-2 border-r-2 border-l-2 bg-opacity-20"
            style={{ 
              left: pipe.x, top: 0, width: PIPE_WIDTH, height: pipe.topHeight,
              borderColor: PRIMARY_COLOR, backgroundColor: `${PRIMARY_COLOR}33`
            }}
          />
          <div 
            className="absolute border-t-2 border-r-2 border-l-2 bg-opacity-20"
            style={{ 
              left: pipe.x, 
              top: pipe.topHeight + gapRef.current, 
              width: PIPE_WIDTH, 
              height: 500 - (pipe.topHeight + gapRef.current),
              borderColor: PRIMARY_COLOR, backgroundColor: `${PRIMARY_COLOR}33`
            }}
          />
        </div>
      ))}

      <div className="absolute bottom-0 w-full h-2" style={{ backgroundColor: PRIMARY_COLOR }}></div>
    </div>
  );
}