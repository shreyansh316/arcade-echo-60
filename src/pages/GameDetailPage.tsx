import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { getGameById, allGames } from "@/data/games";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useTrailerPlayer } from "@/contexts/TrailerPlayerContext";
import { SocialCommerceBadge } from "@/components/SocialCommerceBadge";
import { CoBuyModal } from "@/components/CoBuyModal";
import { ReviewSentimentCard } from "@/components/ReviewSentimentCard";
import { LiveReactionBarrage } from "@/components/LiveReactionBarrage";
import { CloudDemoPlayer } from "@/components/CloudDemoPlayer";
import {
  ShoppingBag,
  ArrowLeft,
  Heart,
  Gamepad2,
  Zap,
  Play,
  Users,
  ShieldCheck,
  Film,
  Sparkles,
  Cloud,
} from "lucide-react";
import { SparkleEffect } from "@/components/SparkleEffect";
import { useState } from "react";

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { playTrailer } = useTrailerPlayer();

  const [showSparkle, setShowSparkle] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | undefined>();
  const [selectedTrailerMode, setSelectedTrailerMode] = useState<"cinematic" | "combat" | "multiplayer">("cinematic");
  const [isCoBuyOpen, setIsCoBuyOpen] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);

  const game = id ? getGameById(id) : null;
  const inWishlist = game ? isInWishlist(game.id) : false;

  if (!game) {
    return (
      <div className="min-h-screen bg-[#070510] text-foreground">
        <Header />
        <div className="container px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Game Not Found</h2>
          <Button onClick={() => navigate("/")} className="bg-cyan-500 text-black">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(game);
  };

  const handleBuyNow = () => {
    addToCart(game);
    navigate("/transaction");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    addToWishlist(game.id);
    setShowSparkle(true);
  };

  const trailerCuts = {
    cinematic: {
      label: "Cinematic Story Cut",
      badge: "4K 60FPS Storyline",
      tagline: "Experience the dystopian corporate lore and neural rebellion.",
    },
    combat: {
      label: "High-Octane Combat Cut",
      badge: "Ray-Traced Action",
      tagline: "Witness relentless cyber katana combat and plasma projectile duels.",
    },
    multiplayer: {
      label: "Multiplayer Co-Op Cut",
      badge: "Squad Netcode",
      tagline: "Coordinated tactical raids with 4-player live squad voice integration.",
    },
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

      <div className="min-h-screen bg-[#070510] text-foreground">
        <Header />

        <div className="container max-w-[1360px] px-4 sm:px-6 py-6 space-y-12">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>

          {/* Main Hero Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Media Stage with AI Trailer Cut Selector */}
            <div className="lg:col-span-8 space-y-6">
              {/* Media Stage */}
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-cyan-500/40 bg-black shadow-[0_0_60px_rgba(6,182,212,0.2)] group">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    {trailerCuts[selectedTrailerMode].badge}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 font-mono text-xs border border-green-500/40">
                    Verified Edge Cache
                  </span>
                </div>

                {/* Center Play Trailer Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() =>
                      playTrailer({
                        gameId: game.id,
                        title: game.title,
                        thumbnail: game.image,
                        videoPreviewUrl: game.image,
                        price: game.price,
                      })
                    }
                    className="w-20 h-20 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                    title="Launch 4K Trailer in PiP Player"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                </div>

                {/* Bottom Tagline */}
                <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-gray-300 pointer-events-none">
                  {trailerCuts[selectedTrailerMode].tagline}
                </div>
              </div>

              {/* AI Trailer Cut Selector Bar */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-cyan-400" /> AI Personalized Trailer Cuts:
                </span>

                <div className="flex items-center gap-2">
                  {(["cinematic", "combat", "multiplayer"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSelectedTrailerMode(mode)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedTrailerMode === mode
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : "text-gray-400 hover:text-white bg-black/40 border border-white/5"
                      }`}
                    >
                      {trailerCuts[mode].label.split(" ")[0]} Cut
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Lore & Description */}
              <div className="p-8 rounded-3xl bg-[#0c081e]/90 border border-white/10 space-y-4">
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wide">
                  Mission Brief & Neural Plot
                </h3>
                <p className="text-base text-gray-300 font-sans leading-relaxed">
                  {game.plot || game.description}
                </p>
                <p className="text-sm text-cyan-300 font-mono">
                  {game.persuasiveText}
                </p>
              </div>

              {/* AI Review Sentiment NLP Card */}
              <ReviewSentimentCard gameTitle={game.title} rating={game.rating} />

              {/* Community Live Twitch Barrage */}
              <LiveReactionBarrage gameTitle={game.title} />
            </div>

            {/* Right: Checkout & Squad Co-Buy Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-28 p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-[#0d091e]/95 backdrop-blur-2xl shadow-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold uppercase">
                      {game.category}
                    </span>
                    <StarRating rating={game.rating} />
                  </div>

                  <h1 className="text-3xl font-display font-black text-white leading-tight">
                    {game.title}
                  </h1>
                </div>

                {/* Live Friend In-Game Presence */}
                <SocialCommerceBadge gameTitle={game.title} gameId={game.id} />

                {/* Price Display */}
                <div className="flex items-baseline justify-between border-t border-b border-white/10 py-4">
                  <span className="text-xs font-mono text-gray-400">DIGITAL LICENSE</span>
                  <span className="text-3xl font-mono font-black text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                    {game.price}
                  </span>
                </div>

                {/* Action CTA Trio */}
                <div className="space-y-3">
                  <Button
                    onClick={handleBuyNow}
                    className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-bold text-base rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-all"
                  >
                    <Zap className="w-5 h-5 mr-2 fill-current" /> Buy Now
                  </Button>

                  <Button
                    onClick={() => setIsDemoActive(true)}
                    variant="outline"
                    className="w-full h-12 glass border-cyan-400/40 hover:bg-cyan-500/20 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2"
                  >
                    <Gamepad2 className="w-4 h-4 text-cyan-400" /> Play 60s Zero-Download Demo
                  </Button>

                  <Button
                    onClick={() => setIsCoBuyOpen(true)}
                    variant="outline"
                    className="w-full h-12 glass border-purple-400/40 hover:bg-purple-500/20 text-purple-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" /> Co-Buy & Split with Friends
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      className="flex-1 h-11 glass border-white/10 text-white rounded-xl text-xs"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                    <Button
                      onClick={handleWishlist}
                      variant="outline"
                      className={`h-11 px-4 glass border-white/10 rounded-xl ${inWishlist ? "text-primary border-primary" : "text-white"}`}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2 pt-2 text-xs font-mono text-gray-300 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400" /> Instant Cloud License Minting
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-cyan-400" /> Cross-Platform Cloud Save Sync
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" /> 4-Player Co-Op Voice Channels
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Co-Buy Modal */}
      <CoBuyModal
        game={game}
        isOpen={isCoBuyOpen}
        onClose={() => setIsCoBuyOpen(false)}
      />

      {/* 60s Instant Cloud Demo Modal */}
      <CloudDemoPlayer
        gameId={isDemoActive ? game.id : null}
        onClose={() => setIsDemoActive(false)}
      />
    </>
  );
}
