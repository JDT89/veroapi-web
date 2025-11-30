import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/global.css";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Toaster from "./components/Toaster";
import LandingPage from "./pages/Landing";
import DocsPage from "./pages/DocsPage";
import EndpointsPage from "./pages/EndpointsPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import Pricing from "./pages/Pricing";
import Changelog from "./pages/Changelog";
import Admin from "./pages/Admin";

function App() {
  return (
    <div className="app-root">
      <Toaster />
      <Sidebar />
      <div className="content-wrapper">
        <main className="page">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/endpoints" element={<EndpointsPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}
export default App;
