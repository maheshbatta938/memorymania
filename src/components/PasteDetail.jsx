import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Button from './ui/Button';
import Input from './ui/Input';
import CryptoJS from 'crypto-js';
import { 
  Edit, Trash2, ArrowLeft, Calendar, Tag, Clock, Eye, 
  Copy, Check, Download, Share2, Shield, Lock, FileCode, CheckCheck 
} from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const PasteDetail = ({ isSharedView = false }) => {
  const { id } = useParams();
  const { getPasteById, getPublicPasteById, deletePaste, currentPaste, isLoading, error } = usePaste();
  const navigate = useNavigate();

  const [decryptionPassword, setDecryptionPassword] = useState('');
  const [decryptedContent, setDecryptedContent] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [decryptionError, setDecryptionError] = useState('');
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

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
          <div className="space-y-4">
            {/* Editor Action Bar */}
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-t-lg border border-gray-300 dark:border-gray-700 border-b-0">
              <div className="flex items-center space-x-2">
                <FileCode className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  {currentPaste.language || 'plaintext'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
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