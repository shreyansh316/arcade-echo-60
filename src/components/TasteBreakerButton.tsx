import React, { useState } from "react";
import { useTasteProfile } from "@/contexts/TasteProfileContext";
import { useGridTokens } from "@/contexts/GridTokenContext";
import { allGames, Game } from "@/data/games";
import { useNavigate } from "react-router-dom";
import { Sparkles, Compass, Zap, ArrowRight, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export const TasteBreakerButton: React.FC = () => {
  const { tasteWeights } = useTasteProfile();
  const { addTokens } = useGridTokens();
  const navigate = useNavigate();

  const [suggestedGame, setSuggestedGame] = useState<Game | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTriggerTasteBreaker = () => {
    // Invert weights: find lowest affinity genre
    const sortedGenres = Object.entries(tasteWeights).sort((a, b) => a[1] - b[1]);
    const lowestGenre = sortedGenres[0] ? sortedGenres[0][0] : "adventure";

    // Find top-rated game in that genre
    const candidates = allGames.filter(
      (g) => (g.category || "").toLowerCase() === lowestGenre.toLowerCase()
    );
    const pick = candidates.length > 0 ? candidates[0] : allGames[allGames.length - 1];

    setSuggestedGame(pick);
    setIsOpen(true);
    addTokens(30, `Triggered Taste Breaker: Discovered ${pick.title}!`);

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch {}
  };

  return (
    <>
      <Button
        onClick={handleTriggerTasteBreaker}
        className="h-11 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-display font-bold text-xs shadow-[0_0_25px_rgba(217,70,239,0.35)] hover:scale-105 transition-all flex items-center gap-2"
        title="Invert cosine recommendation weights to break your genre bubble"
      >
        <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: "8s" }} />
        <span>TASTE BREAKER</span>
        <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-amber-300">
          +30 GT
        </span>
      </Button>

      {/* Taste Breaker Spotlight Dialog */}
      {isOpen && suggestedGame && (
        <div className="fixed inset-0 z-[390] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#0e091f] border border-pink-500/50 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(217,70,239,0.3)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    Taste Breaker Anomaly
                  </h3>
                  <p className="text-[11px] text-gray-400">Cosine Vector Inversion Result</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={suggestedGame.image}
                  alt={suggestedGame.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-pink-500/80 text-black font-mono font-black text-xs uppercase">
                    {suggestedGame.category} DISCOVERY
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-display font-black text-white">
                  {suggestedGame.title}
                </h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  {suggestedGame.persuasiveText || suggestedGame.description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-xs text-pink-200">
                💡 <strong>Why this breaks your bubble:</strong> Based on your recent gameplay, you rarely explore {suggestedGame.category?.toUpperCase()}. This critically acclaimed title delivers a completely fresh perspective!
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => {
                  navigate(`/game/${suggestedGame.id}`);
                  setIsOpen(false);
                }}
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center justify-center gap-2"
              >
                Explore {suggestedGame.title} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
