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
    <form onSubmit={handleSearch} className="flex w-full mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Search by title, content, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={handleClear}
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        className="rounded-l-none"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar; 