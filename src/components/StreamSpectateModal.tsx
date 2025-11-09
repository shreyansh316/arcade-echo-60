import React, { useState, useEffect } from "react";
import { useSocial } from "@/contexts/SocialContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { allGames } from "@/data/games";
import {
  X,
  Radio,
  Eye,
  MessageSquare,
  Flame,
  Send,
  Zap,
  ShoppingBag,
  Gamepad2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const StreamSpectateModal: React.FC = () => {
  const { spectatingFriend, stopSpectating } = useSocial();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [chatMessages, setChatMessages] = useState<{ user: string; text: string; time: string }[]>([
    { user: "NeonNinja", text: "INSANE boss dodge right there! 🔥", time: "just now" },
    { user: "SpeedDemon", text: "Use the neural pulse on the weak spot!", time: "just now" },
    { user: "QuantumLeaper", text: "What level gear is that weapon?", time: "1m ago" },
  ]);
  const [inputText, setInputText] = useState("");
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);

  if (!spectatingFriend) return null;

  const matchedGame = allGames.find(
    (g) => g.title.toLowerCase().includes((spectatingFriend.game || "").toLowerCase())
  ) || allGames[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { user: "You", text: inputText.trim(), time: "just now" },
    ]);
    setInputText("");
  };

  const triggerEmoji = (emoji: string) => {
    const id = Date.now() + Math.random();
    setFloatingEmojis((prev) => [...prev, { id, emoji, x: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 2000);
  };

  const handleBuyAndJoin = () => {
    addToCart(matchedGame);
    navigate("/transaction");
    stopSpectating();
  };

  return (
    <div className="fixed inset-0 z-[360] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl h-[90vh] max-h-[850px] bg-[#0b0819] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.3)] flex flex-col md:flex-row">
        {/* Left: Stream Viewport */}
        <div className="flex-1 bg-black relative flex flex-col justify-between overflow-hidden">
          {/* Top Stream Header */}
          <div className="h-14 px-6 bg-black/70 border-b border-white/10 flex items-center justify-between z-30">
            <div className="flex items-center gap-3">
              <img
                src={spectatingFriend.avatar}
                alt={spectatingFriend.username}
                className="w-8 h-8 rounded-full border-2 border-green-400"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{spectatingFriend.username}</span>
                  <span className="px-2 py-0.2 rounded bg-red-500 text-white text-[9px] font-mono font-bold flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE STREAM
                  </span>
                </div>
                <span className="text-[11px] text-cyan-300 font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {spectatingFriend.inGameLocation || spectatingFriend.game}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
              <div className="flex items-center gap-1 text-red-400 font-bold">
                <Eye className="w-3.5 h-3.5" />
                <span>{spectatingFriend.streamViewers || 142} Spectators</span>
              </div>
              <button
                onClick={stopSpectating}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Broadcast Content Simulation */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
            <img
              src={matchedGame.image}
              alt={matchedGame.title}
              className="w-full h-full object-cover scale-105 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />

            {/* Floating Live Emojis */}
            {floatingEmojis.map((e) => (
              <div
                key={e.id}
                style={{ left: `${e.x}%` }}
                className="absolute bottom-10 text-3xl pointer-events-none animate-bounce"
              >
                {e.emoji}
              </div>
            ))}
          </div>

          {/* Stream Bottom Quick CTA Bar */}
          <div className="h-16 px-6 bg-[#0c081e] border-t border-white/10 flex items-center justify-between z-30">
            <div className="flex items-center gap-2">
              {["🔥", "🚀", "💀", "⚡", "👑"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerEmoji(emoji)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <Button
              onClick={handleBuyAndJoin}
              className="h-10 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <Zap className="w-4 h-4 mr-1.5 fill-current" /> Buy & Join Squad ({matchedGame.price})
            </Button>
          </div>
        </div>

        {/* Right: Live Twitch-Style Chat */}
        <div className="w-full md:w-80 bg-[#0d091f] border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between">
          <div className="p-4 border-b border-white/10">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" /> Live Stream Chat
            </h4>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[480px] hide-scrollbar text-xs">
            {chatMessages.map((msg, i) => (
              <div key={i} className="space-y-0.5">
                <span className="font-mono font-bold text-cyan-400 mr-2">{msg.user}:</span>
                <span className="text-gray-200">{msg.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send hype message..."
              className="h-9 bg-black/50 border-white/10 text-xs text-white"
            />
            <Button size="icon" type="submit" className="h-9 w-9 bg-cyan-500 hover:bg-cyan-400 text-black">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
