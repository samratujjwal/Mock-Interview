import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOBILE_PRIMARY_ITEMS,
  MOBILE_DRAWER_ITEMS,
} from "../../constants/navigation.js";

function NavItem({ label, to, icon: Icon, comingSoon, vertical }) {
  if (comingSoon) {
    return (
      <div
        aria-disabled="true"
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/50 cursor-not-allowed",
          vertical && "flex-col gap-1 py-1 text-xs",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          vertical && "flex-col gap-1 py-1 text-xs",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

export function MobileBottomNav({ onOpenDrawer }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background py-2 md:hidden">
      {MOBILE_PRIMARY_ITEMS.map((item) => (
        <NavItem key={item.to} {...item} vertical />
      ))}
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="More navigation options"
        className="flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreHorizontal className="h-5 w-5" />
        <span>More</span>
      </button>
    </nav>
  );
}

export function MobileDrawer({ open, onClose, onLogout }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-background p-4 shadow-xl md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold">Menu</span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {MOBILE_DRAWER_ITEMS.map((item) => (
                  <NavItem key={item.to} {...item} />
                ))}
              </nav>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
