import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Button from '../components/ui/Button';
import PasteCard from '../components/PasteCard';
import SearchBar from '../components/SearchBar';
import { Plus, RefreshCw, FolderOpen, Terminal } from 'lucide-react';

const DashboardPage = () => {
  const { pastes, fetchPastes, isLoading, error } = usePaste();

  useEffect(() => {
    fetchPastes();
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
            <Terminal className="mr-2 text-purple-600 h-8 w-8" />
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your stashed code snippets and secure text notes.
          </p>
        </div>
        
        <div className="flex space-x-3 w-full sm:w-auto justify-end">
          <Button
            variant="ghost"
            onClick={() => fetchPastes()}
            disabled={isLoading}
            className="border border-slate-200 dark:border-slate-800"
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link to="/create">
            <Button variant="primary">
              <Plus className="mr-1.5 h-4 w-4" />
              New Snippet
            </Button>
          </Link>
        </div>
      </div>

      <SearchBar />

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
          <p className="font-medium">{error}</p>
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
        <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-[#0f172a]/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/40 rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto mt-12">
          <FolderOpen className="h-16 w-16 text-slate-400 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No snippets found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm max-w-md">
            You haven't stashed any snippets yet. Create your first paste to store config files, code snippets, or environment templates.
          </p>
          <Link to="/create">
            <Button variant="primary">
              <Plus className="mr-1.5 h-4 w-4" />
              Stash First Snippet
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;