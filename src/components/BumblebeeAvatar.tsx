import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X, Minimize2, Maximize2, MessageCircle, Sparkles, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bumblebee";
  timestamp: Date;
}

export const BumblebeeAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bzzz! *mechanical whirring* Hello! I'm Bumblebee, your robotic gaming assistant! How can I help you today?",
      sender: "bumblebee",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [justOpened, setJustOpened] = useState(false);
  const [eyeGlow, setEyeGlow] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const flipAnimationRef = useRef(false);

  useEffect(() => {
    // Initialize Web Speech API with improved settings
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        if (finalTranscript) {
          handleUserMessage(finalTranscript);
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "no-speech") {
          // Retry automatically
          setTimeout(() => {
            if (recognitionRef.current && !isListening) {
              startListening();
            }
          }, 1000);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
    }

    synthRef.current = window.speechSynthesis;

    // Eye glow animation
    const eyeInterval = setInterval(() => {
      setEyeGlow((prev) => !prev);
    }, 2000);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      clearInterval(eyeInterval);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Generate Bumblebee response with processing delay
    setTimeout(() => {
      const response = generateBumblebeeResponse(text.toLowerCase());
      const bumblebeeMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bumblebee",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, bumblebeeMessage]);
      setIsProcessing(false);
      speakText(response);
    }, 800);
  };

  const generateBumblebeeResponse = (userInput: string): string => {
    // Robot-like responses with mechanical sounds
    const responses: Record<string, string[]> = {
      hello: [
        "Bzzz! *mechanical whirring* Hello there, gamer! Systems online and ready to assist!",
        "*beep boop* Greetings! I'm Bumblebee, your robotic gaming assistant! How can I help?",
        "Bzzz bzzz! *servo motor sounds* Hey! What games are you looking for today?"
      ],
      help: [
        "Bzzz! *processing* I can help you find games, navigate the store, check your cart, or answer questions! What do you need?",
        "*mechanical click* Systems ready! Ask me about games, categories, or anything gaming-related!",
        "Bzzz! *LED lights flash* Need assistance? I can guide you through the store or help find games!"
      ],
      games: [
        "Bzzz! *database search sounds* We have tons of amazing games! Check out our store or browse by category!",
        "*processing* Want to explore? I can guide you to trending games, new releases, or your favorite genre!",
        "Bzzz bzzz! *mechanical whirring* Our game library is buzzing with excitement! What genre catches your interest?"
      ],
      cart: [
        "Bzzz! *inventory check* Your cart is waiting! Click the cart icon in the header to see what you've added.",
        "*beep* Ready to checkout? Your cart is just a click away in the top navigation!",
        "Bzzz! *system scan* Check your cart in the header - it's got all your selected games!"
      ],
      store: [
        "Bzzz! *database access* The store is buzzing with amazing games! Click 'Store' in the navigation to explore.",
        "*mechanical sounds* Our store has the latest and greatest games. Let's go shopping!",
        "Bzzz bzzz! *processing* Head to the Store page to see all our games with hologram prices!"
      ],
      price: [
        "Bzzz! *price calculation* Prices vary by game - some are free, others range from $29.99 to $69.99!",
        "*database query* We have games for every budget! Free games, affordable indies, and premium titles!",
        "Bzzz! *system scan* Game prices start from free and go up to $69.99. Each game page shows the exact price!"
      ],
      category: [
        "Bzzz! *catalog access* We have 6 awesome categories: Action, Adventure, RPG, Racing, Sci-Fi, and Shooter!",
        "*mechanical processing* Explore by category - each has unique games and themes!",
        "Bzzz bzzz! *database search* Browse by category - Action, Adventure, RPG, Racing, Sci-Fi, or Shooter games await!"
      ],
      event: [
        "Bzzz! *event calendar access* Check out our Gaming Events page! Tournaments, challenges, and community events!",
        "*beep boop* Events are buzzing! Click 'Join the Gaming Revolution' to see what's happening!",
        "Bzzz! *system notification* Gaming events with tournaments and prizes! Click the 'Join the Gaming Revolution' button!"
      ],
      wishlist: [
        "Bzzz! *memory access* Found a game you love? Add it to your wishlist with the heart icon!",
        "*beep* Wishlist your favorites and never lose track of games you want!",
        "Bzzz bzzz! *data storage* Use the heart icon to add games to your wishlist. Find it in your profile menu!"
      ],
      profile: [
        "Bzzz! *stats calculation* Your profile shows your gaming stats, favorite genre, play time, and game progress!",
        "*data processing* Check your profile to see achievements, play time charts, and top games!",
        "Bzzz! *system analysis* Your profile has all your gaming stats and achievements!"
      ],
      achievement: [
        "Bzzz! *achievement unlock sound* Unlock achievements by playing games, completing challenges, and exploring categories!",
        "*beep boop* Check the Achievements page to see what you've unlocked and what's next!",
        "Bzzz bzzz! *trophy system* Achievements track your gaming milestones. See them in the Achievements section!"
      ],
      dashboard: [
        "Bzzz! *theme engine* Your dashboard is themed based on your most played category! It shows your gaming stats.",
        "*personalization system* The dashboard adapts to your favorite gaming genre. Check it out!",
        "Bzzz! *customization active* Your personalized dashboard reflects your gaming style!"
      ],
    };

    for (const [key, options] of Object.entries(responses)) {
      if (userInput.includes(key)) {
        return options[Math.floor(Math.random() * options.length)];
      }
    }

    // Default robot responses
    const defaults = [
      "Bzzz! *processing* That's interesting! Tell me more about what you're looking for!",
      "*mechanical whirring* I'm here to help! Try asking about games, the store, your cart, events, or profile!",
      "Bzzz bzzz! *system thinking* Hmm, let me think... How about we explore the store together?",
      "*beep boop* Want to find awesome games? I can guide you through our categories!",
      "Bzzz! *LED flash* I'm your gaming assistant! Ask me about games, prices, categories, achievements, or anything gaming-related!",
      "*mechanical click* Not sure what to ask? Try: 'show me games', 'what's in my cart', or 'tell me about events'!",
    ];

    return defaults[Math.floor(Math.random() * defaults.length)];
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    setIsSpeaking(true);
    
    const loadVoices = () => {
      const voices = synthRef.current?.getVoices() || [];
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Robot-like voice settings (mechanical, higher pitch)
      utterance.rate = 1.2;
      utterance.pitch = 1.8;
      utterance.volume = 1;

      // Try to use a more robotic voice
      const preferredVoice = voices.find(
        (voice) => 
          voice.name.includes("Google") || 
          voice.name.includes("Samantha") ||
          voice.name.includes("Karen") ||
          voice.name.includes("Victoria") ||
          voice.name.includes("Zira") ||
          voice.name.includes("Microsoft")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      synthRef.current?.speak(utterance);
    };

    if (synthRef.current.getVoices().length > 0) {
      loadVoices();
    } else {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserMessage(inputText);
      setInputText("");
    }
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsMinimized(!isMinimized);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      setJustOpened(true);
      flipAnimationRef.current = true;
      setTimeout(() => {
        setJustOpened(false);
        flipAnimationRef.current = false;
      }, 1000);
    }
  };

  return (
    <>
      {/* Floating Robot Bumblebee Avatar Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setJustOpened(true);
            flipAnimationRef.current = true;
            setTimeout(() => {
              setJustOpened(false);
              flipAnimationRef.current = false;
            }, 1000);
          }}
          className="fixed bottom-8 right-8 z-50 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 border-4 border-yellow-600 shadow-2xl hover:scale-110 transition-all duration-300 glow-strong animate-bumblebeeFloat group cursor-pointer relative overflow-hidden"
          style={{
            animation: "bumblebeeFloat 3s ease-in-out infinite",
            boxShadow: "0 0 40px rgba(251, 191, 36, 0.8), 0 0 80px rgba(251, 191, 36, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Metallic shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 rounded-full" />
          
          {/* Robot mechanical parts overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Circuit lines */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path d="M20,50 L40,50 M60,50 L80,50 M50,20 L50,40 M50,60 L50,80" stroke="black" strokeWidth="1" />
                <circle cx="50" cy="50" r="3" fill="black" />
              </svg>
            </div>
          </div>

          <div className="relative w-full h-full flex items-center justify-center z-10">
            {/* Robot Bumblebee Face */}
            <div className="relative z-10">
              {/* LED Eyes with mechanical glow */}
              <div className="flex gap-2 mb-1">
                <div className={`w-4 h-4 bg-black rounded-full relative ${eyeGlow ? 'animate-pulse' : ''}`}>
                  <div className={`absolute inset-0 bg-yellow-300 rounded-full ${eyeGlow ? 'animate-ping opacity-75' : 'opacity-30'}`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full opacity-60" />
                  {/* LED indicator */}
                  <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full animate-pulse" />
                </div>
                <div className={`w-4 h-4 bg-black rounded-full relative ${eyeGlow ? 'animate-pulse' : ''}`}>
                  <div className={`absolute inset-0 bg-yellow-300 rounded-full ${eyeGlow ? 'animate-ping opacity-75' : 'opacity-30'}`} style={{ animationDelay: "0.2s" }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full opacity-60" />
                  <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                </div>
              </div>
              {/* Robot mouth/speaker grille */}
              <div className="w-7 h-3 border-2 border-black border-t-0 rounded-b-full relative">
                <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-0.5 h-1 bg-black/50 rounded-full" />
                  ))}
                </div>
              </div>
            </div>

            {/* Mechanical Wings with robot-like animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="absolute -left-3 w-5 h-7 bg-gradient-to-r from-yellow-300/80 to-yellow-200/60 rounded-full animate-bumblebeeWing relative"
                style={{
                  filter: "blur(1px)",
                  boxShadow: "0 0 10px rgba(251, 191, 36, 0.5)",
                }}
              >
                {/* Wing mechanical details */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full" />
                  <div className="absolute bottom-1 right-1 w-1 h-1 bg-black rounded-full" />
                </div>
              </div>
              <div 
                className="absolute -right-3 w-5 h-7 bg-gradient-to-l from-yellow-300/80 to-yellow-200/60 rounded-full animate-bumblebeeWing relative" 
                style={{ 
                  animationDelay: "0.1s",
                  filter: "blur(1px)",
                  boxShadow: "0 0 10px rgba(251, 191, 36, 0.5)",
                }} 
              >
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full" />
                  <div className="absolute bottom-1 left-1 w-1 h-1 bg-black rounded-full" />
                </div>
              </div>
            </div>

            {/* Robot stripes with metallic look */}
            <div className="absolute inset-0 flex flex-col justify-center gap-1.5 opacity-40">
              <div className="h-1.5 bg-gradient-to-r from-transparent via-black/60 to-transparent rounded-full mx-4" />
              <div className="h-1.5 bg-gradient-to-r from-transparent via-black/60 to-transparent rounded-full mx-4" />
            </div>

            {/* CPU/Processing indicator */}
            <Cpu className="absolute -top-1 -left-1 w-4 h-4 text-yellow-300 animate-pulse z-20" />
            <Zap className="absolute -bottom-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse z-20" style={{ animationDelay: "0.5s" }} />
          </div>
        </button>
      )}

      {/* Chat Interface with 3D Flip Animation */}
      {isOpen && (
        <div
          className={`fixed bottom-8 right-8 z-50 bg-gradient-to-br from-yellow-900/95 via-orange-900/95 to-yellow-800/95 backdrop-blur-lg border-4 border-yellow-500 rounded-2xl shadow-2xl transition-all duration-500 ${
            isMinimized ? "h-20" : "h-[600px]"
          } w-[400px] overflow-hidden glow-strong ${justOpened ? "animate-robotFlip" : ""}`}
          style={{
            animation: isMinimized 
              ? "none" 
              : justOpened 
                ? "robotFlip 1s ease-in-out" 
                : "bumblebeeFloat 3s ease-in-out infinite",
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Header with robot styling */}
          <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 p-4 flex items-center justify-between border-b-2 border-yellow-400 relative overflow-hidden">
            {/* Animated background with circuit pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px)",
              }} />
              {/* Circuit pattern overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 20">
                <path d="M10,10 L30,10 M50,10 L70,10 M10,5 L10,15 M50,5 L50,15" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-yellow-300 flex items-center justify-center animate-robotTransform shadow-lg relative overflow-hidden">
                {/* Metallic shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 rounded-full" />
                
                {/* Robot Bumblebee Face */}
                <div className="relative z-10">
                  <div className="flex gap-1.5 mb-0.5">
                    <div className={`w-2.5 h-2.5 bg-black rounded-full relative ${eyeGlow ? 'animate-pulse' : ''}`}>
                      <div className={`absolute inset-0 bg-yellow-200 rounded-full ${eyeGlow ? 'animate-ping opacity-60' : 'opacity-20'}`} />
                      <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-white rounded-full" />
                    </div>
                    <div className={`w-2.5 h-2.5 bg-black rounded-full relative ${eyeGlow ? 'animate-pulse' : ''}`}>
                      <div className={`absolute inset-0 bg-yellow-200 rounded-full ${eyeGlow ? 'animate-ping opacity-60' : 'opacity-20'}`} style={{ animationDelay: "0.2s" }} />
                      <div className="absolute top-0 right-0 w-0.5 h-0.5 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="w-5 h-2 border border-black border-t-0 rounded-b-full relative">
                    <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-0.5 h-0.5 bg-black/70 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Mechanical Wings */}
                <div className="absolute -left-1.5 w-3.5 h-5 bg-gradient-to-r from-yellow-300/70 to-yellow-200/50 rounded-full animate-bumblebeeWing" />
                <div className="absolute -right-1.5 w-3.5 h-5 bg-gradient-to-l from-yellow-300/70 to-yellow-200/50 rounded-full animate-bumblebeeWing" style={{ animationDelay: "0.1s" }} />
                
                {/* Robot stripes */}
                <div className="absolute inset-0 flex flex-col justify-center gap-0.5 opacity-50">
                  <div className="h-0.5 bg-black/70 rounded-full mx-1.5" />
                  <div className="h-0.5 bg-black/70 rounded-full mx-1.5" />
                </div>

                {/* Processing indicator when speaking/listening */}
                {(isSpeaking || isListening || isProcessing) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping border-2 border-white" />
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  Bumblebee
                  <span className="text-xs bg-yellow-500/30 px-2 py-0.5 rounded-full border border-yellow-400/50">
                    AI
                  </span>
                  {isSpeaking && <span className="text-yellow-200 animate-pulse">🎤</span>}
                  {isListening && <span className="text-red-300 animate-pulse">🔴</span>}
                  {isProcessing && <span className="text-blue-300 animate-spin">⚙️</span>}
                </h3>
                <p className="text-xs text-yellow-100 flex items-center gap-1">
                  {isListening ? (
                    <>
                      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      Listening...
                    </>
                  ) : isSpeaking ? (
                    <>
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Speaking...
                    </>
                  ) : isProcessing ? (
                    <>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      Online
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                className="text-white hover:bg-yellow-500/30 h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                  if (recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                  if (synthRef.current) {
                    synthRef.current.cancel();
                  }
                }}
                className="text-white hover:bg-yellow-500/30 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <ScrollArea className="h-[400px] p-4 bg-gradient-to-b from-transparent via-yellow-900/20 to-transparent">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-lg relative ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-yellow-500/20 text-yellow-100 border-2 border-yellow-400/50"
                        }`}
                      >
                        {message.sender === "bumblebee" && (
                          <div className="absolute -left-2 top-2 w-5 h-5 bg-yellow-400 rounded-full border-2 border-yellow-600 flex items-center justify-center">
                            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                          </div>
                        )}
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-yellow-500/20 text-yellow-100 border-2 border-yellow-400/50 rounded-2xl px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t-2 border-yellow-400/50 p-4 bg-gradient-to-r from-yellow-900/50 to-orange-900/50">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-yellow-900/30 border-yellow-400/50 text-white placeholder:text-yellow-200/50"
                  />
                  <Button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`${
                      isListening
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    } text-white`}
                    size="icon"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="icon"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </form>
                <p className="text-xs text-yellow-200/70 mt-2 text-center">
                  {isListening ? "🎤 Listening... Speak now!" : "💬 Type or click mic to talk"}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bumblebeeFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes robotTransform {
          0% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.1) rotate(90deg);
          }
          50% {
            transform: scale(1.15) rotate(180deg);
          }
          75% {
            transform: scale(1.1) rotate(270deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
          }
        }

        @keyframes robotFlip {
          0% {
            transform: perspective(1000px) rotateY(0deg) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: perspective(1000px) rotateY(180deg) scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: perspective(1000px) rotateY(360deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes bumblebeeWing {
          0%, 100% {
            transform: translateY(-50%) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-50%) rotate(25deg);
            opacity: 0.9;
          }
        }

        .animate-bumblebeeFloat {
          animation: bumblebeeFloat 3s ease-in-out infinite;
        }

        .animate-robotTransform {
          animation: robotTransform 4s ease-in-out infinite;
        }

        .animate-robotFlip {
          animation: robotFlip 1s ease-in-out;
        }

        .animate-bumblebeeWing {
          animation: bumblebeeWing 0.15s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};
