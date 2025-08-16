import * as z from 'zod';

/**
 * @const formSchema
 * @description A Zod schema used by react-hook-form for client-side validation.
 * Note: The detailed file-specific validations are defined directly in the UploadForm component
 * to avoid importing a large library into this simple types file.
 */
export const formSchema = z.object({
  resume: z.any(),
  jobDescription: z.string().optional(),
});

/**
 * @type FormValues
 * @description TypeScript type inferred from the formSchema. This represents the data
 * that our form will handle and submit.
 */
export type FormValues = z.infer<typeof formSchema>;

/**
 * @interface AnalysisResult
 * @description Defines the structure of the JSON object expected from the backend API after
 * a successful resume analysis. This ensures type safety when handling the response.
 */
export interface AnalysisResult {
  skillsMatch: number;
  missingSkills: string[];
  formattingFeedback: string;
  suggestions: string[];
  keywordFrequency: { keyword: string; count: number }[];
}
