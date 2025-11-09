import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { name: "Cyber Blue", class: "" },
  { name: "Neon Purple", class: "theme-neon-purple" },
  { name: "Matrix Green", class: "theme-matrix-green" },
  { name: "Fire Red", class: "theme-fire-red" },
  { name: "Ocean Blue", class: "theme-ocean-blue" },
  { name: "Sunset Orange", class: "theme-sunset-orange" },
  { name: "Electric Cyan", class: "theme-electric-cyan" },
  { name: "Neon Pink", class: "theme-neon-pink" },
  { name: "Golden Yellow", class: "theme-golden-yellow" },
  { name: "Cyber Blue Alt", class: "theme-cyber-blue" },
];

export const ThemeSwitcher = () => {
  const changeTheme = (themeClass: string) => {
    // Remove all theme classes
    themes.forEach((theme) => {
      if (theme.class) {
        document.documentElement.classList.remove(theme.class);
      }
    });
    // Add new theme class if not default
    if (themeClass) {
      document.documentElement.classList.add(themeClass);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="hover-circle border-primary">
          <Palette className="h-5 w-5 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-primary">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => changeTheme(theme.class)}
            className="cursor-pointer hover:bg-primary/20"
          >
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
