import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PatientLayout from "./components/layout/PatientLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import EditPatient from "./pages/patient/EditPatient";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import Settings from "./pages/patient/Settings";
import Prescriptions from "./pages/patient/Prescriptions";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientDashboard from "./pages/patient/Dashboard";
import Profile from "./pages/patient/Profile";

declare global {
  interface Window {
    cordova?: any;
  }
}

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/patient/dashboard" replace />;
  }

  return <>{children}</>;
};

const PatientRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const isCordova = !!window.cordova;
const Router = isCordova ? HashRouter : BrowserRouter;

const App = () => {
  // Track the current user
  const [currentUser, setCurrentUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  // Apply dark mode based on the current user's preference
  useEffect(() => {
    const userId = currentUser?.id;
    if (!userId) {
      // If no user is logged in, remove the dark class (default to light mode)
      document.body.classList.remove("dark");
      return;
    }

    // Get the user's dark mode preference
    const userDarkModesStr = localStorage.getItem("userDarkModes");
    const userDarkModes = userDarkModesStr ? JSON.parse(userDarkModesStr) : {};
    const isDarkMode = userDarkModes[userId] ?? false;

    // Apply the dark class based on the user's preference
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [currentUser]);

  // Monitor changes to the user in localStorage (e.g., after login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem("user");
      const newUser = userStr ? JSON.parse(userStr) : null;
      setCurrentUser(newUser);
    };

    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener("storage", handleStorageChange);

    // Also check on initial load and when the user changes
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                element={
                  <AdminRoute>
                    <Layout />
                  </AdminRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/:patientId/edit" element={<EditPatient />} />
                <Route path="/appointments" element={<Appointments />} />
                {/* <Route path="/billing" element={<div className="p-8 text-center text-foreground">Billing page coming soon</div>} /> */}
                {/* <Route path="/settings" element={<Settings />} /> */}
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route
                element={
                  <PatientRoute>
                    <PatientLayout />
                  </PatientRoute>
                }
              >
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/book-appointment" element={<BookAppointment />} />
                <Route path="/patient/prescriptions" element={<Prescriptions />} />
                {/* <Route path="/patient/bills" element={<div className="p-8 text-center text-foreground">Bills page coming soon</div>} /> */}
                <Route path="/patient/profile" element={<Profile />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;