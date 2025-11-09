import React, { useState } from "react";
import { useGridTokens } from "@/contexts/GridTokenContext";
import { Coins, Sparkles, Trophy, CheckCircle2, ChevronRight, Gift, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

export const GridTokenWallet: React.FC = () => {
  const { tokens, quests, achievements, claimQuestReward, getDiscountForTokens } = useGridTokens();
  const [open, setOpen] = useState(false);

  const completedClaimable = quests.filter((q) => q.completed && q.reward > 0).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-primary/20 to-purple-500/20 border border-amber-500/40 hover:border-amber-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] group cursor-pointer">
          <div className="relative flex items-center justify-center">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
            {tokens.toLocaleString()} <span className="text-white/60 font-sans text-[10px]">GT</span>
          </span>

          {completedClaimable > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-red-500 text-white animate-bounce shadow-lg">
              {completedClaimable}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-96 p-0 bg-[#0c0a17]/95 backdrop-blur-2xl border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] text-foreground rounded-2xl overflow-hidden z-50"
      >
        {/* Header */}
        <div className="relative p-5 bg-gradient-to-b from-amber-500/15 via-transparent to-transparent border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40">
                <Coins className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-white flex items-center gap-1.5">
                  Grid Token Wallet
                </h4>
                <p className="text-[11px] text-gray-400">Play, review & earn store credit</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-black text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                {tokens.toLocaleString()}
              </div>
              <span className="text-[10px] text-green-400 font-mono font-semibold">
                ≈ ${getDiscountForTokens(tokens)}.00 Store Credit
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> 100 GT = $1.00 off any game
            </span>
            <span className="text-primary font-bold text-[11px]">Applied at Checkout</span>
          </div>
        </div>

        {/* Quests Section */}
        <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto hide-scrollbar">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Daily Quests
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                {quests.filter((q) => q.completed).length}/{quests.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  className={`p-3 rounded-xl border transition-all ${
                    quest.completed && quest.reward > 0
                      ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : quest.completed
                      ? "bg-white/5 border-white/5 opacity-60"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {quest.title}
                        {quest.completed && quest.reward === 0 && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        )}
                      </h5>
                      <p className="text-[11px] text-gray-400 leading-tight">{quest.description}</p>
                    </div>

                    {quest.completed && quest.reward > 0 ? (
                      <Button
                        size="sm"
                        onClick={() => claimQuestReward(quest.id)}
                        className="h-7 px-2.5 text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"
                      >
                        Claim +{quest.reward} GT
                      </Button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                        +{quest.reward || "✓"} GT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Progress
                      value={(quest.progress / quest.maxProgress) * 100}
                      className="h-1.5 bg-black/40"
                    />
                    <span className="text-[10px] font-mono text-gray-400 shrink-0">
                      {quest.progress}/{quest.maxProgress}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Snippet */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-2.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Milestones
            </span>
            <div className="grid grid-cols-3 gap-2">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    ach.unlocked
                      ? "bg-primary/10 border-primary/40 text-white"
                      : "bg-white/5 border-white/5 opacity-40 text-gray-400"
                  }`}
                >
                  <div className="text-xl mb-1">{ach.badge}</div>
                  <div className="text-[10px] font-bold truncate">{ach.title}</div>
                  <div className="text-[9px] font-mono text-amber-400">+{ach.reward} GT</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>Earn tokens with every action</span>
          <span className="text-primary font-bold hover:underline cursor-pointer">
            View Rulebook →
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
};
