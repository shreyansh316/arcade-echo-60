import React, { createContext, useContext, useState, useEffect } from "react";

interface AmbientThemeContextType {
  dominantColor: string;
  setDominantColor: (color: string) => void;
  resetDominantColor: () => void;
}

const defaultColor = "#06b6d4";

const AmbientThemeContext = createContext<AmbientThemeContextType | undefined>(undefined);

export const AmbientThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dominantColor, setDominantColorState] = useState<string>(defaultColor);

  const setDominantColor = (color: string) => {
    setDominantColorState(color);
  };

  const resetDominantColor = () => {
    setDominantColorState(defaultColor);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--ambient-accent", dominantColor);
  }, [dominantColor]);

  return (
    <AmbientThemeContext.Provider
      value={{
        dominantColor,
        setDominantColor,
        resetDominantColor,
      }}
    >
      {/* Global Ambient Background Aura */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000 ease-out opacity-25"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${dominantColor}40 0%, transparent 65%)`,
        }}
      />
      {children}
    </AmbientThemeContext.Provider>
  );
};

export const useAmbientTheme = () => {
  const context = useContext(AmbientThemeContext);
  if (!context) {
    throw new Error("useAmbientTheme must be used within an AmbientThemeProvider");
  }
  return context;
};
