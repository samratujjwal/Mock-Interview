import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "../../constants/navigation";

export default function Sidebar({ collapsed, onToggleCollapsed, onLogout }) {
  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col md:justify-between border-r border-border bg-background transition-all duration-200",
        collapsed ? "md:w-16" : "md:w-60",
      )}
    >
      <div>
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 text-primary overflow-hidden">
            <Sparkles className="h-6 w-6 shrink-0" />
            {!collapsed && (
              <span className="font-semibold whitespace-nowrap">
                Mock Interview
              </span>
            )}
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-2">
          {NAV_ITEMS.map(({ label, to, icon: Icon, comingSoon }) =>
            comingSoon ? (
              <div
                key={to}
                aria-disabled="true"
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <span className="whitespace-nowrap">{label}</span>
                  )}
                </span>
                {!collapsed && (
                  <span className="text-[10px] uppercase tracking-wide">
                    Soon
                  </span>
                )}
              </div>
            ) : (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap">{label}</span>
                )}
              </NavLink>
            ),
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-1 px-2 pb-4">
        <button
          type="button"
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
