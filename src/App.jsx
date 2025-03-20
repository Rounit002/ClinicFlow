import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PatientLayout from "./components/layout/PatientLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import EditPatient from "./pages/patient/EditPatient"; // ✅ Import Edit Patient Page
import Settings from "./pages/patient/Settings";

// Patient pages
import PatientDashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import Prescriptions from "./pages/patient/Prescriptions";
import Billing from "./pages/patient/Billing";
import Profile from "./pages/patient/Profile";
import Settings from "./pages/patient/Settings";

const queryClient = new QueryClient();

// ✅ Authentication guard for admin routes
const AdminRoute = ({ children }) => {
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

// ✅ Authentication guard for patient routes
const PatientRoute = ({ children }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

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
            <Route path="/patients/:patientId/edit" element={<EditPatient />} /> {/* ✅ Fix: Add Edit Patient Route */}
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/billing" element={<div className="p-8 text-center">Billing page coming soon</div>} />
            <Route path="/settings" element={<Settings />} />
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
            <Route path="/patient/prescriptions" element={<Prescriptions />} />
            <Route path="/patient/bills" element={<Billing />} />
            <Route path="/patient/profile" element={<Profile />} />
            <Route path="/patient/Settings" element={<Settings />} />
          </Route>

          {/* ✅ Not found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
