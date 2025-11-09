import { useState, useRef, useEffect } from "react";
import { StarRating } from "./StarRating";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAmbientTheme } from "@/contexts/AmbientThemeContext";
import { useTrailerPlayer } from "@/contexts/TrailerPlayerContext";
import { spatialAudio } from "@/utils/spatialAudio";
import { useNavigate } from "react-router-dom";
import { SparkleEffect } from "./SparkleEffect";
import { Heart, ShoppingBag, Terminal, Gamepad2, Zap, Play, Users, Cloud, Check } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ImageWithFallback";
import { SocialCommerceBadge } from "./SocialCommerceBadge";
import { WebGLCardPreview } from "./WebGLCardPreview";
import { CoBuyModal } from "./CoBuyModal";
import type { Game } from "@/contexts/CartContext";

interface GameCardProps {
  id?: string;
  title: string;
  image: string;
  price: string;
  priceValue?: number;
  rating: number;
  persuasiveText: string;
  description?: string;
  category?: string;
  onLaunchDemo?: (gameId: string) => void;
}

export const GameCard = ({
  id,
  title,
  image,
  price,
  priceValue,
  rating,
  persuasiveText,
  description,
  category,
  onLaunchDemo,
}: GameCardProps) => {
  const [showSparkle, setShowSparkle] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | undefined>();
  const [isHovered, setIsHovered] = useState(false);
  const [isCoBuyOpen, setIsCoBuyOpen] = useState(false);
  const [prefetchProgress, setPrefetchProgress] = useState(0);
  const [isPrefetched, setIsPrefetched] = useState(false);

  const prefetchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { setDominantColor, resetDominantColor } = useAmbientTheme();
  const { playTrailer } = useTrailerPlayer();
  const navigate = useNavigate();

  const gameId = id || title.toLowerCase().replace(/\s+/g, "-");
  const inWishlist = isInWishlist(gameId);

  // Map category to aesthetic dominant color
  const getThemeColor = () => {
    switch (category?.toLowerCase()) {
      case "scifi": return "#06b6d4"; // Cyan
      case "rpg": return "#a855f7"; // Purple
      case "racing": return "#ec4899"; // Magenta
      case "shooter": return "#ef4444"; // Red
      case "adventure": return "#3b82f6"; // Blue
      default: return "#06b6d4";
    }
  };

  const themeColor = getThemeColor();

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    setDominantColor(themeColor);

    // Spatial Web Audio panning trigger
    const panX = (e.clientX / window.innerWidth) * 2 - 1;
    spatialAudio.playCardHover(panX);

    // 2.5s Edge Pre-fetcher simulation
    setPrefetchProgress(0);
    let progress = 0;
    prefetchTimerRef.current = setInterval(() => {
      progress += 10;
      setPrefetchProgress(progress);
      if (progress >= 100) {
        setIsPrefetched(true);
        if (prefetchTimerRef.current) clearInterval(prefetchTimerRef.current);
      }
    }, 250);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    resetDominantColor();
    if (prefetchTimerRef.current) {
      clearInterval(prefetchTimerRef.current);
    }
    setPrefetchProgress(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const panX = (e.clientX / window.innerWidth) * 2 - 1;
    spatialAudio.setPan(panX);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const game: Game = {
      id: gameId,
      title,
      image,
      price,
      priceValue: priceValue || parseFloat(price.replace("$", "")) || 0,
      rating,
      description,
      category,
    };
    addToCart(game);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(e);
    navigate("/transaction");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCursorPos({ x: e.clientX, y: e.clientY });
    addToWishlist(gameId);
    setShowSparkle(true);
  };

  const handlePlayPiPTrailer = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTrailer({
      gameId,
      title,
      thumbnail: image,
      videoPreviewUrl: image,
      price,
    });
  };

  return (
    <>
      <SparkleEffect
        trigger={showSparkle}
        onComplete={() => {
          setShowSparkle(false);
          setCursorPos(undefined);
        }}
        cursorX={cursorPos?.x}
        cursorY={cursorPos?.y}
      />

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={() => navigate(`/game/${gameId}`)}
        className="group relative h-[490px] w-full cursor-pointer rounded-3xl overflow-hidden glass border border-white/10 hover:border-cyan-400/60 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]"
      >
        {/* Kinetic Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 filter group-hover:brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070512] via-[#070512]/80 to-transparent z-10" />
        </div>

        {/* 3D WebGL Hologram Viewer on Hover */}
        <WebGLCardPreview color={themeColor} active={isHovered} />

        {/* Content Container */}
        <div className="relative z-20 h-full flex flex-col justify-end p-6">
          {/* Top Details & Pre-fetcher Status */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md text-white/90 border border-white/20 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase">
                <Terminal className="w-3 h-3 text-cyan-400" />
                {category || "ACTION RPG"}
              </span>

              {/* 3s Hover Edge Pre-Fetcher Indicator */}
              {isHovered && (
                <span className="px-2 py-0.5 rounded-full bg-black/70 border border-cyan-400/40 text-[9px] font-mono text-cyan-300 flex items-center gap-1 animate-in fade-in duration-200">
                  <Cloud className="w-2.5 h-2.5 text-cyan-400" />
                  {isPrefetched ? (
                    <span className="text-green-400 flex items-center">
                      Edge Ready <Check className="w-2.5 h-2.5 ml-0.5" />
                    </span>
                  ) : (
                    `Pre-fetching ${prefetchProgress}%`
                  )}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* PiP Trailer Trigger Button */}
              <button
                onClick={handlePlayPiPTrailer}
                className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 flex items-center justify-center transition-all hover:scale-110"
                title="Play Trailer in Picture-in-Picture Mini-Player"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>

              <Button
                onClick={handleWishlist}
                size="icon"
                variant="ghost"
                className={`h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black/80 hover:scale-110 transition-all ${
                  inWishlist ? "text-primary border-primary glow" : "text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Social Presence In-Card Tag */}
          <div className="mb-2">
            <SocialCommerceBadge gameTitle={title} gameId={gameId} compact={true} />
          </div>

          {/* Main Info */}
          <div className="transform group-hover:-translate-y-2 transition-transform duration-500 ease-out space-y-2">
            <h3 className="text-2xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors drop-shadow-md leading-tight">
              {title}
            </h3>

            <div className="flex items-center gap-2">
              <StarRating rating={rating} />
              <span className="text-[11px] font-mono text-gray-400">(12.4k reviews)</span>
            </div>

            {/* Price & Demo Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black text-white group-hover:text-cyan-300 transition-all">
                  {price}
                </span>
                {priceValue && priceValue < 40 && (
                  <span className="text-xs font-semibold text-gray-400 line-through">
                    ${(priceValue * 1.5).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Instant 60s Demo Trigger */}
              {onLaunchDemo && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchDemo(gameId);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold hover:bg-cyan-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Gamepad2 className="w-3 h-3 text-cyan-400" />
                  60s Cloud Demo
                </button>
              )}
            </div>

            {/* Action Buttons Suite - Revealed on Hover */}
            <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto overflow-hidden">
              <Button
                onClick={handleBuyNow}
                className="flex-1 h-10 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <Zap className="w-3.5 h-3.5 mr-1 fill-current" />
                BUY
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCoBuyOpen(true);
                }}
                variant="outline"
                className="h-10 px-3 glass border-purple-400/40 hover:bg-purple-500/20 text-purple-300 font-bold text-xs rounded-xl flex items-center gap-1"
                title="Split cost with friends"
              >
                <Users className="w-3.5 h-3.5" /> Co-Buy
              </Button>

              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="h-10 px-3 glass border-white/20 hover:bg-white/10 text-white font-bold text-xs rounded-xl"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Co-Buy Multiplayer Split Modal */}
      <CoBuyModal
        game={{
          id: gameId,
          title,
          image,
          price,
          priceValue: priceValue || 59.99,
          rating,
          persuasiveText,
          description: description || "",
          category: category || "action",
        }}
        isOpen={isCoBuyOpen}
        onClose={() => setIsCoBuyOpen(false)}
      />
    </>
  );
};
