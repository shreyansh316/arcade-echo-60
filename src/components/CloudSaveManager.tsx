import React, { useState } from "react";
import {
  Cloud,
  CheckCircle2,
  RefreshCw,
  Download,
  Laptop,
  Gamepad2,
  HardDrive,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SaveSlot {
  id: string;
  gameTitle: string;
  slotName: string;
  progress: string;
  size: string;
  lastSynced: string;
  platforms: string[];
}

const defaultSaves: SaveSlot[] = [
  {
    id: "save-1",
    gameTitle: "Cyber Rebellion 2077",
    slotName: "Manual Save 01 (Act IV - Final Heist)",
    progress: "Level 48 Cyber Samurai • 38h Played",
    size: "14.2 MB",
    lastSynced: "Just now",
    platforms: ["PC Ultra", "Steam Deck", "GameVerse Cloud"],
  },
  {
    id: "save-2",
    gameTitle: "Neon Velocity",
    slotName: "AutoSave (Grand Prix Finals)",
    progress: "All Gold Trophies • 14h Played",
    size: "4.8 MB",
    lastSynced: "2h ago",
    platforms: ["PC Ultra", "GameVerse Cloud"],
  },
  {
    id: "save-3",
    gameTitle: "Star Command",
    slotName: "Flagship Dreadnought Campaign",
    progress: "Sector 12 Conquered • 22h Played",
    size: "8.1 MB",
    lastSynced: "Yesterday",
    platforms: ["PC Ultra", "Steam Deck"],
  },
];

export const CloudSaveManager: React.FC = () => {
  const [saves, setSaves] = useState<SaveSlot[]>(defaultSaves);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSaves((prev) =>
        prev.map((s) => ({ ...s, lastSynced: "Just now" }))
      );
      toast.success("All Cloud Saves Synchronized!", {
        description: "Zero-conflict delta sync complete via AWS S3 Edge nodes.",
        icon: "☁️",
      });
    }, 1200);
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0c081e]/90 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
              Cross-Platform Cloud Save Vault
              <span className="px-2 py-0.2 rounded-full bg-green-500/20 text-green-300 text-[9px] font-mono font-bold">
                AUTO-SYNC ACTIVE
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Seamlessly continue your single-player and co-op campaigns on any device
            </p>
          </div>
        </div>

        <Button
          onClick={handleSyncAll}
          disabled={isSyncing}
          className="h-9 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync All Saves"}
        </Button>
      </div>

      {/* Save Slots List */}
      <div className="space-y-3">
        {saves.map((slot) => (
          <div
            key={slot.id}
            className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white text-sm">{slot.gameTitle}</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.2 rounded">
                  {slot.size}
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium">{slot.slotName}</p>
              <p className="text-[11px] text-gray-400 font-mono">{slot.progress}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Platform Badges */}
              <div className="flex items-center gap-1.5">
                {slot.platforms.map((plat) => (
                  <span
                    key={plat}
                    className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300"
                  >
                    {plat}
                  </span>
                ))}
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Synced ({slot.lastSynced})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
