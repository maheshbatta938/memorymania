import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ requireAuth = false }) => {
  const { user, isLoading } = useAuth();

  // If authentication is required and user is not logged in
  if (requireAuth && !isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in and trying to access auth pages
  if (!requireAuth && !isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 