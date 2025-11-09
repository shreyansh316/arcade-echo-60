import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import ParticleCanvas from "@/components/ParticleCanvas";
import { allGames, upcomingGames } from "@/data/games";

const GameDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [livePlayers, setLivePlayers] = useState(0);
    
    // Find game
    const game = [...allGames, ...upcomingGames].find(g => g.id === id);

    useEffect(() => {
        if (!id) return;
        
        // 1. Establish WebSocket Connection
        const ws = new WebSocket(`ws://localhost:3000/?gameId=${id}`);
        
        ws.onopen = () => {
            console.log("Connected to game presence server.");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.gameId === id) {
                    setLivePlayers(data.count);
                }
            } catch(e) {
                console.error(e);
            }
        };

        ws.onerror = (err) => {
            console.error("WS Error:", err);
        };

        // 2. Cleanup on dismount
        return () => {
            if (ws.readyState === 1) { // OPEN
                ws.close();
            }
        };
    }, [id]);

    if (!game) return <div className="text-white text-center py-20">Game Not Found</div>;

    return (
        <div className="min-h-screen bg-background text-white relative overflow-x-hidden">
            <ParticleCanvas />
            <Header />
            
            <main className="container mx-auto px-4 py-8 relative z-10">
                <button className="text-gray-400 hover:text-white mb-6" onClick={() => navigate(-1)}>
                    ← Back to Store
                </button>
                
                <div className="relative rounded-3xl overflow-hidden border border-white/10 h-[60vh] min-h-[400px]">
                    <img src={game.image} alt={game.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-end p-12">
                        {/* Live Player Ticker */}
                        <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-full mb-6 max-w-fit shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                            <span className="font-display text-sm tracking-widest text-cyan-50">
                                {livePlayers} USERS BROWSING THIS GAME RIGHT NOW
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold uppercase mb-4 tracking-wider animate-text-shimmer">{game.title}</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
                            {game.description}
                        </p>
                        
                        <div className="flex gap-4 items-center">
                            <button className="btn-action text-lg px-10 py-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                PURCHASE {game.price}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GameDetail;
