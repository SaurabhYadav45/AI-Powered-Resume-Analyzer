"use client";

import React from 'react';
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react';

interface ResultCardProps {
  title: string;
  content: string | string[];
}

const cardStyles: { [key: string]: { icon: React.ReactNode; color: string } } = {
  "Formatting Feedback": {
    icon: <FileText className="h-6 w-6 text-yellow-800" />,
    color: "bg-yellow-100",
  },
  "Improvement Suggestions": {
    icon: <CheckCircle className="h-6 w-6 text-green-800" />,
    color: "bg-green-100",
  },
  "Missing Skills": {
    icon: <AlertTriangle className="h-6 w-6 text-red-800" />,
    color: "bg-red-100",
  },
};

export const ResultCard = ({ title, content }: ResultCardProps) => {
  // **SPECIAL CASE:** If the title is "Skills Match", render the unique percentage style.
  if (title === "Skills Match") {
    const score = parseInt(content as string, 10) || 0;
    return (
      <div className="glass-card p-6 text-center rounded-2xl h-full flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Skills Match</h3>
        <p className={`text-7xl font-extrabold ${score > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
          {content}
        </p>
        <p className="text-gray-600 mt-2">Based on the provided job description.</p>
      </div>
    );
  }

  // **DEFAULT CASE:** For all other titles, render the standard icon and text format.
  const style = cardStyles[title] || {
    icon: <FileText className="h-6 w-6 text-gray-800" />,
    color: "bg-gray-100",
  };

  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="flex items-start space-x-4">
        <div className={`rounded-full p-3 ${style.color}`}>
          {style.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          {Array.isArray(content) ? (
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {content.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          ) : (
            <p className="text-gray-600">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
};
