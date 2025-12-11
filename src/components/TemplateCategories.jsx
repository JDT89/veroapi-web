import { FaRobot, FaShieldAlt, FaMusic, FaTools } from "react-icons/fa";

const categories = [
  {
    name: "Utility Bots",
    description: "Automation, roles, logging, moderation helpers.",
    icon: <FaTools size={28} />,
    link: "/templates?category=utility"
  },
  {
    name: "Moderation Bots",
    description: "Auto-mod, advanced filters, server safety tools.",
    icon: <FaShieldAlt size={28} />,
    link: "/templates?category=moderation"
  },
  {
    name: "Music Bots",
    description: "High-quality audio, playlists, autoplay features.",
    icon: <FaMusic size={28} />,
    link: "/templates?category=music"
  },
  {
    name: "Fun & Social Bots",
    description: "Games, trivia, leveling, economy, community fun.",
    icon: <FaRobot size={28} />,
    link: "/templates?category=fun"
  },
];

export default function TemplateCategories() {
  return (
    <section className="py-16 bg-[#0f0f0f] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Explore Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <a
              key={idx}
              href={cat.link}
              className="bg-[#1a1a1a] p-6 rounded-xl hover:bg-[#262626] transition group border border-[#222]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 text-blue-400 group-hover:scale-110 transition">
                  {cat.icon}
                </div>

                <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>

                <p className="text-gray-400 text-sm">
                  {cat.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
