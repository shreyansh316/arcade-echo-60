import { Header } from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  FlaskConical, 
  Car, 
  Sword, 
  Crown, 
  Gamepad2, 
  Target, 
  Rocket,
  Trophy,
  Clock,
  TrendingUp,
  Star,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ParticleBackground";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { allGames } from "@/data/games";
import { ExpandableGameCard } from "@/components/ExpandableGameCard";

const playtimeData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.8 },
  { name: 'Wed', hours: 1.2 },
  { name: 'Thu', hours: 4.5 },
  { name: 'Fri', hours: 6.0 },
  { name: 'Sat', hours: 8.5 },
  { name: 'Sun', hours: 5.2 },
];

const categoryThemes: Record<string, {
  bg: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}> = {
  scifi: {
    bg: "from-cyan-950/40 via-cyan-900/20",
    gradient: "radial-gradient(circle at 50% 0%, hsl(180 100% 30% / 0.3), transparent 70%)",
    icon: FlaskConical,
    title: "Science Lab",
    description: "Welcome to your research facility"
  },
  racing: {
    bg: "from-orange-950/40 via-orange-900/20",
    gradient: "radial-gradient(circle at 50% 0%, hsl(25 100% 30% / 0.3), transparent 70%)",
    icon: Car,
    title: "Racing Garage",
    description: "Your speed sanctuary"
  },
  action: {
    bg: "from-red-950/40 via-red-900/20",
    gradient: "radial-gradient(circle at 50% 0%, hsl(0 100% 30% / 0.3), transparent 70%)",
    icon: Sword,
    title: "Combat Arena",
    description: "Warrior's headquarters"
  },
  rpg: {
    bg: "from-green-950/40 via-green-900/20",
    gradient: "radial-gradient(circle at 50% 0%, hsl(120 100% 30% / 0.3), transparent 70%)",
    icon: Crown,
    title: "Royal Court",
    description: "Your kingdom awaits"
  },
  adventure: {
    bg: "from-blue-950/40 via-blue-900/20",
    gradient: "radial-gradient(circle at 50% 0%, hsl(220 100% 30% / 0.3), transparent 70%)",
    icon: Gamepad2,
    title: "Explorer's Base",
    description: "Adventure central"
  },
  shooter: {
    bg: "from-yellow-950/40 via-yellow-900/20",
    gradient: "radial-gradient(circle at 50% 0%, hsl(45 100% 30% / 0.3), transparent 70%)",
    icon: Target,
    title: "Training Grounds",
    description: "Sharpshooter's domain"
  },
};

