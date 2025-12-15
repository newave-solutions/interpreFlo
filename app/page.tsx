import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ExpertCard from '@/components/ExpertCard';
import { experts } from '@/data/experts';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      
      {/* Expert Library Section */}
      <section id="experts" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Learn from Expert Coaches
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get insights and tips from experienced medical interpreters and voice professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Medical Interpreters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Hospital Interpreter',
                quote: 'VoiceCoach Pro transformed my confidence in high-stress situations. The real-time feedback is invaluable.',
              },
              {
                name: 'Miguel Torres',
                role: 'Freelance Medical Interpreter',
                quote: 'The scenario library covers every situation I encounter. My clients have noticed the improvement in my vocal delivery.',
              },
              {
                name: 'Lisa Chen',
                role: 'Clinic Interpreter',
                quote: 'The daily warmups and progress tracking keep me consistent. I\'ve seen measurable improvement in just 3 months.',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-yellow-400 text-3xl mb-4">★★★★★</div>
                <p className="text-gray-700 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Master Your Voice?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of medical interpreters improving their skills with VoiceCoach Pro
          </p>
          <button className="bg-white text-blue-600 px-12 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg shadow-lg">
            Start Free Trial
          </button>
        </div>
      </section>
    </main>
  );
}
