'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const exercises = [
  {
    id: 1,
    title: 'Breathing Exercise',
    description: 'Deep diaphragmatic breathing to support vocal projection',
    duration: 60,
    instructions: 'Breathe in for 4 counts, hold for 4, exhale for 6. Repeat.',
  },
  {
    id: 2,
    title: 'Lip Trills',
    description: 'Relax facial muscles and warm up vocal cords',
    duration: 45,
    instructions: 'Keep lips loose and blow air through them while making sound.',
  },
  {
    id: 3,
    title: 'Pitch Glides',
    description: 'Expand vocal range and flexibility',
    duration: 60,
    instructions: 'Slide from low to high pitch on "oo" sound smoothly.',
  },
  {
    id: 4,
    title: 'Tongue Twisters',
    description: 'Improve articulation and clarity',
    duration: 90,
    instructions: 'Repeat: "Red leather, yellow leather" slowly, then faster.',
  },
  {
    id: 5,
    title: 'Volume Control',
    description: 'Practice dynamic range',
    duration: 60,
    instructions: 'Count 1-10 from whisper to full voice, then back down.',
  },
  {
    id: 6,
    title: 'Resonance Exercise',
    description: 'Find optimal vocal placement',
    duration: 45,
    instructions: 'Hum with lips closed, feel vibration in face and chest.',
  },
];

export default function DailyWarmup() {
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (activeExercise !== null) {
              setCompletedExercises([...completedExercises, activeExercise]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeExercise, completedExercises]);

  const startExercise = (exerciseId: number, duration: number) => {
    setActiveExercise(exerciseId);
    setTimeLeft(duration);
    setIsRunning(true);
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const resetExercise = () => {
    const exercise = exercises.find((e) => e.id === activeExercise);
    if (exercise) {
      setTimeLeft(exercise.duration);
      setIsRunning(false);
    }
  };

  const progress = activeExercise
    ? ((exercises.find((e) => e.id === activeExercise)!.duration - timeLeft) /
        exercises.find((e) => e.id === activeExercise)!.duration) *
      100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Vocal Warmup</h2>
        <p className="text-gray-600 mb-4">
          Complete these 6 exercises to prepare your voice for the day
        </p>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-700">
            Progress: {completedExercises.length} / {exercises.length}
          </div>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(completedExercises.length / exercises.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Exercise */}
      {activeExercise !== null && (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">
              {exercises.find((e) => e.id === activeExercise)?.title}
            </h3>
            <p className="text-blue-100 mb-6">
              {exercises.find((e) => e.id === activeExercise)?.instructions}
            </p>

            {/* Timer */}
            <div className="text-6xl font-bold mb-6">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-white bg-opacity-20 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-white transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <button
                onClick={togglePause}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center gap-2"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={resetExercise}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors font-semibold flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              completedExercises.includes(exercise.id) ? 'border-2 border-green-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{exercise.title}</h3>
              {completedExercises.includes(exercise.id) && (
                <span className="text-2xl">✅</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">{exercise.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{exercise.duration}s</span>
              <button
                onClick={() => startExercise(exercise.id, exercise.duration)}
                disabled={activeExercise === exercise.id && isRunning}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {activeExercise === exercise.id ? 'Active' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
