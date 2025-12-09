'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onGameOver: (score: number) => void;
}

export default function NetRunner({ onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Configurazioni Gioco
  const GAME_SPEED = 5;
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -10;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frames = 0;

    // Stato Iniziale Entità
    let player = { x: 50, y: 200, width: 30, height: 30, dy: 0, grounded: false };
    let obstacles: { x: number; y: number; width: number; height: number }[] = [];
    let currentScore = 0;
    let isRunning = true;

    // --- INPUT HANDLER (Salto) ---
    const handleInput = (e: KeyboardEvent | TouchEvent) => {
      if ((e.type === 'keydown' && (e as KeyboardEvent).code === 'Space') || e.type === 'touchstart') {
        if (!isRunning && !gameStarted) {
             // Start logic handled by react state for UI
        } else if (player.grounded) {
          player.dy = JUMP_STRENGTH;
          player.grounded = false;
        }
      }
    };

    // --- GAME LOOP ---
    const loop = () => {
      if (!isRunning) return;
      
      // 1. Pulizia Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sfondo "Cyber" (Griglia)
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      // Linea orizzonte
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.lineTo(canvas.width, 300);
      ctx.stroke();

      // 2. Fisica Player
      player.dy += GRAVITY;
      player.y += player.dy;

      // Pavimento
      if (player.y + player.height > 300) {
        player.y = 300 - player.height;
        player.dy = 0;
        player.grounded = true;
      }

      // 3. Generazione Ostacoli (Firewalls)
      if (frames % 120 === 0) { // Ogni ~2 secondi
        // Altezza casuale
        const height = Math.random() > 0.5 ? 40 : 60; 
        obstacles.push({ x: canvas.width, y: 300 - height, width: 20, height: height });
      }

      // 4. Gestione Ostacoli
      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= GAME_SPEED;

        // Disegna Ostacolo (Rosso)
        ctx.fillStyle = '#ff003c'; // Cyber Red
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff003c';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;

        // Collisione
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          isRunning = false;
          onGameOver(currentScore);
        }
      }

      // Rimuovi ostacoli passati
      if (obstacles.length > 0 && obstacles[0].x < -50) {
        obstacles.shift();
        currentScore++;
        setScore(currentScore);
      }

      // 5. Disegna Player (Verde)
      ctx.fillStyle = '#00ff41'; // Cyber Green
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ff41';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;

      // Loop
      frames++;
      animationFrameId = requestAnimationFrame(loop);
    };

    // Avvia loop solo se gameStarted è true (gestito esternamente o al click)
    if (gameStarted) {
        loop();
    } else {
        // Schermata Iniziale
        ctx.fillStyle = '#00ff41';
        ctx.font = '20px monospace';
        ctx.fillText("PRESS SPACE TO START RUN", 200, 180);
    }

    // Event Listeners
    window.addEventListener('keydown', handleInput);
    window.addEventListener('touchstart', handleInput);

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, onGameOver]);

  return (
    <div className="relative border-4 border-green-500 rounded p-1 bg-black">
      <div className="absolute top-4 right-4 text-green-500 font-pixel text-2xl z-10">
        SCORE: {score}
      </div>
      
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <button 
                onClick={() => setGameStarted(true)} 
                className="bg-green-600 text-black px-6 py-3 font-pixel text-xl hover:scale-105 transition-transform"
            >
                INITIALIZE RUN
            </button>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={350} 
        className="block bg-black w-full max-w-full"
      />
      
      <p className="text-center text-zinc-500 text-xs mt-2 font-mono">CONTROLS: [SPACE] or [TAP] TO JUMP</p>
    </div>
  );
}