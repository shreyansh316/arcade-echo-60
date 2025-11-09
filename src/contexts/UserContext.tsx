import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  mostPlayedCategory: string;
  playTime: Record<string, number>;
  purchasedGames: string[];
}

interface LoginHistory {
  username: string;
  email: string;
  lastLogin: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, email: string) => void;
  logout: () => void;
  updatePlayTime: (category: string, minutes: number) => void;
  getMostPlayedCategory: () => string;
  loginHistory: LoginHistory[];
  addPurchasedGame: (gameId: string) => void;
  getPurchasedGames: () => string[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure purchasedGames exists
      if (!parsed.purchasedGames) {
        parsed.purchasedGames = [];
      }
      return parsed;
    }
    return null;
  });

  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>(() => {
    const saved = localStorage.getItem("loginHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(`user_${user.email}`, JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("loginHistory", JSON.stringify(loginHistory));
  }, [loginHistory]);

  // Session Restoration
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          credentials: "include" // Send HttpOnly cookie
        });
        if (res.ok) {
          const data = await res.json();
          // Merge purchasedGames from backend
          if (!user || user.username !== data.user.username) {
             const loggedUser = {
                 id: data.user.id,
                 username: data.user.username,
                 email: `${data.user.username}@example.com`,
                 mostPlayedCategory: "action",
                 playTime: {},
                 purchasedGames: data.user.purchasedGames || []
             };
             setUser(loggedUser);
          } else if (user) {
             setUser({ ...user, purchasedGames: data.user.purchasedGames || [] });
          }
        }
      } catch (err) {
        console.log("Failed to restore session", err);
      }
    };
    restoreSession();
  }, []);

  const login = (username: string, email: string) => {
    const existingHistoryUser = loginHistory.find((h) => h.email === email);
    
    const updatedHistory = existingHistoryUser
      ? loginHistory.map((h) =>
          h.email === email
            ? { ...h, lastLogin: new Date().toISOString() }
            : h
        )
      : [
          ...loginHistory,
          { username, email, lastLogin: new Date().toISOString() },
        ].slice(-5); // Keep only last 5 logins

    setLoginHistory(updatedHistory);

    const savedUser = localStorage.getItem(`user_${email}`);
    const existingUser = savedUser ? JSON.parse(savedUser) : null;

    const newUser: User = existingUser || {
      id: email,
      username,
      email,
      mostPlayedCategory: "scifi",
      playTime: {},
      purchasedGames: [],
    };

    setUser(newUser);
    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
  };

  const updatePlayTime = (category: string, minutes: number) => {
    if (!user) return;
    
    setUser((prev) => {
      if (!prev) return prev;
      const currentPlayTime = prev.playTime || {};
      const newPlayTime = {
        ...currentPlayTime,
        [category]: (currentPlayTime[category] || 0) + minutes,
      };
      
      // Calculate most played category
      const entries = Object.entries(newPlayTime);
      if (entries.length > 0) {
        const mostPlayed = entries.reduce((a, b) =>
          newPlayTime[a[0]] > newPlayTime[b[0]] ? a : b
        );
        
        return {
          ...prev,
          playTime: newPlayTime,
          mostPlayedCategory: mostPlayed[0],
        };
      }

      return {
        ...prev,
        playTime: newPlayTime,
      };
    });
  };

  const getMostPlayedCategory = () => {
    if (!user) return "scifi";
    if (!user.playTime || Object.keys(user.playTime).length === 0) {
      return user.mostPlayedCategory || "scifi";
    }
    const entries = Object.entries(user.playTime);
    if (entries.length === 0) return user.mostPlayedCategory || "scifi";
    const mostPlayed = entries.reduce((a, b) =>
      user.playTime[a[0]] > user.playTime[b[0]] ? a : b
    );
    return mostPlayed[0] || user.mostPlayedCategory || "scifi";
  };

  const addPurchasedGame = (gameId: string) => {
    if (!user) return;
    
    setUser((prev) => {
      if (!prev) return prev;
      const updatedGames = [...(prev.purchasedGames || []), gameId];
      const updatedUser = {
        ...prev,
        purchasedGames: Array.from(new Set(updatedGames)), // Remove duplicates
      };
      localStorage.setItem(`user_${prev.email}`, JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const getPurchasedGames = () => {
    if (!user) return [];
    return user.purchasedGames || [];
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        updatePlayTime,
        getMostPlayedCategory,
        loginHistory,
        addPurchasedGame,
        getPurchasedGames,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

