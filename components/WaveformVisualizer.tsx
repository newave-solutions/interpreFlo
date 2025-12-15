'use client';

import React, { useEffect, useState } from 'react';

interface WaveformVisualizerProps {
  isActive?: boolean;
  color?: string;
  barCount?: number;
  height?: number;
}

export default function WaveformVisualizer({
  isActive = false,
  color = '#3b82f6',
  barCount = 50,
  height = 80,
}: WaveformVisualizerProps) {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        setBars(Array.from({ length: barCount }, () => Math.random()));
      } else {
        setBars(Array.from({ length: barCount }, () => 0.1));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, barCount]);

  return (
    <div className="flex items-center justify-center gap-1" style={{ height: `${height}px` }}>
      {bars.map((value, index) => (
        <div
          key={index}
          className="w-1 rounded-full transition-all duration-100"
          style={{
            height: `${value * height}px`,
            backgroundColor: color,
            opacity: isActive ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
