import { useState, useEffect } from "react";
import { StarRating } from "@/components/StarRating";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Gamepad2, MonitorPlay, Settings2, MessageSquare, ChevronDown, ChevronUp, PlayCircle, PackagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { TiltCard } from "./TiltCard";
import { MagneticButton } from "./MagneticButton";

interface ExpandableGameCardProps {
  game: {
    id: string;
    title: string;
    price: number;
    rating: number;
    image: string;
    category: string;
  };
  mode?: "store" | "library";
  onLaunch?: (id: string) => void;
}

export function ExpandableGameCard({ game, mode = "store", onLaunch }: ExpandableGameCardProps) {
  const displayPrice = typeof game.price === 'number' ? game.price : parseFloat(String(game.price).replace(/[^0-9.]/g, '')) || 0;
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"media" | "specs" | "reviews" | "dlc">("media");
  const [dlcs, setDlcs] = useState<any[]>([]);
  const [hasFetchedDlcs, setHasFetchedDlcs] = useState(false);
  
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(game.id);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const prefetchDlcs = () => {
    if (!hasFetchedDlcs) {
      setHasFetchedDlcs(true);
      fetch(`http://localhost:3000/api/economy/dlc/${game.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.dlcs) setDlcs(data.dlcs);
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      prefetchDlcs();
    }
  }, [isExpanded, game.id]);

  return (
    <TiltCard disabled={isExpanded} className={isExpanded ? "md:col-span-2 lg:col-span-4 z-20" : ""}>
      <div 
        onMouseEnter={prefetchDlcs}
        className={cn(
          "group relative flex flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-primary/50 shadow-lg hover:shadow-primary/20",
          isExpanded ? "scale-[1.02] shadow-2xl shadow-primary/30 border-primary" : ""
        )}
      >
      {/* Base Card Header (Always Visible) */}
      <div className={cn(
        "relative w-full overflow-hidden flex",
        isExpanded ? "h-64 md:h-96" : "h-48 flex-col"
      )}>
        {/* Banner Image */}
        <div className={cn(
          "relative overflow-hidden",
          isExpanded ? "w-full md:w-2/3 h-full" : "w-full h-full"
        )}>
          <ImageWithFallback
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
        </div>

        {/* Base Info */}
        <div className={cn(
          "absolute flex flex-col justify-end p-5",
          isExpanded ? "bottom-0 left-0 w-full md:w-2/3 h-full" : "inset-0"
        )}>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                {game.category}
              </span>
              <h3 className={cn("font-bold text-foreground line-clamp-1", isExpanded ? "text-4xl mb-2" : "text-xl")}>
                {game.title}
              </h3>
              <StarRating rating={game.rating} />
            </div>
          </div>
        </div>

        {/* Expanded View Right Panel (Price & Actions) */}
        {isExpanded && (
          <div className="hidden md:flex w-1/3 bg-background/95 backdrop-blur border-l border-border flex-col p-8 justify-center gap-6">
            {mode === "store" ? (
              <>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">Purchase</p>
                  <p className="text-5xl font-black text-primary">${displayPrice.toFixed(2)}</p>
                </div>
                
                <div className="space-y-3 w-full">
                  <MagneticButton className="w-full">
                    <Button 
                      onClick={(e) => { e.stopPropagation(); addToCart(game as any); }}
                      className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    >
                      Add to Cart
                    </Button>
                  </MagneticButton>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isWishlisted) {
                        removeFromWishlist(game.id);
                      } else {
                        addToWishlist(game.id);
                      }
                    }}
                    className={cn(
                      "w-full h-12 transition-all",
                      isWishlisted ? "bg-primary/20 border-primary text-primary" : "hover:border-primary"
                    )}
                  >
                    {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-6 h-full w-full">
                <MagneticButton className="w-full">
                  <Button 
                    onClick={(e) => { e.stopPropagation(); onLaunch?.(game.id); }}
                    className="w-full h-16 text-xl font-black uppercase tracking-wider bg-green-500 hover:bg-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all hover:scale-105"
                  >
                    <PlayCircle className="w-6 h-6 mr-3" />
                    Launch Game
                  </Button>
                </MagneticButton>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">Time Played</p>
                  <p className="text-2xl font-bold text-foreground">{Math.floor(Math.random() * 100) + 10} Hours</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions (Collapsed View Only) */}
      {!isExpanded && (
        <div className="p-5 flex items-center justify-between border-t border-border/50 bg-background/50">
          {mode === "store" ? (
            <>
              <span className="text-xl font-bold text-primary">${displayPrice.toFixed(2)}</span>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); addToCart(game as any); }}
                >
                  Add
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-between items-center">
              <span className="text-sm font-semibold text-muted-foreground">Owned</span>
              <Button 
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                onClick={(e) => { e.stopPropagation(); onLaunch?.(game.id); }}
              >
                Launch
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Expand Toggle Button */}
      <button 
        onClick={toggleExpand}
        className="w-full py-2 bg-secondary/30 hover:bg-secondary/60 flex justify-center items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors border-y border-border"
      >
        {isExpanded ? (
          <><ChevronUp className="w-4 h-4" /> CLOSE DETAILS</>
        ) : (
          <><ChevronDown className="w-4 h-4" /> VIEW DETAILS</>
        )}
      </button>

      {/* Expanded Inline Drawer (Tabs: Media, Specs, Reviews) */}
      <div className={cn(
        "transition-all duration-500 ease-in-out overflow-hidden bg-background/95",
        isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-6 md:p-8">
          
          {/* Tabs Navigation */}
          <div className="flex gap-2 mb-8 border-b border-border pb-px">
            <button
              onClick={() => setActiveTab("media")}
              className={cn("px-6 py-3 font-semibold text-sm transition-all border-b-2", activeTab === "media" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
            >
              <div className="flex items-center gap-2"><MonitorPlay className="w-4 h-4" /> Media</div>
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={cn("px-6 py-3 font-semibold text-sm transition-all border-b-2", activeTab === "specs" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
            >
              <div className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> System Specs</div>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={cn("px-6 py-3 font-semibold text-sm transition-all border-b-2", activeTab === "reviews" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
            >
              <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Reviews</div>
            </button>
            {dlcs.length > 0 && (
              <button
                onClick={() => setActiveTab("dlc")}
                className={cn("px-6 py-3 font-semibold text-sm transition-all border-b-2", activeTab === "dlc" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
              >
                <div className="flex items-center gap-2"><PackagePlus className="w-4 h-4" /> Expansions <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">{dlcs.length}</span></div>
              </button>
            )}
          </div>

          {/* Tab Contents */}
          <div className="relative min-h-[300px]">
            
            {/* MEDIA TAB */}
            {activeTab === "media" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="snap-center flex-shrink-0 w-[85%] md:w-[70%] relative rounded-xl overflow-hidden group cursor-pointer border border-border">
                    <img src={game.image} alt="Gameplay Trailer" className="w-full h-64 md:h-80 object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-background/30 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-primary/50 transition-all duration-300">
                        <PlayCircle className="w-10 h-10 text-white translate-x-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-black/60 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-md">4K</span>
                      <span className="bg-black/60 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-md">60 FPS</span>
                    </div>
                  </div>
                  <div className="snap-center flex-shrink-0 w-[85%] md:w-[70%] relative rounded-xl overflow-hidden border border-border group cursor-pointer">
                    <img src={game.image} alt="Screenshot 1" className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="snap-center flex-shrink-0 w-[85%] md:w-[70%] relative rounded-xl overflow-hidden border border-border group cursor-pointer">
                    <img src={game.image} alt="Screenshot 2" className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0" />
                  </div>
                </div>
              </div>
            )}

            {/* SPECS TAB */}
            {activeTab === "specs" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-primary mb-4 border-b border-primary/20 pb-2">Minimum Requirements</h4>
                  <ul className="space-y-4 text-sm">
                    <li className="grid grid-cols-3 gap-2 items-center"><span className="text-muted-foreground font-semibold">OS:</span> <span className="col-span-2">Windows 10 64-bit</span></li>
                    <li className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-muted-foreground font-semibold">Processor:</span> 
                      <div className="col-span-2 flex items-center gap-3">
                        <span className="w-24 text-right">i5-8400</span>
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden border border-border"><div className="h-full bg-primary/60 w-[40%] rounded-full shadow-[0_0_10px_rgba(0,255,204,0.5)]"></div></div>
                      </div>
                    </li>
                    <li className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-muted-foreground font-semibold">Graphics:</span> 
                      <div className="col-span-2 flex items-center gap-3">
                        <span className="w-24 text-right">GTX 1060</span>
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden border border-border"><div className="h-full bg-primary/60 w-[50%] rounded-full shadow-[0_0_10px_rgba(0,255,204,0.5)]"></div></div>
                      </div>
                    </li>
                    <li className="grid grid-cols-3 gap-2 items-center"><span className="text-muted-foreground font-semibold">Memory:</span> <span className="col-span-2">8 GB RAM</span></li>
                    <li className="grid grid-cols-3 gap-2 items-center"><span className="text-muted-foreground font-semibold">Storage:</span> <span className="col-span-2">60 GB available</span></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-[#10b981] mb-4 border-b border-[#10b981]/20 pb-2">Recommended Settings</h4>
                  <ul className="space-y-4 text-sm">
                    <li className="grid grid-cols-3 gap-2 items-center"><span className="text-muted-foreground font-semibold">OS:</span> <span className="col-span-2">Windows 11 64-bit</span></li>
                    <li className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-muted-foreground font-semibold">Processor:</span> 
                      <div className="col-span-2 flex items-center gap-3">
                        <span className="w-24 text-right">i7-12700K</span>
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden border border-border"><div className="h-full bg-[#10b981] w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div></div>
                      </div>
                    </li>
                    <li className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-muted-foreground font-semibold">Graphics:</span> 
                      <div className="col-span-2 flex items-center gap-3">
                        <span className="w-24 text-right">RTX 3080</span>
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden border border-border"><div className="h-full bg-[#10b981] w-[90%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div></div>
                      </div>
                    </li>
                    <li className="grid grid-cols-3 gap-2 items-center"><span className="text-muted-foreground font-semibold">Memory:</span> <span className="col-span-2">16 GB RAM</span></li>
                    <li className="grid grid-cols-3 gap-2 items-center"><span className="text-muted-foreground font-semibold">Storage:</span> <span className="col-span-2">60 GB NVMe SSD</span></li>
                  </ul>
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between shadow-[inset_0_0_20px_rgba(0,255,204,0.05)]">
                  <div>
                    <h4 className="text-lg font-bold text-primary mb-1">Overwhelmingly Positive</h4>
                    <p className="text-xs text-muted-foreground">Based on 24,591 user reviews across all platforms.</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-primary">96%</span>
                    <div className="w-32 h-2 bg-background rounded-full mt-2 border border-border overflow-hidden">
                      <div className="h-full bg-primary w-[96%] shadow-[0_0_10px_rgba(0,255,204,0.8)]"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">X</div>
                      <div>
                        <p className="font-bold text-sm">Xx_GamerKing_xX</p>
                        <StarRating rating={5} />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">Absolutely masterpiece. The graphics are stunning and the combat loop is incredibly satisfying. A must play for fans of the genre.</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">N</div>
                      <div>
                        <p className="font-bold text-sm">NeonNinja</p>
                        <StarRating rating={4} />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">Great game overall. Encountered a few bugs in the physics engine, but the developers have been pushing patches quickly.</p>
                  </div>
                </div>
              </div>
            )}

            {/* DLC TAB */}
            {activeTab === "dlc" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-4">
                {dlcs.map(dlc => (
                  <div key={dlc.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
                    <img src={dlc.image} alt={dlc.title} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1 flex flex-col">
                      <h4 className="font-bold text-lg leading-tight mb-1">{dlc.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{dlc.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-primary">${dlc.price.toFixed(2)}</span>
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            cartDispatch({ type: "ADD_ITEM", payload: { ...dlc, id: `dlc-${dlc.id}`, category: 'DLC' } });
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
    </TiltCard>
  );
}
