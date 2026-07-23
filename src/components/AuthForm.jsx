import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from './ui/Input';
import Button from './ui/Button';
import { KeyRound, User, AtSign, ShieldAlert } from 'lucide-react';

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const { login, signup, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
    };

    if (type === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      if (type === 'login') {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto my-12">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-teal-500 rounded-2xl blur opacity-25"></div>

      <div className="relative glass-card p-8 w-full bg-white/80 dark:bg-[#0f172a]/70 backdrop-blur-md rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4 transform hover:rotate-12 transition-transform duration-300">
            <KeyRound size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 text-center">
            {type === 'login'
              ? 'Sign in to NotesApp to access your stashes'
              : 'Stash code securely with local client AES encryption'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2.5">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'signup' && (
            <div className="relative">
              <Input
                id="name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                fullWidth
                required
                className="pr-10 dark:bg-slate-900/60"
              />
              <div className="absolute top-9.5 right-3 text-gray-400 pointer-events-none">
                <User size={16} />
              </div>
            </div>
          )}

          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              fullWidth
              required
              className="pr-10 dark:bg-slate-900/60"
            />
            <div className="absolute top-9.5 right-3 text-gray-400 pointer-events-none">
              <AtSign size={16} />
            </div>
          </div>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              fullWidth
              required
              className="pr-10 dark:bg-slate-900/60"
            />
            <div className="absolute top-9.5 right-3 text-gray-400 pointer-events-none">
              <KeyRound size={16} />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-6 py-2.5 font-bold shadow-lg shadow-purple-600/20"
          >
            {type === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-200/50 dark:border-slate-800/40 pt-5">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {type === 'login' ? "New to NotesApp? " : 'Already have an account? '}
            <Link
              to={type === 'login' ? '/signup' : '/login'}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
            >
              {type === 'login' ? 'Create an Account' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;