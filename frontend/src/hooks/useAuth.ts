"use client";

import { useState, useEffect } from 'react';

/**
 * @interface AuthState
 * @description Defines the shape of the authentication state.
 */
interface AuthState {
  isLoggedIn: boolean;
  logout: () => void;
}

/**
 * useAuth Custom Hook
 * @description A hook to manage and check the user's authentication status
 * by looking for an auth token in localStorage.
 * @returns {AuthState} An object containing the login status and a logout function.
 */
export const useAuth = (): AuthState => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for the token when the component mounts
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // !! converts the string (or null) to a boolean
  }, []);

  const logout = () => {
    // Remove the token from storage
    localStorage.removeItem('authToken');
    // Update the state
    setIsLoggedIn(false);
    // Redirect to the login page
    window.location.href = '/login';
  };

  return { isLoggedIn, logout };
};
