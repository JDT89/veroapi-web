import React from "react";
import Hero from "../components/Hero";
import TemplateCategories from "../components/TemplateCategories";
import TemplateGrid from "../components/TemplateGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <TemplateCategories />
      </div>

      {/* Template Grid Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12 mb-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Templates</h2>
        <TemplateGrid />
      </div>
    </div>
  );
}
