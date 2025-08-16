import * as z from 'zod';

// Zod schema for the login/signup form
export const authSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

// Type inferred from the Zod schema
export type AuthFormValues = z.infer<typeof authSchema>;

// Type for the successful authentication response from the backend
export interface AuthResponse {
  message: string;
  token: string;
  email: string;
}
