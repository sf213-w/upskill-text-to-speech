import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import "./lib/i18n"; // Initialize i18n
import { useSettings } from "./store/settings";
import { useHistory } from "./store/history";

// Pages
import Dashboard from "./pages/dashboard";
import Onboarding from "./pages/onboarding";
import Consultation from "./pages/consultation";
import History from "./pages/history";
import Settings from "./pages/settings";
import Providers from "./pages/providers";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RouteWrapper() {
  const [location, setLocation] = useLocation();
  const { onboardingDone } = useSettings();
  const { fetchSessions } = useHistory();

  useEffect(() => {
    // Redirect to onboarding if not done, unless already there
    if (!onboardingDone && location !== '/onboarding') {
      setLocation('/onboarding');
    }
  }, [onboardingDone, location, setLocation]);

  // Fetch sessions from Supabase on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/consultation" component={Consultation} />
      <Route path="/history" component={History} />
      <Route path="/settings" component={Settings} />
      <Route path="/providers" component={Providers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <RouteWrapper />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
