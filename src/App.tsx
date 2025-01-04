import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { supabase } from "./integrations/supabase/client";
import "./App.css";

// Lazy load routes
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
      suspense: true, // Enable suspense mode for queries
    },
  },
});

function App() {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={null}
    >
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;