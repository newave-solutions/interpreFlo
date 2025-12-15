'use client';

import React from 'react';

interface VocalMeterProps {
  label: string;
  value: number; // 0-100
  targetMin?: number;
  targetMax?: number;
  color?: string;
}

export default function VocalMeter({
  label,
  value,
  targetMin = 40,
  targetMax = 60,
  color = '#3b82f6',
}: VocalMeterProps) {
  const isInTarget = value >= targetMin && value <= targetMax;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${isInTarget ? 'text-green-600' : 'text-gray-600'}`}>
          {value}%
        </span>
      </div>
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        {/* Target zone */}
        <div
          className="absolute h-full bg-green-100"
          style={{
            left: `${targetMin}%`,
            width: `${targetMax - targetMin}%`,
          }}
        />
        {/* Current value */}
        <div
          className="absolute h-full rounded-full transition-all duration-300"
          style={{
            width: `${value}%`,
            backgroundColor: isInTarget ? '#10b981' : color,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Low</span>
        <span className="text-green-600">Target</span>
        <span>High</span>
      </div>
    </div>
  );
}
