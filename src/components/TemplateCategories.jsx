export default function TemplateCategories() {
  return (
    <section className="section">
      <h2 className="h-title text-center mb-12">Explore Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => (
          <a
            key={idx}
            href={cat.link}
            className="card card-hover p-8 group text-center"
          >
            <div className="text-blue-400 mb-5 group-hover:scale-110 transition">
              {cat.icon}
            </div>

            <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
            <p className="text-gray-400 text-sm">{cat.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

