export default function Hero() {
  return (
    <section className="w-full py-24 bg-gradient-to-b from-[#1e1e1e] to-[#111] text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          Build Discord Bots in Minutes — No Code Required
        </h1>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
          Choose from community-built templates and instantly deploy powerful bots.
          Manage commands, automation, and features visually.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/templates"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition"
          >
            Browse Templates
          </a>

          <a
            href="/dashboard"
            className="px-6 py-3 border border-gray-500 hover:bg-gray-800 rounded-xl font-medium transition"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </section>
  )
}
