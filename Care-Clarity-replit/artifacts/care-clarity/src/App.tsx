import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import initialized i18n
import "@/i18n";

// Pages
import Home from "@/pages/home";
import Consultation from "@/pages/consultation";
import Transcript from "@/pages/transcript";
import History from "@/pages/history";
import Providers from "@/pages/providers";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Booking from "@/pages/booking";
import BookingCall from "@/pages/booking-call";
import BookingForm from "@/pages/booking-form";
import BookingEmail from "@/pages/booking-email";
import Intake from "@/pages/intake";
import IntakeCamera from "@/pages/intake-camera";
import Pharmacy from "@/pages/pharmacy";
import Referrals from "@/pages/referrals";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Providers} />
      <Route path="/book" component={Booking} />
      <Route path="/book/call" component={BookingCall} />
      <Route path="/book/form" component={BookingForm} />
      <Route path="/book/email" component={BookingEmail} />
      <Route path="/consultation" component={Consultation} />
      <Route path="/intake" component={Intake} />
      <Route path="/intake/camera" component={IntakeCamera} />
      <Route path="/post-visit/:id" component={Transcript} />
      <Route path="/transcript/:id" component={Transcript} />
      <Route path="/pharmacy" component={Pharmacy} />
      <Route path="/referrals" component={Referrals} />
      <Route path="/history" component={History} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;