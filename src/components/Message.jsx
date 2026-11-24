import { motion } from 'framer-motion';
import { FileText, AlertTriangle } from 'lucide-react';
import styles from './Message.module.css';

export default function Message({ role, text, sources = [], isError = false, isTyping = false }) {
  return (
    <motion.div
      className={`${styles.wrapper} ${styles[role]}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <div className={`${styles.avatar} ${styles[role + 'Avatar']}`}>
        {role === 'user' ? '👤' : '🩺'}
      </div>

      <div className={`${styles.bubble} ${isError ? styles.error : ''}`}>
        {isTyping ? (
          <div className={styles.typing}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        ) : (
          <>
            {isError && (
              <div className={styles.errorHeader}>
                <AlertTriangle size={13} /> Error
              </div>
            )}
            <p className={styles.text}>{text}</p>

            {sources.length > 0 && (
              <div className={styles.sources}>
                <span className={styles.sourcesLabel}>Sources</span>
                <div className={styles.chips}>
                  {sources.filter(Boolean).map((s, i) => {
                    const fname = s.split('/').pop().split('\\').pop();
                    return (
                      <span key={i} className={styles.chip}>
                        <FileText size={10} />
                        {fname}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
