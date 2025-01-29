import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, NavLink } from "react-router-dom";
import TabelProduk from "./Components/TabelProduk";
import Analitik from "./Components/Analitik";
import CMS from "./Components/CMS";
import Index from "./Components/Index";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faChartLine,
  faBarsProgress,
  faBars,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import wylozLogo from "./Assets/wyloz-logo.png";
import Login from "./Components/Login";

// Protected Route Component
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  // Get the initial authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  // Update localStorage whenever isAuthenticated changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="app-container">
                <Sidebar />
                <MainContent />
              </div>
            </ProtectedRoute>
          }
        >
          <Route path="tabelProduk" element={<TabelProduk />} />
          <Route path="analitik" element={<Analitik />} />
          <Route path="cms" element={<CMS />} />
          <Route index element={<h2>Welcome to Wyloz Dashboard</h2>} />
        </Route>
      </Routes>
    </Router>
  );
}

const Sidebar = () => (
  <div className="sidebar">
    <NavLink to="/" className="dashboard-title">
      <h1>Wyloz Dashboard</h1>
    </NavLink>
    <NavLink
      to="/tabelProduk"
      className={({ isActive }) => (isActive ? "active-menu" : "")}
    >
      <FontAwesomeIcon icon={faTable} className="icon-sidebar" /> Data Produk
    </NavLink>
    <NavLink
      to="/analitik"
      className={({ isActive }) => (isActive ? "active-menu" : "")}
    >
      <FontAwesomeIcon icon={faChartLine} className="icon-sidebar" /> Analytics
    </NavLink>
    <NavLink
      to="/cms"
      className={({ isActive }) => (isActive ? "active-menu" : "")}
    >
      <FontAwesomeIcon icon={faBarsProgress} className="icon-sidebar" /> CMS
    </NavLink>
  </div>
);

const MainContent = () => (
  <div className="main-container">
    <div className="navbar">
      <h1>
        <FontAwesomeIcon icon={faBars} />
      </h1>
      <div className="dropdown">
        <img src={wylozLogo} alt="Profile" className="dropdown-toggle" />
        <div className="dropdown-content">
          <a
            className="dropdown-item"
            href="/login"
            onClick={() => {
              localStorage.removeItem("isAuthenticated"); // Clear authentication state
              window.location.href = "/login"; // Redirect to login
            }}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
          </a>
        </div>
      </div>
    </div>
    <div className="content">
      <Routes>
        <Route path="tabelProduk" element={<TabelProduk />} />
        <Route path="analitik" element={<Analitik />} />
        <Route path="cms" element={<CMS />} />
        <Route index element={<Index />} />
      </Routes>
    </div>
  </div>
);

export default App;
