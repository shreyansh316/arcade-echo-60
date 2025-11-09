import React from "react";
import { useSocial, Friend } from "@/contexts/SocialContext";
import { useGridTokens } from "@/contexts/GridTokenContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Users, Gamepad2, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allGames } from "@/data/games";

interface SocialCommerceBadgeProps {
  gameTitle: string;
  gameId?: string;
  onInstantJoin?: () => void;
  compact?: boolean;
}

export const SocialCommerceBadge: React.FC<SocialCommerceBadgeProps> = ({
  gameTitle,
  gameId,
  onInstantJoin,
  compact = false,
}) => {
  const { friends, toggleSidebar } = useSocial();
  const { completeQuestProgress } = useGridTokens();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Find friends playing or owning this game
  const activeFriends = friends.filter(
    (f) =>
      f.status === "in-game" &&
      f.game &&
      (f.game.toLowerCase().includes(gameTitle.toLowerCase()) ||
        gameTitle.toLowerCase().includes(f.game.toLowerCase()))
  );

  const matchedGame = allGames.find(
    (g) => g.id === gameId || g.title.toLowerCase() === gameTitle.toLowerCase()
  ) || allGames[0];

  if (activeFriends.length === 0) {
    return null;
  }

  const primaryFriend = activeFriends[0];

  const handleBuyAndJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    completeQuestProgress("social_squad", 1);

    addToCart({
      id: matchedGame.id,
      title: matchedGame.title,
      image: matchedGame.image,
      price: matchedGame.price,
      priceValue: matchedGame.priceValue || 59.99,
      rating: matchedGame.rating,
      category: matchedGame.category,
    });

    if (onInstantJoin) {
      onInstantJoin();
    } else {
      navigate("/transaction");
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleBuyAndJoin}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 hover:bg-cyan-500/30 transition-all text-xs font-semibold text-cyan-200 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse"
      >
        <img
          src={primaryFriend.avatar}
          alt={primaryFriend.username}
          className="w-4 h-4 rounded-full border border-cyan-300"
        />
        <span className="truncate max-w-[140px] font-bold text-white">
          {primaryFriend.username} is playing
        </span>
        <span className="text-[10px] text-cyan-300 font-mono underline flex items-center">
          Join <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
        </span>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-2xl bg-gradient-to-r from-[#06b6d4]/15 via-purple-900/20 to-black/60 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.15)] flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative shrink-0">
          <img
            src={primaryFriend.avatar}
            alt={primaryFriend.username}
            className="w-9 h-9 rounded-full border-2 border-cyan-400 bg-card"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-black animate-pulse" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-white truncate">
              {primaryFriend.username}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-green-500/20 text-green-300 text-[9px] font-mono font-bold">
              LIVE
            </span>
          </div>
          <p className="text-[11px] text-cyan-300 truncate flex items-center gap-1">
            <Gamepad2 className="w-3 h-3 text-cyan-400 shrink-0" />
            Playing in Squad Lobby
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={handleBuyAndJoin}
          className="h-8 px-3 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1"
        >
          <Zap className="w-3 h-3" /> Buy & Join Party
        </Button>
      </div>
    </div>
  );
};
