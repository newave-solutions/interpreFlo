'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Badge from './Badge';
import { badges } from '@/data/badges';

interface UserProgress {
  total_practice_time: number;
  scenarios_completed: number;
  average_score: number;
  streak_days: number;
}

interface PracticeSession {
  id: string;
  session_type: string;
  duration: number;
  overall_score: number;
  completed_at: string;
}

interface UserBadge {
  badge_id: string;
  earned_at: string;
}

export default function ProgressDashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }, [user]);

  const fetchSessions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(7);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchBadges = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProgress();
      fetchSessions();
      fetchBadges();
    }
  }, [user, fetchProgress, fetchSessions, fetchBadges]);

  // Prepare chart data
  const chartData = sessions
    .reverse()
    .map((session) => ({
      date: new Date(session.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: session.overall_score || 0,
    }));

  if (loading) {
    return <div className="text-center py-12">Loading progress...</div>;
  }

  const earnedBadgeIds = new Set(userBadges.map((b) => b.badge_id));

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90 mb-1">Total Practice Time</div>
          <div className="text-3xl font-bold">
            {Math.floor((progress?.total_practice_time || 0) / 60)}h {(progress?.total_practice_time || 0) % 60}m
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90 mb-1">Sessions Completed</div>
          <div className="text-3xl font-bold">{progress?.scenarios_completed || 0}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90 mb-1">Average Score</div>
          <div className="text-3xl font-bold">{progress?.average_score || 0}%</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90 mb-1">Current Streak</div>
          <div className="text-3xl font-bold">{progress?.streak_days || 0} days</div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Activity</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No practice sessions yet. Start practicing to see your progress!
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const earnedBadge = userBadges.find((ub) => ub.badge_id === badge.id);
            return (
              <Badge
                key={badge.id}
                id={badge.id}
                name={badge.name}
                description={badge.description}
                icon={badge.icon}
                earned={earnedBadgeIds.has(badge.id)}
                earnedAt={earnedBadge?.earned_at}
              />
            );
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Sessions</h2>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {session.session_type.charAt(0).toUpperCase() + session.session_type.slice(1)} Session
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(session.completed_at).toLocaleDateString()} •{' '}
                    {Math.floor(session.duration / 60)}m {session.duration % 60}s
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {session.overall_score}%
                  </div>
                  <div className="text-xs text-gray-500">Overall</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No sessions recorded yet. Start your first practice session!
          </div>
        )}
      </div>
    </div>
  );
}
