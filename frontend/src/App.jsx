import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./pages/Login";
import Signup from "./pages/Signup"
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Dashboard from "./pages/Dashboard";
import Preloader from "./components/Preloader";
import { AuthProvider } from "./context/AuthContext";
import DocDashbaord from "./pages/DoctorDashboard"
import DocPatientshealth from "./pages/DocPatientshealth";
import AdminPage from "./pages/AdminPage";
import TalkAI from "./TalkAI";
import InventoryDashboard from "./Inventory/InventoryDashboard";
import AddItems from "./Inventory/AddItems";
import LowStockItems from "./Inventory/LowStockItems";
import StockAnalytics from "./Inventory/StockAnalytics";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Appointments from './DoctorDashboard/Appointments';
import  PAppointments from './pages/PAppointments';
import FitbitData from './pages/FitbitData';
import DoctorProfile from './pages/DoctorProfile';
import Medicine from './pages/Medicine';
import MaintenancePage from './DashBoardCompo/MaintenancePage';
import ConnectCallback from './pages/ConnectCallback';
import CreatePrescription from "./Prescription/CreatePrescription";
import Prescription from "./PatientInfoDoc/Prescriptions";
import PatientPrescriptions from './pages/PatientPrescriptions';
import DemandForecast from "./Inventory/DemandForecast";
import ReportAI from "./pages/ReportAI";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Suspense fallback={null}>
        <Preloader />
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin-dashboard" element={<AdminPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/docdashboard" element={<DocDashbaord />} />
            <Route path="/doc-patients-health/:id" element={<DocPatientshealth />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/about" element={<AboutPage/>} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/talk" element={<TalkAI />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/createprescription/:patientId" element={<CreatePrescription />} />
            {/* Inventory route */}

            <Route path="/admin/inventory/" element={<InventoryDashboard />} />
            <Route path="/admin/inventory/add-item" element={<AddItems />} />
            <Route path="/admin/inventory/low-stock" element={<LowStockItems />} />
            <Route path="/admin/inventory/stock-analytics" element={<StockAnalytics />} />
            <Route path="/admin/inventory/forecast" element={<DemandForecast />} />

            <Route path="/PAppointments" element={<PAppointments />} />
            <Route path="/fitbit-data" element={<FitbitData />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
            <Route path="/medicine" element={<Medicine />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/connect" element={<ConnectCallback />} />
            <Route path="/patient-prescriptions/:id" element={<PatientPrescriptions />} />


            <Route path="/report-ai" element={<ReportAI />} />
          </Routes>
        </AuthProvider>
      </Suspense>
    </Router>
  );
};

export default App;