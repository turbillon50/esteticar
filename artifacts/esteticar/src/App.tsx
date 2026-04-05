import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/AuthProvider";
import { MobileLayout } from "@/components/MobileLayout";
import { useAuth } from "@/components/AuthProvider";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Services from "@/pages/Services";
import Locations from "@/pages/Locations";
import Book from "@/pages/Book";
import Bookings from "@/pages/Bookings";
import Profile from "@/pages/Profile";
import ProviderHome from "@/pages/ProviderHome";
import ProviderSchedule from "@/pages/ProviderSchedule";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminBookings from "@/pages/AdminBookings";
import AdminLocations from "@/pages/AdminLocations";
import AdminServices from "@/pages/AdminServices";
import AdminProviders from "@/pages/AdminProviders";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function RoleRouter() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Auth */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Public + Customer home */}
      <Route path="/services" component={Services} />
      <Route path="/locations" component={Locations} />

      {/* Customer routes */}
      <Route path="/book" component={Book} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/profile" component={Profile} />

      {/* Provider routes */}
      <Route path="/schedule" component={ProviderSchedule} />
      <Route path="/history" component={ProviderSchedule} />

      {/* Admin routes */}
      <Route path="/admin/bookings" component={AdminBookings} />
      <Route path="/admin/locations" component={AdminLocations} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/providers" component={AdminProviders} />
      <Route path="/admin">
        {() => <AdminDashboard />}
      </Route>

      {/* Home - role-aware */}
      <Route path="/">
        {() => {
          if (user?.role === "provider") return <ProviderHome />;
          if (user?.role === "admin") return <AdminDashboard />;
          return <Home />;
        }}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AuthProvider>
          <MobileLayout>
            <RoleRouter />
          </MobileLayout>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "16px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: "600",
                fontSize: "14px",
              },
            }}
          />
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
