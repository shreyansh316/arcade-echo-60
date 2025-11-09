import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Trophy, Gift, ArrowLeft, CheckCircle2, Share2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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
    tasks: [
      { id: 1, name: "Win 10 matches", reward: "500 points", completed: false },
      { id: 2, name: "Get 50 eliminations", reward: "Exclusive weapon skin", completed: false },
      { id: 3, name: "Reach top 10", reward: "Tournament badge", completed: false },
    ],
    rewards: [
      "1st Place: $5,000 + Exclusive Champion Skin",
      "2nd Place: $3,000 + Rare Weapon",
      "3rd Place: $2,000 + Special Avatar",
      "Top 10: Tournament Badge + 1000 Points",
    ],
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
    tasks: [
      { id: 1, name: "Defeat the boss", reward: "Exclusive armor set", completed: false },
      { id: 2, name: "Complete with team", reward: "Team badge", completed: false },
      { id: 3, name: "Deal 100K damage", reward: "Damage dealer title", completed: false },
    ],
    rewards: [
      "All Participants: Exclusive Armor Set",
      "Top Damage Dealers: Legendary Weapon",
      "Fastest Completion: Special Title",
    ],
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
    tasks: [
      { id: 1, name: "Win a race", reward: "Racing points", completed: false },
      { id: 2, name: "Set fastest lap", reward: "Speed demon badge", completed: false },
      { id: 3, name: "Complete all tracks", reward: "Championship car", completed: false },
    ],
    rewards: [
      "1st Place: $3,000 + Championship Car",
      "2nd Place: $1,500 + Rare Car",
      "3rd Place: $500 + Special Paint",
    ],
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
    tasks: [
      { id: 1, name: "Join a guild", reward: "Guild member badge", completed: false },
      { id: 2, name: "Win guild battle", reward: "Victory points", completed: false },
      { id: 3, name: "Capture territory", reward: "Territory badge", completed: false },
    ],
    rewards: [
      "Winning Guild: Legendary Weapons for All Members",
      "Top 3 Guilds: Rare Items + Gold",
      "All Participants: Guild War Badge",
    ],
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
    tasks: [
      { id: 1, name: "Complete nightmare mode", reward: "Demon slayer skin", completed: false },
      { id: 2, name: "No deaths run", reward: "Perfect run badge", completed: false },
      { id: 3, name: "Speed run under 2 hours", reward: "Speed demon title", completed: false },
    ],
    rewards: [
      "Completion: Demon Slayer Skin",
      "No Deaths: Perfect Run Badge",
      "Speed Run: Exclusive Title",
    ],
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
    tasks: [
      { id: 1, name: "Win a match", reward: "Victory badge", completed: false },
      { id: 2, name: "Get 10 kills", reward: "Killer badge", completed: false },
      { id: 3, name: "Survive to top 5", reward: "Survivor badge", completed: false },
    ],
    rewards: [
      "1st Place: $8,000 + Champion Skin",
      "2nd Place: $4,000 + Rare Skin",
      "3rd Place: $3,000 + Special Skin",
      "Top 10: Battle Royale Badge",
    ],
  },
];

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [email, setEmail] = useState("");

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button onClick={() => navigate("/events")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    setRegistered(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/events")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Event Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold glow">
                {event.category}
              </div>
            </div>

            {/* Event Info */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{event.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="font-semibold">{event.participants.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                    <p className="font-semibold">{event.prize}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <h2 className="text-2xl font-bold mb-6">Tasks & Challenges</h2>
              <div className="space-y-4">
                {event.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-background"
                  >
                    <div className="flex items-center gap-4">
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                      )}
                      <div>
                        <p className="font-semibold">{task.name}</p>
                        <p className="text-sm text-muted-foreground">Reward: {task.reward}</p>
                      </div>
                    </div>
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                Rewards
              </h2>
              <ul className="space-y-3">
                {event.rewards.map((reward, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Gift className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{reward}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Registration */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-bold mb-4">Registration</h3>
                {registered ? (
                  <div className="text-center py-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="font-semibold mb-2">Registered!</p>
                    <p className="text-sm text-muted-foreground">
                      You're all set for the event
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={handleRegister}
                      className="w-full"
                      size="lg"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register for Event
                    </Button>
                  </div>
                )}
              </div>

              {/* Referral */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-bold mb-4">Referral Program</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="referral">Referral Code</Label>
                    <Input
                      id="referral"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter code"
                      className="mt-2"
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    Apply Referral Code
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

