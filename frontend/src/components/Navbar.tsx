"use client";

import { FileText, LogOut, History } from 'lucide-react';
// Corrected relative path from src/components/
import { useAuth } from '../hooks/useAuth';

/**
 * Navbar Component (Updated)
 * @description A responsive navigation bar that now dynamically changes
 * based on the user's authentication status, including a link to the history page.
 */
export const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors">
              <FileText className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">Resume Analyzer</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/upload" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Analyze
              </a>
              
              {/* Conditional Rendering based on login status */}
              {isLoggedIn ? (
                <>
                  {/* Add the History link for logged-in users */}
                  <a href="/history" className="flex items-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <History className="mr-2 h-4 w-4" />
                    History
                  </a>
                  <button
                    onClick={logout}
                    className="flex items-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <a href="/login" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
