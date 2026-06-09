'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface ConnectClientPageProps {
  username: string;
  profile: {
    id: number;
    userId: number;
    name: string;
    avatar: string;
    tagline: string;
  };
  isLoggedIn: boolean;
}

export default function ConnectClientPage({
  username,
  profile,
  isLoggedIn,
}: ConnectClientPageProps) {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(isLoggedIn);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Attempt to launch the mobile app if on a mobile device
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tapfolio://connect/${username}`;
    }

    async function loadPublicData() {
      try {
        const res = await fetch(`/api/profile/${username}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setProfileData(data.profile);
        }
      } catch (err) {
        console.error('Error fetching public profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    }

    async function loadStatus() {
      if (!isLoggedIn) {
        setLoadingStatus(false);
        return;
      }
      try {
        const res = await fetch(`/api/connections/status/${username}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus(data.connectionStatus);
        }
      } catch (err) {
        console.error('Error fetching connection status:', err);
      } finally {
        setLoadingStatus(false);
      }
    }

    loadPublicData();
    loadStatus();
  }, [username, isLoggedIn]);

  const handleConnect = async () => {
    if (!isLoggedIn) {
      // 3-layer intent preservation
      sessionStorage.setItem('pendingIntent', `connect:${username}`);
      localStorage.setItem('pendingIntent', `connect:${username}`);
      router.push(`/login?redirect=/connect/${username}&intent=connect`);
      return;
    }

    setLoadingAction(true);
    setError('');

    try {
      const res = await fetch('/api/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverUsername: username, via: 'web' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Connection request failed.');
      }
      setStatus('pending');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoadingAction(false);
    }
  };

  // Build tags section
  const renderTags = () => {
    const tags = profileData?.tags || [];
    if (tags.length === 0) return null;
    return (
      <div className={styles.tagsContainer}>
        {tags.map((t: any) => {
          const isLoc = t.type === 'location';
          return (
            <span key={t.id} className={isLoc ? styles.locationTag : styles.roleTag}>
              {isLoc ? '📍' : '⚙️'} {t.text}
            </span>
          );
        })}
      </div>
    );
  };

  // Build social links list
  const renderSocials = () => {
    const socials = profileData?.socials || [];
    if (socials.length === 0) return null;
    return (
      <div className={styles.socialsSection}>
        <h3 className={styles.sectionTitle}>Links</h3>
        <div className={styles.socialList}>
          {socials.map((link: any) => {
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialCard}
                style={{ borderColor: `${link.color}44` }}
              >
                <div className={styles.socialInfo}>
                  <span className={styles.platform}>{link.platform}</span>
                  <span className={styles.handle}>{link.handle}</span>
                </div>
                <span className={styles.socialIcon} style={{ color: link.color }}>🔗</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Profile Basic Details */}
        <img
          src={profile.avatar || '/profile_avatar.png'}
          alt={profile.name}
          className={styles.avatar}
        />
        <h1 className={styles.name}>{profile.name}</h1>
        {profile.tagline && <p className={styles.tagline}>{profile.tagline}</p>}

        {/* Loading Skeleton / Profile Hydration */}
        {loadingProfile ? (
          <div className={styles.skeletonContainer}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLineShort}></div>
            <div className={styles.skeletonChips}>
              <div className={styles.skeletonChip}></div>
              <div className={styles.skeletonChip}></div>
            </div>
          </div>
        ) : (
          <>
            {/* Bio Section */}
            {profileData?.bio && (
              <p className={styles.bio}>
                {profileData.bio}
              </p>
            )}

            {/* Tags (Roles/Locations) */}
            {renderTags()}

            {/* Stats Row */}
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <span className={styles.statVal}>💎 {profileData?.diamonds || '0'}</span>
                <span className={styles.statLabel}>Points</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal}>👥 {profileData?.connectionCount || '0'}</span>
                <span className={styles.statLabel}>Connections</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal}>⚡ {profileData?.tapCount || '0'}</span>
                <span className={styles.statLabel}>Taps</span>
              </div>
            </div>

            {/* Social Links List */}
            {renderSocials()}
          </>
        )}

        {/* Action Button & Badges */}
        <div className={styles.actions}>
          {loadingStatus ? (
            <div className={styles.statusBadgeLoading}>Checking connection status...</div>
          ) : (
            <>
              {status === 'pending' && (
                <div className={styles.statusBadgePending}>
                  ⏳ Request Pending
                </div>
              )}
              {status === 'accepted' && (
                <div className={styles.statusBadgeAccepted}>
                  ✅ Already Connected
                </div>
              )}
              {status === 'blocked' && (
                <div className={styles.statusBadgeBlocked}>
                  🚫 Blocked
                </div>
              )}
              {(!status || status === 'rejected') && (
                <button
                  onClick={handleConnect}
                  disabled={loadingAction}
                  className={styles.openAppBtn}
                >
                  {loadingAction ? 'Processing...' : isLoggedIn ? 'Connect with me' : 'Login to Connect'}
                </button>
              )}
            </>
          )}

          <a href={`/@${username}`} className={styles.viewProfileLink}>
            View web profile
          </a>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
