function SearchBar({
  query,
  setQuery,
  onSearch,
  loading
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const quickSearches = ["Nike Air Max", "Adidas Ultraboost", "Puma RS-X", "Jordan 1 Retro", "New Balance 550"];

  return (
    <div className="mt-8 flex w-full max-w-2xl flex-col items-center gap-4">
      <div className="flex w-full flex-col sm:flex-row gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-lg">
        
        <div className="relative flex-1 flex items-center">
          <span className="absolute left-4 text-slate-400 text-lg">
            🔍
          </span>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search Nike Air Max, Adidas Ultraboost, Puma..."
            className="w-full rounded-xl bg-transparent pl-11 pr-4 py-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-500"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="mr-3 text-slate-500 hover:text-slate-300 transition"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={onSearch}
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Searching...
            </span>
          ) : (
            "Compare Prices"
          )}
        </button>

      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Popular:</span>
        {quickSearches.map((term, i) => (
          <button
            key={i}
            onClick={() => setQuery(term)}
            className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1 text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;