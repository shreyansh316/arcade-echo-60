import React, { useState } from "react";
import { useSocial, Friend } from "@/contexts/SocialContext";
import { useGridTokens } from "@/contexts/GridTokenContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import {
  X,
  Users,
  Coins,
  CheckCircle2,
  Share2,
  Copy,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Game } from "@/data/games";

interface CoBuyModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

export const CoBuyModal: React.FC<CoBuyModalProps> = ({ game, isOpen, onClose }) => {
  const { friends } = useSocial();
  const { addTokens } = useGridTokens();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedFriends, setSelectedFriends] = useState<string[]>(["1"]); // Default 1st friend selected
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalParticipants = selectedFriends.length + 1; // user + friends
  const originalPrice = game.priceValue || parseFloat(game.price.replace("$", "")) || 59.99;
  const splitPricePerPerson = (originalPrice / totalParticipants).toFixed(2);

  const toggleFriend = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://gameverse.io/cobuy/${game.id}?squad=${selectedFriends.join(",")}`
    );
    setCopied(true);
    toast.success("Co-Buy Invite Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmCoBuy = () => {
    addTokens(50, `Initiated Co-Buy Split for ${game.title}!`);
    try {
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
    } catch {}

    addToCart({
      ...game,
      price: `$${splitPricePerPerson}`,
      priceValue: parseFloat(splitPricePerPerson),
      title: `${game.title} (Co-Buy Squad License)`,
    });

    toast.success("Co-Buy order created! Proceed to checkout to pay your share.");
    navigate("/transaction");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[370] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-[#0d091e] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.3)] flex flex-col p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                Co-Buy Real-Time Split
              </h3>
              <p className="text-xs text-gray-400">
                Split the cost of <strong className="text-cyan-300">{game.title}</strong> with friends
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

        {/* Cost Split Summary Card */}
        <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 grid grid-cols-2 gap-4 text-center">
          <div className="border-r border-white/10 pr-2">
            <span className="text-xs font-mono text-gray-400 uppercase">Original Price</span>
            <div className="text-2xl font-mono font-bold text-gray-300 line-through">
              ${originalPrice.toFixed(2)}
            </div>
          </div>

          <div className="pl-2">
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
              Your Share ({totalParticipants} Players)
            </span>
            <div className="text-3xl font-mono font-black text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
              ${splitPricePerPerson}
            </div>
          </div>
        </div>

        {/* Select Friends List */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
            <span>Select Friends to Split With:</span>
            <span className="text-cyan-400">{selectedFriends.length} Selected</span>
          </label>

          <div className="space-y-2 max-h-48 overflow-y-auto hide-scrollbar">
            {friends
              .filter((f) => f.status !== "offline")
              .map((friend) => {
                const isSelected = selectedFriends.includes(friend.id);
                return (
                  <div
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-cyan-500/20 border-cyan-400/70 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.avatar}
                        alt={friend.username}
                        className="w-8 h-8 rounded-full border border-cyan-400"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">{friend.username}</span>
                        <span className="text-[10px] text-gray-400 font-mono capitalize">
                          {friend.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        ${splitPricePerPerson}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/30" />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Share Link Generator */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
          <input
            readOnly
            value={`https://gameverse.io/cobuy/${game.id}?squad=${selectedFriends.join(",")}`}
            className="bg-transparent border-0 text-gray-300 flex-1 truncate focus:outline-none"
          />
          <Button size="sm" onClick={handleCopyLink} variant="ghost" className="h-7 px-2.5 text-[11px] text-cyan-300">
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleConfirmCoBuy}
            className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)]"
          >
            <Zap className="w-4 h-4 mr-1.5 fill-current" />
            Pay My Share (${splitPricePerPerson}) & Send Squad Invites
          </Button>
        </div>
      </div>
    </div>
  );
};
