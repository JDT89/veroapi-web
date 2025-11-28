import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import DocsPage from "./pages/DocsPage";
import EndpointsPage from "./pages/Endpoints";

function App() {
  return (
    <div className="saas-root">
      <Navbar />

      <main className="saas-page">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/endpoints" element={<EndpointsPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;