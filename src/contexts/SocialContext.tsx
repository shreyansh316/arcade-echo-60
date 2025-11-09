import React, { createContext, useContext, useState, useEffect } from "react";

export type FriendStatus = "online" | "away" | "offline" | "in-game";

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: FriendStatus;
  game?: string;
  inGameLocation?: string;
  isStreaming?: boolean;
  streamViewers?: number;
}

interface SocialContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  friends: Friend[];
  spectatingFriend: Friend | null;
  startSpectating: (friend: Friend) => void;
  stopSpectating: () => void;
}

const mockFriends: Friend[] = [
  {
    id: "1",
    username: "Xx_GamerKing_xX",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=King",
    status: "in-game",
    game: "Cyber Rebellion 2077",
    inGameLocation: "Night City - Arasaka Tower Rooftop [Boss Fight - Phase 2]",
    isStreaming: true,
    streamViewers: 142,
  },
  {
    id: "2",
    username: "NeonNinja",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja",
    status: "online",
  },
  {
    id: "3",
    username: "QuantumLeaper",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quantum",
    status: "in-game",
    game: "Star Command",
    inGameLocation: "Nebula Sector 9 - Planetary Blockade",
    isStreaming: true,
    streamViewers: 89,
  },
  {
    id: "4",
    username: "SpeedDemon",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Speed",
    status: "in-game",
    game: "Neon Velocity",
    inGameLocation: "Orbital Speed Track [Lap 2/3 - Position #1]",
  },
  {
    id: "5",
    username: "PixelPioneer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel",
    status: "offline",
  },
];

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [spectatingFriend, setSpectatingFriend] = useState<Friend | null>(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const startSpectating = (friend: Friend) => setSpectatingFriend(friend);
  const stopSpectating = () => setSpectatingFriend(null);

  return (
    <SocialContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        friends,
        spectatingFriend,
        startSpectating,
        stopSpectating,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error("useSocial must be used within a SocialProvider");
  }
  return context;
}
