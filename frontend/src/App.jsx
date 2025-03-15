import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./pages/Login";
import Signup from "./pages/Signup"
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Dashboard from "./pages/Dashboard";
import Preloader from "./components/Preloader";
import { AuthProvider } from "./context/AuthContext";
import AdminPage from "./pages/AdminPage";
import TalkAI from "./TalkAI";
import Preloader from "./components/Preloader";
import { AuthProvider } from "./context/AuthContext";
import TalkAI from "./TalkAI";
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode='wait'>
        {loading && <Preloader setLoading={setLoading} />}
      </AnimatePresence>
      <AnimatePresence mode='wait'>
        {loading && <Preloader setLoading={setLoading} />}
      </AnimatePresence>
      
      {!loading && (
        <AuthProvider>
        <AuthProvider>
          <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/talk" element={<TalkAI />} />
              <Route path="/talk" element={<TalkAI />} />
            </Routes>
          </Router>
        </AuthProvider>
        </AuthProvider>
      )}
    </>
  );
}

export default App;