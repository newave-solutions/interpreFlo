'use client';

import React from 'react';
import { Expert } from '@/types';
import { Play } from 'lucide-react';

interface ExpertCardProps {
  expert: Expert;
  onPlayAudio?: (expertId: string) => void;
}

export default function ExpertCard({ expert, onPlayAudio }: ExpertCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
        {expert.image ? (
          <img
            src={expert.image}
            alt={expert.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            👤
          </div>
        )}
        {expert.audioUrl && (
          <button
            onClick={() => onPlayAudio?.(expert.id)}
            className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            aria-label="Play audio tip"
          >
            <Play size={20} fill="white" />
          </button>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{expert.name}</h3>
        <p className="text-sm text-blue-600 font-medium mb-2">{expert.specialty}</p>
        <p className="text-xs text-gray-500 mb-3">{expert.experience}</p>
        <p className="text-sm text-gray-700 mb-4">{expert.bio}</p>
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-700">
            <span className="text-blue-600">💡 Pro Tip:</span> {expert.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
