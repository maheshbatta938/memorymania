import React from 'react';
import { usePaste } from '../context/PasteContext';
import PasteCard from '../components/PasteCard';
import SearchBar from '../components/SearchBar';
import { SearchX, Search } from 'lucide-react';

const SearchPage = () => {
  const { pastes, isLoading } = usePaste();

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Decorative background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
          <Search className="mr-2 text-purple-600 h-8 w-8" />
          Search Snippets
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Perform a fuzzy search across titles, contents, tags, and languages.
        </p>
      </div>

      <SearchBar />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : pastes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastes.map((paste) => (
            <PasteCard key={paste._id} paste={paste} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-[#0f172a]/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/40 rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto mt-12">
          <SearchX className="h-16 w-16 text-slate-400 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
            We couldn't find any snippets matching your criteria. Try different keywords, tags, or check for typos.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;