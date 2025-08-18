import axios from 'axios';
import { AnalysisResult, FormValues, AnalyzeApiResponse } from '../types';
import { AuthFormValues, AuthResponse } from '../types/auth';
import { HistoryResponse } from '../types/history';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * analyzeResumeApi (Updated)
 * @description Handles the API call for resume analysis.
 * Now expects an object containing both the analysis and the extracted resume text.
 */
export const analyzeResumeApi = async (data: FormValues): Promise<AnalyzeApiResponse> => {
  const formData = new FormData();
  formData.append('resume', data.resume[0]);
  if (data.jobDescription) {
    formData.append('jobDescription', data.jobDescription);
  }

  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await axios.post(`${API_BASE_URL}/resume/analyze`, formData, config);
  return response.data; // Returns { analysisResult, resumeText }
};

/**
 * generateCoverLetterApi
 * @description Generates a cover letter using the AI.
 */
export const generateCoverLetterApi = async (resumeText: string, jobDescription: string): Promise<{ coverLetter: string }> => {
  const response = await axios.post(`${API_BASE_URL}/resume/generate-cover-letter`, {
    resumeText,
    jobDescription,
  });
  return response.data;
};


// --- Existing Auth and History Functions ---

export const signupUser = async (credentials: AuthFormValues): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, credentials);
  return response.data;
};

export const loginUser = async (credentials: AuthFormValues): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};

export const getHistory = async (): Promise<HistoryResponse[]> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_BASE_URL}/resume/history`, config);
  return response.data;
};
