import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Button from '../components/ui/Button';
import PasteCard from '../components/PasteCard';
import SearchBar from '../components/SearchBar';
import Input from '../components/ui/Input';
import { 
  Plus, RefreshCw, FolderOpen, Terminal, Star, Folder, 
  ChevronRight, Trash2, FolderPlus, Inbox, Settings, Key 
} from 'lucide-react';

const DashboardPage = () => {
  const { 
    pastes = [], folders = [], fetchPastes, fetchFolders, createFolder, deleteFolder, 
    isLoading, fetchApiKeys, createApiKey, deleteApiKey, apiKeys = [], error
  } = usePaste();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'starred', or folderId
  const [newFolderName, setNewFolderName] = useState('');
  const [folderError, setFolderError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [keyError, setKeyError] = useState('');

  useEffect(() => {
    if (typeof fetchPastes === 'function') fetchPastes();
    if (typeof fetchFolders === 'function') fetchFolders();
  }, []);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await createFolder(newFolderName.trim());
      setNewFolderName('');
      setFolderError('');
    } catch (err) {
      setFolderError(err.response?.data?.message || 'Failed to create folder');
    }
  };

  const handleDeleteFolder = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Delete this folder? Snippets inside it will be moved back to All Snippets.')) {
      try {
        await deleteFolder(id);
        if (activeFilter === id) {
          setActiveFilter('all');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCreateApiKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      await createApiKey(newKeyName.trim());
      setNewKeyName('');
      setKeyError('');
    } catch (err) {
      setKeyError(err.response?.data?.message || 'Failed to create API key');
    }
  };

  const handleDeleteApiKey = async (id) => {
    if (window.confirm('Are you sure you want to revoke this API key? Apps using it will immediately lose access.')) {
      try {
        await deleteApiKey(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenSettings = async () => {
    setShowSettings(!showSettings);
    if (!showSettings) {
      try {
        await fetchApiKeys();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filtering Logic with Safety Fallbacks
  const getFilteredPastes = () => {
    const list = pastes || [];
    if (activeFilter === 'all') return list;
    if (activeFilter === 'starred') return list.filter(p => p && p.isStarred);
    return list.filter(p => p && p.folderId === activeFilter);
  };

  const filteredPastes = getFilteredPastes();
  const activeFolderName = activeFilter === 'all' 
    ? 'All Snippets' 
    : activeFilter === 'starred' 
      ? 'Starred Stashes' 
      : (folders || []).find(f => f && f._id === activeFilter)?.name || 'Folder';

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background glow decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      {/* Main Grid: Left Side Navigation vs Right Side Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <div className="space-y-6">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-6">
            
            {/* Global navigation groups */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
                Quick Access
              </h3>
              <button
                onClick={() => setActiveFilter('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  activeFilter === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center">
                  <Inbox className="mr-2 h-4 w-4" />
                  All Snippets
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {(pastes || []).length}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter('starred')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  activeFilter === 'starred'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  Starred Stashes
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeFilter === 'starred' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {(pastes || []).filter(p => p && p.isStarred).length}
                </span>
              </button>
            </div>

            {/* Folder list section */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2 flex justify-between items-center">
                <span>Folders</span>
                <FolderPlus size={14} className="text-gray-400" />
              </h3>

              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {(folders || []).map((folder) => {
                  if (!folder) return null;
                  const isCurrent = activeFilter === folder._id;
                  const count = (pastes || []).filter(p => p && p.folderId === folder._id).length;
                  return (
                    <button
                      key={folder._id}
                      onClick={() => setActiveFilter(folder._id)}
                      className={`group/item w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                        isCurrent
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center min-w-0">
                        <Folder className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{folder.name}</span>
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isCurrent ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-gray-500'
                        }`}>
                          {count}
                        </span>
                        <Trash2
                          onClick={(e) => handleDeleteFolder(e, folder._id)}
                          size={12}
                          className={`opacity-0 group-hover/item:opacity-100 hover:text-red-500 transition-opacity duration-200 cursor-pointer ${
                            isCurrent ? 'text-purple-200' : 'text-gray-500'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Add folder inline form */}
              <form onSubmit={handleCreateFolder} className="pt-2 flex gap-1 border-t border-slate-200/50 dark:border-slate-800/50 mt-2">
                <input
                  type="text"
                  placeholder="New folder..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 min-w-0 px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <Button type="submit" size="xs" variant="secondary" disabled={!newFolderName.trim()}>
                  Add
                </Button>
              </form>
              {folderError && <p className="text-[10px] text-red-500 px-1 mt-1">{folderError}</p>}
            </div>

            {/* API Keys toggle button */}
            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={handleOpenSettings}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  API Keys & settings
                </span>
                <ChevronRight size={14} className={`transform transition-transform duration-200 ${showSettings ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Content Block */}
        <div className="lg:col-span-3 space-y-6">
          {showSettings ? (
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Key className="mr-2 text-purple-500 h-5 w-5" />
                  API Keys Configuration
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  Close Settings
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Generate personal API keys to programmatic stashing using Terminal shell curl scripts. All notes stashed via API keys default to public visibility.
                </p>

                {/* Create key form */}
                <form onSubmit={handleCreateApiKey} className="flex gap-2">
                  <Input
                    placeholder="Key label (e.g., CI/CD Runner, Home Desktop)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="primary" disabled={!newKeyName.trim()}>
                    Generate Key
                  </Button>
                </form>
                {keyError && <p className="text-xs text-red-500">{keyError}</p>}

                {/* Keys list */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active API Keys</h3>
                  {(apiKeys || []).length > 0 ? (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                      {(apiKeys || []).map((keyObj) => {
                        if (!keyObj) return null;
                        return (
                          <div key={keyObj._id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50/50 dark:bg-slate-900/30">
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{keyObj.name}</p>
                              <p className="text-xs font-mono bg-slate-200/60 dark:bg-slate-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300 mt-1 select-all">
                                {keyObj.key}
                              </p>
                            </div>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteApiKey(keyObj._id)}>
                              Revoke
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-xs text-gray-400">
                      No active API keys found.
                    </div>
                  )}
                </div>

                <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800/80">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Example CLI Usage:</h4>
                  <pre className="text-[10px] font-mono text-purple-600 dark:text-purple-400 overflow-x-auto whitespace-pre p-2 bg-slate-200/30 dark:bg-slate-900 rounded">
{`curl -X POST \\
  -H "X-API-KEY: <YOUR_GENERATED_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Server Log", "content":"Error: DB disconnect at 14:02", "language":"plaintext"}' \\
  https://memorymania-service.onrender.com/api/pastes/api`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                    <Terminal className="mr-2 text-purple-600 h-8 w-8" />
                    {activeFolderName}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage stashed notes for selection: <span className="font-semibold text-purple-500">{activeFolderName}</span>.
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
              ) : (filteredPastes || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(filteredPastes || []).map((paste) => {
                    if (!paste) return null;
                    return <PasteCard key={paste._id} paste={paste} />;
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-[#0f172a]/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/40 rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto mt-12">
                  <FolderOpen className="h-16 w-16 text-slate-400 dark:text-slate-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No snippets found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm max-w-md">
                    No stashed snippets found matching this filter folder. Start by creating a snippet or adding it to folders!
                  </p>
                  <Link to="/create">
                    <Button variant="primary">
                      <Plus className="mr-1.5 h-4 w-4" />
                      Stash Snippet
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;