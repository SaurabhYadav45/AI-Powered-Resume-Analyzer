"use client";

import React, { useState } from 'react';
import { FileText, LogOut, History, Menu, X } from 'lucide-react';
// Corrected relative path from src/components/
import { useAuth } from '../hooks/useAuth';

/**
 * Navbar Component (Tablet Fix)
 * @description A responsive navigation bar with an adjusted breakpoint for better tablet support.
 */
export const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

          {/* Desktop Menu (Now hidden until 'lg' screens) */}
          <div className="hidden lg:flex items-baseline space-x-4">
            <a href="/upload" className="text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
              Analyze
            </a>
            {isLoggedIn ? (
              <>
                <a href="/history" className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  <History className="mr-2 h-4 w-4" /> History
                </a>
                <button onClick={logout} className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <a href="/login" className="text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </a>
            )}
          </div>

          {/* Hamburger Menu Button (Now visible up to 'lg' screens) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Now collapsible up to 'lg' screens) */}
      <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          <a href="/upload" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
            Analyze
          </a>
          {isLoggedIn ? (
            <>
              <a href="/history" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                History
              </a>
              <button onClick={logout} className="w-full text-left text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                Logout
              </button>
            </>
          ) : (
            <a href="/login" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};
