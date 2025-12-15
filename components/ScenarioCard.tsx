'use client';

import React from 'react';
import { Scenario } from '@/types';
import { Clock, Award } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  onStart?: (scenarioId: string) => void;
}

export default function ScenarioCard({ scenario, onStart }: ScenarioCardProps) {
  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {scenario.image && (
        <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
          <img
            src={scenario.image}
            alt={scenario.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              difficultyColors[scenario.difficulty]
            }`}
          >
            {scenario.difficulty}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{scenario.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Award size={16} />
            <span>{scenario.category}</span>
          </div>
        </div>
        <button
          onClick={() => onStart?.(scenario.id)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Start Practice
        </button>
      </div>
    </div>
  );
}
