import React from 'react';
import { usePaste } from '../context/PasteContext';
import PasteCard from '../components/PasteCard';
import SearchBar from '../components/SearchBar';
import { SearchX } from 'lucide-react';

const SearchPage: React.FC = () => {
  const { pastes, isLoading } = usePaste();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Search Pastes
      </h1>

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
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
          <SearchX className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try different keywords or check your spelling.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;