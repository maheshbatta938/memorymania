import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Button from '../components/ui/Button';
import PasteCard from '../components/PasteCard';
import SearchBar from '../components/SearchBar';
import { Plus, RefreshCw, FolderOpen } from 'lucide-react';

const DashboardPage = () => {
  const { pastes, fetchPastes, isLoading, error } = usePaste();

  useEffect(() => {
    fetchPastes();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Your Saved Pastes
        </h1>
        <div className="flex space-x-3">
          <Button
            variant="ghost"
            onClick={() => fetchPastes()}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link to="/create">
            <Button variant="primary">
              <Plus className="mr-1 h-4 w-4" />
              New Paste
            </Button>
          </Link>
        </div>
      </div>

      <SearchBar />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

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
          <FolderOpen className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No pastes found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            You haven't created any pastes yet. Start by creating your first paste to store your code, credentials, or any text.
          </p>
          <Link to="/create">
            <Button variant="primary">
              <Plus className="mr-1 h-4 w-4" />
              Create Your First Paste
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 