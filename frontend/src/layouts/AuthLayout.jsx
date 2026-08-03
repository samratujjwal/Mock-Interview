import { Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="mb-6 flex items-center gap-2 text-primary">
        <Sparkles className="h-8 w-8" />
        <span className="text-lg font-semibold">AI Mock Interview</span>
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
