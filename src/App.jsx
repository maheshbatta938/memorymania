import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import { AuthProvider } from './context/AuthContext';
import { PasteProvider } from './context/PasteContext';
import MainLayout from './components/Layout/MainLayout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreatePastePage from './pages/CreatePastePage';
import EditPastePage from './pages/EditPastePage';
import ViewPastePage from './pages/ViewPastePage';
import SearchPage from './pages/SearchPage';

// Set axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  // Initialize dark mode based on user preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <PasteProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
            </Route>
            
            {/* Auth routes (redirect to dashboard if logged in) */}
            <Route path="/" element={<MainLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </Route>
            
            {/* Protected routes (require authentication) */}
            <Route path="/" element={<MainLayout requireAuth />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="create" element={<CreatePastePage />} />
              <Route path="edit/:id" element={<EditPastePage />} />
              <Route path="view/:id" element={<ViewPastePage />} />
              <Route path="search" element={<SearchPage />} />
            </Route>
          </Routes>
        </Router>
      </PasteProvider>
    </AuthProvider>
  );
}

export default App; 