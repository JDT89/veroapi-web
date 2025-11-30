import React from "react";
import { Routes, Route } from "react-router-dom";

import "./styles/global.css";

import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import LandingPage from "./pages/Landing";
import DocsPage from "./pages/DocsPage";
import EndpointsPage from "./pages/EndpointsPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";

// Updated layout: Sidebar is fixed, content + footer stack vertically with left margin
function App() {
  return (
    <div className="app-root">
      <Sidebar />

      <div className="content-wrapper">
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
    </div>
  );
}

export default App;
