'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';

interface HistoryEvent {
  id: number;
  action: string;
  details: string;
  icon: string | null;
  color: string | null;
  createdAt: string;
}

export default function HistoryPage() {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (!res.ok) throw new Error('Failed to fetch connection logs.');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading history logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading connection logs..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Connection Logs</h1>
          <p className="text-gray-500 mt-1">Monitor active engagement on your profile. See when and how users connect with your card.</p>
        </div>

        {error && <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

        <div className="relative">
          {events.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">📶</div>
              <h3 className="text-lg font-bold text-gray-900">No Interaction Events</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm">Your NFC card has not been scanned or tapped by other users yet.</p>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {events.map((event, idx) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" style={{ background: event.color || '#3b82f6' }}>
                    <span className="text-white text-sm">{event.icon || '🔗'}</span>
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900">{event.action}</h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {new Date(event.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
