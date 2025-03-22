import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PatientLayout from "./components/layout/PatientLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register"; // ✅ Import Register page
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import EditPatient from "./pages/patient/EditPatient"; // ✅ Import Edit Patient page
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import Settings from "./pages/patient/Settings";
import Prescriptions from "./pages/patient/Prescriptions"; // ✅ Import Prescriptions page
import BookAppointment from "./pages/patient/BookAppointment";
import PatientDashboard from "./pages/patient/Dashboard";

declare global {
  interface Window {
    cordova?: any;
  }
}

const queryClient = new QueryClient();

// Authentication guard for admin routes
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

// Authentication guard for patient routes
const PatientRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const isCordova = typeof window !== 'undefined' && !!window.cordova;
const Router = isCordova ? HashRouter : BrowserRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* ✅ Added Register route */}

          {/* ✅ Admin routes with layout and auth guard */}
          <Route
            element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:patientId/edit" element={<EditPatient />} /> {/* ✅ Fixed Route */}
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/billing" element={<div className="p-8 text-center">Billing page coming soon</div>} />
          </Route>

          {/* ✅ Patient routes with patient layout and auth guard */}
          <Route
            element={
              <PatientRoute>
                <PatientLayout />
              </PatientRoute>
            }
          >
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/book-appointment" element={<BookAppointment />} />
            <Route path="/patient/prescriptions" element={<Prescriptions />} /> {/* ✅ Fixed route */}
            <Route path="/patient/bills" element={<div className="p-8 text-center">Bills page coming soon</div>} />
            <Route path="/patient/profile" element={<div className="p-8 text-center">Profile page coming soon</div>} />
          </Route>

          {/* Not found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;