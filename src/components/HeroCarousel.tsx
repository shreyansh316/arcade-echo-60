import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string;
}

const games: GameSlide[] = [
  {
    id: 1,
    title: "CYBER REBELLION 2077",
    description: "Welcome to Neo-Detroit. Upgrade your neon-ware or get left in the scrap heap. Dropping Q4.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop",
    tag: "NEW RELEASE",
  },
  {
    id: 2,
    title: "MYSTIC LEGENDS",
    description: "Shatter the archaic runes. A dark fantasy RPG where every choice carves your destiny in stone.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop",
    tag: "TRENDING",
  },
  {
    id: 3,
    title: "NEON DRIFTER",
    description: "Push 300mph on hyper-ways. If you aren't first, you're roadkill.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop",
    tag: "BEST SELLER",
  },
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioningRef.current) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % games.length);
          setIsTransitioning(false);
        }, 600);
      }
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
      setIsTransitioning(false);
    }, 600);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
      setIsTransitioning(false);
    }, 600);
  };

  const currentGame = games[currentIndex];

  // Magnetic button effect handler
  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.style.transform = `translate(0px, 0px)`;
  };

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden rounded-3xl mx-auto my-4 max-w-[98%] shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/5">
      {/* Background with subtle Ken Burns scale effect */}
      <div
        key={currentIndex} // forces re-render of animation
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 animate-in fade-in zoom-in-105 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        style={{ backgroundImage: `url(${currentGame.image})`, animationDuration: '10s', animationFillMode: 'forwards' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      <div className={`relative h-full flex flex-col justify-end p-8 md:p-16 lg:p-24 ${isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"} transition-all duration-700 ease-out`}>
        <div className="flex flex-col items-start max-w-4xl">
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary border border-primary/50 backdrop-blur-md rounded-full text-sm font-bold tracking-widest mb-6 glow">
            {currentGame.tag}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 leading-tight drop-shadow-2xl">
            {currentGame.title}
          </h1>
          <p className="text-lg md:text-2xl text-foreground/80 mb-10 max-w-2xl font-sans font-medium leading-relaxed">
            {currentGame.description}
          </p>
          <div className="flex gap-4 md:gap-6">
            <Button 
              size="lg" 
              className="magnetic-btn bg-primary hover:bg-primary text-primary-foreground font-bold px-10 py-6 text-lg rounded-xl glow-strong"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              [ BUY NOW ]
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="magnetic-btn glass border-primary/50 text-foreground hover:bg-primary/20 font-bold px-10 py-6 text-lg rounded-xl transition-colors"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              EXPLORE
            </Button>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full glass border border-white/10 hover:bg-white/10 transition-all text-white/80 hover:text-white"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full glass border border-white/10 hover:bg-white/10 transition-all text-white/80 hover:text-white"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning && index !== currentIndex) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }
            }}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentIndex ? "bg-primary w-12 glow" : "bg-white/30 w-3 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
