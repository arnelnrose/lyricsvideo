import { HelpCircle } from "lucide-react";

import { ProfileMenu } from "@/components/profile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function TopBar({ userEmail, onLogout }) {
  return (
    <header className="h-16 border-b border-border/70 bg-card/70 backdrop-blur-xl supports-[backdrop-filter]:bg-card/50">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="text-cyan-400 text-xl font-black tracking-wider">LF</div>
          <span className="hidden text-sm text-muted-foreground sm:inline">Lyrics Flow Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" variant="ghost" className="px-2 sm:px-3">
            <HelpCircle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Help</span>
          </Button>
          <ProfileMenu userEmail={userEmail} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
