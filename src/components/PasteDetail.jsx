import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Button from './ui/Button';
import Input from './ui/Input';
import CryptoJS from 'crypto-js';
import { 
  Edit, Trash2, ArrowLeft, Calendar, Tag, Clock, Eye, Play,
  Copy, Check, Download, Share2, Shield, Lock, FileCode, Star, Folder, Terminal as TermIcon
} from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const PasteDetail = ({ isSharedView = false }) => {
  const { id } = useParams();
  const { getPasteById, getPublicPasteById, deletePaste, toggleStarPaste, currentPaste, folders, isLoading, error } = usePaste();
  const navigate = useNavigate();

  const [decryptionPassword, setDecryptionPassword] = useState('');
  const [decryptedContent, setDecryptedContent] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [decryptionError, setDecryptionError] = useState('');
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  // Execution Sandbox State
  const [showSandbox, setShowSandbox] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [htmlSrcDoc, setHtmlSrcDoc] = useState('');

  useEffect(() => {
    if (id) {
      if (isSharedView) {
        getPublicPasteById(id);
      } else {
        getPasteById(id);
      }
    }
  }, [id, isSharedView]);

  useEffect(() => {
    if (currentPaste && currentPaste._id === id) {
      if (!currentPaste.isEncrypted) {
        setDecryptedContent(currentPaste.content);
        setIsDecrypted(true);
      } else {
        setDecryptedContent('');
        setIsDecrypted(false);
      }
    }
  }, [currentPaste, id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this paste?')) {
      deletePaste(id);
      navigate('/dashboard');
    }
  };

  const handleStarToggle = async () => {
    try {
      await toggleStarPaste(id);
    } catch (err) {
      console.error('Failed to toggle star status:', err);
    }
  };

  const handleDecrypt = (e) => {
    e.preventDefault();
    try {
      const bytes = CryptoJS.AES.decrypt(currentPaste.content, decryptionPassword);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
        throw new Error('Incorrect password');
      }
      setDecryptedContent(decryptedText);
      setIsDecrypted(true);
      setDecryptionError('');
    } catch (err) {
      setDecryptionError('Incorrect password. Failed to decrypt.');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(decryptedContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/shared/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([decryptedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const fileExt = currentPaste.language === 'plaintext' ? 'txt' : currentPaste.language === 'javascript' ? 'js' : currentPaste.language === 'typescript' ? 'ts' : currentPaste.language === 'python' ? 'py' : currentPaste.language === 'go' ? 'go' : currentPaste.language === 'rust' ? 'rs' : currentPaste.language === 'html' ? 'html' : currentPaste.language === 'css' ? 'css' : currentPaste.language === 'json' ? 'json' : currentPaste.language === 'sql' ? 'sql' : currentPaste.language === 'markdown' ? 'md' : 'txt';
    element.download = `${currentPaste.title.replace(/\s+/g, '_').toLowerCase()}.${fileExt}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Run Code Sandbox Action
  const handleRunCode = () => {
    setShowSandbox(true);
    if (currentPaste.language === 'html') {
      setHtmlSrcDoc(decryptedContent);
      setExecutionLogs([]);
    } else if (currentPaste.language === 'javascript') {
      setHtmlSrcDoc('');
      const logs = [];
      
      // Override console.log temporarily
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = (...args) => {
        logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
      };
      console.error = (...args) => {
        logs.push('[ERROR] ' + args.join(' '));
      };

      try {
        const runFn = new Function(decryptedContent);
        const result = runFn();
        if (result !== undefined) {
          logs.push('=> Returned: ' + (typeof result === 'object' ? JSON.stringify(result) : String(result)));
        }
      } catch (err) {
        logs.push('Uncaught Exception: ' + err.message);
      }

      // Restore console
      console.log = originalLog;
      console.error = originalError;

      setExecutionLogs(logs.length > 0 ? logs : ['Code executed successfully with zero console output.']);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Metrics calculation
  const getMetrics = () => {
    const text = decryptedContent || '';
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lineCount = text ? text.split('\n').length : 0;
    const byteSize = new Blob([text]).size;
    const formattedSize = byteSize > 1024 
      ? (byteSize / 1024).toFixed(2) + ' KB' 
      : byteSize + ' B';

    return { charCount, wordCount, lineCount, formattedSize };
  };

  const { charCount, wordCount, lineCount, formattedSize } = getMetrics();
  const folder = folders?.find(f => f._id === currentPaste.folderId);
  const isExecutable = currentPaste && (currentPaste.language === 'javascript' || currentPaste.language === 'html');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded max-w-md mx-auto">
        <p className="font-semibold">{error}</p>
        {!isSharedView && (
          <Button
            variant="primary"
            size="sm"
            className="mt-3"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        )}
      </div>
    );
  }

  if (!currentPaste) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded max-w-md mx-auto text-center">
        <p className="font-semibold">Paste not found</p>
        {!isSharedView && (
          <Button
            variant="primary"
            size="sm"
            className="mt-3"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden max-w-5xl mx-auto">
      <div className="p-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              {!isSharedView && (
                <button 
                  onClick={handleStarToggle} 
                  className="focus:outline-none text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <Star size={22} className={currentPaste.isStarred ? "fill-yellow-400 text-yellow-400" : ""} />
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentPaste.title}
              </h1>
              {currentPaste.isEncrypted && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300">
                  <Lock size={10} className="mr-1" />
                  Secure
                </span>
              )}
              {currentPaste.isPublic && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                  <Share2 size={10} className="mr-1" />
                  Public
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span className="flex items-center">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                Created: {formatDate(currentPaste.createdAt)}
              </span>
              <span className="flex items-center">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                Updated: {formatDate(currentPaste.updatedAt)}
              </span>
              {currentPaste.viewCount !== undefined && (
                <span className="flex items-center">
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Views: {currentPaste.viewCount}
                </span>
              )}
              {folder && (
                <span className="flex items-center">
                  <Folder className="mr-1.5 h-3.5 w-3.5" />
                  Folder: {folder.name}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons (only show edit/delete if not shared view) */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {currentPaste.isPublic && (
              <Button variant="secondary" size="sm" onClick={handleCopyLink}>
                {copiedLink ? <Check className="mr-1 h-4 w-4" /> : <Share2 className="mr-1 h-4 w-4" />}
                {copiedLink ? 'Copied Link' : 'Copy Share Link'}
              </Button>
            )}
            {!isSharedView && (
              <>
                <Link to={`/edit/${currentPaste._id}`}>
                  <Button variant="ghost" size="sm" className="border border-gray-300 dark:border-gray-600">
                    <Edit className="mr-1 h-4 w-4 text-blue-500" />
                    Edit
                  </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tags Block */}
        {currentPaste.tags && currentPaste.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {currentPaste.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300"
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content Block */}
        {!isDecrypted ? (
          <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700/60 p-8 rounded-xl text-center max-w-md mx-auto my-8">
            <Shield className="h-12 w-12 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Encrypted Paste</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-6">
              This snippet was client-side encrypted before storage. Enter the password to view.
            </p>
            <form onSubmit={handleDecrypt} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password to decrypt"
                value={decryptionPassword}
                onChange={(e) => setDecryptionPassword(e.target.value)}
                fullWidth
                required
              />
              {decryptionError && <p className="text-sm text-red-500">{decryptionError}</p>}
              <Button type="submit" variant="primary" fullWidth>
                Decrypt Paste
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              {/* Editor Action Bar */}
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 px-4 py-2.5 rounded-t-lg border border-gray-300 dark:border-gray-700 border-b-0">
                <div className="flex items-center space-x-2">
                  <FileCode className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {currentPaste.language || 'plaintext'}
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  {isExecutable && (
                    <>
                      <button
                        onClick={handleRunCode}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 focus:outline-none font-bold"
                      >
                        <Play className="h-3.5 w-3.5 fill-purple-600 dark:fill-purple-400" />
                        Run Snippet
                      </button>
                      <span className="text-gray-300 dark:text-gray-700">|</span>
                    </>
                  )}
                  <button
                    onClick={() => setShowRaw(!showRaw)}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium focus:outline-none"
                  >
                    {showRaw ? 'Show Highlighted' : 'Show Raw'}
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 focus:outline-none font-medium"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedCode ? 'Copied' : 'Copy'}
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <button
                    onClick={handleDownload}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 focus:outline-none font-medium"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
              </div>

              {/* Editor Body */}
              <div className="relative border border-gray-300 dark:border-gray-700 rounded-b-lg overflow-hidden shadow-inner bg-gray-900">
                {showRaw ? (
                  <pre className="font-mono text-sm text-gray-200 p-4 bg-gray-900 overflow-x-auto whitespace-pre-wrap select-text h-[400px]">
                    <code>{decryptedContent}</code>
                  </pre>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto">
                    <SyntaxHighlighter
                      language={currentPaste.language || 'plaintext'}
                      style={atomOneDark}
                      className="!bg-gray-900 !p-4 !m-0 !font-mono !text-sm"
                      showLineNumbers
                    >
                      {decryptedContent}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>

              {/* Metrics metadata bar */}
              <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 px-1 pt-1.5">
                <div className="flex space-x-3">
                  <span>Lines: <strong>{lineCount}</strong></span>
                  <span>Words: <strong>{wordCount}</strong></span>
                  <span>Characters: <strong>{charCount}</strong></span>
                </div>
                <span>Size: <strong className="text-purple-500">{formattedSize}</strong></span>
              </div>
            </div>

            {/* Execution Sandbox Console Panel */}
            {showSandbox && (
              <div className="bg-slate-950 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-lg animate-fadeIn">
                <div className="bg-slate-900 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 flex items-center">
                    <TermIcon className="mr-1.5 h-3.5 w-3.5 text-purple-500" />
                    Interactive Sandbox Playground
                  </span>
                  <button 
                    onClick={() => setShowSandbox(false)}
                    className="text-xs text-gray-500 hover:text-gray-300 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
                <div className="p-4 min-h-[150px] max-h-[350px] overflow-y-auto">
                  {currentPaste.language === 'javascript' && (
                    <div className="font-mono text-xs text-slate-300 space-y-1 select-text">
                      {executionLogs.map((log, i) => (
                        <div key={i} className="whitespace-pre-wrap leading-relaxed py-0.5 border-b border-slate-800 last:border-b-0">
                          {log.startsWith('[ERROR]') ? (
                            <span className="text-red-400 font-semibold">{log}</span>
                          ) : log.startsWith('=>') ? (
                            <span className="text-teal-400 font-semibold">{log}</span>
                          ) : (
                            log
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {currentPaste.language === 'html' && htmlSrcDoc && (
                    <div className="border border-slate-800 rounded-lg overflow-hidden bg-white h-72">
                      <iframe
                        srcDoc={htmlSrcDoc}
                        sandbox="allow-scripts"
                        title="HTML Sandbox Playground"
                        className="w-full h-full border-none bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-6 flex justify-between items-center">
          {!isSharedView ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Button>
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Shared via NotesApp. Create your own account to stash code snippets securely!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasteDetail;