import { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header    from './components/Header';
import Sidebar   from './components/Sidebar';
import Welcome   from './components/Welcome';
import Message   from './components/Message';
import ChatInput from './components/ChatInput';
import Toast     from './components/Toast';
import { useToast } from './hooks/useToast';
import { askQuestion } from './api/client';
import { useServerStatus } from './hooks/useServerStatus';
import styles from './App.module.css';

// ── Upload Page ────────────────────────────────────────────────────────────────
function UploadPage({ files, onFilesAdded }) {
  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.pageInner}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Upload Documents</h2>
          <p className={styles.pageDesc}>
            Upload your medical PDF files to the knowledge base. Once indexed,
            you can ask questions about them on the Chat page.
          </p>
        </div>
        <Sidebar files={files} onFilesAdded={onFilesAdded} fullPage />
      </div>
    </motion.div>
  );
}

// ── Chat Page ─────────────────────────────────────────────────────────────────
function ChatPage({ files, onFilesAdded }) {
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [querying,   setQuerying]   = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { addToast } = useToast();

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  const handleSend = useCallback(async (question) => {
    if (querying) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: question }]);
    setInput('');
    setQuerying(true);
    setShowTyping(true);
    try {
      const data = await askQuestion(question);
      setShowTyping(false);
      if (data?.answer) {
        const ans = data.answer;
        setMessages(prev => [...prev, {
          id: Date.now(), role: 'bot',
          text: ans.response || String(ans),
          sources: ans.sources || [],
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now(), role: 'bot',
          text: data?.error || 'Something went wrong.',
          isError: true,
        }]);
      }
    } catch {
      setShowTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(), role: 'bot',
        text: 'Could not reach the server. Make sure FastAPI is running on port 8000.',
        isError: true,
      }]);
      addToast('error', '❌ Server unreachable');
    }
    setQuerying(false);
  }, [querying, addToast]);

  const handleSuggestion = useCallback((text) => setInput(text), []);
  const handleClear = useCallback(() => { setMessages([]); setInput(''); }, []);

  return (
    <motion.div
      className={styles.chatPage}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.body}>
        {/* Sidebar — collapsed on chat page */}
        <Sidebar files={files} onFilesAdded={onFilesAdded} />

        <main className={styles.main}>
          {!hasMessages ? (
            <Welcome onSuggestion={handleSuggestion} />
          ) : (
            <div className={styles.messages}>
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <Message
                    key={msg.id}
                    role={msg.role}
                    text={msg.text}
                    sources={msg.sources}
                    isError={msg.isError}
                  />
                ))}
                {showTyping && <Message key="typing" role="bot" isTyping />}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={querying}
          />
        </main>
      </div>
    </motion.div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [files, setFiles] = useState([]);
  const { toasts, addToast, dismiss } = useToast();
  const status = useServerStatus();

  const handleFilesAdded = useCallback((newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
    const ok  = newFiles.filter(f => f.status === 'ok').length;
    const err = newFiles.filter(f => f.status === 'error').length;
    if (ok)  addToast('success', `✅ ${ok} file${ok > 1 ? 's' : ''} indexed successfully`);
    if (err) addToast('error',   `❌ ${err} file${err > 1 ? 's' : ''} failed to upload`);
  }, [addToast]);

  return (
    <div className={styles.app}>
      {/* Background */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGrid}  />

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.navLogoIcon}>🩺</div>
          <span className={styles.navLogoText}>Medi<span>SuperBot</span></span>
        </div>

        <div className={styles.navLinks}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            💬 Chat
          </NavLink>
          <NavLink
            to="/upload-pdfs"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            📄 Upload PDFs
          </NavLink>
        </div>

        <div className={styles.navRight}>
          <div className={`${styles.statusBadge} ${styles[status]}`}>
            <span className={styles.statusDot} />
            <span className={styles.statusLabel}>
              {status === 'checking' ? 'Connecting…' : status === 'online' ? 'API Online' : 'API Offline'}
            </span>
          </div>
          <div className={styles.filesBadge}>
            📁 {files.filter(f => f.status === 'ok').length} indexed
          </div>
        </div>
      </nav>

      {/* Routes */}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <ChatPage files={files} onFilesAdded={handleFilesAdded} />
          }/>
          <Route path="/upload-pdfs" element={
            <UploadPage files={files} onFilesAdded={handleFilesAdded} />
          }/>
          <Route path="*" element={
            <motion.div
              className={styles.notFound}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <span>404</span>
              <p>Page not found</p>
              <NavLink to="/" className={styles.notFoundLink}>← Go to Chat</NavLink>
            </motion.div>
          }/>
        </Routes>
      </AnimatePresence>

      <Toast toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
