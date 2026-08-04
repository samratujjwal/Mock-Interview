import { Bell, Menu, Moon, Search, Sparkles, Sun } from "lucide-react";
import useAuthStore from "../../store/useAuthStore.js";
import useTheme from "../../hooks/useTheme.jsx";

export default function Navbar({ onOpenDrawer }) {
  const user = useAuthStore((s) => s.user);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open menu"
          className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-primary md:hidden">
          <Sparkles className="h-6 w-6" />
        </div>
      </div>

      <div className="hidden flex-1 max-w-md sm:flex">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt={user?.name || "User avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            (user?.name?.[0] || "?").toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
}
