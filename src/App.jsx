import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/Dashboard";   // 🔹 use DashboardPage here
import DocsPage from "./pages/DocsPage";
import EndpointsPage from "./pages/Endpoints";

function App() {
  return (
    <div className="app-root">
      <div className="halo-bg" />
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/endpoints" element={<EndpointsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
