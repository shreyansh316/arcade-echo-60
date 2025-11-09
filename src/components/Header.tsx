import {
  Search,
  ShoppingCart,
  User,
  Users,
  Trophy,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  LogIn,
  Heart,
  Sparkles,
  Compass,
  Radio,
  Wifi,
  BrainCircuit,
} from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { GridTokenWallet } from "./GridTokenWallet";
import { TasteBreakerButton } from "./TasteBreakerButton";
import { NLPSearchModal } from "./NLPSearchModal";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useSocial } from "@/contexts/SocialContext";
import { useTasteProfile } from "@/contexts/TasteProfileContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, logout } = useUser();
  const { toggleSidebar, friends } = useSocial();
  const { openProfiler } = useTasteProfile();
  const [isNLPSearchOpen, setIsNLPSearchOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const onlineFriendsCount = friends.filter((f) => f.status !== "offline").length;

  return (
    <>
      <header className="sticky top-5 z-[100] w-[95%] max-w-[1360px] mx-auto bg-[#0d091e]/85 backdrop-blur-2xl border border-cyan-500/25 rounded-[24px] mb-8 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4 lg:gap-6">
            <Link to="/" className="flex items-center">
              <div className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity animate-gradient-shift"
                  style={{
                    animation: "gradientShift 4s ease-in-out infinite",
                  }}
                />
                <h1
                  className="text-2xl sm:text-3xl font-display font-black uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer relative z-10 animate-logo-float"
                  style={{
                    animation: "logoFloat 3s ease-in-out infinite",
                    textShadow: "0 0 30px rgba(6, 182, 212, 0.4)",
                  }}
                >
                  GAMEVERSE
                </h1>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              <Link
                to="/store"
                className="text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-cyan-300 hover:bg-white/5 transition-all px-3 py-1.5 rounded-xl"
              >
                Store
              </Link>

              {/* NLP Semantic Search Trigger */}
              <button
                onClick={() => setIsNLPSearchOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-300 transition-all cursor-pointer"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Search</span>
              </button>

              {/* AI Taste Profiler Feed Trigger */}
              <button
                onClick={openProfiler}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-purple-500/15 border border-purple-400/40 text-purple-300 hover:bg-purple-500/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Taste Feed</span>
              </button>

              {/* Taste Breaker Cosine Inversion Trigger */}
              <TasteBreakerButton />
            </nav>
          </div>

          {/* Right Actions Suite */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Edge Node Ping Telemetry */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-[10px] font-mono text-gray-300">
              <Wifi className="w-3 h-3 text-green-400" />
              <span>Edge: <strong className="text-green-400">11ms</strong></span>
            </div>

            {/* Grid Token Gamification Wallet */}
            <GridTokenWallet />

            {/* Social Hub Button with Live Friends Pulse */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="relative px-2.5 h-9 bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-gray-300 hover:text-white transition-all rounded-full flex items-center gap-1.5"
              title="Open Social Hub & Squad Party"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold hidden sm:inline text-cyan-300">
                {onlineFriendsCount} Online
              </span>
              {onlineFriendsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              )}
            </Button>

            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              <ShoppingCart className="w-4 h-4 text-gray-200" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-black font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* User Profile / Auth */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/40"
                >
                  <User className="w-4 h-4 text-gray-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-primary bg-[#0d091e]/95 backdrop-blur-2xl">
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-games")} className="cursor-pointer">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      My Games & Cloud Saves
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/achievements")} className="cursor-pointer">
                      <Trophy className="w-4 h-4 mr-2" />
                      Bounties & Quests
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/wishlist")} className="cursor-pointer">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile & GDPR Vault
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/login")} className="cursor-pointer">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <style>{`
          @keyframes gradientShift {
            0%, 100% {
              background: linear-gradient(135deg, #06b6d4, #a855f7, #ec4899, #6366f1);
            }
            25% {
              background: linear-gradient(135deg, #ec4899, #06b6d4, #6366f1, #a855f7);
            }
            50% {
              background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4, #6366f1);
            }
            75% {
              background: linear-gradient(135deg, #6366f1, #06b6d4, #a855f7, #ec4899);
            }
          }
          @keyframes logoFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-2px) rotate(0.5deg);
            }
          }
        `}</style>
      </header>

      {/* NLP Search Modal */}
      <NLPSearchModal
        isOpen={isNLPSearchOpen}
        onClose={() => setIsNLPSearchOpen(false)}
      />
    </>
  );
};
