'use client';

import React from 'react';
import { Mic, BarChart3, Trophy, Users, Brain, Clock } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Mic size={32} />,
      title: 'Real-Time Vocal Analysis',
      description: 'Get instant feedback on pitch, pace, and volume as you practice',
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Progress Tracking',
      description: 'Visualize your improvement with detailed analytics and charts',
    },
    {
      icon: <Trophy size={32} />,
      title: 'Achievement System',
      description: 'Earn badges and track milestones as you master new skills',
    },
    {
      icon: <Users size={32} />,
      title: 'Expert Coaching',
      description: 'Learn from experienced medical interpreters and voice coaches',
    },
    {
      icon: <Brain size={32} />,
      title: 'Interactive Scenarios',
      description: '8 realistic medical scenarios covering various specialties',
    },
    {
      icon: <Clock size={32} />,
      title: 'Daily Practice',
      description: 'Structured warmup exercises to build consistent habits',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            VoiceCoach Pro provides comprehensive tools and resources to help medical interpreters
            develop their vocal skills and professional confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
