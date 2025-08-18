"use client";

import React, { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, FileText, Briefcase, Loader, ServerCrash, Wand2, Copy } from 'lucide-react';

// Corrected paths to use Next.js style aliases (@/)
import { SkillChart } from '@/components/SkillChart';
import { ResultCard } from '@/components/ResultCard';
import { analyzeResumeApi, generateCoverLetterApi } from '@/utils/api';
import { AnalysisResult, FormValues } from '@/types';

const formSchema = z.object({
  resume: z.any()
    .refine((files) => files?.length === 1, "A resume file is required.")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, `Max file size is 10MB.`)
    .refine(
      (files) => ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"].includes(files?.[0]?.type),
      "Only PDF, DOCX, JPG, and PNG formats are accepted."
    ),
  jobDescription: z.string().optional(),
});

export default function UploadPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const resultsRef = useRef<HTMLDivElement>(null);
  // 1. Create a new ref for the cover letter section
  const coverLetterRef = useRef<HTMLDivElement>(null);

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
    setCoverLetter('');

    try {
      const { analysisResult: resultData, resumeText: extractedText } = await analyzeResumeApi(data);
      setAnalysisResult(resultData);
      setResumeText(extractedText);
      setJobDescriptionText(data.jobDescription || '');
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resumeText || !jobDescriptionText) {
      setError("A job description is required to generate a cover letter.");
      return;
    }
    setIsGeneratingLetter(true);
    setError(null);
    try {
      const { coverLetter: generatedLetter } = await generateCoverLetterApi(resumeText, jobDescriptionText);
      setCoverLetter(generatedLetter);

      // 2. Add the scroll logic
      setTimeout(() => {
        coverLetterRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to generate cover letter.";
      setError(errorMessage);
    } finally {
      setIsGeneratingLetter(false);
    }
  };
  
  const handleCopyText = () => {
    navigator.clipboard.writeText(coverLetter).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed to copy.');
    });
  };

  return (
    <main className="min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">AI Resume Analyzer</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant feedback on your resume to see how you match up.
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-12 content-glow">
          <div className="rounded-2xl p-8 glass-card-purple">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Form fields... */}
              <div>
                <label htmlFor="resume-upload-input" className="block text-lg font-semibold text-gray-700 mb-2">
                  <FileText className="inline-block w-5 h-5 mr-2 align-text-bottom" />
                  Upload Your Resume
                </label>
                <div className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-white/50 border-dashed rounded-xl hover:border-indigo-400">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-500" />
                    <div className="flex text-sm text-gray-700">
                      <label htmlFor="resume-upload-input" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="resume-upload-input" type="file" className="sr-only" {...register("resume")} accept=".pdf,.docx,image/jpeg,image/png" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 10MB</p>
                    {fileName && <p className="text-sm text-green-700 pt-2 font-semibold">{fileName}</p>}
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
                  className="w-full p-4 text-gray-700 bg-white/60 border border-white/50 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="Paste the job description here..."
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-4 px-6 border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
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
        </div>

        {/* Results Section */}
        <div ref={resultsRef}>
          {error && (
            <div className="max-w-4xl mx-auto my-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg" role="alert">
              <div className="flex">
                <div className="py-1"><ServerCrash className="h-6 w-6 text-red-500 mr-4" /></div>
                <div><p className="font-bold">An Error Occurred</p><p>{error}</p></div>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
              <h2 className="text-3xl font-bold text-center text-gray-800">Analysis Results</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2"><SkillChart data={analysisResult.keywordFrequency} /></div>
                <ResultCard title="Skills Match" content={`${analysisResult.skillsMatch}%`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ResultCard title="Formatting Feedback" content={analysisResult.formattingFeedback} />
                <ResultCard title="Improvement Suggestions" content={analysisResult.suggestions} />
                <ResultCard title="Missing Skills" content={analysisResult.missingSkills} />
              </div>

              {/* Cover Letter Section */}
              <div className="text-center pt-8">
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGeneratingLetter || !jobDescriptionText}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                >
                  {isGeneratingLetter ? (
                    <><Loader className="animate-spin mr-3 h-5 w-5" /> Generating...</>
                  ) : (
                    <><Wand2 className="mr-2 h-5 w-5" /> Generate Cover Letter</>
                  )}
                </button>
                {!jobDescriptionText && <p className="text-sm text-gray-500 mt-2">A job description is required to generate a cover letter.</p>}
              </div>

              {/* 3. Attach the ref to the cover letter container */}
              <div ref={coverLetterRef}>
                {coverLetter && (
                  <div className="glass-card rounded-2xl p-6 relative">
                     <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Generated Cover Letter</h3>
                     <textarea
                       readOnly
                       value={coverLetter}
                       className="w-full h-96 p-4 bg-white/60 border border-white/50 rounded-md text-gray-800 font-mono"
                     />
                     <button onClick={handleCopyText} className="absolute top-6 right-6 bg-gray-700 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800 flex items-center">
                       <Copy className="mr-2 h-4 w-4" />
                       {copySuccess || 'Copy'}
                     </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
