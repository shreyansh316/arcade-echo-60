import React, { useState } from "react";
import { useGridTokens } from "@/contexts/GridTokenContext";
import {
  ShieldAlert,
  Coins,
  Bug,
  CheckCircle2,
  Send,
  Zap,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Bounty {
  id: string;
  title: string;
  game: string;
  reward: number;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Open" | "Claimed";
  description: string;
}

const initialBounties: Bounty[] = [
  {
    id: "b-1",
    title: "Report Physics Glitch in Rooftop Infiltration",
    game: "Cyber Rebellion 2077",
    reward: 150,
    difficulty: "Medium",
    status: "Open",
    description: "Submit video/screenshot of abnormal ragdoll collisions near Sector 4.",
  },
  {
    id: "b-2",
    title: "Benchmark WebRTC Frame Pacing on 4K Stream",
    game: "Neon Velocity",
    reward: 200,
    difficulty: "Hard",
    status: "Open",
    description: "Log frametimes during high-speed apex turns on edge nodes.",
  },
  {
    id: "b-3",
    title: "Verify Spatial Audio Panning on Surround Headphones",
    game: "Star Command",
    reward: 100,
    difficulty: "Easy",
    status: "Open",
    description: "Confirm left/right stereo channel separation during warp drive jump.",
  },
];

export const BountyBoard: React.FC = () => {
  const { addTokens } = useGridTokens();
  const [bounties, setBounties] = useState<Bounty[]>(initialBounties);
  const [submittingBountyId, setSubmittingBountyId] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");

  const handleSubmitReport = (bountyId: string) => {
    const b = bounties.find((item) => item.id === bountyId);
    if (!b) return;

    addTokens(b.reward, `Smart Contract Bounty Payout: ${b.title}`);
    try {
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.7 } });
    } catch {}

    setBounties((prev) =>
      prev.map((item) => (item.id === bountyId ? { ...item, status: "Claimed" } : item))
    );
    setSubmittingBountyId(null);
    setReportText("");
    toast.success("Bounty verified and paid out to your Grid Wallet!", {
      icon: "🪙",
    });
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0c081e]/90 border border-amber-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(245,158,11,0.15)] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
              Bug Hunter & Beta Bounty Board
              <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                SMART CONTRACT PAYOUTS
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Help QA test games, discover glitches, and earn instant Grid Token store credit
            </p>
          </div>
        </div>
      </div>

      {/* Bounties List */}
      <div className="space-y-3.5">
        {bounties.map((b) => (
          <div
            key={b.id}
            className={`p-4 rounded-2xl border transition-all ${
              b.status === "Claimed"
                ? "bg-white/5 border-white/5 opacity-50"
                : "bg-black/40 border-amber-500/30 hover:border-amber-400/60"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-white text-sm">{b.title}</span>
                  <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                    {b.difficulty}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-400">{b.game}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-black text-amber-400">
                  +{b.reward} GT
                </span>

                {b.status === "Open" ? (
                  <Button
                    size="sm"
                    onClick={() => setSubmittingBountyId(submittingBountyId === b.id ? null : b.id)}
                    className="h-8 px-3 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-xl shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                  >
                    Submit Report
                  </Button>
                ) : (
                  <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-300">{b.description}</p>

            {/* Submission Form Dropdown */}
            {submittingBountyId === b.id && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2 animate-in fade-in duration-200">
                <Input
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe the steps to reproduce or paste error log / video URL..."
                  className="h-9 bg-black/60 border-white/10 text-xs text-white rounded-xl"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSubmittingBountyId(null)}
                    className="h-7 text-xs text-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReport(b.id)}
                    className="h-7 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg"
                  >
                    <Send className="w-3 h-3 mr-1" /> Claim +{b.reward} GT
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
