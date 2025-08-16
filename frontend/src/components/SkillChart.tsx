"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types'; // Assuming types are in src/types/index.ts

/**
 * @interface SkillChartProps
 * @description Defines the props for the SkillChart component.
 * @property {AnalysisResult['keywordFrequency']} data - An array of objects, where each object contains a 'keyword' and its 'count'.
 */
interface SkillChartProps {
  data: AnalysisResult['keywordFrequency'];
}

/**
 * SkillChart Component
 * @description A reusable UI component that displays a bar chart for keyword frequency.
 * It is fully responsive and uses the Recharts library for rendering.
 */
export const SkillChart = ({ data }: SkillChartProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Keyword Frequency</h3>
    {/* Set a fixed height for the chart container to ensure it renders correctly */}
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10, // Adjust left margin to give Y-axis labels space
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="keyword" stroke="#6b7280" />
          <YAxis allowDecimals={false} stroke="#6b7280" />
          <Tooltip
            cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
            contentStyle={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend />
          <Bar dataKey="count" fill="#4f46e5" name="Frequency" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
