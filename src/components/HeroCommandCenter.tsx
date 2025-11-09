import React, { useState } from "react";
import { WebGLPreviewCanvas } from "./WebGLPreviewCanvas";
import { useTasteProfile } from "@/contexts/TasteProfileContext";
import { useCart } from "@/contexts/CartContext";
import { useSocial } from "@/contexts/SocialContext";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Gamepad2,
  Zap,
  ShoppingBag,
  Flame,
  Users,
  Activity,
  ChevronRight,
  ShieldCheck,
  Play,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { allGames } from "@/data/games";

interface HeroCommandCenterProps {
  onLaunchDemo: (gameId: string) => void;
}

export const HeroCommandCenter: React.FC<HeroCommandCenterProps> = ({ onLaunchDemo }) => {
  const { openProfiler } = useTasteProfile();
  const { addToCart } = useCart();
  const { friends } = useSocial();
  const navigate = useNavigate();

  const featuredGames = [
    {
      ...allGames[0], // Cyber Rebellion 2077
      themeColor: "#06b6d4",
      shape: "energyCore" as const,
      activeSquad: "Xx_GamerKing_xX & 3 friends",
      livePilots: "14,892",
    },
    {
      ...allGames[2], // Neon Velocity
      themeColor: "#ec4899",
      shape: "holoCube" as const,
      activeSquad: "SpeedDemon & NeonNinja",
      livePilots: "9,420",
    },
    {
      ...allGames[1], // Star Command
      themeColor: "#a855f7",
      shape: "starshipGrid" as const,
      activeSquad: "QuantumLeaper",
      livePilots: "7,115",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const currentGame = featuredGames[activeIndex];

  const handleBuyAndJoin = () => {
    addToCart({
      id: currentGame.id,
      title: currentGame.title,
      image: currentGame.image,
      price: currentGame.price,
      priceValue: currentGame.priceValue || 59.99,
      rating: currentGame.rating,
      category: currentGame.category,
    });
    navigate("/transaction");
  };

  return (
    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#0e091e] via-[#090714] to-[#040308] border border-cyan-500/30 overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.15)]">
      {/* Background Ambience & Lighting */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: currentGame.themeColor }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.12),transparent_60%)] pointer-events-none" />

      {/* Top Telemetry Header Strip */}
      <div className="px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold tracking-wider uppercase">GRID COMMAND v2.4</span>
          </div>
          <span className="text-gray-500">|</span>
          <div className="flex items-center gap-1 text-gray-300">
            <Activity className="w-3.5 h-3.5 text-green-400" />
            <span>{currentGame.livePilots} Active Players Now</span>
          </div>
        </div>

        {/* Quick Hologram Selector Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {featuredGames.map((g, idx) => (
            <button
              key={g.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeIndex === idx
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {g.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Command Center Grid */}
      <div className="p-6 md:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Game Intel & Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category & Rating Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> FEATURED TITLE
            </span>

            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1">
              ⭐ 9.8 / 10 Masterpiece
            </span>

            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              Cloud Ready • 0-Sec Play
            </span>
          </div>

          {/* Massive Title */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 tracking-tight leading-none uppercase drop-shadow-lg">
              {currentGame.title}
            </h1>
            <p className="text-lg text-gray-300 font-sans mt-3 max-w-xl leading-relaxed">
              {currentGame.persuasiveText || currentGame.description}
            </p>
          </div>

          {/* Social Presence In-Card Integration */}
          <div className="p-4 rounded-2xl bg-white/5 border border-cyan-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=King"
                  alt="Friend"
                  className="w-8 h-8 rounded-full border-2 border-cyan-400 bg-card"
                />
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja"
                  alt="Friend"
                  className="w-8 h-8 rounded-full border-2 border-purple-500 bg-card"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {currentGame.activeSquad} in Lobby
                </div>
                <p className="text-[11px] text-cyan-300">Co-Op Matchmaking Open • 15% Squad Discount</p>
              </div>
            </div>

            <span className="text-2xl font-mono font-black text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              {currentGame.price}
            </span>
          </div>

          {/* Primary Action Suite */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={handleBuyAndJoin}
              className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-black text-base rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:scale-105 transition-all flex items-center gap-2.5"
            >
              <Zap className="w-5 h-5 fill-current" />
              BUY & JOIN SQUAD
            </Button>

            <Button
              onClick={() => onLaunchDemo(currentGame.id)}
              variant="outline"
              className="h-14 px-6 glass border-cyan-400/40 hover:border-cyan-300 text-white font-bold text-sm rounded-2xl hover:bg-cyan-500/20 hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              <Gamepad2 className="w-5 h-5 text-cyan-400 animate-pulse" />
              PLAY 60s CLOUD DEMO
            </Button>

            <Button
              onClick={openProfiler}
              variant="ghost"
              className="h-14 px-5 text-gray-300 hover:text-white hover:bg-white/10 rounded-2xl text-xs font-mono flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI TASTE FEED
            </Button>
          </div>
        </div>

        {/* Right Column: 3D Holographic WebGL Preview Stage */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square max-w-[440px] rounded-3xl overflow-hidden border border-cyan-500/40 bg-gradient-to-b from-black/80 to-[#0c081d]/90 shadow-[0_0_60px_rgba(6,182,212,0.25)] flex items-center justify-center">
            {/* Live WebGL Three.js Canvas */}
            <WebGLPreviewCanvas
              themeColor={currentGame.themeColor}
              shapeType={currentGame.shape}
              interactive={true}
            />

            {/* Stage Hologram Overlays */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                3D HOLOGRAPHIC VIEWPORT
              </span>
            </div>

            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-gray-400 border border-white/10">
                Move cursor to inspect 360° mesh
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-[10px] font-mono text-purple-300 border border-purple-500/40">
                +30 GT on Inspect
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
