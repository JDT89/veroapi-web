import React from "react";
import { Routes, Route } from "react-router-dom";

import "./styles/global.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/Landing";
import DocsPage from "./pages/DocsPage";
import EndpointsPage from "./pages/EndpointsPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <div className="app-root">
      <div className="app-bg-glow" />
      <Navbar />

      <main className="page">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/endpoints" element={<EndpointsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
