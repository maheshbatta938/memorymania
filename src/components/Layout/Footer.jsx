import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-gray-600 dark:text-gray-400">
              © {year} MemoryMania. All rights reserved.
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 dark:text-gray-400 flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> in MERN Stack
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 