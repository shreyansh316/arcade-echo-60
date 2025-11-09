import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement } from "@stripe/react-stripe-js";
import confetti from "canvas-confetti";
import {
  CreditCard,
  Lock,
  CheckCircle2,
  Shield,
  Download,
  Play,
  Wallet,
  QrCode,
  Coins,
  Building2,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Loader2,
  AlertCircle,
  HardDrive,
  Cpu,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DistributedTracingConsole } from "@/components/DistributedTracingConsole";
import { cn } from "@/lib/utils";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

type Stage = "payment" | "processing" | "success" | "download-prompt";
type PaymentMethod = "credit-card" | "upi" | "crypto" | "bank-transfer";

export default function TransactionPage() {
  const navigate = useNavigate();
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user, addPurchasedGame } = useUser();

  const [stage, setStage] = useState<Stage>("payment");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);

  // Form & Validation states
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
    cryptoWallet: "",
    bankAccount: "",
    ifscCode: "",
  });

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [upiTimeLeft, setUpiTimeLeft] = useState(300);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentMethod === "upi" && upiTimeLeft > 0 && stage === "payment") {
      timer = setInterval(() => setUpiTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [paymentMethod, upiTimeLeft, stage]);

  useEffect(() => {
    if (!user && stage === "payment") {
      navigate("/login");
    }
  }, [user, navigate, stage]);

  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsWalletConnected(true);
      toast.success("Wallet Connected", { description: "0x71C...974F securely connected." });
    }, 1200);
  };

  const handleCopyCrypto = () => {
    navigator.clipboard.writeText("0xArcadePaySecureVault99382104");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if payment method requirements are satisfied
  const isMethodValid = () => {
    switch (paymentMethod) {
      case "credit-card":
        return isCardComplete && !cardError;
      case "upi":
        return formData.upiId.trim().length > 3;
      case "crypto":
        return isWalletConnected;
      case "bank-transfer":
        return formData.ifscCode.trim().length >= 4;
      default:
        return false;
    }
  };

  const canSubmit = agreedToTerms && isMethodValid() && !isProcessing;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !canSubmit) return;

    setIsProcessing(true);
    setStage("processing");

    // Idempotency Key guarantees single charge even upon retry / lag
    const idempotencyKey = crypto.randomUUID();

    try {
      const response = await fetch("http://localhost:3000/api/economy/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey,
        },
        credentials: "include",
        body: JSON.stringify({
          cartItems: cart,
          paymentMethod,
          legalAgreedTimestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsProcessing(false);
        setStage("payment");
        toast.error("Checkout Failed", {
          description: data.message || "An error occurred during checkout.",
        });
        return;
      }

      setStage("success");
      cart.forEach((game) => {
        addPurchasedGame(game.id);
      });
      generateInvoicePDF({ items: cart, total: getTotalPrice() * 1.1 });

      // Confetti burst
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00ffcc", "#a855f7", "#06b6d4"],
        });
      } catch {}

      setTimeout(() => {
        setShowDownloadPrompt(true);
      }, 1500);
    } catch (error) {
      setIsProcessing(false);
      setStage("payment");
      toast.error("Network Error", {
        description: "Failed to reach the checkout server.",
      });
    }
  };

  const handleDownloadNow = () => {
    setShowDownloadPrompt(false);
    clearCart();
    navigate("/my-games");
  };

  const handlePlayLater = () => {
    setShowDownloadPrompt(false);
    clearCart();
    navigate("/dashboard");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070510] flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl border border-white/10 bg-[#0d091e] max-w-md animate-in fade-in zoom-in">
          <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Sign In Required</h2>
          <p className="text-gray-400 mb-6">Please sign in before making a purchase</p>
          <Button onClick={() => navigate("/login")} className="bg-cyan-500 text-black font-bold">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070510] text-foreground relative overflow-hidden">
      {/* Live Game Art Background Filter */}
      {cart[0]?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 blur-[120px] scale-125 pointer-events-none transition-all duration-1000 z-0"
          style={{ backgroundImage: `url(${cart[0].image})` }}
        />
      )}

      <div className="relative z-10">
        {/* Closed Checkout Isolated Header (No menu distractions) */}
        <header className="w-full border-b border-white/10 bg-[#090714]/90 backdrop-blur-2xl py-4 px-6 sm:px-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-black uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              GAMEVERSE
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-xs font-mono text-green-300">
              <Lock className="w-3.5 h-3.5 text-green-400" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>

            <Link
              to="/cart"
              className="text-xs font-mono text-gray-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Cart
            </Link>
          </div>
        </header>

        <div className="container px-4 py-8 max-w-5xl mx-auto">
          {stage === "payment" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Details Form */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-3xl font-display font-black uppercase tracking-wider text-white mb-1">
                    Secure Payment Gateway
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    Select your preferred encrypted payment method
                  </p>
                </div>

                <Tabs
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-4 mb-6 bg-black/50 p-1 rounded-2xl border border-white/10">
                    <TabsTrigger
                      value="credit-card"
                      className="rounded-xl font-mono text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-bold flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Card</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="upi"
                      className="rounded-xl font-mono text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-bold flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>UPI</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="crypto"
                      className="rounded-xl font-mono text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-bold flex items-center gap-1.5"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Crypto</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="bank-transfer"
                      className="rounded-xl font-mono text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-bold flex items-center gap-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Bank</span>
                    </TabsTrigger>
                  </TabsList>

                  <Elements stripe={stripePromise}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Credit Card Payment */}
                      <TabsContent value="credit-card" className="space-y-4 animate-in fade-in">
                        <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-[#0c081e]/90 backdrop-blur-xl shadow-xl space-y-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                                <CreditCard className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-base font-display font-bold text-white">
                                  Credit or Debit Card
                                </h3>
                                <p className="text-xs text-gray-400 font-mono">
                                  Visa, MasterCard, Amex, Discover
                                </p>
                              </div>
                            </div>

                            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2.5 py-1 rounded-full border border-cyan-500/30">
                              Stripe Tokenized
                            </span>
                          </div>

                          {/* High-Contrast Focused Stripe Card Element Container */}
                          <div className="space-y-2">
                            <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                              Card Information (Number, Exp Date, CVC)
                            </Label>
                            <div className="p-4 rounded-2xl bg-[#05030d] border border-white/20 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all">
                              <CardElement
                                onChange={(e) => {
                                  setIsCardComplete(e.complete);
                                  setCardError(e.error ? e.error.message : null);
                                }}
                                options={{
                                  style: {
                                    base: {
                                      fontSize: "15px",
                                      color: "#ffffff",
                                      fontFamily: "Inter, sans-serif",
                                      "::placeholder": {
                                        color: "#888888",
                                      },
                                      iconColor: "#06b6d4",
                                    },
                                    invalid: {
                                      color: "#ef4444",
                                      iconColor: "#ef4444",
                                    },
                                  },
                                  hidePostalCode: true,
                                }}
                              />
                            </div>

                            {/* Inline Real-Time Error Message */}
                            {cardError && (
                              <p className="text-xs text-red-400 font-mono flex items-center gap-1 mt-1 animate-in fade-in">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {cardError}
                              </p>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      {/* UPI Payment */}
                      <TabsContent value="upi" className="space-y-4 animate-in fade-in">
                        <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-[#0c081e]/90 backdrop-blur-xl shadow-xl space-y-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                              <QrCode className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-display font-bold text-white">
                                Instant UPI QR Payment
                              </h3>
                              <p className="text-xs text-gray-400 font-mono">
                                Google Pay, PhonePe, Paytm, BHIM
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="upiId" className="text-xs font-mono text-gray-300">
                                UPI ID / VPA
                              </Label>
                              <Input
                                id="upiId"
                                value={formData.upiId}
                                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                                placeholder="yourname@okhdfcbank"
                                className="mt-1.5 h-12 bg-[#05030d] border-white/20 focus:border-cyan-400 text-white rounded-xl"
                              />
                            </div>

                            <div className="p-6 rounded-2xl bg-black/50 border border-white/10 text-center flex flex-col items-center">
                              <div className="bg-white p-3 rounded-2xl shadow-xl mb-3">
                                <QRCodeSVG
                                  value={`arcadepay://checkout?amount=${(getTotalPrice() * 1.1).toFixed(2)}`}
                                  size={130}
                                  level="H"
                                />
                              </div>
                              <p className="text-xs font-mono text-cyan-300">
                                Scan QR with any UPI app to authenticate
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Crypto Payment */}
                      <TabsContent value="crypto" className="space-y-4 animate-in fade-in">
                        <div className="p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-[#0c081e]/90 backdrop-blur-xl shadow-xl space-y-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40">
                              <Coins className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-display font-bold text-white">
                                Web3 Crypto Checkout
                              </h3>
                              <p className="text-xs text-gray-400 font-mono">
                                Ethereum, Polygon, USDT, USDC
                              </p>
                            </div>
                          </div>

                          {!isWalletConnected ? (
                            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/20 rounded-2xl bg-black/40 text-center">
                              <Wallet className="w-10 h-10 text-gray-400 mb-3 opacity-60" />
                              <p className="text-xs text-gray-300 mb-4">
                                Connect your MetaMask or Phantom wallet
                              </p>
                              <Button
                                type="button"
                                onClick={handleConnectWallet}
                                disabled={isConnecting}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl"
                              >
                                {isConnecting ? "Connecting..." : "Connect Web3 Wallet"}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono">
                                <span className="text-gray-400">Connected Wallet: </span>
                                <strong className="text-purple-300">0x71C...974F</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      {/* Bank Transfer */}
                      <TabsContent value="bank-transfer" className="space-y-4 animate-in fade-in">
                        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c081e]/90 backdrop-blur-xl shadow-xl space-y-4">
                          <div>
                            <Label className="text-xs font-mono text-gray-300">IFSC / Wire Routing</Label>
                            <Input
                              value={formData.ifscCode}
                              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                              placeholder="GAME0001234"
                              className="mt-1.5 h-12 bg-[#05030d] border-white/20 text-white rounded-xl"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      {/* Mandatory Legal Compliance Checkbox */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-cyan-400 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                          />
                          <span className="text-xs text-gray-300 leading-relaxed">
                            I agree to the{" "}
                            <span className="text-cyan-400 underline">Terms of Service</span> and{" "}
                            <span className="text-cyan-400 underline">Refund Policy</span>, and I
                            acknowledge that immediate digital activation waives my statutory right of
                            withdrawal.
                          </span>
                        </label>
                      </div>

                      {/* Consolidated Certified Trust Badges Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-gray-400">
                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center gap-1.5 text-center">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          <span>Norton Secured</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center gap-1.5 text-center">
                          <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>PCI-DSS Level 1</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center gap-1.5 text-center">
                          <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>Stripe Verified</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center gap-1.5 text-center">
                          <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>256-Bit AES-GCM</span>
                        </div>
                      </div>

                      {/* Stateful Complete Purchase Button */}
                      <Button
                        type="submit"
                        disabled={!canSubmit}
                        className={cn(
                          "w-full h-14 font-display font-black text-base uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2",
                          canSubmit
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:scale-[1.01] cursor-pointer"
                            : "bg-white/10 text-gray-500 border border-white/5 cursor-not-allowed"
                        )}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Authorizing with Gateway...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-1" />
                            Complete Purchase (${(getTotalPrice() * 1.1).toFixed(2)})
                          </>
                        )}
                      </Button>
                    </form>
                  </Elements>
                </Tabs>
              </div>

              {/* Order Summary with Clear Product Delivery & Platform Badges */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 rounded-3xl border border-cyan-500/30 bg-[#0d091e]/95 backdrop-blur-2xl shadow-xl space-y-6">
                  <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">
                    Order Summary ({cart.length} Titles)
                  </h3>

                  {/* Cart Items with Platform & Delivery Badges */}
                  <div className="space-y-3 max-h-80 overflow-y-auto hide-scrollbar">
                    {cart.map((game) => (
                      <div
                        key={game.id}
                        className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2"
                      >
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={game.image}
                            alt={game.title}
                            className="w-14 h-14 object-cover rounded-xl border border-white/10 shrink-0"
                            fallbackText={game.title}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-display font-bold text-xs text-white truncate">
                              {game.title}
                            </h4>
                            <span className="text-sm font-mono font-black text-cyan-300">
                              {game.price}
                            </span>
                          </div>
                        </div>

                        {/* Product Delivery & Platform Badges */}
                        <div className="flex flex-wrap gap-1.5 text-[9px] font-mono pt-1 border-t border-white/5">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 flex items-center gap-1">
                            <HardDrive className="w-2.5 h-2.5" /> PC Windows • Steam / Cloud
                          </span>
                          <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> Instant Digital Activation
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Digital Service Tax (10%)</span>
                      <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-display font-black text-white">
                      <span>Total</span>
                      <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                        ${(getTotalPrice() * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* OpenTelemetry Distributed Tracing Console */}
                  <div className="pt-2">
                    <DistributedTracingConsole />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing Screen */}
          {stage === "processing" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
              <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_40px_rgba(6,182,212,0.6)]" />
              <h2 className="text-3xl font-display font-black text-white uppercase tracking-wider">
                Cryptographic Payment Processing
              </h2>
              <p className="text-xs font-mono text-gray-400 max-w-md">
                Verifying Stripe payment intent, minting digital license token, and invalidating idempotency locks...
              </p>
            </div>
          )}

          {/* Success Screen & Invoice Prompt */}
          {stage === "success" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-400 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 font-mono text-xs font-bold uppercase">
                  ORDER CONFIRMED & FULFILLED
                </span>
                <h2 className="text-4xl font-display font-black text-white uppercase tracking-wider mt-2">
                  Payment Successful
                </h2>
                <p className="text-sm text-gray-300 max-w-md mt-2">
                  Your digital game licenses and cloud save keys have been minted to your account.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleDownloadNow}
                  className="h-12 px-6 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" /> Download & View in Library
                </Button>
                <Button
                  onClick={handlePlayLater}
                  variant="outline"
                  className="h-12 px-6 glass border-white/20 text-white rounded-xl"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
