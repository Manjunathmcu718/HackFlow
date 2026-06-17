import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/context/NotificationContext";

const Landing = lazy(() => import("./pages/Landing"));
const HackathonList = lazy(() => import("./pages/HackathonList"));
const HackathonDetail = lazy(() => import("./pages/HackathonDetail"));
const RegisterHackathon = lazy(() => import("./pages/RegisterHackathon"));
const ParticipantDashboard = lazy(() => import("./pages/ParticipantDashboard"));
const SubmitProject = lazy(() => import("./pages/SubmitProject"));
const JudgePanel = lazy(() => import("./pages/JudgePanel"));
const OrganizerDashboard = lazy(() => import("./pages/OrganizerDashboard"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm font-semibold text-gray-500">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Router>
          <Toaster position="top-right" richColors />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/hackathons" element={<HackathonList />} />
              <Route path="/hackathon/:id" element={<HackathonDetail />} />
              <Route path="/register-hackathon" element={<RegisterHackathon />} />
              <Route path="/participant" element={<ParticipantDashboard />} />
              <Route path="/submit" element={<SubmitProject />} />
              <Route path="/judge" element={<JudgePanel />} />
              <Route path="/organizer" element={<OrganizerDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-gray-400">Page not found</div>} />
            </Routes>
          </Suspense>
        </Router>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
