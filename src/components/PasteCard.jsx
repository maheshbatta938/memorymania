import React from 'react';
import { Link } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Button from './ui/Button';
import { Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react';

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
  
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {paste.title}
          </h3>
          <div className="flex space-x-2">
            <Link to={`/view/${paste._id}`}>
              <Button variant="ghost" size="sm">
                <Eye size={16} className="text-gray-600 dark:text-gray-400" />
              </Button>
            </Link>
            <Link to={`/edit/${paste._id}`}>
              <Button variant="ghost" size="sm">
                <Edit size={16} className="text-blue-600" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 size={16} className="text-red-600" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(paste.createdAt)}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {truncateContent(paste.content)}
        </p>

        {paste.tags && paste.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {paste.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                <Tag size={12} className="mr-1" />
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