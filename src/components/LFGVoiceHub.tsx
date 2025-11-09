import React, { useState, useEffect } from "react";
import { useSocial } from "@/contexts/SocialContext";
import { useGridTokens } from "@/contexts/GridTokenContext";
import {
  Mic,
  MicOff,
  Headphones,
  Users,
  Radio,
  Volume2,
  PhoneCall,
  PhoneOff,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VoiceChannel {
  id: string;
  name: string;
  game: string;
  activeUsers: { name: string; avatar: string; isSpeaking: boolean }[];
  maxUsers: number;
}

const defaultChannels: VoiceChannel[] = [
  {
    id: "v-1",
    name: "Cyber Rebellion Alpha Squad",
    game: "Cyber Rebellion 2077",
    activeUsers: [
      { name: "Xx_GamerKing_xX", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=King", isSpeaking: true },
      { name: "NeonNinja", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja", isSpeaking: false },
    ],
    maxUsers: 4,
  },
  {
    id: "v-2",
    name: "Neon Velocity Pro Drifters",
    game: "Neon Velocity",
    activeUsers: [
      { name: "SpeedDemon", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Speed", isSpeaking: true },
    ],
    maxUsers: 4,
  },
];

export const LFGVoiceHub: React.FC = () => {
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([12, 24, 45, 30, 60, 20, 15, 38]);
  const { addTokens } = useGridTokens();

  // Waveform animation
  useEffect(() => {
    if (!activeChannelId || isMicMuted) return;
    const interval = setInterval(() => {
      setWaveformData(Array.from({ length: 8 }, () => Math.floor(Math.random() * 45 + 10)));
    }, 120);
    return () => clearInterval(interval);
  }, [activeChannelId, isMicMuted]);

  const handleJoinChannel = (channel: VoiceChannel) => {
    setActiveChannelId(channel.id);
    toast.success(`Connected to ${channel.name}`, {
      description: "Spatial WebRTC Voice Channel active (US-East Edge)",
      icon: "🎙️",
    });
    addTokens(20, `Joined LFG Voice Party: ${channel.name}`);
  };

  const handleLeaveChannel = () => {
    setActiveChannelId(null);
    toast.info("Disconnected from voice channel.");
  };

  const currentChannel = defaultChannels.find((c) => c.id === activeChannelId);

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0c081e] via-[#080614] to-[#04030a] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
              Live LFG Voice Channels
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 text-[10px] font-mono font-bold">
                WEBRTC LIVE
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Jump into open squad voice lobbies to play and co-op with community members
            </p>
          </div>
        </div>

        {activeChannelId && (
          <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-2 rounded-lg transition-colors ${
                isMicMuted ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-300"
              }`}
              title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsDeafened(!isDeafened)}
              className={`p-2 rounded-lg transition-colors ${
                isDeafened ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-300"
              }`}
              title={isDeafened ? "Undeafen" : "Deafen Audio"}
            >
              <Headphones className="w-4 h-4" />
            </button>

            <Button
              size="sm"
              onClick={handleLeaveChannel}
              className="h-8 px-3 bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-bold rounded-lg border border-red-500/40"
            >
              <PhoneOff className="w-3.5 h-3.5 mr-1" /> Disconnect
            </Button>
          </div>
        )}
      </div>

      {/* Active Voice Waveform HUD if in channel */}
      {activeChannelId && currentChannel && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=You"
                alt="You"
                className="w-9 h-9 rounded-full border-2 border-green-400"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border border-black animate-ping" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block truncate">
                Connected to {currentChannel.name}
              </span>
              <span className="text-[10px] font-mono text-cyan-300">
                12ms Ping • Opus 48kHz Audio Stream
              </span>
            </div>
          </div>

          {/* Real-time Audio Waveform */}
          <div className="flex items-center gap-1 h-6 px-3 bg-black/40 rounded-lg border border-white/5">
            {waveformData.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-cyan-400 rounded-full transition-all duration-100"
                style={{ height: `${isMicMuted ? 4 : height}px` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Voice Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defaultChannels.map((channel) => {
          const isCurrent = activeChannelId === channel.id;
          return (
            <div
              key={channel.id}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrent
                  ? "bg-cyan-500/15 border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                  : "bg-black/40 border-white/10 hover:border-cyan-500/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="text-sm font-display font-bold text-white leading-tight">
                    {channel.name}
                  </h4>
                  <span className="text-[11px] font-mono text-cyan-300">{channel.game}</span>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300 text-[10px] font-mono">
                  {channel.activeUsers.length}/{channel.maxUsers} In Voice
                </span>
              </div>

              {/* Members Avatars */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {channel.activeUsers.map((u, i) => (
                      <div key={i} className="relative" title={`${u.name} (In Voice)`}>
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className={`w-7 h-7 rounded-full border-2 bg-card ${
                            u.isSpeaking ? "border-green-400 animate-pulse" : "border-gray-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-sans">
                    {channel.activeUsers.map((u) => u.name).join(", ")}
                  </span>
                </div>

                {!isCurrent ? (
                  <Button
                    size="sm"
                    onClick={() => handleJoinChannel(channel)}
                    className="h-8 px-3 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 mr-1" /> Join Squad
                  </Button>
                ) : (
                  <span className="text-xs font-mono font-bold text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" /> Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
