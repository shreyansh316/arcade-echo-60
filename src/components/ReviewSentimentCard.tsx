import React from "react";
import { Sparkles, ThumbsUp, ThumbsDown, BrainCircuit, Check, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReviewSentimentCardProps {
  gameTitle: string;
  rating: number;
}

export const ReviewSentimentCard: React.FC<ReviewSentimentCardProps> = ({
  gameTitle,
  rating,
}) => {
  const sentimentScore = Math.min(99, Math.floor(rating * 19 + 4));

  const pros = [
    "Spectacular visual fidelity and atmospheric neon lighting",
    "Seamless sub-15ms cloud streaming and instant responsive controls",
    "Engaging narrative with deep branching decision points",
    "High replayability with online squad matchmaking",
  ];

  const cons = [
    "Steep difficulty curve during late-game boss encounters",
    "Advanced skill tree may require reading documentation",
  ];

  return (
    <div className="p-6 rounded-3xl bg-[#0c081e]/90 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
              AI Review Sentiment Analyzer
              <span className="px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold">
                NLP ENGINE v3
              </span>
            </h4>
            <p className="text-xs text-gray-400">
              Summarized from 12,400+ verified player reviews
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-mono font-black text-green-400">
            {sentimentScore}% POSITIVE
          </div>
          <span className="text-[10px] font-mono text-gray-400">Overall Community Consensus</span>
        </div>
      </div>

      {/* Sentiment Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-green-400 flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" /> Positive (96%)
          </span>
          <span className="text-red-400 flex items-center gap-1">
            <ThumbsDown className="w-3.5 h-3.5" /> Negative (4%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden flex">
          <div className="h-full bg-green-500 rounded-l-full" style={{ width: "96%" }} />
          <div className="h-full bg-red-500 rounded-r-full" style={{ width: "4%" }} />
        </div>
      </div>

      {/* Pros & Cons Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pros */}
        <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-green-400">
            <Check className="w-4 h-4" /> AI Verified Highlights (Pros)
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            {pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-400 shrink-0 mt-0.5">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-red-400">
            <AlertCircle className="w-4 h-4" /> Community Caveats (Cons)
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            {cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
