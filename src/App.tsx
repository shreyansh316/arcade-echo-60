import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SocialProvider } from "@/contexts/SocialContext";
import { GridTokenProvider } from "@/contexts/GridTokenContext";
import { TasteProfileProvider } from "@/contexts/TasteProfileContext";
import { AmbientThemeProvider } from "@/contexts/AmbientThemeContext";
import { TrailerPlayerProvider } from "@/contexts/TrailerPlayerContext";
import { PersistentTrailerPlayer } from "@/components/PersistentTrailerPlayer";
import { SocialSidebar } from "@/components/SocialSidebar";
import Index from "./pages/Index";
import RacingCategory from "./pages/RacingCategory";
import ActionCategory from "./pages/ActionCategory";
import RPGCategory from "./pages/RPGCategory";
import AdventureCategory from "./pages/AdventureCategory";
import ShooterCategory from "./pages/ShooterCategory";
import SciFiCategory from "./pages/SciFiCategory";
import CartPage from "./pages/CartPage";
import TransactionPage from "./pages/TransactionPage";
import LoginPage from "./pages/LoginPage";
import MagicLinkHandler from "./pages/MagicLinkHandler";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AchievementsPage from "./pages/AchievementsPage";
import MyGamesPage from "./pages/MyGamesPage";
import StorePage from "./pages/StorePage";
import GameDetailPage from "./pages/GameDetailPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import WishlistPage from "./pages/WishlistPage";
import NotFound from "./pages/NotFound";
import { BumblebeeAvatar } from "./components/BumblebeeAvatar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <GridTokenProvider>
          <TasteProfileProvider>
            <AmbientThemeProvider>
              <TrailerPlayerProvider>
                <SocialProvider>
                  <WishlistProvider>
                    <CartProvider>
                      <Toaster />
                      <Sonner position="top-right" richColors />
                      <BrowserRouter>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/category/racing" element={<RacingCategory />} />
                          <Route path="/category/action" element={<ActionCategory />} />
                          <Route path="/category/rpg" element={<RPGCategory />} />
                          <Route path="/category/adventure" element={<AdventureCategory />} />
                          <Route path="/category/shooter" element={<ShooterCategory />} />
                          <Route path="/category/scifi" element={<SciFiCategory />} />
                          <Route path="/store" element={<StorePage />} />
                          <Route path="/game/:id" element={<GameDetailPage />} />
                          <Route path="/events" element={<EventsPage />} />
                          <Route path="/events/:id" element={<EventDetailPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/transaction" element={<TransactionPage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/magic-login" element={<MagicLinkHandler />} />
                          <Route path="/dashboard" element={<DashboardPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/achievements" element={<AchievementsPage />} />
                          <Route path="/my-games" element={<MyGamesPage />} />
                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                        <BumblebeeAvatar />
                        <SocialSidebar />
                        <PersistentTrailerPlayer />
                      </BrowserRouter>
                    </CartProvider>
                  </WishlistProvider>
                </SocialProvider>
              </TrailerPlayerProvider>
            </AmbientThemeProvider>
          </TasteProfileProvider>
        </GridTokenProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
