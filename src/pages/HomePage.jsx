import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Lock, Search, Code, Clipboard, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-12 md:py-24">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white mb-4">
            Store your <span className="text-purple-600">important snippets</span> securely
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            MemoryMania helps you securely store, organize, and retrieve your code snippets, credentials, and other important text in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="lg">
                Log In
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-teal-600 rounded-lg blur opacity-25"></div>
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-auto font-mono text-xs text-gray-500">snippet.js</div>
              </div>
              <pre className="font-mono text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code>{`// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ 
      _id: decoded._id, 
      'tokens.token': token 
    });
    
    if (!user) throw new Error();
    
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 rounded-lg my-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Features designed for developers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-purple-700 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure Storage
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                All your data is securely stored with encryption and protected by your account credentials.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Search className="h-7 w-7 text-teal-700 dark:text-teal-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Fast Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quickly find your saved snippets with powerful search functionality across titles, content, and tags.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Code className="h-7 w-7 text-blue-700 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Code Highlighting
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                View your code snippets with syntax highlighting for better readability and understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="bg-gradient-to-r from-purple-700 to-teal-600 rounded-lg p-8 md:p-12 shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to organize your digital memory?
            </h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers and IT professionals who trust MemoryMania to store their important code snippets and credentials.
            </p>
            <Link to="/signup">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-purple-700 hover:bg-gray-100"
              >
                <Clipboard className="mr-2 h-5 w-5" />
                Start Storing Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 