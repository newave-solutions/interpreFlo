'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import VocalDashboard from '@/components/VocalDashboard';
import ScenarioLibrary from '@/components/ScenarioLibrary';
import DailyWarmup from '@/components/DailyWarmup';
import ToneShiftDrills from '@/components/ToneShiftDrills';
import BaselineAssessment from '@/components/BaselineAssessment';
import PracticeSession from '@/components/PracticeSession';

export default function PracticePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scenarios' | 'warmup' | 'drills'>('dashboard');
  const [showBaselineAssessment, setShowBaselineAssessment] = useState(false);
  const [activePracticeSession, setActivePracticeSession] = useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'dashboard' as const, label: 'Vocal Dashboard', icon: '📊' },
    { id: 'scenarios' as const, label: 'Practice Scenarios', icon: '🎭' },
    { id: 'warmup' as const, label: 'Daily Warmup', icon: '🔥' },
    { id: 'drills' as const, label: 'Tone Drills', icon: '🎯' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Practice Center</h1>
          <p className="text-gray-600">
            Improve your vocal skills with real-time feedback and interactive exercises
          </p>
          <button
            onClick={() => setShowBaselineAssessment(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            📈 Take Baseline Assessment
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'dashboard' && <VocalDashboard />}
          {activeTab === 'scenarios' && (
            <ScenarioLibrary onStartSession={(id) => setActivePracticeSession(id)} />
          )}
          {activeTab === 'warmup' && <DailyWarmup />}
          {activeTab === 'drills' && <ToneShiftDrills />}
        </div>
      </div>

      {/* Modals */}
      {showBaselineAssessment && (
        <BaselineAssessment onClose={() => setShowBaselineAssessment(false)} />
      )}
      {activePracticeSession && (
        <PracticeSession
          scenarioId={activePracticeSession}
          onClose={() => setActivePracticeSession(null)}
        />
      )}
    </main>
  );
}
