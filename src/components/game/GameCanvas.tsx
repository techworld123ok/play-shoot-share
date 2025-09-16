import React, { useRef, useEffect, useState, useCallback } from 'react';
import { toast } from "sonner";

interface Player {
  x: number;
  y: number;
  angle: number;
  health: number;
  maxHealth: number;
  speed: number;
  weapon: string;
  ammo: number;
  maxAmmo: number;
  score: number;
}

interface Bot {
  x: number;
  y: number;
  angle: number;
  health: number;
  maxHealth: number;
  speed: number;
  targetX: number;
  targetY: number;
  lastShot: number;
  id: string;
}

interface Bullet {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  damage: number;
  owner: string;
  id: string;
}

interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 20;
const BOT_SIZE = 18;
const BULLET_SIZE = 4;
const BULLET_SPEED = 8;
const PLAYER_SPEED = 3;
const BOT_SPEED = 1.5;

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<Player>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    angle: 0,
    health: 100,
    maxHealth: 100,
    speed: PLAYER_SPEED,
    weapon: 'pistol',
    ammo: 12,
    maxAmmo: 12,
    score: 0,
  });

  const [bots, setBots] = useState<Bot[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gameRunning, setGameRunning] = useState(true);
  const [killFeed, setKillFeed] = useState<string[]>([]);

  // Initialize game
  useEffect(() => {
    // Create walls (arena boundaries and obstacles)
    const gameWalls: Wall[] = [
      // Outer walls
      { x: 0, y: 0, width: CANVAS_WIDTH, height: 20 },
      { x: 0, y: CANVAS_HEIGHT - 20, width: CANVAS_WIDTH, height: 20 },
      { x: 0, y: 0, width: 20, height: CANVAS_HEIGHT },
      { x: CANVAS_WIDTH - 20, y: 0, width: 20, height: CANVAS_HEIGHT },
      // Inner obstacles
      { x: 200, y: 150, width: 100, height: 20 },
      { x: 500, y: 300, width: 20, height: 100 },
      { x: 150, y: 400, width: 80, height: 20 },
      { x: 600, y: 100, width: 60, height: 60 },
    ];
    setWalls(gameWalls);

    // Spawn bots
    const initialBots: Bot[] = [];
    for (let i = 0; i < 5; i++) {
      let x, y;
      do {
        x = Math.random() * (CANVAS_WIDTH - 100) + 50;
        y = Math.random() * (CANVAS_HEIGHT - 100) + 50;
      } while (Math.hypot(x - CANVAS_WIDTH/2, y - CANVAS_HEIGHT/2) < 100);

      initialBots.push({
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        health: 60,
        maxHealth: 60,
        speed: BOT_SPEED,
        targetX: x,
        targetY: y,
        lastShot: 0,
        id: `bot_${i}`,
      });
    }
    setBots(initialBots);

    toast("Battle arena loaded! Use WASD to move, mouse to aim and shoot!", {
      duration: 4000,
    });
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeys(prev => new Set([...prev, e.code.toLowerCase()]));
    
    // Handle reload key
    if (e.code.toLowerCase() === 'keyr') {
      handleReload();
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(e.code.toLowerCase());
      return newKeys;
    });
  }, []);

  // Reload function
  const handleReload = useCallback(() => {
    if (player.ammo < player.maxAmmo) {
      setPlayer(prev => ({ ...prev, ammo: prev.maxAmmo }));
      toast("Reloaded!", { duration: 1000 });
    }
  }, [player.ammo, player.maxAmmo]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseClick = useCallback(() => {
    if (!gameRunning || player.ammo <= 0) return;

    const angle = Math.atan2(mousePos.y - player.y, mousePos.x - player.x);
    const newBullet: Bullet = {
      x: player.x,
      y: player.y,
      velocityX: Math.cos(angle) * BULLET_SPEED,
      velocityY: Math.sin(angle) * BULLET_SPEED,
      damage: 25,
      owner: 'player',
      id: `bullet_${Date.now()}_${Math.random()}`,
    };

    setBullets(prev => [...prev, newBullet]);
    setPlayer(prev => ({ ...prev, ammo: prev.ammo - 1 }));
  }, [mousePos, player, gameRunning]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseMove, handleMouseClick]);

  // Game loop
  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      // Update player movement
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (keys.has('keyw') || keys.has('arrowup')) newY -= prev.speed;
        if (keys.has('keys') || keys.has('arrowdown')) newY += prev.speed;
        if (keys.has('keya') || keys.has('arrowleft')) newX -= prev.speed;
        if (keys.has('keyd') || keys.has('arrowright')) newX += prev.speed;

        // Keep player in bounds
        newX = Math.max(PLAYER_SIZE, Math.min(CANVAS_WIDTH - PLAYER_SIZE, newX));
        newY = Math.max(PLAYER_SIZE, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, newY));

        // Update angle to face mouse
        const angle = Math.atan2(mousePos.y - newY, mousePos.x - newX);

        return { ...prev, x: newX, y: newY, angle };
      });

      // Update bots
      setBots(prevBots => prevBots.map(bot => {
        const dx = player.x - bot.x;
        const dy = player.y - bot.y;
        const distance = Math.hypot(dx, dy);

        // Move towards player if close enough
        if (distance < 200) {
          const angle = Math.atan2(dy, dx);
          const newX = bot.x + Math.cos(angle) * bot.speed;
          const newY = bot.y + Math.sin(angle) * bot.speed;

          // Bot shooting
          let newLastShot = bot.lastShot;
          if (distance < 150 && Date.now() - bot.lastShot > 1500) {
            const bulletAngle = Math.atan2(dy, dx);
            const botBullet: Bullet = {
              x: bot.x,
              y: bot.y,
              velocityX: Math.cos(bulletAngle) * BULLET_SPEED * 0.8,
              velocityY: Math.sin(bulletAngle) * BULLET_SPEED * 0.8,
              damage: 15,
              owner: bot.id,
              id: `bullet_${Date.now()}_${Math.random()}`,
            };
            setBullets(prev => [...prev, botBullet]);
            newLastShot = Date.now();
          }

          return {
            ...bot,
            x: Math.max(BOT_SIZE, Math.min(CANVAS_WIDTH - BOT_SIZE, newX)),
            y: Math.max(BOT_SIZE, Math.min(CANVAS_HEIGHT - BOT_SIZE, newY)),
            angle: Math.atan2(dy, dx),
            lastShot: newLastShot,
          };
        }

        return bot;
      }));

      // Update bullets
      setBullets(prevBullets => {
        return prevBullets
          .map(bullet => ({
            ...bullet,
            x: bullet.x + bullet.velocityX,
            y: bullet.y + bullet.velocityY,
          }))
          .filter(bullet => 
            bullet.x > 0 && bullet.x < CANVAS_WIDTH &&
            bullet.y > 0 && bullet.y < CANVAS_HEIGHT
          );
      });

      // Check collisions
      setBullets(prevBullets => {
        const remainingBullets: Bullet[] = [];
        
        prevBullets.forEach(bullet => {
          let hit = false;

          // Check player hit
          if (bullet.owner !== 'player') {
            const dx = bullet.x - player.x;
            const dy = bullet.y - player.y;
            if (Math.hypot(dx, dy) < PLAYER_SIZE) {
              setPlayer(prev => {
                const newHealth = Math.max(0, prev.health - bullet.damage);
                if (newHealth <= 0) {
                  toast("You were eliminated! Respawning...", { duration: 2000 });
                  // Respawn player
                  return {
                    ...prev,
                    health: prev.maxHealth,
                    x: CANVAS_WIDTH / 2,
                    y: CANVAS_HEIGHT / 2,
                    ammo: prev.maxAmmo,
                  };
                }
                return { ...prev, health: newHealth };
              });
              hit = true;
            }
          }

          // Check bot hits
          if (bullet.owner === 'player') {
            setBots(prevBots => prevBots.map(bot => {
              const dx = bullet.x - bot.x;
              const dy = bullet.y - bot.y;
              if (Math.hypot(dx, dy) < BOT_SIZE) {
                hit = true;
                const newHealth = Math.max(0, bot.health - bullet.damage);
                if (newHealth <= 0) {
                  setPlayer(prev => ({ ...prev, score: prev.score + 100 }));
                  setKillFeed(prev => [`You eliminated ${bot.id}`, ...prev.slice(0, 4)]);
                  toast("Bot eliminated! +100 points", { duration: 1500 });
                  
                  // Respawn bot
                  let newX, newY;
                  do {
                    newX = Math.random() * (CANVAS_WIDTH - 100) + 50;
                    newY = Math.random() * (CANVAS_HEIGHT - 100) + 50;
                  } while (Math.hypot(newX - player.x, newY - player.y) < 100);

                  return {
                    ...bot,
                    health: bot.maxHealth,
                    x: newX,
                    y: newY,
                  };
                }
                return { ...bot, health: newHealth };
              }
              return bot;
            }));
          }

          if (!hit) {
            remainingBullets.push(bullet);
          }
        });

        return remainingBullets;
      });

    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [keys, mousePos, player.x, player.y, gameRunning, handleReload]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw walls
    ctx.fillStyle = '#4A4A5E';
    walls.forEach(wall => {
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });

    // Draw player
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.fillStyle = '#00BFFF';
    ctx.fillRect(-PLAYER_SIZE/2, -PLAYER_SIZE/2, PLAYER_SIZE, PLAYER_SIZE);
    // Draw gun
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(PLAYER_SIZE/2 - 2, -2, 15, 4);
    ctx.restore();

    // Draw bots
    bots.forEach(bot => {
      ctx.save();
      ctx.translate(bot.x, bot.y);
      ctx.rotate(bot.angle);
      ctx.fillStyle = '#FF4444';
      ctx.fillRect(-BOT_SIZE/2, -BOT_SIZE/2, BOT_SIZE, BOT_SIZE);
      // Draw bot gun
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(BOT_SIZE/2 - 2, -1, 12, 2);
      ctx.restore();

      // Draw bot health bar
      const healthPercent = bot.health / bot.maxHealth;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(bot.x - 15, bot.y - 25, 30, 4);
      ctx.fillStyle = healthPercent > 0.5 ? '#00FF88' : healthPercent > 0.25 ? '#FFB800' : '#FF4444';
      ctx.fillRect(bot.x - 15, bot.y - 25, 30 * healthPercent, 4);
    });

    // Draw bullets
    bullets.forEach(bullet => {
      ctx.fillStyle = bullet.owner === 'player' ? '#00BFFF' : '#FF4444';
      ctx.fillRect(bullet.x - BULLET_SIZE/2, bullet.y - BULLET_SIZE/2, BULLET_SIZE, BULLET_SIZE);
    });

  }, [player, bots, bullets, walls]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      
      {/* Game HUD */}
      <div className="flex justify-between items-center w-full max-w-4xl">
        <div className="hud-panel p-4 rounded-lg">
          <div className="flex items-center gap-4">
            {/* Health Bar */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold">HEALTH</span>
              <div className="health-bar w-32 h-3">
                <div 
                  className={`health-fill ${
                    player.health > 60 ? '' : player.health > 30 ? 'medium' : 'low'
                  }`}
                  style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                />
              </div>
              <span className="text-xs">{player.health}/{player.maxHealth}</span>
            </div>

            {/* Ammo Counter */}
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold">AMMO</span>
              <span className="ammo-counter text-2xl font-bold">{player.ammo}</span>
              <button 
                onClick={handleReload}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
              >
                RELOAD [R]
              </button>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="hud-panel p-4 rounded-lg text-center">
          <span className="text-sm font-bold block">SCORE</span>
          <span className="score-display text-3xl font-bold">{player.score}</span>
        </div>

        {/* Controls */}
        <div className="controls-hint p-3 rounded-lg text-xs">
          <div><strong>WASD:</strong> Move</div>
          <div><strong>Mouse:</strong> Aim & Shoot</div>
          <div><strong>R:</strong> Reload</div>
        </div>
      </div>

      {/* Kill Feed */}
      {killFeed.length > 0 && (
        <div className="fixed top-4 right-4 space-y-1">
          {killFeed.map((kill, index) => (
            <div key={index} className="kill-feed p-2 rounded text-sm animate-fade-in">
              {kill}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
