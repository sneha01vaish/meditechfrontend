import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className={styles.container}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            className={`${styles.toast} ${styles[t.type]}`}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{    opacity: 0, x: 60,  scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <span className={styles.icon}>
              {t.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
            </span>
            <span className={styles.msg}>{t.message}</span>
            <button className={styles.close} onClick={() => onDismiss(t.id)}>
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
