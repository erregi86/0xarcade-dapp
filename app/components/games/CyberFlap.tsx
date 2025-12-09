'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onGameOver: (score: number) => void;
}

export default function CyberFlap({ onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Configurazione Fisica
    const GRAVITY = 0.5;
    const JUMP = -8;
    const SPEED = 3;
    const PIPE_WIDTH = 50;
    const PIPE_GAP = 120; // Spazio tra i tubi
    const SPAWN_RATE = 100; // Ogni quanti frame appare un tubo

    // Stato Iniziale
    let bird = { x: 50, y: 150, width: 30, height: 30, velocity: 0 };
    let pipes: { x: number; topHeight: number }[] = [];
    let frameCount = 0;
    let currentScore = 0;
    let isRunning = true;

    const handleInput = () => {
      if (!isRunning) return;
      bird.velocity = JUMP;
    };

    const resetGame = () => {
      bird = { x: 50, y: 150, width: 30, height: 30, velocity: 0 };
      pipes = [];
      frameCount = 0;
      currentScore = 0;
      setScore(0);
      isRunning = true;
    };

    const loop = () => {
      if (!isRunning) return;

      // 1. Pulisci Canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Fisica Bird
      bird.velocity += GRAVITY;
      bird.y += bird.velocity;

      // 3. Generazione Tubi (Cavi)
      if (frameCount % SPAWN_RATE === 0) {
        const minHeight = 50;
        const maxHeight = canvas.height - minHeight - PIPE_GAP;
        const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        pipes.push({ x: canvas.width, topHeight: randomHeight });
      }

      // 4. Gestione Tubi e Collisioni
      for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x -= SPEED;

        // Disegna Tubo Superiore (Ciano)
        ctx.fillStyle = '#00f0ff'; // Cyber Blue
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topHeight);
        
        // Disegna Tubo Inferiore
        ctx.fillRect(p.x, p.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - (p.topHeight + PIPE_GAP));

        // Collision Logic
        if (
          bird.x < p.x + PIPE_WIDTH &&
          bird.x + bird.width > p.x &&
          (bird.y < p.topHeight || bird.y + bird.height > p.topHeight + PIPE_GAP)
        ) {
          isRunning = false;
          onGameOver(currentScore);
        }

        // Rimuovi tubi passati e aumenta punteggio
        if (p.x + PIPE_WIDTH < 0) {
          pipes.shift();
          i--;
        }
        
        // Punteggio: se il tubo passa il bird
        if (p.x + PIPE_WIDTH === bird.x) {
            currentScore++;
            setScore(currentScore);
        }
      }

      // 5. Collisioni Limiti (Soffitto/Pavimento)
      if (bird.y + bird.height > canvas.height || bird.y < 0) {
        isRunning = false;
        onGameOver(currentScore);
      }

      // 6. Disegna Bird (Giallo)
      ctx.fillStyle = '#ffee00';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffee00';
      ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
      ctx.shadowBlur = 0;

      frameCount++;
      animationFrameId = requestAnimationFrame(loop);
    };

    if (gameStarted) {
      resetGame();
      loop();
    } else {
        // Schermata Home del gioco
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f0ff';
        ctx.font = '20px monospace';
        ctx.fillText("TAP TO FLY", 350, 180);
    }

    window.addEventListener('mousedown', handleInput);
    window.addEventListener('touchstart', handleInput);
    window.addEventListener('keydown', (e) => { if(e.code === 'Space') handleInput() });

    return () => {
      window.removeEventListener('mousedown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, onGameOver]);

  return (
    <div className="relative border-4 border-cyan-500 rounded p-1 bg-black">
      <div className="absolute top-4 right-4 text-cyan-500 font-pixel text-2xl z-10">
        SCORE: {score}
      </div>

      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <button 
                onClick={() => setGameStarted(true)} 
                className="bg-cyan-600 text-black px-6 py-3 font-pixel text-xl hover:scale-105 transition-transform"
            >
                INITIATE FLIGHT
            </button>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="block bg-black w-full max-w-full"
      />
      <p className="text-center text-zinc-500 text-xs mt-2 font-mono">CONTROLS: [SPACE] or [TAP] TO FLY UP</p>
    </div>
  );
}