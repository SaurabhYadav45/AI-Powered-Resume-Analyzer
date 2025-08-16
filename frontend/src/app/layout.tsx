import type { Metadata } from 'next';
// Using Next.js path aliases (@/) which are configured to point to the `src` directory.
import { Navbar } from '@/components/Navbar';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'AI Resume Analyzer',
  description: 'Get instant feedback on your resume to land your dream job.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans" suppressHydrationWarning={true}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
