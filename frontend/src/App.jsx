import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from './pages/HomePage';
import Header from './components/Header';

function App() {
  return <>
  <Router>
       <ToastContainer position="top-right" autoClose={3000} />
       <Header/>
       <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
  </Router>
  </>;
}

export default App;
