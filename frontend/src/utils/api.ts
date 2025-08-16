import axios from 'axios';
import { AnalysisResult, FormValues } from '../types';
import { AuthFormValues, AuthResponse } from '../types/auth'; // We will create this new types file next
import { HistoryResponse } from '../types/history'; // We will create this new types file next

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * analyzeResumeApi
 * @description Handles the API call to the backend for resume analysis.
 * It now includes the auth token if the user is logged in.
 */
export const analyzeResumeApi = async (data: FormValues): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('resume', data.resume[0]);
  if (data.jobDescription) {
    formData.append('jobDescription', data.jobDescription);
  }

  // Get the token from localStorage
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      // If a token exists, add it to the Authorization header
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await axios.post(`${API_BASE_URL}/resume/analyze`, formData, config);
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

/**
 * getHistory
 * @description Fetches the analysis history for the logged-in user.
 */
export const getHistory = async (): Promise<HistoryResponse[]> => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_BASE_URL}/resume/history`, config);
  return response.data;
};
