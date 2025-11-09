import React, { createContext, useContext, useState, useEffect } from "react";
import { Game, allGames } from "@/data/games";
import { useGridTokens } from "./GridTokenContext";
import { toast } from "sonner";

export interface TasteClip {
  id: string;
  gameId: string;
  title: string;
  genre: string;
  tags: string[];
  duration: string;
  videoPreview: string; // Animated webp or high-res image
  description: string;
  quote: string;
  streamer: string;
  streamerAvatar: string;
  ratingScore: number;
  matchScore: number;
  weights: { [genre: string]: number };
}

export const sampleClips: TasteClip[] = [
  {
    id: "clip-1",
    gameId: "cyber-rebellion-2077",
    title: "Cyber Rebellion 2077 - Neon Night Infiltration",
    genre: "scifi",
    tags: ["Cyberpunk", "Hacking", "Ray Traced", "Open World"],
    duration: "0:15",
    videoPreview: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1000&h=1400&fit=crop",
    description: "High-voltage neural hack infiltration into Arasaka mainframe.",
    quote: "\"The combat pacing and neon lighting are mindblowing.\" - IGN",
    streamer: "Xx_GamerKing_xX",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=King",
    ratingScore: 98,
    matchScore: 96,
    weights: { scifi: 3, rpg: 2, action: 2 },
  },
  {
    id: "clip-2",
    gameId: "neon-velocity",
    title: "Neon Velocity - 600MPH Zero-G Drift",
    genre: "racing",
    tags: ["High Speed", "Synthwave", "Anti-Gravity", "Competitive"],
    duration: "0:14",
    videoPreview: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&h=1400&fit=crop",
    description: "Flawless apex turn across orbital plasma tracks.",
    quote: "\"Pure adrenaline with unmatched synth audio design.\" - PC Gamer",
    streamer: "SpeedDemon",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Speed",
    ratingScore: 94,
    matchScore: 92,
    weights: { racing: 3, action: 2 },
  },
  {
    id: "clip-3",
    gameId: "star-command",
    title: "Star Command - Dreadnought Warp Battle",
    genre: "scifi",
    tags: ["Space Fleet", "Tactical", "Intergalactic", "Sci-Fi"],
    duration: "0:15",
    videoPreview: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1000&h=1400&fit=crop",
    description: "Colossal planetary blockade encounter in deep nebula.",
    quote: "\"Scale and spectacle on an intergalactic level.\" - GameSpot",
    streamer: "QuantumLeaper",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quantum",
    ratingScore: 91,
    matchScore: 89,
    weights: { scifi: 3, strategy: 2 },
  },
  {
    id: "clip-4",
    gameId: "quantum-odyssey",
    title: "Quantum Odyssey - Dimension Rift Slash",
    genre: "adventure",
    tags: ["Time Travel", "Lore Rich", "Atmospheric", "Puzzle"],
    duration: "0:15",
    videoPreview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&h=1400&fit=crop",
    description: "Slicing through space-time to outmaneuver temporal sentinels.",
    quote: "\"A masterpiece of atmosphere and mind-bending gameplay.\" - Kotaku",
    streamer: "NeonNinja",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja",
    ratingScore: 97,
    matchScore: 95,
    weights: { adventure: 3, rpg: 2, action: 1 },
  },
  {
    id: "clip-5",
    gameId: "chronicles-of-eldoria",
    title: "Chronicles of Eldoria - Dragon Siege Spell",
    genre: "rpg",
    tags: ["High Fantasy", "Magic", "Epic Bosses", "Open World"],
    duration: "0:15",
    videoPreview: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&h=1400&fit=crop",
    description: "Casting Level 90 Frost Cataclysm against Ancient Wyrm.",
    quote: "\"Redefines magical spellcasting in modern RPGs.\" - Polygon",
    streamer: "PixelPioneer",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel",
    ratingScore: 95,
    matchScore: 88,
    weights: { rpg: 3, fantasy: 2, adventure: 1 },
  },
];

interface TasteProfileContextType {
  isProfilerOpen: boolean;
  openProfiler: () => void;
  closeProfiler: () => void;
  toggleProfiler: () => void;
  tasteWeights: { [key: string]: number };
  rateClip: (clipId: string, action: "like" | "dislike" | "superlike") => void;
  getPersonalizedGames: (gamesList: Game[]) => Game[];
  activeClipIndex: number;
  setActiveClipIndex: (index: number) => void;
  clips: TasteClip[];
}

const TasteProfileContext = createContext<TasteProfileContextType | undefined>(undefined);

export const TasteProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProfilerOpen, setIsProfilerOpen] = useState(false);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const { completeQuestProgress, addTokens } = useGridTokens();

  const [tasteWeights, setTasteWeights] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem("taste_weights");
    return saved
      ? JSON.parse(saved)
      : { scifi: 3, rpg: 2, action: 2, racing: 1, adventure: 2, shooter: 1 };
  });

  useEffect(() => {
    localStorage.setItem("taste_weights", JSON.stringify(tasteWeights));
  }, [tasteWeights]);

  const openProfiler = () => setIsProfilerOpen(true);
  const closeProfiler = () => setIsProfilerOpen(false);
  const toggleProfiler = () => setIsProfilerOpen((prev) => !prev);

  const rateClip = (clipId: string, action: "like" | "dislike" | "superlike") => {
    const clip = sampleClips.find((c) => c.id === clipId);
    if (!clip) return;

    setTasteWeights((prev) => {
      const next = { ...prev };
      const multiplier = action === "superlike" ? 3 : action === "like" ? 1.5 : -1;

      Object.entries(clip.weights).forEach(([genre, weight]) => {
        next[genre] = Math.max(0, Math.min(20, (next[genre] || 1) + weight * multiplier));
      });
      return next;
    });

    // Advance quest progress
    completeQuestProgress("taste_profiler", 1);

    if (action === "superlike") {
      addTokens(15, `SuperLiked ${clip.title}! Preference boosted 3x.`);
    } else if (action === "like") {
      toast.success(`Liked ${clip.genre.toUpperCase()} clip! Feed recalibrating...`, {
        icon: "🔥",
      });
    } else {
      toast.info(`Skipped clip. Filtering similar content.`, {
        icon: "⏭️",
      });
    }

    setActiveClipIndex((prev) => (prev + 1) % sampleClips.length);
  };

  const getPersonalizedGames = (gamesList: Game[]): Game[] => {
    return [...gamesList].sort((a, b) => {
      const catA = (a.category || "action").toLowerCase();
      const catB = (b.category || "action").toLowerCase();
      const weightA = (tasteWeights[catA] || 1) * (a.rating || 4);
      const weightB = (tasteWeights[catB] || 1) * (b.rating || 4);
      return weightB - weightA;
    });
  };

  return (
    <TasteProfileContext.Provider
      value={{
        isProfilerOpen,
        openProfiler,
        closeProfiler,
        toggleProfiler,
        tasteWeights,
        rateClip,
        getPersonalizedGames,
        activeClipIndex,
        setActiveClipIndex,
        clips: sampleClips,
      }}
    >
      {children}
    </TasteProfileContext.Provider>
  );
};

export const useTasteProfile = () => {
  const context = useContext(TasteProfileContext);
  if (!context) {
    throw new Error("useTasteProfile must be used within a TasteProfileProvider");
  }
  return context;
};
