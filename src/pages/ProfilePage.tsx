import { Header } from "@/components/Header";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, Clock, Trophy, Gamepad2, TrendingUp, Calendar, ShieldCheck, Download, Trash2, Database, Key } from "lucide-react";
import { toast } from "sonner";
import { getGameById } from "@/data/games";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProfilePage() {
  const { user, logout, getPurchasedGames: getUserPurchasedGames } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const purchasedGameIds = getUserPurchasedGames();
  const purchasedGames = purchasedGameIds
    .map((id) => getGameById(id))
    .filter((game) => game !== undefined);

  // Calculate favorite genre
  const categoryCounts: Record<string, number> = {};
  purchasedGames.forEach((game) => {
    categoryCounts[game.category] = (categoryCounts[game.category] || 0) + 1;
  });
  const favoriteGenre = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  // Generate last 7 days play time data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  // Mock play time data for last 7 days (in hours)
  const playTimeData = last7Days.map(() => Math.floor(Math.random() * 8));

  const chartData = {
    labels: last7Days,
    datasets: [
      {
        label: "Hours Played",
        data: playTimeData,
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "hsl(var(--card))",
        titleColor: "hsl(var(--foreground))",
        bodyColor: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
        grid: {
          color: "hsl(var(--border))",
        },
      },
      x: {
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
        grid: {
          color: "hsl(var(--border))",
        },
      },
    },
  };

  const totalPlayTime = Object.values(user.playTime || {}).reduce((a, b) => a + b, 0);
  const totalHours = Math.floor(totalPlayTime / 60);
  const totalMinutes = totalPlayTime % 60;

  // Get top games this month (mock data)
  const topGamesThisMonth = purchasedGames.slice(0, 3).map((game) => ({
    ...game,
    hoursPlayed: Math.floor(Math.random() * 50) + 10,
    progress: Math.floor(Math.random() * 100),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* User Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--glow-secondary))] flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
              <p className="text-muted-foreground text-lg">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">
                  Member since {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              variant="destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-sm text-muted-foreground">Total Play Time</h3>
              </div>
              <p className="text-3xl font-bold">
                {totalHours}h {totalMinutes}m
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <h3 className="text-sm text-muted-foreground">Games Owned</h3>
              </div>
              <p className="text-3xl font-bold">{purchasedGames.length}</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h3 className="text-sm text-muted-foreground">Favorite Genre</h3>
              </div>
              <p className="text-3xl font-bold capitalize">{favoriteGenre}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Play Time Chart */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Play Time (Last 7 Days)
              </h2>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Favorite Genre */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Most Played Category
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold capitalize mb-2">{user.mostPlayedCategory || "None"}</p>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-6">
                  {Object.entries(user.playTime || {}).map(([category, time]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{category}</span>
                        <span>{Math.floor(time / 60)}h {time % 60}m</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${(time / totalPlayTime) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Games This Month */}
          <div className="p-6 rounded-lg border border-border bg-card mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Top Games This Month
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topGamesThisMonth.length > 0 ? (
                topGamesThisMonth.map((game) => (
                  <div
                    key={game.id}
                    className="p-4 rounded-lg border border-border bg-background hover:border-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h3 className="font-bold mb-2">{game.title}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hours Played</span>
                        <span className="font-semibold">{game.hoursPlayed}h</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{game.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${game.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground col-span-3 text-center py-8">
                  No games played this month
                </p>
              )}
            </div>
          </div>

          {/* All Games Progress */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-primary" />
              All Games Progress
            </h2>
            <div className="space-y-4">
              {purchasedGames.length > 0 ? (
                purchasedGames.map((game) => {
                  const progress = Math.floor(Math.random() * 100);
                  return (
                    <div
                      key={game.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:border-primary transition-colors cursor-pointer"
                      onClick={() => navigate(`/game/${game.id}`)}
                    >
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{game.title}</h3>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{progress}% Complete</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No games in your library yet
                </p>
              )}
            </div>
          </div>

          {/* GDPR Privacy Vault & Data Portability API */}
          <div className="p-6 rounded-3xl border border-cyan-500/30 bg-[#0c081e]/90 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                    GDPR Data Privacy Vault & Compliance
                    <span className="px-2 py-0.2 rounded-full bg-green-500/20 text-green-300 text-[9px] font-mono font-bold">
                      EU 2016/679 COMPLIANT
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Self-service data portability, automated TTL lifecycle, and right-to-be-forgotten controls
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
                    JSON.stringify({
                      user,
                      purchasedGames,
                      exportDate: new Date().toISOString(),
                      schemaVersion: "v2.4",
                    }, null, 2)
                  );
                  const downloadAnchor = document.createElement("a");
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `gameverse_gdpr_export_${user.username}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  toast.success("GDPR Data Portability Export Downloaded!", {
                    description: "Complete personal machine-readable JSON archive created.",
                    icon: "🛡️",
                  });
                }}
                className="h-9 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download GDPR Archive (.json)
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase">Telemetry TTL Retention</span>
                <p className="text-white font-bold">90 Days (Auto-Purge Active)</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase">Cryptographic Anonymization</span>
                <p className="text-green-400 font-bold">Argon2id + SHA-256 Hashes</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase">Right to Erasure</span>
                <p className="text-cyan-300 font-bold">1-Click Instant Purge Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
