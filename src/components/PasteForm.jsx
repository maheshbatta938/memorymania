import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Input from './ui/Input';
import Button from './ui/Button';
import Editor from '@monaco-editor/react';
import CryptoJS from 'crypto-js';
import { Save, X, Tag, Globe, Lock, Shield, Clock, Terminal, Folder } from 'lucide-react';

const LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'shell', label: 'Shell / Bash' },
  { value: 'markdown', label: 'Markdown' },
];

const EXPIRATIONS = [
  { value: 'never', label: 'Never' },
  { value: '10m', label: '10 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
  { value: 'burn', label: 'Burn after reading' },
];

const PasteForm = ({ isEditing = false, pasteId = '' }) => {
  const navigate = useNavigate();
  const { createPaste, updatePaste, getPasteById, currentPaste, folders, fetchFolders } = usePaste();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    language: 'plaintext',
    isPublic: false,
    expiration: 'never',
    isEncrypted: false,
    burnAfterRead: false,
    folderId: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [decryptionPassword, setDecryptionPassword] = useState('');
  const [decryptionError, setDecryptionError] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFolders();
    if (isEditing && pasteId) {
      getPasteById(pasteId);
    }
  }, [isEditing, pasteId]);

  useEffect(() => {
    if (isEditing && currentPaste && currentPaste._id === pasteId) {
      let initialExpiration = 'never';
      if (currentPaste.burnAfterRead) {
        initialExpiration = 'burn';
      } else if (currentPaste.expiresAt) {
        const remaining = new Date(currentPaste.expiresAt).getTime() - Date.now();
        if (remaining <= 11 * 60 * 1000) initialExpiration = '10m';
        else if (remaining <= 61 * 60 * 1000) initialExpiration = '1h';
        else if (remaining <= 25 * 60 * 60 * 1000) initialExpiration = '1d';
        else initialExpiration = '1w';
      }

      setFormData({
        title: currentPaste.title,
        content: currentPaste.content,
        tags: currentPaste.tags || [],
        language: currentPaste.language || 'plaintext',
        isPublic: currentPaste.isPublic || false,
        expiration: initialExpiration,
        isEncrypted: currentPaste.isEncrypted || false,
        burnAfterRead: currentPaste.burnAfterRead || false,
        folderId: currentPaste.folderId || '',
      });

      // If it's not encrypted, we consider it decrypted
      if (!currentPaste.isEncrypted) {
        setIsDecrypted(true);
      }
    } else if (!isEditing) {
      setIsDecrypted(true);
    }
  }, [isEditing, currentPaste, pasteId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (formData.isEncrypted && !isEditing && !encryptionPassword) {
      newErrors.password = 'Encryption password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDecrypt = (e) => {
    e.preventDefault();
    try {
      const bytes = CryptoJS.AES.decrypt(formData.content, decryptionPassword);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
        throw new Error('Incorrect password');
      }
      setFormData(prev => ({
        ...prev,
        content: decryptedText
      }));
      setIsDecrypted(true);
      setDecryptionError('');
    } catch (err) {
      setDecryptionError('Incorrect decryption password.');
    }
  };

  const calculateExpiresAt = (option) => {
    if (option === 'never' || option === 'burn') return null;
    const now = new Date();
    if (option === '10m') return new Date(now.getTime() + 10 * 60 * 1000);
    if (option === '1h') return new Date(now.getTime() + 60 * 60 * 1000);
    if (option === '1d') return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    if (option === '1w') return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let finalContent = formData.content;
    let isEncryptedPayload = formData.isEncrypted;

    // Encrypt content on client side if enabled and not already encrypted
    if (formData.isEncrypted && encryptionPassword) {
      finalContent = CryptoJS.AES.encrypt(formData.content, encryptionPassword).toString();
      isEncryptedPayload = true;
    }

    const expiresAt = calculateExpiresAt(formData.expiration);
    const burnAfterRead = formData.expiration === 'burn';

    const payload = {
      title: formData.title,
      content: finalContent,
      tags: formData.tags,
      language: formData.language,
      isPublic: formData.isPublic,
      isEncrypted: isEncryptedPayload,
      expiresAt,
      burnAfterRead,
      folderId: formData.folderId || null,
    };

    try {
      if (isEditing) {
        await updatePaste(pasteId, payload);
      } else {
        await createPaste(payload);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save paste:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Helper Metrics Calculations
  const getMetrics = () => {
    const text = formData.content || '';
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

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
        {isEditing ? 'Edit Paste' : 'Create New Paste'}
      </h1>

      {isEditing && formData.isEncrypted && !isDecrypted ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-purple-500/20 max-w-md mx-auto my-12 text-center">
          <Shield className="h-14 w-14 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Encrypted Content</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            This paste is client-side encrypted. Please enter the password to decrypt and edit it.
          </p>
          <form onSubmit={handleDecrypt} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter decryption password"
              value={decryptionPassword}
              onChange={(e) => setDecryptionPassword(e.target.value)}
              fullWidth
              required
            />
            {decryptionError && <p className="text-sm text-red-500">{decryptionError}</p>}
            <div className="flex justify-center gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Decrypt to Edit
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Editor & Title */}
          <div className="lg:col-span-2 space-y-6">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter a title for your paste..."
              fullWidth
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Code / Content Editor
              </label>
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-inner bg-gray-900">
                <Editor
                  height="450px"
                  language={formData.language}
                  theme="vs-dark"
                  value={formData.content}
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val || '' }))}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    automaticLayout: true,
                    tabSize: 2,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                  }}
                />
              </div>

              {/* Metrics bar */}
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex space-x-4">
                  <span>Lines: <strong className="text-gray-800 dark:text-gray-200">{lineCount}</strong></span>
                  <span>Words: <strong className="text-gray-800 dark:text-gray-200">{wordCount}</strong></span>
                  <span>Chars: <strong className="text-gray-800 dark:text-gray-200">{charCount}</strong></span>
                </div>
                <span>Size: <strong className="text-purple-600 dark:text-purple-400 font-semibold">{formattedSize}</strong></span>
              </div>

              {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
            </div>

            {/* Tags section */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300"
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 focus:outline-none hover:text-purple-600 dark:hover:text-purple-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. env, utility, api"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                <Shield className="mr-2 text-purple-600 h-5 w-5" />
                Security & Settings
              </h3>

              {/* Language selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Terminal className="mr-1.5 h-4 w-4 text-gray-500" />
                  Language Highlight
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Folder Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Folder className="mr-1.5 h-4 w-4 text-gray-500" />
                  Assign Folder
                </label>
                <select
                  name="folderId"
                  value={formData.folderId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- No Folder (Root) --</option>
                  {folders.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Expiration Settings */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Clock className="mr-1.5 h-4 w-4 text-gray-500" />
                  Expiry Duration
                </label>
                <select
                  name="expiration"
                  value={formData.expiration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {EXPIRATIONS.map((exp) => (
                    <option key={exp.value} value={exp.value}>
                      {exp.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visibility Settings */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Globe className="mr-1.5 h-4 w-4 text-gray-500" />
                  Visibility
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Make this paste Public
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Public pastes can be accessed by anyone with the link (no account login required).
                </p>
              </div>

              {/* Client-Side Encryption */}
              {!isEditing && (
                <div className="space-y-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isEncrypted"
                      name="isEncrypted"
                      checked={formData.isEncrypted}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="isEncrypted" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                      <Lock className="mr-1.5 h-4 w-4 text-purple-500" />
                      Client-Side Encryption
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Encrypt content locally using AES. Only users with the password will be able to read it. The database stores ciphertext only.
                  </p>

                  {formData.isEncrypted && (
                    <div className="space-y-2">
                      <Input
                        type="password"
                        name="encryptionPassword"
                        label="Encryption Password"
                        placeholder="Enter password"
                        value={encryptionPassword}
                        onChange={(e) => setEncryptionPassword(e.target.value)}
                        error={errors.password}
                        fullWidth
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" variant="primary" size="lg" fullWidth>
                <Save className="mr-2 h-5 w-5" />
                {isEditing ? 'Update Paste' : 'Create Paste'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasteForm;