import { useRef } from 'react';
import { SendHorizonal, Mic } from 'lucide-react';
import styles from './ChatInput.module.css';

export default function ChatInput({ onSend, disabled, value, onChange }) {
  const ref = useRef();

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const q = value.trim();
    if (!q || disabled) return;
    onSend(q);
  }

  function handleChange(e) {
    onChange(e.target.value);
    // auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px';
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.inputBox} ${disabled ? styles.disabled : ''}`}>
        <textarea
          ref={ref}
          className={styles.textarea}
          placeholder="Ask a question about your uploaded documents…"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          rows={1}
          disabled={disabled}
        />
        <button
          className={styles.sendBtn}
          onClick={submit}
          disabled={!value.trim() || disabled}
          title="Send (Enter)"
        >
          <SendHorizonal size={16} strokeWidth={2} />
        </button>
      </div>

      <div className={styles.footer}>
        <span className={styles.hint}>⏎ Send · Shift+⏎ New line</span>
        <span className={styles.charCount}>{value.length} / 500</span>
      </div>
    </div>
  );
}
