import SearchBar from '@/components/search/SearchBar';

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
        Describe. Discover. Decide.
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Your AI-powered shopping assistant. Just tell us what you're looking for.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <SearchBar />
      </div>
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Trending Searches</h2>
        {/* Placeholder for trending searches */}
      </div>
    </div>
  );
}
