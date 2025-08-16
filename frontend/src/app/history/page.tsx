"use client";

import React, { useEffect, useState } from 'react';
import { Loader, ServerCrash, Inbox, ArrowRight } from 'lucide-react';
// Corrected relative paths from src/app/history/
import { getHistory } from '../../utils/api';
import { HistoryResponse } from '../../types/history';

/**
 * HistoryPage
 * @description Displays a list of the logged-in user's past analysis reports.
 */
export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch history. Please try logging in again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Use standard browser navigation to avoid import issues
  const goToLogin = () => {
    window.location.href = '/login';
  };

  const goToUpload = () => {
    window.location.href = '/upload';
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-8">
        <Loader className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-lg text-gray-600">Loading your analysis history...</p>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-8">
        <ServerCrash className="h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Could Not Load History</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={goToLogin}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go to Login
        </button>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">Analysis History</h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl">
            Review your past resume analyses to track your improvements.
          </p>
        </header>

        {/* 3. No History State */}
        {history.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-xl">
            <Inbox className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">No History Found</h2>
            <p className="mt-2 text-gray-500">You haven't analyzed any resumes yet.</p>
            <button
              onClick={goToUpload}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Analyze Your First Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        ) : (
          // 4. Success State with History List
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg text-gray-800">{item.fileName}</p>
                  <p className="text-sm text-gray-500">
                    Analyzed on: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Skills Match</p>
                  <p className={`text-2xl font-bold ${item.analysisResult.skillsMatch > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {item.analysisResult.skillsMatch}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
