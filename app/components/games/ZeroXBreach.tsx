'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Skull } from 'lucide-react';

interface ZeroXBreachProps {
  onGameOver: (score: number) => void;
}

export default function ZeroXBreach({ onGameOver }: ZeroXBreachProps) {
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50); // % position
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [items, setItems] = useState<{ id: number; x: number; y: number; type: 'bad' | 'good' }[]>([]);
  
  const reqRef = useRef<number>();
  const lastSpawn = useRef(0);
  const speedRef = useRef(0.5); // Fall speed % per frame
  const spawnRateRef = useRef(1000); // ms

  const startGame = () => {
    setScore(0);
    setItems([]);
    speedRef.current = 0.5;
    spawnRateRef.current = 1000;
    setGameState('playing');
  };

  const update = (time: number) => {
    if (gameState !== 'playing') return;

    // Spawn Logic
    if (time - lastSpawn.current > spawnRateRef.current) {
      setItems(prev => [
        ...prev, 
        { 
          id: Math.random(), 
          x: Math.random() * 90 + 5, // 5% - 95% width
          y: -10, 
          type: Math.random() > 0.8 ? 'good' : 'bad' // 20% good, 80% bad
        }
      ]);
      lastSpawn.current = time;
      
      // Difficulty Ramp
      if (spawnRateRef.current > 300) spawnRateRef.current -= 10;
      if (speedRef.current < 2.0) speedRef.current += 0.01;
    }

    // Move & Collision
    setItems(prev => {
      const nextItems: typeof prev = [];
      let gameOver = false;
      let scoreAdd = 0;

      prev.forEach(item => {
        item.y += speedRef.current;

        // Collision Check (Player is at bottom 10%, width 10%)
        if (item.y > 85 && item.y < 95 && Math.abs(item.x - playerX) < 8) {
          if (item.type === 'bad') {
            gameOver = true;
          } else {
            scoreAdd += 50; // Collected Good
          }
        } else if (item.y > 100) {
          if (item.type === 'bad') scoreAdd += 10; // Dodged Bad
          // Missed Good = nothing
        } else {
          nextItems.push(item);
        }
      });

      if (gameOver) {
        handleGameOver();
        return prev;
      }
      
      if (scoreAdd > 0) setScore(s => s + scoreAdd);
      return nextItems;
    });

    reqRef.current = requestAnimationFrame(update);
  };

  const handleGameOver = () => {
    setGameState('gameover');
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    onGameOver(score);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      reqRef.current = requestAnimationFrame(update);
    }
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [gameState]);

  return (
    <div 
      className="relative w-full h-full bg-[#050505] border border-[#00ff41] overflow-hidden cursor-crosshair"
      onMouseMove={(e) => {
        if (gameState !== 'playing') return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPlayerX(((e.clientX - rect.left) / rect.width) * 100);
      }}
      onClick={() => { if (gameState === 'start') startGame(); }}
    >
      <div className="absolute top-4 right-4 font-[Press Start 2P] text-[#00ff41]">{score}</div>

      {gameState === 'start' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 pointer-events-none text-center">
          <p className="text-[#00ff41] font-[Press Start 2P] animate-pulse mb-2">CLICK TO BREACH</p>
          <p className="text-xs text-[#00ff41]/60 font-mono">DODGE RED // CATCH GREEN</p>
        </div>
      )}

      {/* Falling Items */}
      {items.map(item => (
        <div 
          key={item.id}
          className={`absolute w-6 h-6 flex items-center justify-center font-mono font-bold text-xs ${item.type === 'bad' ? 'text-red-500' : 'text-green-400'}`}
          style={{ top: `${item.y}%`, left: `${item.x}%` }}
        >
          {item.type === 'bad' ? '0x' : '$'}
        </div>
      ))}

      {/* Player */}
      <div 
        className="absolute bottom-[5%] w-[10%] h-2 bg-[#00ff41] shadow-[0_0_15px_#00ff41] transition-transform duration-75 ease-out"
        style={{ left: `${playerX}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#00ff41]">
          <Shield size={20} />
        </div>
      </div>
    </div>
  );
}