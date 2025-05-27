import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="max-w-md mx-auto">
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      <AuthForm type="login" />
    </div>
  );
};

export default LoginPage; 