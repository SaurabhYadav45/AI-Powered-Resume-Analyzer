"use client";

import React from 'react';
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react';

/**
 * @interface ResultCardProps
 * @description Defines the props for the ResultCard component.
 * @property {string} title - The title of the feedback card.
 * @property {string | string[]} content - The feedback content, which can be a single string or an array of strings for a list.
 */
interface ResultCardProps {
  title: string;
  content: string | string[];
}

// A map to associate card titles with specific icons and background colors for styling.
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

/**
 * ResultCard Component
 * @description A reusable UI component to display a piece of analysis feedback.
 * It dynamically selects an icon and color based on its title.
 */
export const ResultCard = ({ title, content }: ResultCardProps) => {
  // Select the style from the map based on the title, or use a default gray style if no match is found.
  const style = cardStyles[title] || {
    icon: <FileText className="h-6 w-6 text-gray-800" />,
    color: "bg-gray-100",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="flex items-start space-x-4">
        {/* Icon and its colored background */}
        <div className={`rounded-full p-3 ${style.color}`}>
          {style.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          {/* Render content as a list if it's an array, otherwise as a paragraph */}
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
