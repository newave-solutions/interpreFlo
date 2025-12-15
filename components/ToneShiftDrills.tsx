'use client';

import React, { useState } from 'react';
import VocalMeter from './VocalMeter';

const drills = [
  {
    id: 'empathetic',
    title: 'Empathetic Tone',
    description: 'Practice warm, compassionate delivery for sensitive situations',
    color: '#10b981',
    icon: '💚',
    scenarios: [
      'I understand this is a difficult diagnosis to hear.',
      'We are here to support you through this process.',
      'Your concerns are completely valid.',
    ],
  },
  {
    id: 'authoritative',
    title: 'Authoritative Tone',
    description: 'Practice clear, confident delivery for medical instructions',
    color: '#3b82f6',
    icon: '💪',
    scenarios: [
      'It is essential that you take this medication exactly as prescribed.',
      'Follow these post-operative instructions carefully.',
      'Do not stop the treatment without consulting your doctor.',
    ],
  },
  {
    id: 'neutral',
    title: 'Neutral Tone',
    description: 'Practice impartial, professional delivery',
    color: '#6b7280',
    icon: '⚖️',
    scenarios: [
      'The doctor will explain the procedure to you.',
      'Your test results are now available.',
      'The appointment has been scheduled for next week.',
    ],
  },
];

export default function ToneShiftDrills() {
  const [activeDrill, setActiveDrill] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [metrics, setMetrics] = useState({
    pitch: 0,
    pace: 0,
    volume: 0,
  });

  const drill = drills.find((d) => d.id === activeDrill);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate metrics
      setTimeout(() => {
        setMetrics({
          pitch: Math.floor(Math.random() * 30) + 70,
          pace: Math.floor(Math.random() * 30) + 70,
          volume: Math.floor(Math.random() * 30) + 70,
        });
        setIsRecording(false);
      }, 3000);
    }
  };

  const nextScenario = () => {
    if (drill && currentScenario < drill.scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setMetrics({ pitch: 0, pace: 0, volume: 0 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tone Shift Drills</h2>
        <p className="text-gray-600">
          Master different vocal tones for various interpretation contexts
        </p>
      </div>

      {!activeDrill ? (
        /* Drill Selection */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drills.map((drill) => (
            <button
              key={drill.id}
              onClick={() => {
                setActiveDrill(drill.id);
                setCurrentScenario(0);
                setMetrics({ pitch: 0, pace: 0, volume: 0 });
              }}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-all text-left"
            >
              <div className="text-5xl mb-4">{drill.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{drill.title}</h3>
              <p className="text-gray-600 mb-4">{drill.description}</p>
              <div className="text-blue-600 font-medium">
                {drill.scenarios.length} scenarios →
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Active Drill */
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{drill.title}</h3>
                <p className="text-gray-600">
                  Scenario {currentScenario + 1} of {drill.scenarios.length}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveDrill(null);
                  setMetrics({ pitch: 0, pace: 0, volume: 0 });
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
            </div>

            {/* Scenario Text */}
            <div
              className="p-8 rounded-lg mb-6 text-center"
              style={{ backgroundColor: `${drill.color}20`, borderLeft: `4px solid ${drill.color}` }}
            >
              <p className="text-2xl text-gray-900 font-medium">
                &quot;{drill.scenarios[currentScenario]}&quot;
              </p>
            </div>

            {/* Record Button */}
            <div className="text-center mb-6">
              <button
                onClick={handleRecord}
                disabled={isRecording}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRecording ? '🎙️ Recording...' : '🎙️ Start Recording'}
              </button>
            </div>

            {/* Metrics */}
            {metrics.pitch > 0 && (
              <div className="space-y-4">
                <VocalMeter label="Tone Match" value={metrics.pitch} />
                <VocalMeter label="Pace Control" value={metrics.pace} />
                <VocalMeter label="Volume Consistency" value={metrics.volume} />

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setMetrics({ pitch: 0, pace: 0, volume: 0 })}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={nextScenario}
                    disabled={currentScenario === drill.scenarios.length - 1}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {currentScenario === drill.scenarios.length - 1
                      ? 'Complete'
                      : 'Next Scenario →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
