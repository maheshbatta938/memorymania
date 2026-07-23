import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { usePaste } from '../context/PasteContext';
import Button from './ui/Button';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { searchPastes, fetchPastes } = usePaste();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchPastes(query);
    } else {
      fetchPastes();
    }
  };

  const handleClear = () => {
    setQuery('');
    fetchPastes();
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full mb-8 shadow-sm">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-12 py-3 border border-gray-200 dark:border-slate-800 rounded-l-lg bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
          placeholder="Search by title, content, language, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
            onClick={handleClear}
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
          </button>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        className="rounded-l-none rounded-r-lg px-6 font-semibold"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;