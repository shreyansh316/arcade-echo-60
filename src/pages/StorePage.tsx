import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { allGames } from "@/data/games";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { getGamesByCategory } from "@/data/games";
import { Sparkles, TrendingUp, Zap, PackageOpen, Wand2 } from "lucide-react";
import { ExpandableGameCard } from "@/components/ExpandableGameCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { AIPosterStudioModal } from "@/components/AIPosterStudioModal";
export default function StorePage() {
  const navigate = useNavigate();
  const { user, getMostPlayedCategory } = useUser();
  const { dispatch: cartDispatch } = useCart();
  const [bundles, setBundles] = useState<any[]>([]);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/economy/bundles')
      .then(res => res.json())
      .then(data => {
        if (data.bundles) setBundles(data.bundles);
      })
      .catch(console.error);
  }, []);

  // Get recommendations based on user's most played category
  const mostPlayedCategory = user ? getMostPlayedCategory() : "action";
  const recommendations = getGamesByCategory(mostPlayedCategory).slice(0, 4);

  // Featured games
  const featuredGames = allGames.filter((g) => g.rating === 5).slice(0, 4);

  // New releases
  const newReleases = allGames.slice(-4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl font-bold mb-4 glitch-on-viewport bg-gradient-to-r from-primary via-[hsl(var(--glow-secondary))] to-primary bg-clip-text text-transparent">
            Game Store
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Discover thousands of games across all genres. Your next adventure awaits!
          </p>

          <Button
            onClick={() => setIsStudioOpen(true)}
            className="h-11 px-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-black font-display font-bold text-xs rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] inline-flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-black" />
            AI POSTER STUDIO & PROMPT ENGINE
          </Button>
        </div>

        {/* Curated Bundles Section */}
        {bundles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <PackageOpen className="w-8 h-8 text-accent" />
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Curated Bundles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bundles.map(bundle => (
                <div key={bundle.id} className="relative p-8 rounded-3xl border border-accent/50 bg-card/40 backdrop-blur-xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent z-0 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold inline-block mb-4 shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                      SAVE {bundle.discountPercentage}%
                    </div>
                    <h3 className="text-3xl font-black mb-2">{bundle.title}</h3>
                    <p className="text-muted-foreground mb-6">A hand-picked collection of {bundle.gameIds.length} premium titles.</p>
                    
                    <div className="flex gap-4 mb-8">
                      {bundle.gameIds.map((id: number) => {
                        const game = allGames.find(g => g.id === String(id));
                        return game ? (
                          <img key={id} src={game.image} alt={game.title} className="w-20 h-20 rounded-xl object-cover border border-border shadow-md" title={game.title} />
                        ) : null;
                      })}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="line-through text-muted-foreground text-lg mr-2">${bundle.originalPrice.toFixed(2)}</span>
                        <span className="text-4xl font-bold text-accent">${bundle.discountedPrice.toFixed(2)}</span>
                      </div>
                      <Button 
                        size="lg" 
                        className="bg-accent hover:bg-accent/80 text-accent-foreground shadow-[0_0_20px_rgba(217,70,239,0.3)]"
                        onClick={() => {
                          bundle.gameIds.forEach((id: number) => {
                            const game = allGames.find(g => g.id === String(id));
                            if (game) {
                              // Override price with proportionate discount for simplicity in cart
                              const discountedItem = { ...game, price: game.price * (1 - bundle.discountPercentage/100) };
                              cartDispatch({ type: "ADD_ITEM", payload: discountedItem });
                            }
                          });
                        }}
                      >
                        Add Bundle to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations Section */}
        {user && recommendations.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Recommended For You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((game) => (
                <ExpandableGameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Games */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Featured Games</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <ExpandableGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* New Releases */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">New Releases</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newReleases.map((game) => (
              <ExpandableGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* All Games */}
        <section>
          <h2 className="text-3xl font-bold mb-8">All Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allGames.map((game) => (
              <ExpandableGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </div>

      <AIPosterStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
      />
    </div>
  );
}

