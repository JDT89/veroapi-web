export default function TemplateGrid({ templates = [] }) {
  return (
    <section className="section">
      <h2 className="h-title mb-12 text-center">Featured Templates</h2>

      {templates.length === 0 ? (
        <p className="text-gray-400 text-center">No templates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {templates.map((template) => (
            <a
              key={template.id}
              href={`/templates/${template.id}`}
              className="card card-hover block overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="h-44 bg-[#1a1a1a] border-b border-[#222] relative overflow-hidden">
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                    No Preview
                  </div>
                )}

                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition"></div>
              </div>

              {/* Info Section */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition">
                  {template.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {template.description || "A BotGhost template."}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{template.category || "Uncategorized"}</span>
                  <span>by {template.author || "Unknown"}</span>
                </div>

                {/* Button */}
                <div className="mt-5">
                  <span className="btn-primary block text-center py-2 text-sm">
                    View Template
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
