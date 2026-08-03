import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { MobileBottomNav, MobileDrawer } from "../components/layout/MobileNav";
import useLogout from "../hooks/useLogout";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const logout = useLogout();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        onLogout={logout}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar onOpenDrawer={() => setDrawerOpen(true)} />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-20 sm:px-6 md:pb-6 lg:px-8">
          <Outlet />
        </main>

        <MobileBottomNav onOpenDrawer={() => setDrawerOpen(true)} />
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onLogout={logout}
        />
      </div>
    </div>
  );
}
