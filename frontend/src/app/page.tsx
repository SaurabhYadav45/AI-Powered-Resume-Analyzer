"use client";

import { ArrowRight } from 'lucide-react';

/**
 * HomePage (with Gradient Text)
 * @description The main landing page for the application, now with a styled, eye-catching heading.
 */
export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-8">
      <div className="w-full md:max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
          Land Your 
          {/* Add the gradient span for "Dream Job" */}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text"> Dream Job </span> 
          with an 
          {/* Add the gradient span for "AI-Powered" */}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"> AI-Powered </span> 
          Resume Review
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Upload your resume and get instant, data-driven feedback on skills, formatting, and keywords to stand out to recruiters.
        </p>
        <div className="mt-10">
          <a 
            href="/upload" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </main>
  );
}
