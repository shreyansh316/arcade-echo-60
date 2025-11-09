import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractivePosterCard } from "@/components/InteractivePosterCard";
import { Sparkles, Copy, Check, Wand2, Layers, Sliders, Palette, Zap, Code, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface AIPosterStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIPosterStudioModal: React.FC<AIPosterStudioModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<"cyberpunk" | "retro" | "minimalist" | "surreal">("cyberpunk");
  const [aspectRatio, setAspectRatio] = useState<"2:3" | "16:9">("2:3");

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Prompt Copied to Clipboard!", {
      description: "Ready to paste into Midjourney, DALL-E 3, or Stable Diffusion.",
      icon: "✨",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const prompts = {
    master150: `Act as an expert video game concept designer and prompt engineer. Generate a structured list of exactly 150 unique, highly creative video game ideas across various modern genres. For each idea, provide: 1. Title: A catchy, memorable name. 2. Genre: (e.g., Roguelike, Cozy Sim, Cyberpunk RPG, Physics Puzzler). 3. Core Mechanic: The main gameplay hook in one sentence. 4. Hook/Twist: What makes it unique from existing games.

To ensure maximum variety, split the 150 ideas equally across these 5 themes:
- Theme 1 (Ideas 1-30): Time manipulation and chronology.
- Theme 2 (Ideas 31-60): Physics-defying mechanics (Gravity, Magnetism, Fluid dynamics).
- Theme 3 (Ideas 61-90): Psychological thrillers and mind-bending narratives.
- Theme 4 (Ideas 91-120): Eco-restoration and nature-based cozy games.
- Theme 5 (Ideas 121-150): Cybernetic high-tech stealth and corporate espionage.

Format the output as a clean, numbered markdown list. Keep descriptions punchy, action-oriented, and highly visual.`,

    antigravity: `Act as a Lead Game Designer. Create a comprehensive, AAA-tier game design pitch for a video game centered entirely around anti-gravity mechanics. Include the following sections in your response:

1. Working Title & Logline: A compelling one-sentence summary.
2. Core Gameplay Hook: Explain exactly how the player controls, toggles, or manipulates anti-gravity (e.g., directional gravity boots, localized gravity fields, or full-world inversion).
3. Level Design & Environment: Describe how the world reacts to anti-gravity (floating debris, upside-down architecture, dynamic platforming hazards).
4. Combat or Puzzle Mechanics: Detail how anti-gravity is used offensively against enemies or logically to solve complex environmental puzzles.
5. Visual Art Style: Define the aesthetic (e.g., sleek solarpunk, gritty industrial sci-fi, or surrealist abstract dreamscape).

Make the tone professional, inspiring, and technically grounded for a dev team.`,

    posterCyberpunk: `A cinematic cyberpunk gaming poster designed as a web asset background for GameVerse. Centered is a sleek, holographic AI android head wearing a glowing neon VR headset with fiber-optic wires. High-contrast lighting with vivid magenta (#d946ef) and electric cyan (#06b6d4) neon accents against a dark, rainy dystopian tech-noir cityscape. Clean graphic composition with intentional negative space left at the top and bottom for web layout typography and buttons. Octane render style, crisp 8k digital art, ultra-detailed textures --ar 2:3`,

    posterRetro: `A minimalist retro-futuristic video game poster layout for a modern gaming storefront. A flat vector illustration of an abstract humanoid robot hand gripping a glowing neon joystick with geometric grid lines extending toward a sharp synthwave horizon. Warm grainy overlay, high contrast, clean distinct lines, blank dark navy space at top half for web typography --ar 2:3`,

    posterMinimalist: `A minimalist, high-end graphic design poster themed around Artificial Intelligence in gaming. Centered is a clean, abstract vector icon of a glowing neural network fading into a human silhouette against solid deep navy blue (#0A192F). Minimalist thin typography placeholder, geometric balance, corporate tech aesthetic, 8k vector layout --ar 2:3`,

    posterSurreal: `A surrealist art poster exploring human consciousness and machine intelligence in virtual worlds. Double exposure showing a human face shattering into floating glowing digital cubes, liquid chrome accents, and golden light streaks across cosmic nebula backdrop. Elegant high-art aesthetic, rich textures, dramatic chiaroscuro lighting --ar 2:3`,
  };

  const styleImages = {
    cyberpunk: {
      bg: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&fit=crop",
      char: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&fit=crop",
      color: "#06b6d4",
      title: "Cyber Rebellion 2077",
      category: "Sci-Fi Action",
    },
    retro: {
      bg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&fit=crop",
      char: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&fit=crop",
      color: "#d946ef",
      title: "Neon Velocity 84",
      category: "Retro Arcade",
    },
    minimalist: {
      bg: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&fit=crop",
      char: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&fit=crop",
      color: "#3b82f6",
      title: "Synthetica Core",
      category: "Neural Puzzler",
    },
    surreal: {
      bg: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&fit=crop",
      char: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&fit=crop",
      color: "#a855f7",
      title: "Astral Echoes",
      category: "Surreal RPG",
    },
  };

  const activePoster = styleImages[selectedStyle];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-[#080514]/98 border border-cyan-500/40 text-foreground backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                AI Poster Studio & Prompt Engine
              </DialogTitle>
              <p className="text-xs text-gray-400 font-mono">
                End-to-End Generation, 5-Phase Web Optimization, and Live Interactive 3D Parallax Sandbox
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="generator" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-black/60 p-1 rounded-2xl border border-white/10 mb-6">
            <TabsTrigger
              value="generator"
              className="rounded-xl font-mono text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-bold flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Prompt Frameworks</span>
            </TabsTrigger>
            <TabsTrigger
              value="sandbox"
              className="rounded-xl font-mono text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-bold flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Live UI Parallax Sandbox</span>
            </TabsTrigger>
            <TabsTrigger
              value="pipeline"
              className="rounded-xl font-mono text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-bold flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" />
              <span>5-Phase Web Pipeline</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Prompt Frameworks */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Master 150 Game Idea Prompt */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-400/40 transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                      Ideation Engine
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy("150", prompts.master150)}
                      className="h-8 px-2.5 text-xs text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-xl"
                    >
                      {copiedId === "150" ? <Check className="w-3.5 h-3.5 text-green-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      Copy Prompt
                    </Button>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">Master 150 Game Idea Generator</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-3">
                    Structured prompt partitioning 150 AAA/indie concepts across Time, Physics, Psychology, Eco-Cozy, and Cyberpunk espionage.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#05030d] border border-white/5 font-mono text-[11px] text-cyan-300/80 max-h-24 overflow-y-auto">
                  {prompts.master150}
                </div>
              </div>

              {/* Anti-Gravity Game Pitch Prompt */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-400/40 transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold uppercase">
                      AAA Game Pitch
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy("anti", prompts.antigravity)}
                      className="h-8 px-2.5 text-xs text-gray-300 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl"
                    >
                      {copiedId === "anti" ? <Check className="w-3.5 h-3.5 text-green-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      Copy Prompt
                    </Button>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">Dedicated Anti-Gravity Game Pitch</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-3">
                    Comprehensive lead game designer architecture prompt detailing 6-DoF zero-G physics, combat constraints, and environmental hazards.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#05030d] border border-white/5 font-mono text-[11px] text-purple-300/80 max-h-24 overflow-y-auto">
                  {prompts.antigravity}
                </div>
              </div>
            </div>

            {/* Poster Aesthetics Matrix */}
            <div className="p-6 rounded-3xl bg-[#0c081e] border border-white/10 space-y-4">
              <h4 className="text-base font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                Storefront Poster Aesthetic Prompt Suite
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: "p1", title: "1. Neon Cyberpunk", prompt: prompts.posterCyberpunk, tag: "High Vibrancy" },
                  { id: "p2", title: "2. Retro-Futurism", prompt: prompts.posterRetro, tag: "1980s Synthwave" },
                  { id: "p3", title: "3. Minimalist Corporate", prompt: prompts.posterMinimalist, tag: "Clean Tech" },
                  { id: "p4", title: "4. Surreal Abstract", prompt: prompts.posterSurreal, tag: "Double Exposure" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-400/30 transition-all flex flex-col justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-cyan-300">{item.tag}</span>
                      <h5 className="font-display font-bold text-sm text-white mt-0.5">{item.title}</h5>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCopy(item.id, item.prompt)}
                      className="w-full h-8 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 text-xs rounded-xl font-mono"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      Copy Asset Prompt
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Live UI Parallax Sandbox */}
          <TabsContent value="sandbox" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Controls */}
              <div className="p-6 rounded-3xl bg-[#0c081e] border border-white/10 space-y-5">
                <h4 className="font-display font-bold text-base text-white uppercase tracking-wider">
                  Poster Customizer
                </h4>

                <div className="space-y-3">
                  <label className="text-xs font-mono text-gray-400 uppercase">Select Aesthetic Preset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["cyberpunk", "retro", "minimalist", "surreal"] as const).map((style) => (
                      <Button
                        key={style}
                        variant={selectedStyle === style ? "default" : "outline"}
                        onClick={() => setSelectedStyle(style)}
                        className={`h-10 text-xs font-mono capitalize rounded-xl ${
                          selectedStyle === style ? "bg-cyan-500 text-black font-bold" : "glass text-gray-300"
                        }`}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono text-gray-300">
                  <span className="text-cyan-400 font-bold">Live UI Features Enabled:</span>
                  <ul className="space-y-1 text-[11px] list-disc list-inside text-gray-400">
                    <li>Aspect Ratio Morphing (2:3 to 16:10)</li>
                    <li>3-Layer Mouse Parallax Physics</li>
                    <li>Translucent Social Proof Overlay</li>
                    <li>Dynamic Dominant Glow Extraction</li>
                  </ul>
                </div>
              </div>

              {/* Live Render Card */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/50 border border-white/10 min-h-[420px]">
                <div className="w-full max-w-sm">
                  <InteractivePosterCard
                    title={activePoster.title}
                    category={activePoster.category}
                    price="$59.99"
                    bgLayerUrl={activePoster.bg}
                    charLayerUrl={activePoster.char}
                    dominantColor={activePoster.color}
                    onPlayTrailer={() => toast.info("Opening 4K Trailer Loop...")}
                    onLaunchDemo={() => toast.success("Launching 60s Micro-Demo...")}
                  />
                </div>
                <p className="text-[11px] font-mono text-gray-400 mt-4 text-center">
                  💡 Move cursor over the card to test 3D multi-plane parallax and smooth container expansion.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: 5-Phase Web Optimization Pipeline */}
          <TabsContent value="pipeline" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { phase: "Phase 1", title: "Asset Curation", desc: "Engineered prompts with --ar 2:3 and 8K ESRGAN upscaling." },
                { phase: "Phase 2", title: "UI Prototyping", desc: "Negative space testing, Figma layout frames, text contrast." },
                { phase: "Phase 3", title: "Compression", desc: "AVIF/WebP conversion + Base64 Blurhash 10px placeholders." },
                { phase: "Phase 4", title: "Frontend Layout", desc: "Next.js/React Image component with responsive srcset." },
                { phase: "Phase 5", title: "Interactivity", desc: "Framer Motion hover scaling + dominant color radial shadow." },
              ].map((p, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#0c081e] border border-cyan-500/20 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                    {p.phase}
                  </span>
                  <h5 className="font-display font-bold text-sm text-white">{p.title}</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-gray-300 space-y-2">
              <span className="text-cyan-400 font-bold">// Next.js / React WebP Optimization Snippet:</span>
              <pre className="p-3 rounded-xl bg-[#05030d] text-cyan-200 overflow-x-auto text-[11px]">
{`<Image
  src="/posters/cyber-rebellion.avif"
  alt="Cyber Rebellion 2077"
  width={600}
  height={900}
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAo..."
  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
/>`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
