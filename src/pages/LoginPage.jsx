import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto">
      <AuthForm type="login" />
    </div>
  );
};

export default LoginPage; 