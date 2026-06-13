'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';

interface Tag {
  text: string;
  type: string;
}

interface LeaderboardProfile {
  id: number;
  userId: number;
  name: string;
  tagline: string;
  avatar: string;
  bio: string;
  diamonds: string;
  isPremium: boolean;
  tapCount: number;
  score: number;
  tags: Tag[];
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) throw new Error('Failed to fetch leaderboard data.');
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading leaderboard rankings..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tapfolio Leaderboard</h1>
          <p className="text-gray-500 mt-1">Discover elite creators and professionals. Only Premium accounts meeting a minimum profile score of 60 qualify.</p>
        </div>

        {error && <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

        <div>
          {leaderboard.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-gray-900">No Qualified Profiles Yet</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm mb-6">Be the first to upgrade your profile and meet all checklist criteria to rank number one!</p>
              <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                Complete Checklist in Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {leaderboard.map((profile, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={profile.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {/* Rank Indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : rank === 3 ? '#b45309' : 'transparent' }}></div>
                    
                    <div className="flex items-center justify-center w-10 h-10 shrink-0">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${rank === 1 ? 'bg-amber-100 text-amber-700' : rank === 2 ? 'bg-slate-100 text-slate-700' : rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-500'}`}>
                        {rank}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start flex-1 gap-4 text-center sm:text-left w-full">
                      <img src={profile.avatar} alt={profile.name} className="w-16 h-16 sm:w-14 sm:h-14 rounded-full border border-gray-200 object-cover shrink-0" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{profile.name}</h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wide">💎 Premium</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mb-2">{profile.tagline}</p>
                        <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                          {profile.tags.map((t, tIdx) => (
                            <span key={tIdx} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${t.type === 'location' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                              {t.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto justify-center sm:justify-end border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-gray-900">{profile.score}</span>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Pts</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-gray-900">{profile.tapCount}</span>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Taps</span>
                      </div>
                      <Link href={`/${slugify(profile.name)}`} className="hidden sm:flex px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors">
                        View
                      </Link>
                    </div>
                    {/* Mobile View Button */}
                    <Link href={`/${slugify(profile.name)}`} className="sm:hidden w-full px-4 py-2 mt-2 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors text-center">
                      View Profile
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
