import React, { useState, useEffect } from "react";
import { useTasteProfile } from "@/contexts/TasteProfileContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  X,
  Heart,
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Gamepad2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { allGames } from "@/data/games";

interface TasteProfilerModalProps {
  onLaunchDemo?: (gameId: string) => void;
}

export const TasteProfilerModal: React.FC<TasteProfilerModalProps> = ({ onLaunchDemo }) => {
  const {
    isProfilerOpen,
    closeProfiler,
    clips,
    activeClipIndex,
    rateClip,
    tasteWeights,
  } = useTasteProfile();

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const activeClip = clips[activeClipIndex] || clips[0];
  const matchedGame = allGames.find((g) => g.id === activeClip.gameId) || allGames[0];

  // Motion values for swipe gestures
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacityLike = useTransform(x, [50, 150], [0, 1]);
  const opacityDislike = useTransform(x, [-50, -150], [0, 1]);

  // Simulated 15-second playback timer
  useEffect(() => {
    if (!isProfilerOpen || !isPlaying) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1.2;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isProfilerOpen, activeClipIndex, isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    if (!isProfilerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        rateClip(activeClip.id, "like");
      } else if (e.key === "ArrowLeft") {
        rateClip(activeClip.id, "dislike");
      } else if (e.key === "ArrowUp") {
        rateClip(activeClip.id, "superlike");
      } else if (e.key === "Escape") {
        closeProfiler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isProfilerOpen, activeClip, rateClip, closeProfiler]);

  if (!isProfilerOpen) return null;

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      rateClip(activeClip.id, "like");
    } else if (info.offset.x < -100) {
      rateClip(activeClip.id, "dislike");
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: matchedGame.id,
      title: matchedGame.title,
      image: matchedGame.image,
      price: matchedGame.price,
      priceValue: matchedGame.priceValue || 59.99,
      rating: matchedGame.rating,
      category: matchedGame.category,
    });
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#0c0919] border border-[#06b6d4]/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.25)] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={closeProfiler}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 border border-white/20 text-white/80 hover:text-white hover:bg-black/90 hover:scale-110 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left / Main: Short-form Feed Card */}
        <div className="relative flex-1 h-full bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeClip.id}
              style={{ x, rotate }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-[380px] h-[95%] rounded-2xl overflow-hidden border border-white/20 shadow-2xl cursor-grab active:cursor-grabbing group select-none"
            >
              {/* Media Stream Simulation */}
              <div className="absolute inset-0">
                <img
                  src={activeClip.videoPreview}
                  alt={activeClip.title}
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
                <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
              </div>

              {/* Swipe Stamps */}
              <motion.div
                style={{ opacity: opacityLike }}
                className="absolute top-12 left-6 z-30 px-4 py-1.5 rounded-xl border-4 border-green-400 text-green-400 font-display font-black text-2xl rotate-[-15deg] uppercase tracking-wider bg-black/60 backdrop-blur-md"
              >
                🔥 LIKE
              </motion.div>

              <motion.div
                style={{ opacity: opacityDislike }}
                className="absolute top-12 right-6 z-30 px-4 py-1.5 rounded-xl border-4 border-red-500 text-red-500 font-display font-black text-2xl rotate-[15deg] uppercase tracking-wider bg-black/60 backdrop-blur-md"
              >
                ⏭️ SKIP
              </motion.div>

              {/* Top Stream Status Bar */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[11px] font-mono font-bold text-white tracking-widest uppercase">
                    LIVE REACTION
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                </div>
              </div>

              {/* 15s Progress Bar */}
              <div className="absolute top-14 left-4 right-4 z-20">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Content Information Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-20 space-y-3">
                {/* Match percentage & tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> {activeClip.matchScore}% Match
                  </span>
                  {activeClip.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300 text-[10px] font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Title & streamer */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={activeClip.streamerAvatar}
                      alt={activeClip.streamer}
                      className="w-6 h-6 rounded-full border border-cyan-400"
                    />
                    <span className="text-xs font-semibold text-gray-200">
                      {activeClip.streamer}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-white leading-tight drop-shadow-md">
                    {activeClip.title}
                  </h3>
                  <p className="text-xs text-gray-300 italic mt-1 line-clamp-1">
                    {activeClip.quote}
                  </p>
                </div>

                {/* Instant Play CTA on Card */}
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onLaunchDemo) {
                        onLaunchDemo(matchedGame.id);
                        closeProfiler();
                      }
                    }}
                    className="flex-1 h-9 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    <Gamepad2 className="w-3.5 h-3.5 mr-1.5" /> Play 60s Demo
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                      navigate("/cart");
                      closeProfiler();
                    }}
                    variant="outline"
                    className="h-9 px-3 glass border-white/20 hover:border-white/40 text-white text-xs rounded-xl"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Swipe Buttons Deck */}
          <div className="flex items-center gap-5 mt-4 z-20">
            <button
              onClick={() => rateClip(activeClip.id, "dislike")}
              className="p-4 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/30 hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] cursor-pointer"
              title="Skip Clip (Left Arrow)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => rateClip(activeClip.id, "superlike")}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 border border-amber-400/50 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
              title="SuperLike (+15 Tokens)"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>SUPER BOOST</span>
              <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-amber-300 font-mono">
                +15 GT
              </span>
            </button>

            <button
              onClick={() => rateClip(activeClip.id, "like")}
              className="p-4 rounded-full bg-green-500/15 border border-green-500/40 text-green-400 hover:bg-green-500/30 hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] cursor-pointer"
              title="Want to Play (Right Arrow)"
            >
              <Flame className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Dynamic Neural Taste Matrix */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 bg-[#0e0b1d]/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-base">
                  AI Taste Matrix
                </h4>
                <p className="text-[11px] text-gray-400">Dynamic Vector Weighting</p>
              </div>
            </div>

            {/* Live Vector Sliders */}
            <div className="space-y-3.5 mb-6">
              {Object.entries(tasteWeights).map(([genre, weight]) => {
                const percentage = Math.min(100, Math.round((weight / 15) * 100));
                return (
                  <div key={genre} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="uppercase text-gray-300 font-bold">{genre}</span>
                      <span className="text-cyan-400 font-semibold">{percentage}% Affinity</span>
                    </div>
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Neural Insights */}
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-gray-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold font-mono text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" /> RE-RANKING ACTIVE
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Your storefront feed automatically adjusts to prioritize high-affinity titles based on clip engagement.
              </p>
            </div>
          </div>

          {/* Keyboard hints footer */}
          <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Swipe Left / [←]</span>
              <span className="text-red-400 font-bold">Skip</span>
            </div>
            <div className="flex justify-between">
              <span>Swipe Right / [→]</span>
              <span className="text-green-400 font-bold">Like</span>
            </div>
            <div className="flex justify-between">
              <span>Key [↑]</span>
              <span className="text-amber-400 font-bold">SuperBoost</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
