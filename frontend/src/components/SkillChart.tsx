"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types';

interface SkillChartProps {
  data: AnalysisResult['keywordFrequency'];
}

export const SkillChart = ({ data }: SkillChartProps) => (
  // UPDATED: Replaced bg-white and shadow with the glass-card class
  <div className="glass-card rounded-2xl p-6 h-full">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Keyword Frequency</h3>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
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
            }}
          />
          <Legend />
          <Bar dataKey="count" fill="#4f46e5" name="Frequency" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
