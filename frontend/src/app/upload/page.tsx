"use client";

import React, { useState, useRef } from 'react'; // Import useRef
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, FileText, Briefcase, Loader, ServerCrash } from 'lucide-react';

// Corrected paths to use Next.js style aliases (@/)
import { SkillChart } from '@/components/SkillChart';
import { ResultCard } from '@/components/ResultCard';
import { analyzeResumeApi } from '@/utils/api';
import { AnalysisResult, FormValues } from '@/types';

// Zod schema for validation
const formSchema = z.object({
  resume: z.any()
    .refine((files) => files?.length === 1, "A resume file is required.")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, `Max file size is 10MB.`)
    .refine(
      (files) => ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(files?.[0]?.type),
      "Only .pdf and .docx formats are accepted."
    ),
  jobDescription: z.string().optional(),
});

export default function UploadPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // **STEP 1: Create a ref for the results container**
  const resultsRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const resumeFile = watch("resume");
  React.useEffect(() => {
    if (resumeFile && resumeFile.length > 0) {
      setFileName(resumeFile[0].name);
    } else {
      setFileName('');
    }
  }, [resumeFile]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const resultData = await analyzeResumeApi(data);
      setAnalysisResult(resultData);

      // **STEP 2: Scroll to the results after the data is set**
      // We use a short timeout to ensure the DOM has updated before we scroll.
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">AI Resume Analyzer</h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Get instant feedback on your resume to see how you match up.
          </p>
        </header>

        {/* The Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Form fields... */}
            <div>
              <label htmlFor="resume-upload-input" className="block text-lg font-semibold text-gray-700 mb-2">
                <FileText className="inline-block w-5 h-5 mr-2 align-text-bottom" />
                Upload Your Resume
              </label>
              <div className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-500">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="resume-upload-input" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input id="resume-upload-input" type="file" className="sr-only" {...register("resume")} accept=".pdf,.docx" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
                  {fileName && <p className="text-sm text-green-600 pt-2 font-semibold">{fileName}</p>}
                </div>
              </div>
              {errors.resume && <p className="mt-2 text-sm text-red-600">{errors.resume.message?.toString()}</p>}
            </div>
            <div>
              <label htmlFor="jobDescription" className="block text-lg font-semibold text-gray-700 mb-2">
                <Briefcase className="inline-block w-5 h-5 mr-2 align-text-bottom" />
                Job Description (Optional)
              </label>
              <textarea
                id="jobDescription"
                {...register("jobDescription")}
                rows={6}
                className="w-full p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste the job description here..."
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-4 px-6 border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {isLoading ? (
                  <><Loader className="animate-spin mr-3 h-5 w-5" /> Analyzing...</>
                ) : (
                  "Analyze My Resume"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section - Rendered Conditionally */}
        {error && (
          <div className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-r-lg" role="alert">
            <div className="flex">
              <div className="py-1"><ServerCrash className="h-6 w-6 text-red-500 mr-4" /></div>
              <div><p className="font-bold">Analysis Failed</p><p>{error}</p></div>
            </div>
          </div>
        )}

        {/* **STEP 3: Attach the ref to the results container** */}
        <div ref={resultsRef}>
          {analysisResult && (
            <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
              <h2 className="text-3xl font-bold text-center text-gray-800">Analysis Results</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2"><SkillChart data={analysisResult.keywordFrequency} /></div>
                <div className="bg-white p-6 text-center rounded-2xl shadow-lg h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Skills Match</h3>
                  <p className={`text-7xl font-extrabold ${analysisResult.skillsMatch > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{analysisResult.skillsMatch}%</p>
                  <p className="text-gray-500 mt-2">Based on the provided job description.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ResultCard title="Formatting Feedback" content={analysisResult.formattingFeedback} />
                <ResultCard title="Improvement Suggestions" content={analysisResult.suggestions} />
                <ResultCard title="Missing Skills" content={analysisResult.missingSkills} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
