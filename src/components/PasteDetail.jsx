import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Button from './ui/Button';
import { Edit, Trash2, ArrowLeft, Calendar, Tag, Clock } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const PasteDetail = () => {
  const { id } = useParams();
  const { getPasteById, deletePaste, currentPaste, isLoading, error } = usePaste();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getPasteById(id);
    }
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this paste?')) {
      deletePaste(id);
      navigate('/dashboard');
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <Button
          variant="primary"
          size="sm"
          className="mt-3"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!currentPaste) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Paste not found</p>
        <Button
          variant="primary"
          size="sm"
          className="mt-3"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentPaste.title}
          </h1>
          <div className="flex space-x-2">
            <Link to={`/edit/${currentPaste._id}`}>
              <Button variant="secondary" size="sm">
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Created: {formatDate(currentPaste.createdAt)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="mr-2 h-4 w-4" />
            <span>Updated: {formatDate(currentPaste.updatedAt)}</span>
          </div>
        </div>

        {currentPaste.tags && currentPaste.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {currentPaste.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="relative">
          <SyntaxHighlighter
            language="javascript"
            style={atomOneDark}
            className="rounded-lg !bg-gray-900 !p-4"
            showLineNumbers
          >
            {currentPaste.content}
          </SyntaxHighlighter>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasteDetail; 