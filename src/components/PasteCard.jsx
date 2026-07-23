import React from 'react';
import { Link } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Button from './ui/Button';
import { Edit, Trash2, Eye, Calendar, Tag, Lock, Globe } from 'lucide-react';

const PasteCard = ({ paste }) => {
  const { deletePaste } = usePaste();
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this paste?')) {
      deletePaste(paste._id);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="glass-card hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-5 flex flex-col justify-between h-full space-y-4">
        <div>
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-1">
              {paste.title}
            </h3>
            <div className="flex space-x-1">
              <Link to={`/view/${paste._id}`}>
                <Button variant="ghost" size="sm" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800">
                  <Eye size={15} className="text-gray-600 dark:text-gray-400" />
                </Button>
              </Link>
              <Link to={`/edit/${paste._id}`}>
                <Button variant="ghost" size="sm" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800">
                  <Edit size={15} className="text-blue-600 dark:text-blue-400" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleDelete} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950/40">
                <Trash2 size={15} className="text-red-600" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center text-[10px] text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center">
              <Calendar size={12} className="mr-1" />
              {formatDate(paste.createdAt)}
            </span>
            {paste.language && (
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {paste.language}
              </span>
            )}
            {paste.isEncrypted && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300">
                <Lock size={9} className="mr-0.5" />
                Secure
              </span>
            )}
            {paste.isPublic && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300">
                <Globe size={9} className="mr-0.5" />
                Public
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 select-none">
            {paste.isEncrypted ? "• • • • • • • (Encrypted Snippet)" : truncateContent(paste.content)}
          </p>
        </div>

        {paste.tags && paste.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {paste.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30"
              >
                <Tag size={10} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasteCard;