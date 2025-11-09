import { Header } from "@/components/Header";
import { Car } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { getGamesByCategory } from "@/data/games";

export default function RacingCategory() {
  const racingGames = getGamesByCategory("racing");

  return (
    <div className="min-h-screen bg-background" style={{ 
      background: "linear-gradient(to bottom, hsl(25 50% 8% / 0.4), hsl(270 50% 4%))",
    }}>
      <div className="fixed inset-0 bg-gradient-to-br from-orange-950/40 via-orange-900/20 to-background pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 0%, hsl(25 100% 30% / 0.3), transparent 70%)",
      }} />
      <Header />
      <div className="container px-4 py-12 relative z-10">
        <div className="relative h-[400px] rounded-lg overflow-hidden border-2 border-orange-500 mb-16 glow" style={{
          boxShadow: "0 0 40px hsl(25 100% 50% / 0.4), inset 0 0 60px hsl(25 100% 30% / 0.2)",
        }}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950/50 via-orange-900/30 to-orange-950/20">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <Car className="w-64 h-64 text-orange-500 opacity-30 animate-race-fast" style={{
                filter: "drop-shadow(0 0 20px hsl(25 100% 50% / 0.6))",
              }} />
            </div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-6xl font-bold mb-4 glitch-on-viewport text-orange-400" style={{
              textShadow: "0 0 20px hsl(25 100% 50% / 0.8), 0 0 40px hsl(25 100% 40% / 0.4)",
            }}>Racing Games</h1>
            <p className="text-xl text-muted-foreground max-w-2xl glitch-on-viewport">
              Experience the thrill of high-speed racing with our collection of the most intense racing games
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {racingGames.map((game) => (
            <div key={game.id} className="glitch-on-viewport">
              <GameCard {...game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
