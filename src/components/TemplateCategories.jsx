const categories = [
  {
    name: "Utility Bots",
    description: "Automation, roles, logging, moderation helpers.",
    icon: (
      <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2 L12 12 L2 12" />
        <path d="M18 22 L18 12 L28 12" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
      </svg>
    ),
    link: "/templates?category=utility",
  },
  {
    name: "Moderation Bots",
    description: "Auto-mod, filters, protection systems.",
    icon: (
      <svg width="30" height="30" fill="currentColor">
        <path d="M15 2 L27 8 V15 C27 21 22 27 15 29 C8 27 3 21 3 15 V8 L15 2Z" />
      </svg>
    ),
    link: "/templates?category=moderation",
  },
  {
    name: "Music Bots",
    description: "Audio, playlists, streaming features.",
    icon: (
      <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="5" />
        <circle cx="21" cy="18" r="5" />
        <line x1="14" y1="21" x2="14" y2="5" />
        <line x1="14" y1="5" x2="25" y2="8" />
      </svg>
    ),
    link: "/templates?category=music",
  },
  {
    name: "Fun & Social Bots",
    description: "Trivia, leveling, economy, community tools.",
    icon: (
      <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="15" cy="10" r="3" />
        <circle cx="10" cy="20" r="3" />
        <circle cx="20" cy="20" r="3" />
        <line x1="15" y1="13" x2="10" y2="17" />
        <line x1="15" y1="13" x2="20" y2="17" />
      </svg>
    ),
    link: "/templates?category=fun",
  },
];

export default function TemplateCategories() {
  return (
    <section className="py-16 bg-[#0f0f0f] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore Categories</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <a
              key={idx}
              href={cat.link}
              className="bg-[#1a1a1a] p-6 rounded-xl hover:bg-[#262626] border border-[#222] transition group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 text-blue-400 group-hover:scale-110 transition">
                  {cat.icon}
                </div>

                <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
                <p className="text-gray-400 text-sm">{cat.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
