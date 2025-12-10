'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface DataBreakerProps {
  onGameOver: (score: number) => void;
}

export default function DataBreaker({ onGameOver }: DataBreakerProps) {
  const WIDTH = 600; 
  const HEIGHT = 400;
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 10;
  const BALL_RADIUS = 6;
  const PRIMARY_COLOR = '#d600ff';
  const PADDLE_SPEED = 8; 

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<number>();
  
  const gameState = useRef<'start' | 'playing' | 'transition' | 'gameover'>('start');
  const score = useRef(0);
  const levelRef = useRef(1);
  
  const paddle = useRef({ x: WIDTH / 2 - PADDLE_WIDTH / 2 });
  // Start più lento (3.5 invece di 5.0)
  const ball = useRef({ x: WIDTH / 2, y: HEIGHT - 50, dx: 0, dy: 0, speed: 3.5 });
  const bricks = useRef<{ x: number, y: number, active: boolean }[]>([]);
  
  const keys = useRef({ left: false, right: false });

  const [uiScore, setUiScore] = useState(0);
  const [uiLevel, setUiLevel] = useState(1);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [status, setStatus] = useState<'start' | 'playing' | 'transition' | 'gameover'>('start');

  const generateBricks = () => {
    bricks.current = [];
    const rows = 5;
    const cols = 8;
    const brickW = (WIDTH - 40) / cols;
    for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
        bricks.current.push({ x: 20 + c * brickW, y: r * 25 + 40, active: true });
      }
    }
  };

  const initGame = () => {
    score.current = 0;
    levelRef.current = 1;
    setUiScore(0);
    setUiLevel(1);
    resetBallAndPaddle();
    generateBricks();
    gameState.current = 'playing';
    setStatus('playing');
  };

  const resetBallAndPaddle = () => {
    ball.current = { 
      x: WIDTH / 2, 
      y: HEIGHT - 50, 
      dx: 3 * (Math.random() > 0.5 ? 1 : -1), 
      dy: -4, 
      // Aumento velocità per livello leggermente più alto (+0.8), ma base bassa (3.5)
      speed: 3.5 + (levelRef.current * 0.8) 
    };
    paddle.current = { x: WIDTH / 2 - PADDLE_WIDTH / 2 };
  };

  const startNextLevel = () => {
    gameState.current = 'transition';
    setStatus('transition');
    levelRef.current += 1;
    setUiLevel(levelRef.current);
    
    paddle.current = { x: WIDTH / 2 - PADDLE_WIDTH / 2 };
    ball.current = { x: WIDTH / 2, y: HEIGHT - 50, dx: 0, dy: 0, speed: 0 };

    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        generateBricks();
        resetBallAndPaddle();
        gameState.current = 'playing';
        setStatus('playing');
      }
    }, 1000);
  };

  const update = () => {
    if (gameState.current !== 'playing') return;

    if (keys.current.left) paddle.current.x -= PADDLE_SPEED;
    if (keys.current.right) paddle.current.x += PADDLE_SPEED;

    if (paddle.current.x < 0) paddle.current.x = 0;
    if (paddle.current.x + PADDLE_WIDTH > WIDTH) paddle.current.x = WIDTH - PADDLE_WIDTH;

    let { x, y, dx, dy } = ball.current;
    x += dx;
    y += dy;

    if (x + BALL_RADIUS > WIDTH) { x = WIDTH - BALL_RADIUS; dx = -dx; }
    if (x - BALL_RADIUS < 0) { x = BALL_RADIUS; dx = -dx; }
    if (y - BALL_RADIUS < 0) { y = BALL_RADIUS; dy = -dy; }
    
    if (y + BALL_RADIUS > HEIGHT) {
      gameState.current = 'gameover';
      setStatus('gameover');
      onGameOver(score.current);
      return;
    }

    if (
      y + BALL_RADIUS >= HEIGHT - 20 &&
      y - BALL_RADIUS <= HEIGHT - 20 + PADDLE_HEIGHT &&
      x >= paddle.current.x &&
      x <= paddle.current.x + PADDLE_WIDTH
    ) {
      // Accelerazione molto più dolce (2% invece del 3-5%)
      ball.current.speed = Math.min(ball.current.speed * 1.02, 10); 
      
      const hitPoint = x - (paddle.current.x + PADDLE_WIDTH / 2);
      const normalizedHit = hitPoint / (PADDLE_WIDTH / 2);
      const angle = normalizedHit * (Math.PI / 3); 
      dx = ball.current.speed * Math.sin(angle);
      dy = -ball.current.speed * Math.cos(angle);
      y = HEIGHT - 20 - BALL_RADIUS - 1;
    }

    const brickW = (WIDTH - 40) / 8;
    const brickH = 20;
    
    bricks.current.forEach(b => {
      if (!b.active) return;
      if (
        x > b.x && x < b.x + brickW &&
        y > b.y && y < b.y + brickH
      ) {
        dy = -dy;
        b.active = false;
        score.current += 10;
        setUiScore(score.current);
      }
    });

    if (bricks.current.every(b => !b.active)) {
       score.current += 100;
       startNextLevel();
       return;
    }

    ball.current = { x, y, dx, dy, speed: ball.current.speed };
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = PRIMARY_COLOR;
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);

    const brickW = (WIDTH - 40) / 8;
    bricks.current.forEach(b => {
      if (b.active) {
        ctx.fillStyle = PRIMARY_COLOR;
        ctx.fillRect(b.x + 2, b.y + 2, brickW - 4, 16);
      }
    });

    ctx.fillStyle = PRIMARY_COLOR;
    ctx.shadowBlur = 15;
    ctx.shadowColor = PRIMARY_COLOR;
    ctx.fillRect(paddle.current.x, HEIGHT - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
  };

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    update();
    draw(ctx);

    if (gameState.current !== 'gameover') {
      reqRef.current = requestAnimationFrame(loop);
    }
  }, []);

  useEffect(() => {
    reqRef.current = requestAnimationFrame(loop);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [loop]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState.current !== 'playing') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    paddle.current.x = mouseX - PADDLE_WIDTH / 2;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState.current !== 'playing') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    paddle.current.x = touchX - PADDLE_WIDTH / 2;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.current.right = true;
      if (e.code === 'Space' && gameState.current === 'start') initGame();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center bg-[#050505] p-4 outline-none touch-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={() => { if (status === 'start') initGame(); }}
      tabIndex={0}
    >
      <div className="relative shadow-[0_0_30px_rgba(214,0,255,0.15)]">
        <canvas 
          ref={canvasRef} 
          width={WIDTH} 
          height={HEIGHT} 
          className="block max-w-full h-auto cursor-none"
        />
        
        <div className="absolute top-4 right-4 font-[Press Start 2P] text-xl" style={{ color: PRIMARY_COLOR }}>
          {uiScore}
        </div>
        <div className="absolute top-8 right-4 font-mono text-[10px] opacity-70" style={{ color: PRIMARY_COLOR }}>
          LVL {uiLevel}
        </div>

        {status === 'start' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 pointer-events-none">
            <div className="text-center">
              <p className="font-[Press Start 2P] animate-pulse mb-2" style={{ color: PRIMARY_COLOR }}>SYSTEM READY</p>
              <p className="text-xs font-mono text-white/50">DRAG / ARROWS TO MOVE</p>
              <p className="text-xs font-mono text-white/50 mt-1">TAP TO SERVE</p>
            </div>
          </div>
        )}

        {status === 'transition' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20 pointer-events-none">
            <div className="text-center">
              <p className="font-[Press Start 2P] text-2xl mb-4" style={{ color: PRIMARY_COLOR }}>LEVEL {uiLevel}</p>
              <div className="text-4xl font-bold font-mono text-white animate-ping">{countdown}</div>
              <p className="text-xs font-mono text-white/50 mt-4">GET READY</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}