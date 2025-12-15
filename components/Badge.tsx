'use client';

import React from 'react';

interface BadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned?: boolean;
  earnedAt?: string;
}

export default function Badge({ name, description, icon, earned = false, earnedAt }: BadgeProps) {
  return (
    <div
      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
        earned
          ? 'border-yellow-400 bg-yellow-50'
          : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      <div
        className={`text-4xl mb-2 ${earned ? 'grayscale-0' : 'grayscale'}`}
        aria-label={icon}
      >
        {icon}
      </div>
      <h4 className={`font-semibold text-center ${earned ? 'text-gray-900' : 'text-gray-500'}`}>
        {name}
      </h4>
      <p className="text-xs text-center text-gray-600 mt-1">{description}</p>
      {earned && earnedAt && (
        <p className="text-xs text-yellow-600 mt-2">
          Earned {new Date(earnedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
