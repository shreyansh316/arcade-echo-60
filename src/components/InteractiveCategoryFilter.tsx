import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Rocket,
  Crown,
  Car,
  Target,
  Gamepad2,
  Flame,
  Sparkles,
  Zap,
  Cpu,
} from "lucide-react";

interface CategoryItem {
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  color: string;
  bgGlow: string;
  borderGlow: string;
}

const categories: CategoryItem[] = [
  {
    name: "All Games",
    slug: "/store",
    icon: Flame,
    count: 24,
    color: "text-amber-400",
    bgGlow: "from-amber-500/20 to-orange-600/10",
    borderGlow: "hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]",
  },
  {
    name: "Sci-Fi & Cyber",
    slug: "/category/scifi",
    icon: Rocket,
    count: 8,
    color: "text-cyan-400",
    bgGlow: "from-cyan-500/20 to-blue-600/10",
    borderGlow: "hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
  },
  {
    name: "Action RPG",
    slug: "/category/rpg",
    icon: Crown,
    count: 6,
    color: "text-purple-400",
    bgGlow: "from-purple-500/20 to-pink-600/10",
    borderGlow: "hover:border-purple-400/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
  },
  {
    name: "Velocity Racing",
    slug: "/category/racing",
    icon: Car,
    count: 4,
    color: "text-emerald-400",
    bgGlow: "from-emerald-500/20 to-teal-600/10",
    borderGlow: "hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(52,211,153,0.25)]",
  },
  {
    name: "Tactical Shooter",
    slug: "/category/shooter",
    icon: Target,
    count: 5,
    color: "text-red-400",
    bgGlow: "from-red-500/20 to-rose-600/10",
    borderGlow: "hover:border-red-400/60 hover:shadow-[0_0_20px_rgba(248,113,113,0.25)]",
  },
  {
    name: "Adventure & Lore",
    slug: "/category/adventure",
    icon: Gamepad2,
    count: 6,
    color: "text-blue-400",
    bgGlow: "from-blue-500/20 to-indigo-600/10",
    borderGlow: "hover:border-blue-400/60 hover:shadow-[0_0_20px_rgba(96,165,250,0.25)]",
  },
];

interface InteractiveCategoryFilterProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const InteractiveCategoryFilter: React.FC<InteractiveCategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const location = useLocation();

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">
            Neural Genre Matrix
          </h3>
        </div>
        <span className="text-xs font-mono text-gray-400">
          Icon-Driven Filtering • 24 Curated Titles
        </span>
      </div>

      {/* Horizontal Scrollable Icon Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 hide-scrollbar">
        {categories.map((cat) => {
          const isActive =
            activeCategory === cat.name ||
            location.pathname === cat.slug ||
            (cat.slug === "/store" && location.pathname === "/store" && !activeCategory);

          return (
            <Link
              key={cat.name}
              to={cat.slug}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
              className={`group relative shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${cat.bgGlow} border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.3)] scale-[1.03]`
                  : `bg-card/40 border-white/10 hover:bg-gradient-to-r ${cat.bgGlow} ${cat.borderGlow} hover:scale-[1.02]`
              }`}
            >
              <div
                className={`p-2 rounded-xl bg-black/40 border border-white/10 ${cat.color} group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="w-5 h-5" />
              </div>

              <div>
                <div className="text-xs font-display font-bold text-white group-hover:text-cyan-300 transition-colors uppercase tracking-wider">
                  {cat.name}
                </div>
                <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-300">
                  {cat.count} Titles Online
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
