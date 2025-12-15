'use client';

import React from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        {/* Center text */}
        <text
          x="50%"
          y="50%"
          className="fill-gray-700 text-2xl font-bold"
          dominantBaseline="middle"
          textAnchor="middle"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        >
          {Math.round(progress)}%
        </text>
      </svg>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
}
