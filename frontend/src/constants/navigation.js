import {
  LayoutDashboard,
  MessageSquareText,
  Code2,
  FileText,
  History,
  GraduationCap,
  Trophy,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Interviews", to: "/interview", icon: MessageSquareText },
  { label: "Coding", to: "/coding", icon: Code2, comingSoon: true },
  { label: "Reports", to: "/reports", icon: FileText, comingSoon: true },
  { label: "History", to: "/history", icon: History, comingSoon: true },
  { label: "Learning", to: "/learning", icon: GraduationCap, comingSoon: true },
  {
    label: "Achievements",
    to: "/achievements",
    icon: Trophy,
    comingSoon: true,
  },
  { label: "Settings", to: "/profile", icon: Settings },
];

// Bottom nav prioritizes working routes; everything else (including
// comingSoon items) lives in the drawer.
const availableItems = NAV_ITEMS.filter((item) => !item.comingSoon);
const comingSoonItems = NAV_ITEMS.filter((item) => item.comingSoon);

export const MOBILE_PRIMARY_ITEMS = availableItems.slice(0, 4);
export const MOBILE_DRAWER_ITEMS = [
  ...availableItems.slice(4),
  ...comingSoonItems,
];
