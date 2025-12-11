export default function Hero() {
  return (
    <section className="section text-center">
      <h1 className="h-title">
        BotGhost Template Marketplace
      </h1>

      <p className="h-subtitle mx-auto">
        Discover, share, and install powerful BotGhost templates — with full support 
        for multi-code imports, premium layouts, and community-driven automation.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a href="/templates" className="btn-primary">Browse Templates</a>
        <a href="/submit" className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-800">
          Submit Template
        </a>
      </div>

      {/* subtle gradient background glow */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="w-[500px] h-[500px] mx-auto rounded-full blur-3xl bg-blue-600/30 glow"></div>
      </div>
    </section>
  );
}

