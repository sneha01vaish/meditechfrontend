import { Activity, Trash2 } from 'lucide-react';
import { useServerStatus } from '../hooks/useServerStatus';
import styles from './Header.module.css';

export default function Header({ onClear }) {
  const status = useServerStatus();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🩺</div>
        <span className={styles.logoText}>
          Medi<span className={styles.accent}>SuperBot</span>
        </span>
        <span className={styles.logoSub}>Medical AI Assistant</span>
      </div>

      <div className={styles.right}>
        <div className={`${styles.statusBadge} ${styles[status]}`}>
          <span className={styles.statusDot} />
          <span className={styles.statusLabel}>
            {status === 'checking' ? 'Connecting…' : status === 'online' ? 'API Online' : 'API Offline'}
          </span>
        </div>

        <button className={styles.clearBtn} onClick={onClear} title="Clear chat">
          <Trash2 size={14} />
          Clear
        </button>
      </div>
    </header>
  );
}
