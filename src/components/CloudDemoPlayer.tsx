import React, { useState, useEffect, useRef } from "react";
import { useGridTokens } from "@/contexts/GridTokenContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { allGames } from "@/data/games";
import {
  X,
  Play,
  RotateCcw,
  Zap,
  Activity,
  Wifi,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  ShoppingBag,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloudDemoPlayerProps {
  gameId: string | null;
  onClose: () => void;
}

export const CloudDemoPlayer: React.FC<CloudDemoPlayerProps> = ({ gameId, onClose }) => {
  const { completeQuestProgress, addTokens } = useGridTokens();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const game = allGames.find((g) => g.id === gameId) || allGames[0];

  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [score, setScore] = useState(0);
  const [demoFinished, setDemoFinished] = useState(false);
  const [ping, setPing] = useState(12);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Micro-game state
  const gameStateRef = useRef({
    playerX: 200,
    playerY: 300,
    projectiles: [] as { x: number; y: number; speed: number }[],
    enemies: [] as { x: number; y: number; speed: number; radius: number }[],
    keys: {} as { [key: string]: boolean },
    score: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
  });

  // Track quest progress upon launch
  useEffect(() => {
    if (gameId) {
      completeQuestProgress("cloud_demo", 1);
    }
  }, [gameId, completeQuestProgress]);

  // 60-second countdown timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setDemoFinished(true);
          addTokens(50, `Completed 60s Instant Cloud Demo for ${game.title}!`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, game.title, addTokens]);

  // Simulated WebRTC ping jitter
  useEffect(() => {
    const pingInterval = setInterval(() => {
      setPing(Math.floor(10 + Math.random() * 6));
    }, 2000);
    return () => clearInterval(pingInterval);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = true;
      if (e.code === "Space") {
        e.preventDefault();
        // Fire laser
        const p = gameStateRef.current;
        p.projectiles.push({
          x: p.playerX + 15,
          y: p.playerY - 10,
          speed: 12,
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Micro-game rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let spawnTimer = 0;

    const loop = () => {
      const state = gameStateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with motion blur
      ctx.fillStyle = "rgba(10, 8, 24, 0.4)";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Lines (Synthwave style)
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (isPlaying) {
        // Handle Movement
        const speed = 6;
        if (state.keys["KeyA"] || state.keys["ArrowLeft"]) state.playerX = Math.max(20, state.playerX - speed);
        if (state.keys["KeyD"] || state.keys["ArrowRight"]) state.playerX = Math.min(width - 20, state.playerX + speed);
        if (state.keys["KeyW"] || state.keys["ArrowUp"]) state.playerY = Math.max(20, state.playerY - speed);
        if (state.keys["KeyS"] || state.keys["ArrowDown"]) state.playerY = Math.min(height - 20, state.playerY + speed);

        // Spawn Enemies
        spawnTimer++;
        if (spawnTimer % 35 === 0) {
          state.enemies.push({
            x: Math.random() * (width - 40) + 20,
            y: -20,
            speed: Math.random() * 2.5 + 2,
            radius: Math.random() * 8 + 12,
          });
        }

        // Update & Draw Projectiles
        ctx.fillStyle = "#06b6d4";
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 10;
        state.projectiles.forEach((proj, idx) => {
          proj.y -= proj.speed;
          ctx.fillRect(proj.x - 2, proj.y - 6, 4, 12);
          if (proj.y < -20) state.projectiles.splice(idx, 1);
        });

        // Update & Draw Enemies
        state.enemies.forEach((enemy, eIdx) => {
          enemy.y += enemy.speed;
          ctx.fillStyle = "#ec4899";
          ctx.shadowColor = "#ec4899";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
          ctx.fill();

          // Check collisions with projectiles
          state.projectiles.forEach((proj, pIdx) => {
            const dist = Math.hypot(enemy.x - proj.x, enemy.y - proj.y);
            if (dist < enemy.radius + 5) {
              // Destroyed enemy
              state.enemies.splice(eIdx, 1);
              state.projectiles.splice(pIdx, 1);
              state.score += 100;
              setScore(state.score);

              // Spawn particles
              for (let i = 0; i < 8; i++) {
                state.particles.push({
                  x: enemy.x,
                  y: enemy.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 25,
                  color: "#06b6d4",
                });
              }
            }
          });

          if (enemy.y > height + 30) state.enemies.splice(eIdx, 1);
        });

        // Update & Draw Particles
        state.particles.forEach((p, pIdx) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.fillRect(p.x, p.y, 3, 3);
          if (p.life <= 0) state.particles.splice(pIdx, 1);
        });

        // Draw Player Ship (Cyber Arrow)
        ctx.fillStyle = "#a855f7";
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(state.playerX, state.playerY - 18);
        ctx.lineTo(state.playerX + 16, state.playerY + 14);
        ctx.lineTo(state.playerX, state.playerY + 8);
        ctx.lineTo(state.playerX - 16, state.playerY + 14);
        ctx.closePath();
        ctx.fill();

        // Thruster flame
        ctx.fillStyle = "#06b6d4";
        ctx.beginPath();
        ctx.moveTo(state.playerX - 6, state.playerY + 10);
        ctx.lineTo(state.playerX + 6, state.playerY + 10);
        ctx.lineTo(state.playerX, state.playerY + 22 + Math.random() * 6);
        ctx.closePath();
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying]);

  if (!gameId) return null;

  const handleBuyNow = () => {
    addToCart({
      id: game.id,
      title: game.title,
      image: game.image,
      price: game.price,
      priceValue: game.priceValue || 59.99,
      rating: game.rating,
      category: game.category,
    });
    navigate("/transaction");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[350] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[850px] bg-[#0b0819] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.3)] flex flex-col">
        {/* Top Stream Telemetry Bar */}
        <div className="h-14 px-6 bg-black/60 border-b border-white/10 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              WEBRTC STREAM
            </div>
            <span className="font-display font-bold text-white text-sm hidden sm:inline">
              {game.title} — 60s Micro-Demo
            </span>
          </div>

          {/* Telemetry Stats */}
          <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-bold">60 FPS</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-green-400" />
              <span>{ping} ms</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>AWS G5 Edge Node</span>
            </div>

            {/* Countdown Badge */}
            <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-black text-sm animate-pulse">
              ⏱️ {timeLeft}s
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Cloud Canvas Stream Area */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={850}
            height={520}
            className="w-full h-full max-w-[900px] max-h-[550px] object-contain rounded-xl border border-white/5 shadow-2xl"
          />

          {/* Stream Overlay HUD */}
          <div className="absolute top-4 left-6 pointer-events-none space-y-1">
            <div className="text-xs font-mono text-gray-400">SESSION SCORE</div>
            <div className="text-3xl font-mono font-black text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
              {score.toString().padStart(6, "0")}
            </div>
          </div>

          {/* Controls Instruction Overlay */}
          {isPlaying && timeLeft > 50 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-gray-300 flex items-center gap-4 animate-bounce pointer-events-none">
              <span>WASD / Arrow Keys: Move Ship</span>
              <span className="w-1 h-3 bg-white/30" />
              <span>SPACEBAR: Pulse Lasers</span>
            </div>
          )}

          {/* Demo End Overlay */}
          {demoFinished && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300 z-40">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-bold mb-2">
                +50 GRID TOKENS EARNED
              </span>

              <h3 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
                CLOUD DEMO COMPLETE
              </h3>

              <p className="text-gray-300 max-w-md text-sm mb-6">
                Your neural trial session has ended. Unlock the full campaign, online multiplayer, and cloud saves.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  onClick={handleBuyNow}
                  className="h-12 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-bold text-base rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" /> Buy Full Game ({game.price})
                </Button>

                <Button
                  onClick={() => {
                    setTimeLeft(60);
                    setIsPlaying(true);
                    setDemoFinished(false);
                  }}
                  variant="outline"
                  className="h-12 px-6 glass border-white/20 hover:border-white/40 text-white rounded-2xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Replay Demo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Social & Instant Action Bar */}
        <div className="h-16 px-6 bg-[#0e0a1f] border-t border-white/10 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=King"
                alt="Friend"
                className="w-7 h-7 rounded-full border-2 border-cyan-400"
              />
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Speed"
                alt="Friend"
                className="w-7 h-7 rounded-full border-2 border-purple-500"
              />
            </div>
            <span className="text-xs text-gray-300 font-sans">
              <strong className="text-cyan-400">Xx_GamerKing_xX</strong> and 3 others own this game
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleBuyNow}
              className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <Zap className="w-4 h-4 mr-1.5" /> Instant Buy & Keep Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
