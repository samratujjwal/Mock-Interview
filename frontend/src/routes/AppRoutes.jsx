import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "../components/ProtectedRoute";
import RouteFallback from "../components/common/RouteFallback";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

const Signup = lazy(() => import("../features/auth/Signup"));
const Login = lazy(() => import("../features/auth/Login"));
const ForgotPassword = lazy(() => import("../features/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../features/auth/ResetPassword"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const InterviewSetupWizard = lazy(
  () => import("../features/interview/InterviewSetupWizard"),
);
const LiveInterview = lazy(() => import("../pages/LiveInterview"));
const CodingInterview = lazy(() => import("../pages/CodingInterview"));

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 max-w-xl px-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AI Mock Interview Platform
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Practice technical, coding, HR, behavioral, and system design
          interviews with an adaptive AI interviewer.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button size="lg" as="a" href="/signup">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<InterviewSetupWizard />} />
          <Route path="/coding" element={<CodingInterview />} />
          <Route
            path="/interview/session/:sessionId"
            element={<LiveInterview />}
          />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
