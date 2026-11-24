import { motion } from 'framer-motion';
import styles from './Welcome.module.css';

const SUGGESTIONS = [
  { icon: '💊', text: 'What medications are mentioned in the document?' },
  { icon: '🔬', text: 'Summarize the key diagnoses or findings' },
  { icon: '⚠️', text: 'What are the listed side effects or warnings?' },
  { icon: '📋', text: 'What treatment plan or dosage is recommended?' },
  { icon: '🧪', text: 'What lab results or test values are mentioned?' },
  { icon: '📅', text: 'What follow-up actions or dates are specified?' },
];

export default function Welcome({ onSuggestion }) {
  return (
    <div className={styles.welcome}>
      <motion.div
        className={styles.orb}
        animate={{ y: [0, -12, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🧬
      </motion.div>

      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Ask your <em>medical documents</em>
      </motion.h1>

      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Upload PDFs using the sidebar, then ask any question.
        MediSuperBot finds the relevant sections and generates
        a grounded, source-cited answer.
      </motion.p>

      <motion.div
        className={styles.grid}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={i}
            className={styles.card}
            onClick={() => onSuggestion(s.text)}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span className={styles.cardIcon}>{s.icon}</span>
            <span className={styles.cardText}>{s.text}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
