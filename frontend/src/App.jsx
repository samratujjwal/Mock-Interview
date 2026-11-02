import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

import Signup from './features/auth/Signup';
import Login from './features/auth/Login';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import InterviewSetupWizard from './features/interview/InterviewSetupWizard';
import api from './services/api';
import { setAuthHeader } from './utils/authHeader';
import useAuthStore from './store/useAuthStore';

const HomePage = () => {
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
};

const App = () => {
  React.useEffect(() => {
    // Attempt session restore via refresh endpoint on app load
    (async () => {
      try {
        const res = await api.post('/auth/refresh');
        const user = res.data?.data?.user || res.data?.user || null;
        const accessToken = res.data?.data?.accessToken || res.data?.accessToken || null;
        if (user && accessToken) {
          useAuthStore.getState().setUser(user, accessToken);
          setAuthHeader(accessToken);
        }
      } catch (err) {
        // no-op: silent fail (user remains unauthenticated)
        // console.info('Session restore failed', err);
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewSetupWizard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
