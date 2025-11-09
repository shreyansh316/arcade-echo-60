import React, { useState, useEffect } from "react";
import { MessageSquare, Flame, Zap, Heart, Sparkles, Send, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LiveReactionBarrageProps {
  gameTitle?: string;
}

export const LiveReactionBarrage: React.FC<LiveReactionBarrageProps> = ({
  gameTitle = "Cyber Rebellion 2077",
}) => {
  const [hypeLevel, setHypeLevel] = useState(88);
  const [reactions, setReactions] = useState<{ id: number; user: string; text: string; tag: string }[]>([
    { id: 1, user: "CyberVanguard", text: "The ray tracing graphics are unbelievable on ultra! 🚀", tag: "VERIFIED BUYER" },
    { id: 2, user: "NeuralHacker", text: "Best combat pacing since 2024. 10/10 masterclass.", tag: "SQUAD LEADER" },
    { id: 3, user: "SpeedQueen", text: "Co-op with friends works seamlessly with 0 latency!", tag: "CLOUD TESTER" },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; emoji: string; left: number }[]>([]);

  // Periodically simulate live chat messages
  useEffect(() => {
    const mockFeed = [
      "Just unlocked the legendary cyber katana in Phase 3! ⚡",
      "Anyone want to squad up for the boss raid? 🎮",
      "The soundtrack alone is worth the price 🔥",
      "60 FPS cloud stream is flawless on my browser! 🚀",
    ];
    const mockUsers = ["PixelKnight", "VortexGamer", "AstroPilot", "NeonGhost"];

    const interval = setInterval(() => {
      const randomMsg = mockFeed[Math.floor(Math.random() * mockFeed.length)];
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      setReactions((prev) => [
        { id: Date.now(), user: randomUser, text: randomMsg, tag: "COMMUNITY" },
        ...prev.slice(0, 5),
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setReactions((prev) => [
      { id: Date.now(), user: "You", text: inputMsg.trim(), tag: "YOU" },
      ...prev,
    ]);
    setInputMsg("");
    setHypeLevel((prev) => Math.min(100, prev + 2));
    triggerEmoji("🔥");
  };

  const triggerEmoji = (emoji: string) => {
    const id = Date.now() + Math.random();
    setFloatingParticles((prev) => [...prev, { id, emoji, left: Math.random() * 85 + 5 }]);
    setHypeLevel((prev) => Math.min(100, prev + 1));
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== id));
    }, 2200);
  };

  return (
    <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#0e0a22] via-[#090714] to-[#040308] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden space-y-4">
      {/* Floating Particle Emoji Rain */}
      {floatingParticles.map((p) => (
        <div
          key={p.id}
          style={{ left: `${p.left}%` }}
          className="absolute bottom-6 text-3xl pointer-events-none animate-bounce"
        >
          {p.emoji}
        </div>
      ))}

      {/* Header & Hype Meter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
              Community Hype & Live Barrage
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            </h3>
            <p className="text-xs text-gray-400">Live Twitch-style reaction stream</p>
          </div>
        </div>

        {/* Hype Level Gauge */}
        <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-2xl border border-white/10">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Hype Index</span>
            <div className="text-sm font-mono font-black text-cyan-300">{hypeLevel}% MAX HYPE</div>
          </div>
        </div>
      </div>

      {/* Quick Reaction Emojis Barrage Bar */}
      <div className="flex items-center gap-2 relative z-10">
        <span className="text-xs font-mono text-gray-400">Rain Reactions:</span>
        {["🔥", "🚀", "💀", "⚡", "🪙", "👑"].map((emoji) => (
          <button
            key={emoji}
            onClick={() => triggerEmoji(emoji)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-lg hover:scale-125 active:scale-90 transition-transform cursor-pointer border border-white/10"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Chat Stream List */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto hide-scrollbar relative z-10">
        {reactions.map((r) => (
          <div
            key={r.id}
            className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3 text-xs"
          >
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold shrink-0">
              {r.tag}
            </span>
            <div className="min-w-0">
              <span className="font-bold text-white mr-2">{r.user}:</span>
              <span className="text-gray-300">{r.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 relative z-10">
        <Input
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={`Post a live reaction to ${gameTitle}...`}
          className="h-10 bg-black/60 border-white/10 text-xs text-white rounded-xl"
        />
        <Button
          type="submit"
          className="h-10 px-5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <Send className="w-3.5 h-3.5 mr-1" /> Send
        </Button>
      </form>
    </div>
  );
};
