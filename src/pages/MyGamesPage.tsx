import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ExpandableGameCard } from "@/components/ExpandableGameCard";
import { Game, allGames } from "@/data/games";
import { Gamepad2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CloudSaveManager } from "@/components/CloudSaveManager";

export default function MyGamesPage() {
  const [ownedGames, setOwnedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [launchingGameId, setLaunchingGameId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/economy/licenses", {
          credentials: "include",
        });
        const data = await response.json();
        
        if (response.ok) {
          const games = allGames.filter(g => data.licenses.includes(g.id));
          setOwnedGames(games);
        } else {
          setError(data.error || "Failed to load library");
        }
      } catch (err) {
        setError("Network error. Cannot reach server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  const handleLaunch = (id: string) => {
    setLaunchingGameId(id);
    setTimeout(() => {
      setLaunchingGameId(null);
    }, 4000); // Simulate engine spin up
  };

  return (
    <div className="min-h-screen bg-[#0a0514] text-foreground font-sans selection:bg-primary/30">
      
      {/* Dynamic Background Element */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="pt-8 px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <Header />

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            My Library
          </h1>
          <p className="text-muted-foreground text-lg">Your collection of digital experiences.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Syncing licenses...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-destructive border border-destructive/30 bg-destructive/10 rounded-2xl p-8">
            <AlertCircle className="w-12 h-12" />
            <p className="font-bold text-lg">{error}</p>
          </div>
        ) : ownedGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-6 bg-card/30 backdrop-blur-md rounded-2xl border border-border">
            <Gamepad2 className="w-16 h-16 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Your library is empty</h3>
              <p className="text-muted-foreground">Head to the store to discover your next favorite game.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ownedGames.map((game) => (
              <ExpandableGameCard 
                key={game.id} 
                game={{
                  id: game.id,
                  title: game.title,
                  price: game.priceValue,
                  rating: game.rating,
                  image: game.image,
                  category: game.category
                }}
                mode="library"
                onLaunch={handleLaunch}
              />
            ))}
          </div>
        )}

        {/* Cross-Platform Cloud Save Vault */}
        <div className="mt-12">
          <CloudSaveManager />
        </div>
      </div>

      {/* Simulated Game Engine Launcher Overlay */}
      {launchingGameId && (
        <div className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-[50px] animate-pulse opacity-50" />
            <Gamepad2 className="w-24 h-24 text-green-400 relative z-10 animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">
            Initializing Engine
          </h2>
          <div className="w-64 h-2 bg-muted/30 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-300 w-full animate-[progress_3s_ease-in-out]" />
          </div>
          <p className="text-muted-foreground mt-4 text-sm uppercase tracking-widest animate-pulse">
            Loading Assets...
          </p>
        </div>
      )}
    </div>
  );
}
