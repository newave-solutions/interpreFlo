'use client';

import React, { useState } from 'react';
import WaveformVisualizer from './WaveformVisualizer';
import AuthModal from './AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/practice');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Master Your Voice in Medical Interpretation
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Real-time vocal analysis, interactive practice scenarios, and expert coaching to
                help you become a confident, professional medical interpreter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg shadow-lg"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg"
                >
                  Learn More
                </button>
              </div>
              <div className="mt-8 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-blue-100">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-blue-100">Sessions Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.9/5</div>
                  <div className="text-blue-100">User Rating</div>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-semibold mb-2">Live Voice Analysis</h3>
                <p className="text-blue-100">Real-time feedback on your vocal performance</p>
              </div>
              <WaveformVisualizer isActive={true} color="#ffffff" barCount={40} height={100} />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">85%</div>
                  <div className="text-sm text-blue-100">Pitch</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">92%</div>
                  <div className="text-sm text-blue-100">Pace</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">88%</div>
                  <div className="text-sm text-blue-100">Volume</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
