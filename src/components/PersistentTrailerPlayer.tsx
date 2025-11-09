import React, { useState, useEffect } from "react";
import { useTrailerPlayer } from "@/contexts/TrailerPlayerContext";
import { useNavigate } from "react-router-dom";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const PersistentTrailerPlayer: React.FC = () => {
  const {
    activeTrailer,
    isPlaying,
    isMinimized,
    isMuted,
    closeTrailer,
    togglePlay,
    toggleMinimize,
    toggleMute,
  } = useTrailerPlayer();

  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!activeTrailer || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 200);
    return () => clearInterval(interval);
  }, [activeTrailer, isPlaying]);

  if (!activeTrailer) return null;

  return (
    <div
      className={`fixed z-[250] transition-all duration-300 ease-out shadow-[0_0_50px_rgba(6,182,212,0.35)] rounded-2xl overflow-hidden border border-cyan-400/50 bg-[#0c091a]/95 backdrop-blur-2xl ${
        isMinimized
          ? "bottom-5 right-5 w-64 h-16 flex items-center p-2"
          : "bottom-6 right-6 w-80 sm:w-96 flex flex-col"
      }`}
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/60 border-b border-white/10 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-display font-bold text-white truncate text-[11px]">
            {activeTrailer.title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleMinimize}
            className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white"
            title={isMinimized ? "Expand PiP" : "Minimize PiP"}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={closeTrailer}
            className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white"
            title="Close Trailer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Simulated 4K Video Player Viewport */}
          <div className="relative aspect-video w-full bg-black overflow-hidden group">
            <img
              src={activeTrailer.thumbnail}
              alt={activeTrailer.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? "scale-105" : "scale-100"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>

            {/* In-Video Badges */}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] font-mono text-cyan-300">
                4K HDR PiP
              </span>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-3 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => navigate(`/game/${activeTrailer.gameId}`)}
              className="h-7 px-2.5 text-[11px] font-bold bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            >
              View Game <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
