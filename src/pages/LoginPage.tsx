import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { GlowInput } from "@/components/GlowInput";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { useUser } from "@/contexts/UserContext";
import { User, Mail, Lock, Eye, EyeOff, Gamepad2, Sparkles, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI Error & Success State
  const [errorMsg, setErrorMsg] = useState("");
  const [isShake, setIsShake] = useState(false);
  const [magicLinkSuccess, setMagicLinkSuccess] = useState("");
  const [oauthLoadingProvider, setOauthLoadingProvider] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, loginHistory } = useUser();

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setMagicLinkSuccess("");
    setIsShake(true);
    setTimeout(() => setIsShake(false), 500);
  };

  const handleMagicLink = async () => {
    if (!username) {
      triggerError("Please enter your username to send a magic link.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    setMagicLinkSuccess("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/magic-link/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      if (!response.ok) {
        triggerError(data.error || "Failed to send magic link");
      } else {
        setMagicLinkSuccess(`Magic Link Sent! (Check console for dev URL)`);
        console.log(data.mockLink);
      }
    } catch (err) {
      triggerError("Network error. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setOauthLoadingProvider(provider);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/oauth/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ provider })
      });
      
      const data = await response.json();
      if (!response.ok) {
        triggerError(data.error || "OAuth Login Failed");
      } else {
        login(data.user.username, `${data.user.username}@example.com`);
        navigate("/dashboard");
      }
    } catch (err) {
      triggerError("Network error. Is the server running?");
    } finally {
      setOauthLoadingProvider(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setIsLoading(true);
      setErrorMsg("");
      
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password, rememberMe })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          triggerError(data.error || "Login failed");
        } else {
          login(data.user.username, `${data.user.username}@example.com`);
          navigate("/dashboard");
        }
      } catch (err) {
        triggerError("Network error. Is the server running?");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isPasswordValid = (pass: string) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      triggerError("Password does not meet the security constraints.");
      return;
    }
    if (username && password && confirmPassword && password === confirmPassword) {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          triggerError(data.error || "Registration failed");
        } else {
          // Auto login after register
          login(username, email || `${username}@example.com`);
          navigate("/dashboard");
        }
      } catch (err) {
        triggerError("Network error. Is the server running?");
      } finally {
        setIsLoading(false);
      }
    } else if (password !== confirmPassword) {
      triggerError("Passwords do not match");
    }
  };

  const handleQuickLogin = (historyItem: { username: string; email: string }) => {
    setUsername(historyItem.username);
    setEmail(historyItem.email);
    // Since we don't store passwords, they'll still need to enter it.
    setErrorMsg("Enter your password to quick-login.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <Header />
      
      <div className="container px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)] relative z-10">
        <div className="w-full max-w-md">
          {/* Logo/Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-xl opacity-50 animate-pulse" />
                <Gamepad2 className="relative w-16 h-16 text-primary animate-bounce" style={{ animationDuration: "2s" }} />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              GAMEVERSE
            </h1>
            <p className="text-muted-foreground text-lg">
              Your Ultimate Gaming Experience
            </p>
          </div>

          {/* Main Auth Card */}
          <div className={cn(
            "bg-card/80 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-500",
            isShake ? "animate-shake border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]" : ""
          )}>
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Sparkle effects */}
            <Sparkles className="absolute top-4 right-4 w-5 h-5 text-primary/50 animate-pulse" />
            <Sparkles className="absolute bottom-4 left-4 w-4 h-4 text-accent/50 animate-pulse" style={{ animationDelay: "1s" }} />

            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 transition-all">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{errorMsg}</span>
              </div>
            )}

            {magicLinkSuccess && (
              <div className="bg-[#10b981]/20 border border-[#10b981]/50 text-[#10b981] px-4 py-3 rounded-lg mb-6 flex items-center gap-2 transition-all">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm">{magicLinkSuccess}</span>
              </div>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </label>
                    <GlowInput
                      icon={<User className="w-5 h-5" />}
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <GlowInput
                        icon={<Lock className="w-5 h-5" />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => {
                          // Eagerly fetch the Dashboard component chunk in the background
                          import("@/pages/DashboardPage");
                        }}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-20"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <span className="text-muted-foreground">Remember me for 30 Days</span>
                    </label>
                    <button type="button" onClick={handleMagicLink} className="text-primary hover:text-primary/80 transition-colors font-medium">
                      Email Magic Link
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-primary-foreground font-bold text-lg glow-strong transition-all duration-300 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Sign In
                          <Gamepad2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                  </Button>
                </form>

                {/* Social Login Options */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    type="button"
                    onClick={() => handleOAuthLogin('PS')}
                    disabled={!!oauthLoadingProvider}
                    variant="outline" 
                    className="h-12 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105"
                  >
                    {oauthLoadingProvider === 'PS' ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs font-bold">PS</span>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => handleOAuthLogin('XB')}
                    disabled={!!oauthLoadingProvider}
                    variant="outline" 
                    className="h-12 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105"
                  >
                    {oauthLoadingProvider === 'XB' ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs font-bold">XB</span>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => handleOAuthLogin('EPIC')}
                    disabled={!!oauthLoadingProvider}
                    variant="outline" 
                    className="h-12 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105"
                  >
                    {oauthLoadingProvider === 'EPIC' ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs font-bold">EPIC</span>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </label>
                    <GlowInput
                      icon={<User className="w-5 h-5" />}
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <GlowInput
                      icon={<Mail className="w-5 h-5" />}
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <GlowInput
                        icon={<Lock className="w-5 h-5" />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-20"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <PasswordStrengthIndicator password={password} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <GlowInput
                        icon={<Lock className="w-5 h-5" />}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-20"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-primary/30" required />
                    <span className="text-muted-foreground">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                        Privacy Policy
                      </a>
                    </span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-primary-foreground font-bold text-lg glow-strong transition-all duration-300 relative overflow-hidden group"
                    disabled={isLoading || (confirmPassword && password !== confirmPassword)}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <Gamepad2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                  </Button>
                </form>

                {/* Social Sign Up Options */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    type="button"
                    onClick={() => handleOAuthLogin('PS')}
                    disabled={!!oauthLoadingProvider}
                    variant="outline" 
                    className="h-12 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105"
                  >
                    {oauthLoadingProvider === 'PS' ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs font-bold">PS</span>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => handleOAuthLogin('XB')}
                    disabled={!!oauthLoadingProvider}
                    variant="outline" 
                    className="h-12 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105"
                  >
                    {oauthLoadingProvider === 'XB' ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs font-bold">XB</span>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => handleOAuthLogin('EPIC')}
                    disabled={!!oauthLoadingProvider}
                    variant="outline" 
                    className="h-12 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105"
                  >
                    {oauthLoadingProvider === 'EPIC' ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs font-bold">EPIC</span>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Recent Logins */}
          {loginHistory.length > 0 && (
            <div className="mt-8 bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-6 transition-all">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Recent Logins
              </h3>
              <div className="space-y-2">
                {loginHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickLogin(item)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-background/50 hover:border-primary hover:bg-primary/10 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.username}</p>
                      <p className="text-sm text-muted-foreground">{item.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
