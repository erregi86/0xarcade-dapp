'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onGameOver: (score: number) => void;
}

export default function DataBreaker({ onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Configurazione
    const PADDLE_HEIGHT = 10;
    const PADDLE_WIDTH = 100;
    const BALL_RADIUS = 6;
    const BRICK_ROW_COUNT = 5;
    const BRICK_COLUMN_COUNT = 8;
    const BRICK_PADDING = 10;
    const BRICK_OFFSET_TOP = 30;
    const BRICK_OFFSET_LEFT = 35;
    const BRICK_WIDTH = 85;
    const BRICK_HEIGHT = 20;

    // Stato Iniziale
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 4;
    let dy = -4;
    let paddleX = (canvas.width - PADDLE_WIDTH) / 2;
    let currentScore = 0;
    let isRunning = true;

    // Generazione Mattoni
    const bricks: { x: number; y: number; status: number }[][] = [];
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      bricks[c] = [];
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff41'; // Cyber Green
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff41';
      ctx.closePath();
      ctx.shadowBlur = 0;
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillStyle = '#00ff41';
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
            const brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            
            ctx.beginPath();
            ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
            // Colore diverso per righe diverse
            ctx.fillStyle = r % 2 === 0 ? '#008F11' : '#00ff41'; 
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const collisionDetection = () => {
      for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (x > b.x && x < b.x + BRICK_WIDTH && y > b.y && y < b.y + BRICK_HEIGHT) {
              dy = -dy;
              b.status = 0;
              currentScore++;
              setScore(currentScore);
              
              // Win condition (Reset bricks for endless)
              if (currentScore % (BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) === 0) {
                 // Reset bricks
                 for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
                    for (let r = 0; r < BRICK_ROW_COUNT; r++) bricks[c][r].status = 1;
                 }
                 dx = dx * 1.1; // Speed up
                 dy = dy * 1.1;
              }
            }
          }
        }
      }
    };

    const loop = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background Grid
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      // Logica Rimbalzi Muri
      if (x + dx > canvas.width - BALL_RADIUS || x + dx < BALL_RADIUS) {
        dx = -dx;
      }
      if (y + dy < BALL_RADIUS) {
        dy = -dy;
      } else if (y + dy > canvas.height - BALL_RADIUS) {
        // Controllo Paddle
        if (x > paddleX && x < paddleX + PADDLE_WIDTH) {
           // Rimbalzo semplice
           dy = -dy;
           // Aggiungi effetto angolo basato su dove colpisce la barra
           const hitPoint = x - (paddleX + PADDLE_WIDTH / 2);
           dx = hitPoint * 0.15; 
        } else {
          // Game Over
          isRunning = false;
          onGameOver(currentScore);
        }
      }

      x += dx;
      y += dy;

      animationFrameId = requestAnimationFrame(loop);
    };

    // Mouse Move Handler
    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => {
      const relativeX = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - PADDLE_WIDTH / 2;
      }
    };

    if (gameStarted) {
        loop();
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("touchmove", mouseMoveHandler);
    } else {
        // Start Screen
        ctx.fillStyle = '#00ff41';
        ctx.font = '20px monospace';
        ctx.fillText("CLICK TO DECRYPT BLOCKCHAIN", 250, 200);
    }

    return () => {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("touchmove", mouseMoveHandler);
        cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, onGameOver]);

  return (
    <div className="relative border-4 border-purple-500 rounded p-1 bg-black">
      <div className="absolute top-4 right-4 text-purple-500 font-pixel text-2xl z-10">
        DATA BLOCKS: {score}
      </div>

      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <button 
                onClick={() => setGameStarted(true)} 
                className="bg-purple-600 text-black px-6 py-3 font-pixel text-xl hover:scale-105 transition-transform"
            >
                START DECRYPTION
            </button>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="block bg-black w-full max-w-full cursor-none"
      />
      <p className="text-center text-zinc-500 text-xs mt-2 font-mono">CONTROLS: MOUSE or TOUCH TO MOVE PADDLE</p>
    </div>
  );
}