export default function DashboardPage() {
  const { user, getMostPlayedCategory } = useUser();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  const category = getMostPlayedCategory();
  const theme = categoryThemes[category] || categoryThemes.action;
  const Icon = theme.icon;

  // Recommendations logic
  const recommendedGames = allGames.filter(g => g.category === category).slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* 
        The Parallax Particle Engine 
        It moves down at 0.2x speed as you scroll down
      */}
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none transition-transform duration-75 ease-linear"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <ParticleBackground />
      </div>

      <Header />

      <div className="container px-4 py-12 relative z-10">
        
        {/* Immersive Hero Section */}
        <div className="mb-16 text-center pt-8">
          <div className="flex justify-center mb-6">
            <div className="p-8 rounded-full bg-card/20 backdrop-blur-xl border border-primary/30 glow-strong shadow-2xl hover:scale-110 transition-transform duration-500 cursor-pointer">
              <Icon className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            </div>
          </div>
          <h1 className="text-6xl font-black mb-3 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient">
            {theme.title}
          </h1>
          <p className="text-2xl text-muted-foreground/80 font-light tracking-wide mb-2">{theme.description}</p>
          <p className="text-lg text-primary/80 font-semibold tracking-widest uppercase">Commander {user.username}</p>
        </div>

        {/* Asymmetric Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 mb-12 auto-rows-[250px]">
          
          {/* Main Featured Spotlight (Spans 2 columns and 2 rows on desktop) */}
          <div className="md:col-span-2 md:row-span-2 p-8 rounded-3xl border border-primary/30 bg-card/40 backdrop-blur-xl relative overflow-hidden group hover:border-primary/60 transition-all duration-500 shadow-2xl flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" 
              alt="Featured Game" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
            />
            <div className="relative z-20">
              <div className="bg-primary/20 text-primary border border-primary/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold inline-block mb-3 uppercase tracking-wider">
                Trending Now
              </div>
              <h2 className="text-4xl font-bold mb-2">Cyber Neon 2077</h2>
              <p className="text-muted-foreground mb-6 max-w-md">Experience the ultimate sci-fi adventure with breathtaking visuals and intense combat.</p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <Play className="w-5 h-5 mr-2" /> Play Now
              </Button>
            </div>
          </div>

          {/* Top Right Widget */}
          <div className="md:col-span-2 p-6 rounded-3xl border border-border bg-card/40 backdrop-blur-xl hover:border-primary/30 transition-all duration-500 group flex items-center gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Achievements</h3>
              <p className="text-muted-foreground mb-3 text-sm">You unlocked 3 rare trophies this week.</p>
              <Button onClick={() => navigate("/achievements")} variant="link" className="p-0 h-auto text-primary group-hover:translate-x-2 transition-transform">
                View All <span className="ml-1">→</span>
              </Button>
            </div>
          </div>

          {/* Bottom Middle Widget */}
          <div className="p-6 rounded-3xl border border-border bg-card/40 backdrop-blur-xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
            <Gamepad2 className="w-8 h-8 text-accent mb-4" />
            <div>
              <h3 className="text-xl font-bold mb-1">My Library</h3>
              <p className="text-muted-foreground text-sm mb-4">42 Games</p>
              <Button onClick={() => navigate("/my-games")} variant="secondary" className="w-full bg-secondary/50 backdrop-blur group-hover:bg-secondary">
                Browse
              </Button>
            </div>
          </div>

          {/* Bottom Right Widget */}
          <div className="p-6 rounded-3xl border border-border bg-card/40 backdrop-blur-xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all" />
            <Clock className="w-8 h-8 text-yellow-500 mb-4" />
            <div>
              <h3 className="text-xl font-bold mb-1">Play Time</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {Object.values(user.playTime || {}).reduce((a, b) => a + b, 0)} mins total
              </p>
              <Button onClick={() => navigate("/profile")} variant="secondary" className="w-full bg-secondary/50 backdrop-blur group-hover:bg-secondary">
                View Stats
              </Button>
            </div>
          </div>
          
        </div>

        {/* Analytics & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Playtime Area Chart */}
          <div className="lg:col-span-2 p-8 rounded-3xl border border-primary/30 bg-card/40 backdrop-blur-xl relative overflow-hidden group hover:border-primary/60 transition-all duration-500 shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="text-primary w-6 h-6" /> Playtime History
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={playtimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="p-8 rounded-3xl border border-border bg-card/40 backdrop-blur-xl relative overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Clock className="text-accent w-6 h-6" /> Recent Activity
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 hide-scrollbar">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Achievement Unlocked</p>
                  <p className="text-muted-foreground text-xs">"Cyber Hacker" in Cyber Rebellion 2077</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Session Ended</p>
                  <p className="text-muted-foreground text-xs">Played Neon Velocity for 3.2 hours</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">Yesterday</p>
                </div>
              </div>
              <div className="flex gap-4 opacity-50">
                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Reviewed Game</p>
                  <p className="text-muted-foreground text-xs">Left a 5-star review on Galactic Pioneers</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-black uppercase tracking-widest">Recommended For You</h2>
          </div>
          <p className="text-muted-foreground mb-8 text-lg">Because you play a lot of <strong className="text-primary capitalize">{category}</strong> games.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedGames.map(game => (
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
                mode="store"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
