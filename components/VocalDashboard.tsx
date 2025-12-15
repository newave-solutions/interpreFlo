'use client';

import React, { useState, useEffect } from 'react';
import WaveformVisualizer from './WaveformVisualizer';
import VocalMeter from './VocalMeter';
import ProgressRing from './ProgressRing';

export default function VocalDashboard() {
  const [isRecording, setIsRecording] = useState(false);
  const [metrics, setMetrics] = useState({
    pitch: 50,
    pace: 50,
    volume: 50,
  });

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setMetrics({
          pitch: Math.max(0, Math.min(100, metrics.pitch + (Math.random() - 0.5) * 20)),
          pace: Math.max(0, Math.min(100, metrics.pace + (Math.random() - 0.5) * 20)),
          volume: Math.max(0, Math.min(100, metrics.volume + (Math.random() - 0.5) * 20)),
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isRecording, metrics]);

  const overallScore = Math.round((metrics.pitch + metrics.pace + metrics.volume) / 3);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Vocal Analysis</h2>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
          </button>
        </div>

        {/* Waveform */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <WaveformVisualizer isActive={isRecording} barCount={60} height={100} />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <VocalMeter label="Pitch" value={Math.round(metrics.pitch)} />
          <VocalMeter label="Pace" value={Math.round(metrics.pace)} />
          <VocalMeter label="Volume" value={Math.round(metrics.volume)} />
        </div>

        {/* Overall Score */}
        <div className="flex justify-center">
          <ProgressRing progress={overallScore} size={150} label="Overall Score" />
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Quick Tips</h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Keep your pitch within the green target zone for optimal clarity</li>
          <li>• Maintain a steady pace - not too fast, not too slow</li>
          <li>• Ensure consistent volume throughout your interpretation</li>
          <li>• Use headphones for better audio quality and feedback</li>
        </ul>
      </div>
    </div>
  );
}
