'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ImageCropModal from '@/components/ImageCropModal';

interface Tag {
  id?: number;
  text: string;
  type: string;
}

interface SocialLink {
  id?: number;
  platform: string;
  handle: string;
  url: string;
  icon: string;
  color: string;
}

interface Profile {
  id: number;
  userId: number;
  name: string;
  username: string;
  tagline: string;
  avatar: string;
  isOnline: boolean;
  bio: string;
  diamonds: string;
  isPremium: boolean;
  tapCount: number;
  tags: Tag[];
  socials: SocialLink[];
  user?: {
    profileReady: boolean;
    connectionCount?: number;
    sharingSettings: {
      shareName: boolean;
      shareEmail: boolean;
      sharePhone: boolean;
      shareWhatsapp: boolean;
      shareLocation: boolean;
    } | null;
  };
}

interface ChecklistItem {
  id: string;
  label: string;
  points: number;
  completed: boolean;
  description: string;
}

interface SharingSettings {
  shareName: boolean;
  shareEmail: boolean;
  sharePhone: boolean;
  shareWhatsapp: boolean;
  shareLocation: boolean;
}

// Modern Platform Icon Renderer
const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('github')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    );
  }
  if (p.includes('linkedin')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    );
  }
  if (p.includes('twitter') || p.includes('x.com')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  if (p.includes('instagram')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051c-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    );
  }
  if (p.includes('youtube')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.113C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.505a3.003 3.003 0 00-2.11 2.113C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.113c1.87.505 9.388.505 9.388.505s7.518 0 9.388-.505a3.002 3.002 0 002.11-2.113C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
};

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [historyEvents, setHistoryEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tabs Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'customizer' | 'sharing'>('overview');

  // Editable fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  // Tags states
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagText, setNewTagText] = useState('');
  const [newTagType, setNewTagType] = useState('role');

  // Socials states
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('GitHub');
  const [newHandle, setNewHandle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Sharing Settings
  const [sharingSettings, setSharingSettings] = useState<SharingSettings>({
    shareName: true,
    shareEmail: true,
    sharePhone: false,
    shareWhatsapp: true,
    shareLocation: false,
  });
  const [savingSharing, setSavingSharing] = useState(false);

  // Score & Checklist
  const [score, setScore] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Image Crop Modal State
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Failed to fetch profile.');
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setName(data.profile.name);
        setTagline(data.profile.tagline || '');
        setBio(data.profile.bio || '');
        setAvatar(data.profile.avatar);
        setIsPremium(data.profile.isPremium);
        setTags(data.profile.tags || []);
        setSocials(data.profile.socials || []);
        setScore(data.score);
        setChecklist(data.items);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading profile.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setHistoryEvents(data.events || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch history logs:', err);
    }
  };

  const fetchSharingSettings = async () => {
    try {
      const res = await fetch('/api/connections/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSharingSettings(data.settings);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sharing settings:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchHistory();
    fetchSharingSettings();
  }, []);

  // Step 1: User picks a file → show crop modal
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  // Step 2: Crop complete → upload cropped blob
  const handleCropDone = async (croppedBlob: Blob) => {
    setShowCropModal(false);
    setCropImageSrc(null);

    const formData = new FormData();
    formData.append('file', croppedBlob, 'avatar.png');

    setSaving(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAvatar(data.url);
        setSuccess('Avatar cropped & uploaded! Save your profile to finalize.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload error');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropImageSrc(null);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagText.trim()) return;
    const isDuplicate = tags.some(
      (t) => t.text.toLowerCase() === newTagText.trim().toLowerCase() && t.type === newTagType
    );
    if (isDuplicate) return;

    setTags([...tags, { text: newTagText.trim(), type: newTagType }]);
    setNewTagText('');
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim() || !newUrl.trim()) return;

    const platformSpecs: Record<string, { color: string; icon: string }> = {
      GitHub: { color: '#24292e', icon: 'github' },
      LinkedIn: { color: '#0077b5', icon: 'linkedin' },
      Twitter: { color: '#1da1f2', icon: 'twitter' },
      Instagram: { color: '#e1306c', icon: 'instagram' },
      YouTube: { color: '#ff0000', icon: 'youtube' },
      Website: { color: '#10b981', icon: 'globe' },
    };

    const specs = platformSpecs[newPlatform] || { color: '#6366f1', icon: 'link' };

    setSocials([
      ...socials,
      {
        platform: newPlatform,
        handle: newHandle.trim(),
        url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`,
        icon: specs.icon,
        color: specs.color,
      },
    ]);

    setNewHandle('');
    setNewUrl('');
  };

  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          tagline,
          bio,
          avatar,
          tags,
          socials,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile.');

      setSuccess('Profile saved successfully!');
      setProfile(data.profile);
      setScore(data.score);
      setChecklist(data.items);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSharingSettings = async () => {
    setSavingSharing(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/connections/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sharingSettings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update sharing settings.');

      setSuccess('Sharing preferences updated!');
      setSharingSettings(data.settings);
      
      // Refresh profile to update checklist points
      await fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setSavingSharing(false);
    }
  };

  const handleUpgradePayment = async () => {
    setPaymentProcessing(true);
    setError('');

    setTimeout(async () => {
      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPremium: true }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error('Upgrade update failed.');

        setIsPremium(true);
        if (profile) {
          setProfile({ ...profile, isPremium: true });
        }
        setShowPaymentModal(false);
        setSuccess('Upgrade successful! You are now a premium member and eligible for the leaderboard.');
        setTimeout(() => setSuccess(''), 5000);
      } catch (err: any) {
        setError(err.message || 'Upgrade failed.');
      } finally {
        setPaymentProcessing(false);
      }
    }, 2000);
  };

  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  const publicLink = profile ? `${window.location.origin}/@${profile.username}` : '';

  const calculateProgress = () => {
    let pct = 40;
    const checklistItems = [
      { id: 'signup', label: 'Create Account', completed: true, value: 40, desc: 'Sign up with name & email' },
      { id: 'username', label: 'Customize Username', completed: false, value: 15, desc: 'Set a custom username link' },
      { id: 'photo_headline', label: 'Photo & Headline', completed: false, value: 15, desc: 'Upload an avatar and set tagline' },
      { id: 'sharing', label: 'Sharing Preferences', completed: false, value: 15, desc: 'Set your contact sharing settings' },
      { id: 'socials', label: 'Add Social Link', completed: false, value: 15, desc: 'Add at least one social profile' },
    ];

    if (profile?.user?.profileReady) {
      checklistItems[1].completed = true;
      pct += 15;
    }

    const hasCustomAvatar = profile?.avatar && profile.avatar !== '/profile_avatar.png' && !profile.avatar.includes('profile_avatar.png');
    const hasCustomTagline = profile?.tagline && profile.tagline.trim().length > 0 && profile.tagline !== "Let's connect!";
    if (hasCustomAvatar && hasCustomTagline) {
      checklistItems[2].completed = true;
      pct += 15;
    }

    if (profile?.user?.sharingSettings) {
      checklistItems[3].completed = true;
      pct += 15;
    }

    if (profile?.socials && profile.socials.length >= 1) {
      checklistItems[4].completed = true;
      pct += 15;
    }

    return { percentage: pct, items: checklistItems };
  };

  const progressData = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your digital presence and TapFolio settings.</p>
          </div>
          {publicLink && (
            <a 
              href={publicLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Public Profile
              <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
        </div>

        {error && <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
        {success && <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN - MAIN CONTROLS */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* SEGMENTED TABS */}
            <div className="flex p-1 bg-gray-200/60 rounded-xl w-full sm:w-fit overflow-x-auto">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('customizer')}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'customizer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Customize Profile
              </button>
              <button 
                onClick={() => setActiveTab('sharing')}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'sharing' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Privacy & Sharing
              </button>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
                    <span className="text-gray-500 font-medium text-sm">Profile Views</span>
                    <span className="text-3xl font-extrabold text-gray-900">{profile?.tapCount || 0}</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
                    <span className="text-gray-500 font-medium text-sm">TapFolio Score</span>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-extrabold text-gray-900">{score}</span>
                      <span className="text-gray-400 font-medium text-sm mb-1">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Setup Checklist */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Setup Progress</h3>
                    <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressData.percentage}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 font-medium">{progressData.percentage}% Completed</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {progressData.items.map((item, i) => (
                      <div key={i} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${item.completed ? 'bg-green-100 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                            {item.completed ? (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>{item.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-400">+{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Logs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {historyEvents.slice(0, 3).map((event, i) => (
                      <div key={i} className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{event.action}</p>
                          <p className="text-xs text-gray-400">{new Date(event.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {historyEvents.length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-500 text-sm">No activity recorded yet.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* CUSTOMIZER TAB */}
            {activeTab === 'customizer' && (
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Details</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-8 mb-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                        {avatar ? (
                          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        Change Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 font-medium" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Professional Tagline</label>
                        <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 font-medium" placeholder="Founder & CEO" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Biography</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 font-medium resize-none" placeholder="Tell people about yourself..." />
                  </div>

                  {/* Social Links */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Social Links</h4>
                    <div className="space-y-3 mb-4">
                      {socials.map((social, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-gray-700">
                              {getPlatformIcon(social.platform)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{social.platform}</p>
                              <p className="text-xs text-gray-500">{social.handle}</p>
                            </div>
                          </div>
                          <button onClick={() => handleRemoveSocial(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleAddSocial} className="flex flex-col sm:flex-row gap-3">
                      <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-blue-500">
                        <option>LinkedIn</option>
                        <option>Twitter</option>
                        <option>GitHub</option>
                        <option>Instagram</option>
                        <option>Website</option>
                      </select>
                      <input type="text" placeholder="Handle / Label" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-blue-500" />
                      <input type="text" placeholder="URL (e.g. linkedin.com/in/...)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-blue-500" />
                      <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">Add</button>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button onClick={handleSaveProfile} disabled={saving} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Profile Details'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === 'sharing' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Information Sharing</h3>
                <p className="text-gray-500 text-sm mb-8">Control exactly what information is requested and shared when someone taps your card.</p>
                
                <div className="space-y-4 mb-8">
                  {[
                    { id: 'shareName', label: 'Share Name & Photo', desc: 'Display your basic identity on the connection screen.' },
                    { id: 'shareEmail', label: 'Share Email Address', desc: 'Allow contacts to save your primary email.' },
                    { id: 'sharePhone', label: 'Share Phone Number', desc: 'Allow contacts to call or text you directly.' },
                    { id: 'shareWhatsapp', label: 'Share WhatsApp', desc: 'Include a direct WhatsApp messaging link.' },
                    { id: 'shareLocation', label: 'Share Office Location', desc: 'Display your company address or city.' },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-900">{setting.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={sharingSettings[setting.id as keyof SharingSettings]} onChange={(e) => setSharingSettings({ ...sharingSettings, [setting.id]: e.target.checked })} />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button onClick={handleSaveSharingSettings} disabled={savingSharing} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-sm transition-all disabled:opacity-50">
                    {savingSharing ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN - LIVE PREVIEW */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 bg-white rounded-[2rem] shadow-xl border-[6px] border-gray-100 overflow-hidden w-full max-w-[320px] mx-auto min-h-[600px] flex flex-col">
              {/* Dynamic Theme Background */}
              <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-800 relative">
                 <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live Preview
                 </div>
              </div>
              
              <div className="px-6 flex-1 -mt-12 relative flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white overflow-hidden mb-4">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 text-center">{name || 'Your Name'}</h2>
                <p className="text-sm font-medium text-blue-600 text-center mb-4">{tagline || 'Your Tagline'}</p>
                
                <p className="text-xs text-gray-500 text-center leading-relaxed mb-6">{bio || 'Your bio will appear here. Tell people about what you do and how you can help them.'}</p>
                
                {socials.length > 0 && (
                  <div className="w-full grid grid-cols-5 gap-2 mb-6">
                    {socials.map((s, i) => (
                      <div key={i} className="aspect-square bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer" style={{ color: s.color }}>
                        {getPlatformIcon(s.platform)}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto w-full pb-6">
                  <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-md">
                    Save Contact
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {showCropModal && cropImageSrc && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onCropDone={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
