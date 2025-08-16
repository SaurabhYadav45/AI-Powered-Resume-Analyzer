import { AnalysisResult } from "."; // Imports the main AnalysisResult type

/**
 * @interface HistoryResponse
 * @description Defines the structure of a single analysis history item
 * as it is stored in and retrieved from the database.
 */
export interface HistoryResponse {
  _id: string;
  user: string;
  analysisResult: AnalysisResult;
  fileName: string;
  createdAt: string; // The timestamp will be a string in ISO format
  updatedAt: string;
}
