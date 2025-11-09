import { Header } from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Trophy, Lock, CheckCircle2, Star, Zap, Target, Crown, Flame, Award, Gem } from "lucide-react";
import { getPurchasedGames } from "@/contexts/UserContext";
import { allGames } from "@/data/games";
import { BountyBoard } from "@/components/BountyBoard";

const achievements = [
  { 
    id: 1, 
    name: "First Steps", 
    description: "Play your first game", 
    icon: Star,
    unlocked: true,
    points: 10,
  },
  { 
    id: 2, 
    name: "Explorer", 
    description: "Play 10 different games", 
    icon: Zap,
    unlocked: false,
    points: 50,
    requirement: "Play 10 games",
  },
  { 
    id: 3, 
    name: "Marathon Runner", 
    description: "Play for 100 hours", 
    icon: Target,
    unlocked: false,
    points: 100,
    requirement: "100 hours played",
  },
  { 
    id: 4, 
    name: "Collector", 
    description: "Own 20 games", 
    icon: Gem,
    unlocked: false,
    points: 200,
    requirement: "Own 20 games",
  },
  { 
    id: 5, 
    name: "Speed Demon", 
    description: "Complete a racing game", 
    icon: Zap,
    unlocked: false,
    points: 75,
    requirement: "Complete a racing game",
  },
  { 
    id: 6, 
    name: "Action Hero", 
    description: "Play 5 action games", 
    icon: Flame,
    unlocked: false,
    points: 80,
    requirement: "Play 5 action games",
  },
  { 
    id: 7, 
    name: "RPG Master", 
    description: "Play 5 RPG games", 
    icon: Crown,
    unlocked: false,
    points: 80,
    requirement: "Play 5 RPG games",
  },
  { 
    id: 8, 
    name: "Shooter Pro", 
    description: "Play 5 shooter games", 
    icon: Target,
    unlocked: false,
    points: 80,
    requirement: "Play 5 shooter games",
  },
  { 
    id: 9, 
    name: "Adventure Seeker", 
    description: "Play 5 adventure games", 
    icon: Star,
    unlocked: false,
    points: 80,
    requirement: "Play 5 adventure games",
  },
  { 
    id: 10, 
    name: "Sci-Fi Enthusiast", 
    description: "Play 5 sci-fi games", 
    icon: Zap,
    unlocked: false,
    points: 80,
    requirement: "Play 5 sci-fi games",
  },
  { 
    id: 11, 
    name: "Completionist", 
    description: "Complete 10 games to 100%", 
    icon: Award,
    unlocked: false,
    points: 500,
    requirement: "100% complete 10 games",
  },
  { 
    id: 12, 
    name: "Early Adopter", 
    description: "Purchase a game on release day", 
    icon: Gem,
    unlocked: false,
    points: 150,
    requirement: "Buy a game on release",
  },
];

export default function AchievementsPage() {
  const { user, getPurchasedGames: getUserPurchasedGames } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const purchasedGames = getUserPurchasedGames();
  const totalPlayTime = Object.values(user.playTime || {}).reduce((a, b) => a + b, 0);
  const hoursPlayed = Math.floor(totalPlayTime / 60);

  // Calculate unlocked achievements based on user stats
  const updatedAchievements = achievements.map((achievement) => {
    let unlocked = achievement.unlocked;
    
    if (!unlocked) {
      switch (achievement.id) {
        case 2:
          unlocked = purchasedGames.length >= 10;
          break;
        case 3:
          unlocked = hoursPlayed >= 100;
          break;
        case 4:
          unlocked = purchasedGames.length >= 20;
          break;
        // Add more logic for other achievements
      }
    }
    
    return { ...achievement, unlocked };
  });

  const unlockedCount = updatedAchievements.filter(a => a.unlocked).length;
  const totalPoints = updatedAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-primary" />
            Achievements
          </h1>
          <p className="text-muted-foreground">
            Track your gaming accomplishments and unlock rewards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="text-sm text-muted-foreground">Unlocked</h3>
            </div>
            <p className="text-3xl font-bold">
              {unlockedCount} / {updatedAchievements.length}
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-primary" />
              <h3 className="text-sm text-muted-foreground">Total Points</h3>
            </div>
            <p className="text-3xl font-bold">{totalPoints}</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-sm text-muted-foreground">Completion</h3>
            </div>
            <p className="text-3xl font-bold">
              {Math.round((unlockedCount / updatedAchievements.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {updatedAchievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`p-6 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? "border-primary bg-card glow hover:scale-105"
                    : "border-border bg-card/50 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    achievement.unlocked 
                      ? "bg-primary/20" 
                      : "bg-muted"
                  }`}>
                    {achievement.unlocked ? (
                      <Icon className="w-8 h-8 text-primary" />
                    ) : (
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold line-clamp-1">{achievement.name}</h3>
                      {achievement.unlocked && (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {achievement.description}
                    </p>
                    {achievement.requirement && !achievement.unlocked && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Requirement: {achievement.requirement}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">
                        {achievement.points} pts
                      </span>
                      {achievement.unlocked && (
                        <span className="text-xs text-green-500 font-semibold">
                          Unlocked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Smart Contract Bug Bounty Board */}
        <div className="mt-12">
          <BountyBoard />
        </div>
      </div>
    </div>
  );
}
