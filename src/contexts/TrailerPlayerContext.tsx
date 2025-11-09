import React, { createContext, useContext, useState } from "react";

export interface TrailerData {
  gameId: string;
  title: string;
  thumbnail: string;
  videoPreviewUrl: string;
  price: string;
}

interface TrailerPlayerContextType {
  activeTrailer: TrailerData | null;
  isPlaying: boolean;
  isMinimized: boolean;
  isMuted: boolean;
  playTrailer: (data: TrailerData) => void;
  closeTrailer: () => void;
  togglePlay: () => void;
  toggleMinimize: () => void;
  toggleMute: () => void;
}

const TrailerPlayerContext = createContext<TrailerPlayerContextType | undefined>(undefined);

export const TrailerPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTrailer, setActiveTrailer] = useState<TrailerData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const playTrailer = (data: TrailerData) => {
    setActiveTrailer(data);
    setIsPlaying(true);
    setIsMinimized(false);
  };

  const closeTrailer = () => {
    setActiveTrailer(null);
  };

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const toggleMinimize = () => setIsMinimized((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <TrailerPlayerContext.Provider
      value={{
        activeTrailer,
        isPlaying,
        isMinimized,
        isMuted,
        playTrailer,
        closeTrailer,
        togglePlay,
        toggleMinimize,
        toggleMute,
      }}
    >
      {children}
    </TrailerPlayerContext.Provider>
  );
};

export const useTrailerPlayer = () => {
  const context = useContext(TrailerPlayerContext);
  if (!context) {
    throw new Error("useTrailerPlayer must be used within a TrailerPlayerProvider");
  }
  return context;
};
