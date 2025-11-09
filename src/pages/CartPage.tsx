import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useGridTokens } from "@/contexts/GridTokenContext";
import { Trash2, ShoppingCart, Coins, Zap, ShieldCheck, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { tokens, getDiscountForTokens } = useGridTokens();
  const [applyTokens, setApplyTokens] = useState(false);
  const [applyMLDiscount, setApplyMLDiscount] = useState(true);
  const [discountSecondsLeft, setDiscountSecondsLeft] = useState(600); // 10 minutes
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setDiscountSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckout = () => {
    navigate("/transaction");
  };

  const subtotal = getTotalPrice();
  const mlDiscount = applyMLDiscount && discountSecondsLeft > 0 ? subtotal * 0.12 : 0;
  const tokenDiscount = applyTokens ? Math.min(subtotal - mlDiscount, getDiscountForTokens(tokens)) : 0;
  const taxableAmount = Math.max(0, subtotal - mlDiscount - tokenDiscount);
  const tax = taxableAmount * 0.1;
  const finalTotal = taxableAmount + tax;

  const minutes = Math.floor(discountSecondsLeft / 60);
  const seconds = discountSecondsLeft % 60;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#070510] text-foreground">
        <Header />
        <div className="container px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-cyan-400 opacity-75" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2 text-white">Your Cart is Empty</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Explore the grid to find neural RPGs, space fleet battles, or test instant cloud micro-demos!
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 h-12 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            >
              Browse Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070510] text-foreground">
      <Header />
      <div className="container max-w-[1300px] px-4 py-10">
        <h1 className="text-4xl font-display font-black text-white mb-8 uppercase tracking-wider flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-cyan-400" />
          Shopping Cart
        </h1>

        {/* Dynamic ML Pricing Banner */}
        {discountSecondsLeft > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-500/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500 text-black">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-white flex items-center gap-2">
                  ML Dynamic Cart Abandonment Perk Unlocked!
                </span>
                <p className="text-xs text-pink-200">
                  Save an extra 12% (${mlDiscount.toFixed(2)}) if order completed before timer expires.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-pink-400/40 text-pink-300 font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")} Remaining
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((game) => (
              <div
                key={game.id}
                className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-white/10 bg-[#0d091e]/90 hover:border-cyan-400/50 transition-all backdrop-blur-md"
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full sm:w-36 h-36 object-cover rounded-xl border border-white/10"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-display font-bold text-white mb-1">{game.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(game.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {game.description && (
                      <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                        {game.description}
                      </p>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                      Digital Neural License
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-mono font-black text-cyan-300">
                      {game.price}
                    </span>
                    <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Instant Cloud Activation
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-2xl border border-white/10 bg-[#0d091e]/95 backdrop-blur-2xl shadow-xl space-y-6">
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                Order Summary
              </h2>

              {/* Grid Token Store Credit Redemption Card */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-amber-300 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" /> {tokens} Grid Tokens
                  </span>
                  <span className="text-green-400">
                    Worth ${getDiscountForTokens(tokens)}.00
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={applyTokens}
                    onChange={(e) => setApplyTokens(e.target.checked)}
                    className="rounded border-amber-400 text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-gray-200 font-medium">
                    Redeem {tokens} GT (-${getDiscountForTokens(tokens)}.00)
                  </span>
                </label>
              </div>

              {/* Cost Calculations */}
              <div className="space-y-3 text-sm font-mono border-t border-white/10 pt-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {applyMLDiscount && mlDiscount > 0 && (
                  <div className="flex justify-between text-pink-400 font-bold">
                    <span>ML Dynamic Discount (12%)</span>
                    <span>-${mlDiscount.toFixed(2)}</span>
                  </div>
                )}

                {applyTokens && tokenDiscount > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Grid Tokens Discount</span>
                    <span>-${tokenDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Digital Service Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-xl font-display font-black text-white">
                    <span>Total</span>
                    <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                >
                  <Zap className="w-4 h-4 mr-2 fill-current" /> Proceed to Checkout
                </Button>

                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full glass border-white/10 hover:border-white/30 text-gray-300 text-xs rounded-xl"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
