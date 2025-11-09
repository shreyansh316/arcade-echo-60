import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Game {
  id: string;
  title: string;
  image: string;
  price: string;
  priceValue: number;
  rating: number;
  description?: string;
  category?: string;
}

interface CartContextType {
  cart: Game[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Game[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (game: Game) => {
    setCart((prev) => {
      const exists = prev.find((g) => g.id === game.id);
      if (exists) return prev;
      return [...prev, game];
    });
  };

  const removeFromCart = (gameId: string) => {
    setCart((prev) => prev.filter((g) => g.id !== gameId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, game) => total + game.priceValue, 0);
  };

  const getTotalItems = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

