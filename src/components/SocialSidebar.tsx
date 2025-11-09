import { useState } from "react";
import { useSocial, Friend } from "@/contexts/SocialContext";
import { Users, MessageSquare, Headphones, X, Gamepad2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SocialSidebar() {
  const { isSidebarOpen, toggleSidebar, friends } = useSocial();
  const [activeTab, setActiveTab] = useState<"friends" | "party" | "chat">("friends");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]";
      case "in-game": return "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.6)]";
      case "away": return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]";
      case "offline": return "bg-muted-foreground";
      default: return "bg-muted-foreground";
    }
  };

  const getStatusText = (friend: Friend) => {
    if (friend.status === "in-game" && friend.game) {
      return (
        <span className="text-primary text-xs font-semibold flex items-center gap-1">
          <Gamepad2 className="w-3 h-3" /> Playing {friend.game}
        </span>
      );
    }
    return <span className="text-muted-foreground text-xs capitalize">{friend.status}</span>;
  };

  return (
    <>
      {/* Backdrop overlay for mobile (optional, but good for focus) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/20 backdrop-blur-sm z-[200] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-80 bg-background/90 backdrop-blur-2xl border-l border-border shadow-2xl z-[210] transition-transform duration-500 ease-in-out flex flex-col",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-xl font-bold font-display uppercase tracking-widest bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Social Hub
          </h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-primary/20 hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Filter friends..." 
              className="pl-9 bg-card border-border/50 focus-visible:ring-primary/50"
            />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-1 p-2 bg-muted/30 border-b border-border/50">
          <button
            onClick={() => setActiveTab("friends")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all",
              activeTab === "friends" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            <Users className="w-4 h-4" /> Friends
          </button>
          <button
            onClick={() => setActiveTab("party")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all",
              activeTab === "party" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            <Headphones className="w-4 h-4" /> Party
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all",
              activeTab === "chat" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            <MessageSquare className="w-4 h-4" /> Chat
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
          {activeTab === "friends" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Online — {friends.filter(f => f.status !== 'offline').length}</h3>
                <div className="space-y-1">
                  {friends.filter(f => f.status !== 'offline').map(friend => (
                    <div key={friend.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer group">
                      <div className="relative">
                        <img src={friend.avatar} alt={friend.username} className="w-10 h-10 rounded-full bg-card border border-border group-hover:border-primary/50 transition-colors" />
                        <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background", getStatusColor(friend.status))} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-bold text-sm truncate">{friend.username}</span>
                        {getStatusText(friend)}
                      </div>
                      <MessageSquare className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Offline — {friends.filter(f => f.status === 'offline').length}</h3>
                <div className="space-y-1 opacity-50">
                  {friends.filter(f => f.status === 'offline').map(friend => (
                    <div key={friend.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="relative">
                        <img src={friend.avatar} alt={friend.username} className="w-10 h-10 rounded-full bg-card border border-border grayscale" />
                        <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background", getStatusColor(friend.status))} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-bold text-sm truncate">{friend.username}</span>
                        {getStatusText(friend)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === "party" && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 border border-accent/30">
                <Headphones className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">No Active Party</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-[200px]">Invite friends to a voice channel to start playing together.</p>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                Create Party
              </Button>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Select a Friend</h3>
              <p className="text-muted-foreground text-sm max-w-[200px]">Choose a friend from the list to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
