export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Second Brain
          </h1>
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
            Intelligent Knowledge Management System
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 p-6 rounded-xl border border-white/10 hover:bg-white/20 transition">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Document Storage
            </h2>
            <p className="text-gray-300">
              Securely store and organize your knowledge with advanced tagging and versioning.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl border border-white/10 hover:bg-white/20 transition">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              NLP Insights
            </h2>
            <p className="text-gray-300">
              Extract meaningful insights using advanced natural language processing.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl border border-white/10 hover:bg-white/20 transition">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">
              Smart Search
            </h2>
            <p className="text-gray-300">
              Powerful, context-aware search across your entire knowledge base.
            </p>
          </div>
        </section>

        <div className="text-center mt-12">
          <a 
            href="/docs" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-full text-lg font-bold hover:from-blue-600 hover:to-purple-700 transition"
          >
            Get Started
          </a>
        </div>

        <footer className="text-center mt-16 text-gray-500">
          <p>© 2026 Second Brain. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}