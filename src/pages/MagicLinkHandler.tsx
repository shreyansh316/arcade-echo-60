import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Gamepad2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MagicLinkHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useUser();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const token = searchParams.get("token");
  const username = searchParams.get("user");

  useEffect(() => {
    if (!token || !username) {
      setStatus("error");
      setErrorMsg("Invalid magic link parameters.");
      return;
    }

    const consumeLink = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/magic-link/consume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token, username }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          login(data.user.username, `${data.user.username}@example.com`);
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Magic link expired or invalid.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg("Network error trying to authenticate.");
      }
    };

    consumeLink();
  }, [token, username, login, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className={cn(
        "bg-card/80 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-500 w-full max-w-md text-center",
        status === "error" ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-shake" : "",
        status === "success" ? "border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]" : ""
      )}>
        <div className="mb-6 flex justify-center relative">
          <div className="relative">
            {status === "loading" && (
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="w-16 h-16 text-[#10b981] animate-in zoom-in" />
            )}
            {status === "error" && (
              <AlertCircle className="w-16 h-16 text-red-500 animate-in zoom-in" />
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {status === "loading" && "Authenticating..."}
          {status === "success" && "Welcome Back!"}
          {status === "error" && "Authentication Failed"}
        </h2>
        
        <p className="text-muted-foreground">
          {status === "loading" && "Validating your magic link cryptographic token."}
          {status === "success" && "Securely logged in. Teleporting to dashboard..."}
          {status === "error" && errorMsg}
        </p>
        
        {status === "error" && (
          <button 
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-2 bg-primary/20 hover:bg-primary/40 border border-primary/50 rounded-full transition-all text-primary-foreground font-semibold"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}
