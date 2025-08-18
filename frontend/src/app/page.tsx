import { ArrowRight } from 'lucide-react';


/**
 * HomePage
 * @description The main landing page for the application.
 */
export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-8 bg-gray-50">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
          Land Your Dream Job with an AI-Powered Resume Review
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Upload your resume and get instant, data-driven feedback on skills, formatting, and keywords to stand out to recruiters.
        </p>
        <div className="mt-10">
          <a 
            href="/upload" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </main>
  );
}
