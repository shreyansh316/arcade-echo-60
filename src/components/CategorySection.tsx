import { Link } from "react-router-dom";
import { Car, Sword, Crown, Gamepad2, Target, Rocket } from "lucide-react";

const categories = [
  { name: "Action", icon: Sword, path: "/category/action", className: "bento-item-large bg-gradient-to-br from-purple-900/40 to-black/80 border-purple-500/30 text-purple-400" },
  { name: "RPG", icon: Crown, path: "/category/rpg", className: "bento-item-tall bg-gradient-to-br from-green-900/40 to-black/80 border-green-500/30 text-green-400" },
  { name: "Racing", icon: Car, path: "/category/racing", className: "bento-item-wide bg-gradient-to-br from-orange-900/40 to-black/80 border-orange-500/30 text-orange-400" },
  { name: "Shooter", icon: Target, path: "/category/shooter", className: "bento-item bg-gradient-to-br from-red-900/40 to-black/80 border-red-500/30 text-red-400" },
  { name: "Sci-Fi", icon: Rocket, path: "/category/scifi", className: "bento-item bg-gradient-to-br from-cyan-900/40 to-black/80 border-cyan-500/30 text-cyan-400" },
  { name: "Adventure", icon: Gamepad2, path: "/category/adventure", className: "bento-item-wide bg-gradient-to-br from-blue-900/40 to-black/80 border-blue-500/30 text-blue-400" },
];

export const CategorySection = () => {
  return (
    <section className="py-16 max-w-[98%] mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-1 bg-primary rounded-full"></div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-wide uppercase">Explore the Grid</h2>
      </div>
      <div className="bento-grid">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={category.path}
            className={`group bento-item glass border flex flex-col justify-end p-6 md:p-8 hover:scale-[1.02] transition-transform duration-300 ${category.className}`}
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <category.icon className="w-16 h-16 md:w-20 md:h-20 mb-auto opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
            
            <div className="mt-4">
              <span className="text-2xl md:text-3xl font-display font-bold uppercase tracking-widest text-white group-hover:text-current transition-colors drop-shadow-md">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
