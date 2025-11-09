import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export interface StoreQuest {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
  icon: string;
}

export interface StoreAchievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  unlocked: boolean;
  badge: string;
}

interface GridTokenContextType {
  tokens: number;
  addTokens: (amount: number, reason: string) => void;
  spendTokens: (amount: number) => boolean;
  quests: StoreQuest[];
  achievements: StoreAchievement[];
  completeQuestProgress: (questId: string, increment?: number) => void;
  claimQuestReward: (questId: string) => void;
  getDiscountForTokens: (tokenAmount: number) => number;
}

const initialQuests: StoreQuest[] = [
  {
    id: "taste_profiler",
    title: "AI Taste Calibrator",
    description: "Rate 3 gameplay clips in the AI Taste Profiler",
    reward: 50,
    completed: false,
    progress: 0,
    maxProgress: 3,
    icon: "Sparkles",
  },
  {
    id: "cloud_demo",
    title: "Zero-Latency Test Pilot",
    description: "Launch and test any 60-second Cloud Demo",
    reward: 75,
    completed: false,
    progress: 0,
    maxProgress: 1,
    icon: "Gamepad2",
  },
  {
    id: "webgl_inspect",
    title: "Holographic Inspector",
    description: "Interact with the 3D WebGL Command Center",
    reward: 30,
    completed: false,
    progress: 0,
    maxProgress: 1,
    icon: "Boxes",
  },
  {
    id: "social_squad",
    title: "Squad Synergy",
    description: "Inspect a friend's live in-game status",
    reward: 40,
    completed: false,
    progress: 0,
    maxProgress: 1,
    icon: "Users",
  },
];

const initialAchievements: StoreAchievement[] = [
  {
    id: "first_drop",
    title: "Grid Initiate",
    description: "Welcome to the GameVerse ecosystem",
    reward: 100,
    unlocked: true,
    badge: "⚡",
  },
  {
    id: "cloud_pioneer",
    title: "Cloud Streamer",
    description: "Test your first instant micro-demo without downloading",
    reward: 150,
    unlocked: false,
    badge: "🚀",
  },
  {
    id: "squad_leader",
    title: "Party Commander",
    description: "Initiate a Buy & Join Party co-op purchase",
    reward: 250,
    unlocked: false,
    badge: "👑",
  },
];

const GridTokenContext = createContext<GridTokenContextType | undefined>(undefined);

export const GridTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<number>(() => {
    const saved = localStorage.getItem("grid_tokens");
    return saved ? parseInt(saved, 10) : 250;
  });

  const [quests, setQuests] = useState<StoreQuest[]>(() => {
    const saved = localStorage.getItem("grid_quests");
    return saved ? JSON.parse(saved) : initialQuests;
  });

  const [achievements, setAchievements] = useState<StoreAchievement[]>(() => {
    const saved = localStorage.getItem("grid_achievements");
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  useEffect(() => {
    localStorage.setItem("grid_tokens", tokens.toString());
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem("grid_quests", JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem("grid_achievements", JSON.stringify(achievements));
  }, [achievements]);

  const addTokens = (amount: number, reason: string) => {
    setTokens((prev) => {
      const next = prev + amount;
      toast.success(`+${amount} Grid Tokens earned!`, {
        description: reason,
        icon: "🪙",
      });
      return next;
    });

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#06b6d4", "#a855f7", "#22c55e"],
      });
    } catch {
      // ignore
    }
  };

  const spendTokens = (amount: number): boolean => {
    if (tokens >= amount) {
      setTokens((prev) => prev - amount);
      toast.info(`Spent ${amount} Grid Tokens on store discount.`);
      return true;
    }
    toast.error("Insufficient Grid Tokens!");
    return false;
  };

  const completeQuestProgress = (questId: string, increment = 1) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          const nextProgress = Math.min(q.progress + increment, q.maxProgress);
          const isComplete = nextProgress >= q.maxProgress;
          if (isComplete && !q.completed) {
            toast.info(`Quest Ready to Claim: ${q.title}!`, {
              icon: "🏆",
            });
          }
          return { ...q, progress: nextProgress, completed: isComplete };
        }
        return q;
      })
    );
  };

  const claimQuestReward = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (quest && quest.completed && quest.reward > 0) {
      addTokens(quest.reward, `Completed Quest: ${quest.title}`);
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, reward: 0 } : q))
      );
    }
  };

  const getDiscountForTokens = (tokenAmount: number) => {
    return Math.floor(tokenAmount / 100);
  };

  return (
    <GridTokenContext.Provider
      value={{
        tokens,
        addTokens,
        spendTokens,
        quests,
        achievements,
        completeQuestProgress,
        claimQuestReward,
        getDiscountForTokens,
      }}
    >
      {children}
    </GridTokenContext.Provider>
  );
};

export const useGridTokens = () => {
  const context = useContext(GridTokenContext);
  if (!context) {
    throw new Error("useGridTokens must be used within a GridTokenProvider");
  }
  return context;
};
