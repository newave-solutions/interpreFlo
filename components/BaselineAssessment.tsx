'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import VocalMeter from './VocalMeter';

interface BaselineAssessmentProps {
  onClose: () => void;
}

interface AssessmentResults {
  pitch: number;
  pace: number;
  volume: number;
  toneProfile: string;
  strengths: string[];
  areasForImprovement: string[];
}

export default function BaselineAssessment({ onClose }: BaselineAssessmentProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);

  const handleRecord = () => {
    setIsRecording(true);
    // Simulate recording and analysis
    setTimeout(() => {
      const mockResults = {
        pitch: Math.floor(Math.random() * 20) + 70,
        pace: Math.floor(Math.random() * 20) + 70,
        volume: Math.floor(Math.random() * 20) + 70,
        toneProfile: 'Balanced and professional',
        strengths: ['Clear articulation', 'Consistent volume', 'Good pacing'],
        areasForImprovement: ['Pitch variation', 'Emotional range'],
      };
      setResults(mockResults);
      setIsRecording(false);
      setStep(3);
    }, 3000);
  };

  const handleSave = async () => {
    if (!user || !results) return;

    try {
      await setDoc(doc(db, 'baseline_assessments', user.uid), {
        user_id: user.uid,
        pitch_baseline: results.pitch,
        pace_baseline: results.pace,
        volume_baseline: results.volume,
        tone_profile: results.toneProfile,
        strengths: results.strengths,
        areas_for_improvement: results.areasForImprovement,
        completed_at: serverTimestamp(),
      }, { merge: true });
      onClose();
    } catch (error) {
      console.error('Error saving baseline:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Baseline Vocal Assessment</h2>
          <p className="text-gray-600">
            Establish your vocal profile to track improvement over time
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">What to expect:</h3>
              <ul className="space-y-2 text-blue-800">
                <li>✓ You&apos;ll read a short passage aloud</li>
                <li>✓ We&apos;ll analyze your pitch, pace, and volume</li>
                <li>✓ Receive personalized feedback and recommendations</li>
                <li>✓ Takes about 5 minutes to complete</li>
              </ul>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Begin Assessment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                Read this passage clearly and naturally:
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                &quot;Good morning. I will be interpreting for you today during your medical
                consultation. Please speak clearly and pause when needed. I am here to ensure
                accurate communication between you and your healthcare provider. If you have any
                questions, please don&apos;t hesitate to ask.&quot;
              </p>
            </div>
            <button
              onClick={handleRecord}
              disabled={isRecording}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRecording ? '🎙️ Recording... (3s)' : '🎙️ Start Recording'}
            </button>
          </div>
        )}

        {step === 3 && results && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h3>
              <p className="text-gray-600">Here&apos;s your vocal profile</p>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <VocalMeter label="Pitch Baseline" value={results.pitch} />
              <VocalMeter label="Pace Baseline" value={results.pace} />
              <VocalMeter label="Volume Baseline" value={results.volume} />
            </div>

            {/* Tone Profile */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Tone Profile</h4>
              <p className="text-blue-800">{results.toneProfile}</p>
            </div>

            {/* Strengths */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">Strengths</h4>
              <ul className="space-y-2">
                {results.strengths.map((strength: string, i: number) => (
                  <li key={i} className="text-green-800 flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-3">Areas for Growth</h4>
              <ul className="space-y-2">
                {results.areasForImprovement.map((area: string, i: number) => (
                  <li key={i} className="text-yellow-800 flex items-center gap-2">
                    <span className="text-yellow-600">→</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Save Baseline & Start Training
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
