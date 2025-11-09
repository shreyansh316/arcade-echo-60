import { Header } from "@/components/Header";
import { Rocket } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { getGamesByCategory } from "@/data/games";

export default function SciFiCategory() {
  const sciFiGames = getGamesByCategory("scifi");

  return (
    <div className="min-h-screen bg-background" style={{ 
      background: "linear-gradient(to bottom, hsl(180 50% 8% / 0.4), hsl(270 50% 4%))",
    }}>
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950/40 via-cyan-900/20 to-background pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 0%, hsl(180 100% 30% / 0.3), transparent 70%)",
      }} />
      <Header />
      <div className="container px-4 py-12 relative z-10">
        <div className="relative h-[400px] rounded-lg overflow-hidden border-2 border-cyan-500 mb-16 glow" style={{
          boxShadow: "0 0 40px hsl(180 100% 50% / 0.4), inset 0 0 60px hsl(180 100% 30% / 0.2)",
        }}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-cyan-900/30 to-cyan-950/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Rocket className="w-64 h-64 text-cyan-500 opacity-30 animate-pulse" style={{
                filter: "drop-shadow(0 0 20px hsl(180 100% 50% / 0.6))",
              }} />
            </div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-6xl font-bold mb-4 glitch-on-viewport text-cyan-400" style={{
              textShadow: "0 0 20px hsl(180 100% 50% / 0.8), 0 0 40px hsl(180 100% 40% / 0.4)",
            }}>Sci-Fi Games</h1>
            <p className="text-xl text-muted-foreground max-w-2xl glitch-on-viewport">
              Journey through space, time, and technology in futuristic adventures
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sciFiGames.map((game) => (
            <div key={game.id} className="glitch-on-viewport">
              <GameCard {...game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
