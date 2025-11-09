import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Users, Play, Gamepad2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractivePosterCardProps {
  title: string;
  category: string;
  price: string;
  bgLayerUrl: string;
  charLayerUrl: string;
  dominantColor?: string;
  friendsPlaying?: { name: string; avatar: string }[];
  onPlayTrailer?: () => void;
  onLaunchDemo?: () => void;
}

export const InteractivePosterCard: React.FC<InteractivePosterCardProps> = ({
  title,
  category,
  price,
  bgLayerUrl,
  charLayerUrl,
  dominantColor = "#06b6d4",
  friendsPlaying = [
    { name: "Xx_GamerKing_xX", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=King" },
    { name: "NeonNinja", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja" },
  ],
  onPlayTrailer,
  onLaunchDemo,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Mouse coordinate physics for 3D Parallax Depth Slicing
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Layer offsets: Background moves slightly, Character moves moderately, Foreground text moves strongest
  const bgX = useTransform(smoothMouseX, [-1, 1], [-8, 8]);
  const bgY = useTransform(smoothMouseY, [-1, 1], [-8, 8]);

  const charX = useTransform(smoothMouseX, [-1, 1], [15, -15]);
  const charY = useTransform(smoothMouseY, [-1, 1], [15, -15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = (e.clientY - rect.top) / rect.height * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        aspectRatio: isHovered ? "16/10" : "2/3",
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-full rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/10 select-none transition-shadow duration-500"
      style={{
        boxShadow: isHovered ? `0 0 45px ${dominantColor}50` : "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* Zero Layout Shift Blur-Up Placeholder Skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-[#0c081e] animate-pulse flex items-center justify-center z-0">
          <div className="w-12 h-12 rounded-full bg-white/10 animate-spin" />
        </div>
      )}

      {/* Layer 1: Background Environment (Parallax Deep Layer) */}
      <motion.div
        style={{ x: bgX, y: bgY, scale: 1.12 }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src={bgLayerUrl}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          className="w-full h-full object-cover filter brightness-90 group-hover:brightness-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080514] via-[#080514]/40 to-transparent" />
      </motion.div>

      {/* Layer 2: Hero Character Layer (Parallax Mid Layer) */}
      {charLayerUrl && (
        <motion.div
          style={{ x: charX, y: charY, scale: isHovered ? 1.08 : 1 }}
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center transition-transform duration-500"
        >
          <img
            src={charLayerUrl}
            alt="Character Layer"
            className="w-[85%] h-[85%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter drop-shadow-[0_0_20px_var(--ambient-accent)]"
          />
        </motion.div>
      )}

      {/* Dynamic Dominant Color Ambient Rim Lighting */}
      <div
        className="absolute inset-0 z-15 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${dominantColor}35 0%, transparent 70%)`,
        }}
      />

      {/* Layer 3: Foreground Content & Translucent Social Overlay */}
      <div className="relative z-20 h-full flex flex-col justify-between p-5 sm:p-6">
        {/* Top Tag & Trailer Action */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white font-mono text-[11px] font-bold tracking-wider uppercase border border-white/15">
            {category}
          </span>

          {onPlayTrailer && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayTrailer();
              }}
              className="p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:text-cyan-300 hover:scale-110 transition-all shadow-lg"
              title="Play 4K Trailer"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          )}
        </div>

        {/* Bottom Metadata & Integrated Social Proof */}
        <div className="space-y-3">
          {/* Integrated Translucent Social Proof Overlay */}
          {friendsPlaying.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-md">
              <div className="flex -space-x-2">
                {friendsPlaying.map((f, i) => (
                  <img
                    key={i}
                    src={f.avatar}
                    alt={f.name}
                    className="w-5 h-5 rounded-full border border-cyan-400"
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-gray-200 font-bold truncate max-w-[150px]">
                {friendsPlaying[0].name} is playing
              </span>
            </div>
          )}

          <div>
            <h3 className="text-2xl font-display font-black text-white leading-tight drop-shadow-md group-hover:text-cyan-300 transition-colors">
              {title}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-mono font-black text-white">{price}</span>
              <span className="text-[10px] font-mono text-green-400">Instant Cloud Play</span>
            </div>
          </div>

          {/* Action CTAs Revealed on Hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 pt-1"
            >
              {onLaunchDemo && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchDemo();
                  }}
                  className="flex-1 h-9 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  <Gamepad2 className="w-3.5 h-3.5 mr-1" /> 60s Demo
                </Button>
              )}
              <Button
                variant="outline"
                className="h-9 px-4 glass border-white/20 text-white text-xs rounded-xl"
              >
                <Zap className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Buy
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
