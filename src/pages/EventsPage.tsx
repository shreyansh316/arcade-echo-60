import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Calendar, Trophy, Users, Clock, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: "cyber-rebellion-tournament",
    title: "Cyber Rebellion Tournament",
    game: "Cyber Rebellion 2077",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop",
    date: "2024-06-15",
    time: "18:00",
    participants: 1250,
    prize: "$10,000",
    description: "Compete in the ultimate cyberpunk battle royale",
    category: "Tournament",
  },
  {
    id: "shadow-warriors-raid",
    title: "Shadow Warriors Raid Event",
    game: "Shadow Warriors",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    date: "2024-06-20",
    time: "20:00",
    participants: 850,
    prize: "Exclusive Armor Set",
    description: "Team up to defeat the legendary boss",
    category: "Raid",
  },
  {
    id: "neon-velocity-championship",
    title: "Neon Velocity Championship",
    game: "Neon Velocity",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop",
    date: "2024-06-25",
    time: "19:00",
    participants: 2100,
    prize: "$5,000 + Racing Car",
    description: "Speed through neon-lit tracks in this epic racing championship",
    category: "Championship",
  },
  {
    id: "mystic-legends-guild-wars",
    title: "Mystic Legends Guild Wars",
    game: "Mystic Legends",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
    date: "2024-07-01",
    time: "17:00",
    participants: 3200,
    prize: "Legendary Weapons + Gold",
    description: "Guilds battle for supremacy in the magical realm",
    category: "Guild War",
  },
  {
    id: "doom-eternal-nightmare",
    title: "Doom Eternal Nightmare Mode",
    game: "Doom Eternal 2",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=600&fit=crop",
    date: "2024-07-05",
    time: "21:00",
    participants: 1800,
    prize: "Exclusive Demon Slayer Skin",
    description: "Survive the hardest difficulty mode",
    category: "Challenge",
  },
  {
    id: "apex-warriors-battle-royale",
    title: "Apex Warriors Battle Royale",
    game: "Apex Warriors",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    date: "2024-07-10",
    time: "18:30",
    participants: 4500,
    prize: "$15,000",
    description: "Massive battle royale with special rewards",
    category: "Battle Royale",
  },
];

export default function EventsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 glitch-on-viewport bg-gradient-to-r from-primary via-[hsl(var(--glow-secondary))] to-primary bg-clip-text text-transparent">
            Gaming Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join exciting tournaments, challenges, and community events. Compete for prizes and glory!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative rounded-xl overflow-hidden border border-border bg-card hover:border-primary transition-all cursor-pointer"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold glow z-10">
                  {event.category}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg">
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/90 drop-shadow-md">{event.game}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{event.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{event.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{event.prize}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:text-primary">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

