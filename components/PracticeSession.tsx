'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { scenarios } from '@/data/scenarios';
import WaveformVisualizer from './WaveformVisualizer';
import VocalMeter from './VocalMeter';

interface PracticeSessionProps {
  scenarioId: string;
  onClose: () => void;
}

interface SessionResults {
  pitch: number;
  pace: number;
  volume: number;
  overall: number;
  duration: number;
}

export default function PracticeSession({ scenarioId, onClose }: PracticeSessionProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'intro' | 'practice' | 'results'>('intro');
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [metrics, setMetrics] = useState({
    pitch: 50,
    pace: 50,
    volume: 50,
  });
  const [results, setResults] = useState<SessionResults | null>(null);

  const scenario = scenarios.find((s) => s.id === scenarioId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        // Simulate real-time metrics
        setMetrics({
          pitch: Math.max(0, Math.min(100, metrics.pitch + (Math.random() - 0.5) * 15)),
          pace: Math.max(0, Math.min(100, metrics.pace + (Math.random() - 0.5) * 15)),
          volume: Math.max(0, Math.min(100, metrics.volume + (Math.random() - 0.5) * 15)),
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, metrics]);

  const startPractice = () => {
    setStep('practice');
    setIsRecording(true);
  };

  const endPractice = async () => {
    setIsRecording(false);
    const avgPitch = Math.round(metrics.pitch);
    const avgPace = Math.round(metrics.pace);
    const avgVolume = Math.round(metrics.volume);
    const overallScore = Math.round((avgPitch + avgPace + avgVolume) / 3);

    const sessionResults = {
      pitch: avgPitch,
      pace: avgPace,
      volume: avgVolume,
      overall: overallScore,
      duration: elapsedTime,
    };

    setResults(sessionResults);
    setStep('results');

    // Save to database
    if (user) {
      try {
        await supabase.from('practice_sessions').insert({
          user_id: user.id,
          session_type: 'scenario',
          scenario_id: scenarioId,
          duration: elapsedTime,
          pitch_score: avgPitch,
          pace_score: avgPace,
          volume_score: avgVolume,
          overall_score: overallScore,
        });

        // Update user progress
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (progress) {
          await supabase
            .from('user_progress')
            .update({
              total_practice_time: (progress.total_practice_time || 0) + elapsedTime,
              scenarios_completed: (progress.scenarios_completed || 0) + 1,
              average_score: Math.round(
                ((progress.average_score || 0) * (progress.scenarios_completed || 0) + overallScore) /
                  ((progress.scenarios_completed || 0) + 1)
              ),
              last_practice_date: new Date().toISOString().split('T')[0],
            })
            .eq('user_id', user.id);
        }

        // Check for badges
        if (progress.scenarios_completed === 0) {
          await supabase.from('user_badges').insert({
            user_id: user.id,
            badge_id: 'first-session',
            badge_name: 'First Steps',
            badge_description: 'Complete your first practice session',
          });
        }
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
  };

  if (!scenario) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{scenario.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {step === 'intro' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Scenario Context</h3>
                <p className="text-blue-800 mb-4">{scenario.context}</p>
                <h4 className="font-semibold text-blue-900 mb-2">Your Role</h4>
                <p className="text-blue-800">{scenario.rolePrompt}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{scenario.duration}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{scenario.difficulty}</div>
                  <div className="text-sm text-gray-600">Level</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{scenario.category}</div>
                  <div className="text-sm text-gray-600">Category</div>
                </div>
              </div>

              <button
                onClick={startPractice}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Start Practice Session
              </button>
            </div>
          )}

          {step === 'practice' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-gray-600">Recording in progress...</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <WaveformVisualizer isActive={isRecording} barCount={60} height={100} />
              </div>

              <div className="space-y-4">
                <VocalMeter label="Pitch" value={Math.round(metrics.pitch)} />
                <VocalMeter label="Pace" value={Math.round(metrics.pace)} />
                <VocalMeter label="Volume" value={Math.round(metrics.volume)} />
              </div>

              <button
                onClick={endPractice}
                className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                End Session
              </button>
            </div>
          )}

          {step === 'results' && results && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h3>
                <p className="text-gray-600">
                  Duration: {Math.floor(results.duration / 60)}:
                  {(results.duration % 60).toString().padStart(2, '0')}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{results.pitch}%</div>
                  <div className="text-sm text-blue-800">Pitch</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{results.pace}%</div>
                  <div className="text-sm text-green-800">Pace</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{results.volume}%</div>
                  <div className="text-sm text-purple-800">Volume</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{results.overall}%</div>
                  <div className="text-sm text-yellow-800">Overall</div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Great job! 🌟</h4>
                <ul className="space-y-2 text-green-800">
                  <li>✓ Session saved to your progress dashboard</li>
                  <li>✓ All metrics recorded for tracking improvement</li>
                  <li>✓ Keep practicing to unlock more badges!</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep('intro');
                    setElapsedTime(0);
                    setResults(null);
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Practice Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
