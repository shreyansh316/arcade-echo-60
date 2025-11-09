import { Header } from "@/components/Header";
import { useWishlist } from "@/contexts/WishlistContext";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGameById } from "@/data/games";
import { GameCard } from "@/components/GameCard";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const wishlistGames = wishlist
    .map((id) => getGameById(id))
    .filter((game) => game !== undefined);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary fill-current" />
          My Wishlist
        </h1>
        {wishlistGames.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              Your wishlist is empty
            </p>
            <Button onClick={() => navigate("/store")}>Browse Store</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistGames.map((game) => (
              <div key={game.id} className="glitch-on-viewport">
                <GameCard {...game} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

