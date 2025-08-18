"use client";

import React, { useState } from 'react';
import { FileText, LogOut, History, Menu, X } from 'lucide-react';
// Corrected path to use Next.js alias
import { useAuth } from '@/hooks/useAuth';

/**
 * Navbar Component (with Glassmorphism)
 * @description A responsive navigation bar with a frosted glass effect.
 */
export const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // UPDATED: Replaced 'bg-white shadow-sm' with 'glass-card'
    <nav className="glass-card sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors">
              <FileText className="h-8 w-8" />
              <span className="text-xl md:text-2xl font-bold tracking-tight ">ResuMate</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-baseline space-x-4">
            <a href="/upload" className="text-gray-700 hover:bg-white/30 px-3 py-2 rounded-md text-sm font-medium">
              Analyze
            </a>
            {isLoggedIn ? (
              <>
                <a href="/history" className="flex items-center text-gray-700 hover:bg-white/30 px-3 py-2 rounded-md text-sm font-medium">
                  <History className="mr-2 h-4 w-4" /> History
                </a>
                <button onClick={logout} className="flex items-center text-gray-700 hover:bg-white/30 px-3 py-2 rounded-md text-sm font-medium">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <a href="/login" className="text-gray-700 hover:bg-white/30 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </a>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-white/30 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/20">
          <a href="/upload" className="text-gray-700 hover:bg-white/30 block px-3 py-2 rounded-md text-base font-medium">
            Analyze
          </a>
          {isLoggedIn ? (
            <>
              <a href="/history" className="text-gray-700 hover:bg-white/30 block px-3 py-2 rounded-md text-base font-medium">
                History
              </a>
              <button onClick={logout} className="w-full text-left text-gray-700 hover:bg-white/30 block px-3 py-2 rounded-md text-base font-medium">
                Logout
              </button>
            </>
          ) : (
            <a href="/login" className="text-gray-700 hover:bg-white/30 block px-3 py-2 rounded-md text-base font-medium">
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};
