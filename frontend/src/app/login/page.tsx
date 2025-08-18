"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, UserPlus, Loader } from 'lucide-react';

// Corrected relative paths from src/app/login/
import { loginUser, signupUser } from '../../utils/api';
import { authSchema, AuthFormValues } from '../../types/auth';

/**
 * LoginPage (with Glassmorphism)
 * @description A fully functional page for user signup and login with an updated UI.
 */
export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit: SubmitHandler<AuthFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = isLoginMode ? await loginUser(data) : await signupUser(data);
      localStorage.setItem('authToken', response.token);
      window.location.href = '/';
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex  flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <div className="w-full max-w-md">
        {/* Apply the .glass-card style to this container */}
        <div className=" rounded-2xl p-8 glass-card-blue">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              {isLoginMode ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLoginMode ? 'Sign in to access your analysis history.' : 'Sign up to save and view your results.'}
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="w-full px-3 py-2 bg-white/60 border border-white/50 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  className="w-full px-3 py-2 bg-white/60 border border-white/50 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-all duration-300"
              >
                {isLoading ? (
                  <Loader className="animate-spin mr-2 h-5 w-5" />
                ) : isLoginMode ? (
                  <LogIn className="mr-2 h-5 w-5" />
                ) : (
                  <UserPlus className="mr-2 h-5 w-5" />
                )}
                {isLoginMode ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(null);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isLoginMode ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
