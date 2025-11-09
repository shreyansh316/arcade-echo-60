import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroCommandCenter } from "@/components/HeroCommandCenter";
import { InteractiveCategoryFilter } from "@/components/InteractiveCategoryFilter";
import { GameCard } from "@/components/GameCard";
import { SocialCommerceBadge } from "@/components/SocialCommerceBadge";
import { LFGVoiceHub } from "@/components/LFGVoiceHub";
import { CloudDemoPlayer } from "@/components/CloudDemoPlayer";
import { TasteProfilerModal } from "@/components/TasteProfilerModal";
import { StreamSpectateModal } from "@/components/StreamSpectateModal";
import { NLPSearchModal } from "@/components/NLPSearchModal";
import { Loader } from "@/components/Loader";
import ParticleCanvas from "@/components/ParticleCanvas";
import { allGames, upcomingGames } from "@/data/games";
import { useTasteProfile } from "@/contexts/TasteProfileContext";
import { useSocial } from "@/contexts/SocialContext";
import { useGridTokens } from "@/contexts/GridTokenContext";
import {
  Sparkles,
  Gamepad2,
  Users,
  Flame,
  Zap,
  TrendingUp,
  Radio,
  ArrowRight,
  Coins,
  BrainCircuit,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { openProfiler, getPersonalizedGames } = useTasteProfile();
  const { friends, toggleSidebar, startSpectating } = useSocial();
  const { tokens } = useGridTokens();

  const [activeDemoGameId, setActiveDemoGameId] = useState<string | null>(null);
  const [isNLPSearchOpen, setIsNLPSearchOpen] = useState(false);

  const [hasLoaded, setHasLoaded] = useState(() => {
    return localStorage.getItem("siteHasLoaded") === "true";
  });
  const [isLoading, setIsLoading] = useState(!hasLoaded);

  useEffect(() => {
    if (hasLoaded) {
      setIsLoading(false);
    }
  }, [hasLoaded]);

  const handleLoaderComplete = () => {
    localStorage.setItem("siteHasLoaded", "true");
    setHasLoaded(true);
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader onComplete={handleLoaderComplete} />;
  }

  // Get AI personalized feed
  const personalizedGames = getPersonalizedGames(allGames);
  const trendingGames = personalizedGames.slice(0, 6);
  const cloudDemoGames = allGames.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#070510] text-foreground relative overflow-x-hidden">
      <ParticleCanvas />
      <Header />

      <main className="container max-w-[1360px] px-4 sm:px-6 py-6 relative z-10 space-y-16">
        {/* 1. Hero Command Center */}
        <section className="animate-fade-in-scale">
          <HeroCommandCenter onLaunchDemo={(id) => setActiveDemoGameId(id)} />
        </section>

        {/* 2. Interactive Icon-Driven Category Navigation */}
        <section className="animate-slide-in-up">
          <InteractiveCategoryFilter />
        </section>

        {/* 3. Live LFG Squad Voice Channels via WebRTC */}
        <section className="animate-slide-in-up">
          <LFGVoiceHub />
        </section>

        {/* 4. Seamless Social Commerce: Live Squad Lobbies & In-Game Spectating */}
        <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0f0b24] to-cyan-950/30 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Live Squad Lobbies & Streams <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                </h2>
                <p className="text-xs text-gray-400">
                  Friends are in mission raids right now. Spectate their gameplay or co-buy with an instant 15% Squad discount!
                </p>
              </div>
            </div>

            <Button
              onClick={toggleSidebar}
              variant="outline"
              className="glass border-purple-400/40 hover:bg-purple-500/20 text-white rounded-xl text-xs font-mono"
            >
              Open Squad Hub ({friends.filter((f) => f.status !== "offline").length} Active)
            </Button>
          </div>

          {/* Social Presence Grid with Spectating Trigger */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {friends
              .filter((f) => f.status === "in-game")
              .map((friend) => (
                <div
                  key={friend.id}
                  className="p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col justify-between gap-4 backdrop-blur-md group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={friend.avatar}
                          alt={friend.username}
                          className="w-11 h-11 rounded-full border-2 border-green-400"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border border-black animate-ping" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                          {friend.username}
                        </h4>
                        <span className="text-xs font-mono text-cyan-300">{friend.game}</span>
                      </div>
                    </div>

                    {friend.isStreaming && (
                      <button
                        onClick={() => startSpectating(friend)}
                        className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] font-mono font-bold flex items-center gap-1 hover:bg-red-500/40 transition-colors"
                      >
                        <Radio className="w-2.5 h-2.5 animate-pulse" /> Spectate
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 font-mono line-clamp-1">
                    📍 {friend.inGameLocation || "In Squad Lobby"}
                  </p>

                  <SocialCommerceBadge gameTitle={friend.game || ""} />
                </div>
              ))}
          </div>
        </section>

        {/* 5. AI Taste Profiler & NLP Semantic Search Banner */}
        <section className="relative rounded-3xl bg-gradient-to-br from-cyan-950/40 via-[#0d091f] to-purple-950/40 border border-cyan-500/40 p-8 md:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_0_60px_rgba(6,182,212,0.2)]">
          <div className="space-y-4 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              AI DISCOVERY & VECTOR SEARCH
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tight leading-tight">
              AI Taste Profiler & Semantic Search
            </h2>

            <p className="text-base text-gray-300 font-sans leading-relaxed">
              Swipe 15-second gameplay clips to train your neural recommendation matrix, or type complex queries like <em>"Games where I can play as a stealthy cyber hacker with friends"</em> to find your dream title!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                onClick={openProfiler}
                className="h-12 px-8 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-display font-bold text-sm rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-black fill-current" />
                LAUNCH TASTE FEED (+50 GT)
              </Button>

              <Button
                onClick={() => setIsNLPSearchOpen(true)}
                variant="outline"
                className="h-12 px-6 glass border-cyan-400/40 hover:bg-cyan-500/20 text-white rounded-2xl text-xs font-mono flex items-center gap-2"
              >
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                NLP Semantic Search
              </Button>
            </div>
          </div>

          <div
            onClick={openProfiler}
            className="relative w-64 h-80 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.35)] cursor-pointer group hover:scale-105 transition-transform shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=800&fit=crop"
              alt="Taste Preview"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform">
                <Flame className="w-7 h-7 fill-current" />
              </div>
            </div>
            <div className="absolute bottom-3 inset-x-3 text-center">
              <span className="px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono text-cyan-300 font-bold">
                Swipe 15s Clips →
              </span>
            </div>
          </div>
        </section>

        {/* 6. Zero-Download Playable Cloud Micro-Demos */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-cyan-400 rounded-full" />
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide flex items-center gap-3">
                <Gamepad2 className="w-8 h-8 text-cyan-400" />
                Instant Cloud Demos
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/15 border border-cyan-400/30 px-3 py-1 rounded-full">
              Zero Download • 60s Micro-Trial via WebRTC (12ms Ping)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cloudDemoGames.map((game) => (
              <div
                key={game.id}
                onClick={() => setActiveDemoGameId(game.id)}
                className="group relative rounded-3xl overflow-hidden glass border border-white/10 hover:border-cyan-400/60 p-5 flex flex-col justify-between h-[340px] cursor-pointer hover:shadow-[0_0_35px_rgba(6,182,212,0.3)] transition-all duration-300"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                <div className="relative z-10 flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-bold">
                    60s INSTANT PLAY
                  </span>
                  <span className="text-[10px] font-mono text-green-400">12ms Ping</span>
                </div>

                <div className="relative z-10 space-y-3">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-300 line-clamp-2 mt-1">{game.description}</p>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDemoGameId(game.id);
                    }}
                    className="w-full h-10 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    PLAY DEMO NOW
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Personalized Dynamic Storefront Feed */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-purple-500 rounded-full" />
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                Personalized For You
              </h2>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/15 border border-purple-400/30 px-3 py-1 rounded-full">
              Neural Weighted with 3D Holograms & Spatial Audio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingGames.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                image={game.image}
                price={game.price}
                priceValue={game.priceValue}
                rating={game.rating}
                persuasiveText={game.persuasiveText}
                description={game.description}
                category={game.category}
                onLaunchDemo={(id) => setActiveDemoGameId(id)}
              />
            ))}
          </div>
        </section>

        {/* 8. Upcoming Games Rail */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
              Neural Pipeline (Coming Soon)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingGames.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                className="group relative rounded-3xl overflow-hidden glass border border-white/10 hover:border-cyan-400/50 p-6 flex flex-col justify-end h-[320px] cursor-pointer transition-all duration-300"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                    PRE-ORDER
                  </span>
                  <h4 className="text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {game.title}
                  </h4>
                  <p className="text-sm font-mono text-cyan-400">{game.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Global AI Taste Profiler Swipe Deck Modal */}
      <TasteProfilerModal onLaunchDemo={(id) => setActiveDemoGameId(id)} />

      {/* Global 60s Instant Cloud Demo Modal */}
      <CloudDemoPlayer
        gameId={activeDemoGameId}
        onClose={() => setActiveDemoGameId(null)}
      />

      {/* Global Friend Stream Spectating Modal */}
      <StreamSpectateModal />

      {/* Global NLP Semantic Search Modal */}
      <NLPSearchModal
        isOpen={isNLPSearchOpen}
        onClose={() => setIsNLPSearchOpen(false)}
        onLaunchDemo={(id) => setActiveDemoGameId(id)}
      />

      <footer className="border-t border-white/10 py-8 mt-16 bg-[#05030a]">
        <div className="container max-w-[1360px] px-6 text-center text-gray-400 text-sm">
          <p>© 2026 GameVerse Ecosystem • Interactive Entertainment & Social Commerce</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
