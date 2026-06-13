'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';

interface Tag {
  id?: number;
  text: string;
  type: string;
}

interface SocialLink {
  id: number;
  platform: string;
  handle: string;
  url: string;
  icon: string;
  color: string;
}

interface PendingRequest {
  id: number;
  via: string;
  createdAt: string;
  requester: {
    userId: number;
    name: string;
    avatar: string;
    tagline: string;
    profileId: number | null;
    diamonds: string;
    connectionCount: number;
    tapCount: number;
    tags: Tag[];
  };
}

interface Connection {
  id: number;
  via: string;
  connectedAt: string;
  other: {
    userId: number;
    name: string | null;
    avatar: string;
    tagline: string;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    location: string | null;
    tags: Tag[];
    profileId: number | null;
    socials: SocialLink[];
  };
  permissions: {
    shareName: boolean;
    shareEmail: boolean;
    sharePhone: boolean;
    shareWhatsapp: boolean;
    shareLocation: boolean;
    sharedSocialIds: number[];
  };
  myPermissions: {
    shareName: boolean;
    shareEmail: boolean;
    sharePhone: boolean;
    shareWhatsapp: boolean;
    shareLocation: boolean;
    sharedSocialIds: number[];
  };
}

interface OwnProfile {
  id: number;
  socials: SocialLink[];
}

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'connections'>('requests');
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [ownProfile, setOwnProfile] = useState<OwnProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Connection details modal state
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Sharing preferences editing state
  const [shareName, setShareName] = useState(true);
  const [shareEmail, setShareEmail] = useState(true);
  const [sharePhone, setSharePhone] = useState(false);
  const [shareWhatsapp, setShareWhatsapp] = useState(true);
  const [shareLocation, setShareLocation] = useState(false);
  const [sharedSocialIds, setSharedSocialIds] = useState<number[]>([]);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchData = async () => {
    try {
      const [reqsRes, connsRes, profileRes] = await Promise.all([
        fetch('/api/connections/requests'),
        fetch('/api/connections'),
        fetch('/api/profile'),
      ]);

      if (!reqsRes.ok || !connsRes.ok || !profileRes.ok) {
        throw new Error('Failed to load connections data.');
      }

      const reqsData = await reqsRes.json();
      const connsData = await connsRes.json();
      const profileData = await profileRes.json();

      if (reqsData.success) setRequests(reqsData.requests || []);
      if (connsData.success) setConnections(connsData.connections || []);
      if (profileData.success) setOwnProfile(profileData.profile);
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      const res = await fetch('/api/connections/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Accept failed.');

      setSuccess('Connection accepted!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error accepting request.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch('/api/connections/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reject failed.');

      setSuccess('Request rejected.');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error rejecting request.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const openDetails = (conn: Connection) => {
    setSelectedConnection(conn);
    setShareName(conn.myPermissions.shareName);
    setShareEmail(conn.myPermissions.shareEmail);
    setSharePhone(conn.myPermissions.sharePhone);
    setShareWhatsapp(conn.myPermissions.shareWhatsapp);
    setShareLocation(conn.myPermissions.shareLocation);
    setSharedSocialIds(conn.myPermissions.sharedSocialIds || []);
    setShowModal(true);
  };

  const handleSaveVisibility = async () => {
    if (!selectedConnection) return;
    setSavingSettings(true);
    try {
      const res = await fetch('/api/connections/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId: selectedConnection.id,
          shareName,
          shareEmail,
          sharePhone,
          shareWhatsapp,
          shareLocation,
          sharedSocialIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save visibility settings.');

      setSuccess('Visibility settings updated!');
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error updating visibility.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSavingSettings(false);
    }
  };

  const toggleSocialId = (id: number) => {
    if (sharedSocialIds.includes(id)) {
      setSharedSocialIds(sharedSocialIds.filter(x => x !== id));
    } else {
      setSharedSocialIds([...sharedSocialIds, id]);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your connections..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {success && <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">{success}</div>}
        {error && <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Connections</h1>
          <p className="text-gray-500 mt-1">Manage your networking requests and coordinate shared details with accepted connections.</p>
        </div>

        {/* TAB BAR */}
        <div className="flex p-1 bg-gray-200/60 rounded-xl w-full sm:w-fit overflow-x-auto mb-8">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'requests' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Pending Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'connections' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Connections ({connections.length})
          </button>
        </div>

        {/* CONTENTS */}
        <div>
          {activeTab === 'requests' ? (
            requests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-4">📥</div>
                <h3 className="text-lg font-bold text-gray-900">No Pending Requests</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-sm">When someone wants to connect with you via NFC or QR links, their requests will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map(req => (
                  <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 flex items-start gap-4 flex-1">
                      <img src={req.requester.avatar || '/profile_avatar.png'} alt={req.requester.name} className="w-14 h-14 rounded-full border border-gray-100 object-cover" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{req.requester.name}</h3>
                        {req.requester.tagline && <p className="text-sm text-gray-500 truncate">{req.requester.tagline}</p>}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">💎 {req.requester.diamonds}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">👥 {req.requester.connectionCount}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">⚡ {req.requester.tapCount}</span>
                          {req.via === 'nfc' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 uppercase">NFC</span>}
                        </div>
                      </div>
                    </div>
                    {req.requester.tags && req.requester.tags.length > 0 && (
                      <div className="px-6 pb-4 flex flex-wrap gap-2">
                        {req.requester.tags.map((t, idx) => (
                          <span key={idx} className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${t.type === 'location' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                            {t.type === 'location' ? '📍 ' : '⚙️ '} {t.text}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100 bg-gray-50">
                      <button onClick={() => handleReject(req.id)} className="py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">Reject</button>
                      <button onClick={() => handleAccept(req.id)} className="py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors">Accept</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            connections.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-lg font-bold text-gray-900">No Connections Yet</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-sm">Share your NFC profile or QR links to start building your professional database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {connections.map(conn => (
                  <div
                    key={conn.id}
                    onClick={() => openDetails(conn)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all relative flex flex-col items-center text-center"
                  >
                    <img src={conn.other.avatar || '/profile_avatar.png'} alt={conn.other.name || 'Anonymous'} className="w-16 h-16 rounded-full border-2 border-white shadow-sm mb-3 object-cover" />
                    <h3 className="text-md font-bold text-gray-900 truncate w-full">{conn.other.name || 'Anonymous'}</h3>
                    {conn.other.tagline && <p className="text-xs text-gray-500 truncate w-full mb-3">{conn.other.tagline}</p>}
                    
                    <div className="flex flex-wrap gap-1 justify-center mt-auto">
                      {conn.other.tags?.slice(0, 2).map((t, idx) => (
                        <span key={idx} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${t.type === 'location' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {t.text}
                        </span>
                      ))}
                    </div>
                    {conn.via === 'nfc' && (
                      <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">NFC</div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>

      {/* DETAILS MODAL */}
      {showModal && selectedConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center gap-5 bg-gray-50/50">
              <img src={selectedConnection.other.avatar || '/profile_avatar.png'} alt={selectedConnection.other.name || 'Anonymous'} className="w-20 h-20 rounded-full shadow-md object-cover border-4 border-white" />
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">{selectedConnection.other.name || 'Anonymous'}</h2>
                {selectedConnection.other.tagline && <p className="text-gray-500 font-medium">{selectedConnection.other.tagline}</p>}
              </div>
            </div>

            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 p-6 sm:p-8 flex-1">
              {/* Col 1: Their Details */}
              <div className="flex-1 md:pr-8 pb-8 md:pb-0">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Shared Details</h4>
                <div className="space-y-4">
                  {selectedConnection.other.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-xl">📧</span>
                      <span className="text-sm font-medium text-gray-800">{selectedConnection.other.email}</span>
                    </div>
                  )}
                  {selectedConnection.other.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-xl">📞</span>
                      <span className="text-sm font-medium text-gray-800">{selectedConnection.other.phone}</span>
                    </div>
                  )}
                  {selectedConnection.other.whatsapp && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-xl">💬</span>
                      <a href={selectedConnection.other.whatsapp} target="_blank" rel="noreferrer" className="text-sm font-bold text-green-600 hover:underline">WhatsApp Link</a>
                    </div>
                  )}
                  {selectedConnection.other.location && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-xl">📍</span>
                      <span className="text-sm font-medium text-gray-800">{selectedConnection.other.location}</span>
                    </div>
                  )}
                  {!selectedConnection.other.email && !selectedConnection.other.phone && !selectedConnection.other.whatsapp && !selectedConnection.other.location && (
                    <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-xl text-center border border-gray-100">No contact details shared by this user yet.</p>
                  )}
                </div>

                {selectedConnection.other.socials && selectedConnection.other.socials.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Shared Social Links</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedConnection.other.socials.map(link => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col p-3 rounded-xl border hover:shadow-md transition-shadow bg-white"
                          style={{ borderColor: link.color + '40' }}
                        >
                          <span className="text-xs font-bold text-white px-2 py-0.5 rounded w-fit mb-2" style={{ background: link.color }}>{link.platform}</span>
                          <span className="text-sm font-medium text-gray-800 truncate">{link.handle}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Col 2: My Preferences */}
              <div className="flex-1 md:pl-8 pt-8 md:pt-0">
                <h4 className="text-lg font-bold text-gray-900 mb-1">My Sharing Preferences</h4>
                <p className="text-sm text-gray-500 mb-6">Choose what details {selectedConnection.other.name || 'Anonymous'} is allowed to see.</p>
                
                <div className="space-y-3">
                  {[
                    { id: 'shareName', label: 'Name', desc: 'Share your display name', checked: shareName, setter: setShareName },
                    { id: 'shareEmail', label: 'Email', desc: 'Share your email address', checked: shareEmail, setter: setShareEmail },
                    { id: 'sharePhone', label: 'Phone', desc: 'Share your phone number', checked: sharePhone, setter: setSharePhone },
                    { id: 'shareWhatsapp', label: 'WhatsApp', desc: 'Share your WhatsApp link', checked: shareWhatsapp, setter: setShareWhatsapp },
                    { id: 'shareLocation', label: 'Location', desc: 'Share your location details', checked: shareLocation, setter: setShareLocation },
                  ].map(toggle => (
                    <label key={toggle.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="text-sm font-bold text-gray-900">{toggle.label}</div>
                        <div className="text-xs text-gray-500">{toggle.desc}</div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={toggle.checked} onChange={(e) => toggle.setter(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </label>
                  ))}
                </div>

                {ownProfile?.socials && ownProfile.socials.length > 0 && (
                  <div className="mt-8">
                    <h5 className="text-sm font-bold text-gray-900 mb-3">Share Social Links</h5>
                    <div className="space-y-2">
                      {ownProfile.socials.map(link => (
                        <label key={link.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={sharedSocialIds.includes(link.id)}
                            onChange={() => toggleSocialId(link.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm font-bold" style={{ color: link.color }}>{link.platform}</span>
                          <span className="text-sm text-gray-500">({link.handle})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveVisibility}
                disabled={savingSettings}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
