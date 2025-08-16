import axios from 'axios';
import { AnalysisResult, FormValues } from '../types'; // Using relative path from src
import { AuthFormValues, AuthResponse } from '../types/auth'; // We will create this new types file next

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * analyzeResumeApi
 * @description Handles the API call to the backend for resume analysis.
 */
export const analyzeResumeApi = async (data: FormValues): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('resume', data.resume[0]);
  if (data.jobDescription) {
    formData.append('jobDescription', data.jobDescription);
  }
  const response = await axios.post(`${API_BASE_URL}/resume/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * signupUser
 * @description Registers a new user.
 */
export const signupUser = async (credentials: AuthFormValues): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, credentials);
  return response.data;
};

/**
 * loginUser
 * @description Logs in an existing user.
 */
export const loginUser = async (credentials: AuthFormValues): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};
