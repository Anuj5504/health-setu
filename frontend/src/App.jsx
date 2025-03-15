import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./pages/Login";
import Signup from "./pages/Signup"
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Dashboard from "./pages/Dashboard";
function App() {
  return <>
  <Router>
       <ToastContainer position="top-right" autoClose={3000} />
       <Header/>
       <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
  </Router>
  </>;
}

export default App;
