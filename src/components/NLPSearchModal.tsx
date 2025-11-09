import React, { useState } from "react";
import { allGames, Game } from "@/data/games";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  X,
  Zap,
  Gamepad2,
  CheckCircle2,
  ArrowRight,
  BrainCircuit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NLPSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemo?: (gameId: string) => void;
}

interface SearchResult {
  game: Game;
  score: number;
  semanticMatchReason: string;
}

export const NLPSearchModal: React.FC<NLPSearchModalProps> = ({
  isOpen,
  onClose,
  onLaunchDemo,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearch = (customQuery?: string) => {
    const q = (customQuery || query).toLowerCase().trim();
    if (!q) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      // NLP Semantic matching engine simulation
      const scored: SearchResult[] = allGames.map((game) => {
        let score = 50;
        let reasons: string[] = [];

        const titleText = game.title.toLowerCase();
        const descText = (game.description + " " + (game.plot || "") + " " + game.category).toLowerCase();

        const keywords = q.split(/\s+/);
        keywords.forEach((word) => {
          if (word.length < 3) return;
          if (titleText.includes(word)) {
            score += 25;
            reasons.push(`Title matches "${word}"`);
          }
          if (descText.includes(word)) {
            score += 15;
            reasons.push(`Lore matches "${word}"`);
          }
        });

        // Specific semantic concepts
        if (q.includes("stealth") || q.includes("hacker") || q.includes("cyber")) {
          if (game.category === "scifi" || game.id.includes("cyber")) {
            score += 30;
            reasons.push("Semantic alignment with Cyberpunk / Infiltration gameplay");
          }
        }
        if (q.includes("speed") || q.includes("racing") || q.includes("fast") || q.includes("drift")) {
          if (game.category === "racing" || game.id.includes("velocity")) {
            score += 35;
            reasons.push("Semantic alignment with High-Velocity Racing & Anti-Gravity physics");
          }
        }
        if (q.includes("space") || q.includes("fleet") || q.includes("galaxy") || q.includes("strategy")) {
          if (game.id.includes("star") || game.category === "scifi") {
            score += 30;
            reasons.push("Semantic alignment with Galactic Fleet Warfare");
          }
        }
        if (q.includes("magic") || q.includes("rpg") || q.includes("dragon") || q.includes("fantasy")) {
          if (game.category === "rpg" || game.id.includes("eldoria")) {
            score += 35;
            reasons.push("Semantic alignment with High-Fantasy Spellcraft & Open Worlds");
          }
        }

        const matchScore = Math.min(99, Math.max(65, score));
        return {
          game,
          score: matchScore,
          semanticMatchReason: reasons.length > 0 ? reasons.slice(0, 2).join(" • ") : "Genre & gameplay style correlation",
        };
      });

      scored.sort((a, b) => b.score - a.score);
      setResults(scored.slice(0, 4));
      setIsSearching(false);
    }, 250);
  };

  const samplePrompts = [
    "Games where I can play as a stealthy cyber hacker with friends",
    "High-speed futuristic racing with synthwave soundtrack",
    "Space fleet warfare across galaxies",
    "Open-world fantasy RPG with epic boss spells",
  ];

  return (
    <div className="fixed inset-0 z-[380] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-[#0c081e] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_90px_rgba(6,182,212,0.3)] flex flex-col p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-black">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white uppercase tracking-wider flex items-center gap-2">
                NLP Semantic Game Finder
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                  AI VECTOR SEARCH
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Describe the exact gaming experience, mechanics, or mood you want in plain English
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="e.g. 'Games where I can play as a stealthy cyber hacker with friends'..."
              className="h-14 pl-12 pr-4 bg-black/60 border-cyan-500/40 focus:border-cyan-400 text-sm text-white rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              autoFocus
            />
          </div>

          {/* Sample Prompts */}
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setQuery(prompt);
                  handleSearch(prompt);
                }}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-[11px] font-mono text-gray-300 hover:text-cyan-300 border border-white/10 transition-all text-left truncate max-w-full"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-3 max-h-80 overflow-y-auto hide-scrollbar">
          {results.map(({ game, score, semanticMatchReason }) => (
            <div
              key={game.id}
              onClick={() => {
                navigate(`/game/${game.id}`);
                onClose();
              }}
              className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-400/60 transition-all flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-white text-base truncate group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 font-mono text-[10px] font-bold">
                      {score}% Neural Match
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{game.description}</p>
                  <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {semanticMatchReason}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-lg font-mono font-black text-white">{game.price}</span>
                {onLaunchDemo && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLaunchDemo(game.id);
                      onClose();
                    }}
                    className="h-8 px-3 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl"
                  >
                    <Gamepad2 className="w-3.5 h-3.5 mr-1" /> 60s Demo
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
