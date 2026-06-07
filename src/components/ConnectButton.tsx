'use client';

import { useState } from 'react';
import styles from './ConnectButton.module.css';

interface ConnectButtonProps {
  profileId: number;
  initialTapCount: number;
  username: string;
}

export default function ConnectButton({ profileId, initialTapCount, username }: ConnectButtonProps) {
  const handleConnect = () => {
    window.location.href = `/connect/${username}`;
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handleConnect}
        className={styles.connectBtn}
      >
        Connect with me
      </button>
      <div className={styles.tapStats}>
        <span>⚡ {initialTapCount} total connections</span>
      </div>
    </div>
  );
}
