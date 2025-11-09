import { Header } from "@/components/Header";
import { Crown } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { getGamesByCategory } from "@/data/games";

export default function RPGCategory() {
  const rpgGames = getGamesByCategory("rpg");

  return (
    <div className="min-h-screen bg-background" style={{ 
      background: "linear-gradient(to bottom, hsl(120 50% 8% / 0.4), hsl(270 50% 4%))",
    }}>
      <div className="fixed inset-0 bg-gradient-to-br from-green-950/40 via-green-900/20 to-background pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 0%, hsl(120 100% 30% / 0.3), transparent 70%)",
      }} />
      <Header />
      <div className="container px-4 py-12 relative z-10">
        <div className="relative h-[400px] rounded-lg overflow-hidden border-2 border-green-500 mb-16 glow" style={{
          boxShadow: "0 0 40px hsl(120 100% 50% / 0.4), inset 0 0 60px hsl(120 100% 30% / 0.2)",
        }}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/50 via-green-900/30 to-green-950/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Crown className="w-64 h-64 text-green-500 opacity-30 animate-pulse" style={{
                filter: "drop-shadow(0 0 20px hsl(120 100% 50% / 0.6))",
              }} />
            </div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-6xl font-bold mb-4 glitch-on-viewport text-green-400" style={{
              textShadow: "0 0 20px hsl(120 100% 50% / 0.8), 0 0 40px hsl(120 100% 40% / 0.4)",
            }}>RPG Games</h1>
            <p className="text-xl text-muted-foreground max-w-2xl glitch-on-viewport">
              Embark on epic quests, build your character, and shape your destiny
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rpgGames.map((game) => (
            <div key={game.id} className="glitch-on-viewport">
              <GameCard {...game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
