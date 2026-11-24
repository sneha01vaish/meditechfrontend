import { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadPDFs } from '../api/client';
import styles from './Sidebar.module.css';

export default function Sidebar({ files, onFilesAdded, fullPage = false }) {
  const [pending,   setPending]   = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver,  setDragOver]  = useState(false);
  const inputRef = useRef();

  function handleSelect(e) { setPending(Array.from(e.target.files)); }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    setPending(Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf'));
  }

  async function handleUpload() {
    if (!pending.length || uploading) return;
    setUploading(true);
    try {
      await uploadPDFs(pending);
      onFilesAdded(pending.map(f => ({ name: f.name, size: f.size, status: 'ok' })));
      setPending([]);
      if (inputRef.current) inputRef.current.value = '';
    } catch {
      onFilesAdded(pending.map(f => ({ name: f.name, size: f.size, status: 'error' })));
    }
    setUploading(false);
  }

  function formatSize(b) {
    if (!b) return '?';
    if (b < 1024) return `${b}B`;
    if (b < 1024*1024) return `${Math.round(b/1024)}KB`;
    return `${(b/1024/1024).toFixed(1)}MB`;
  }

  const wrapClass = fullPage ? `${styles.sidebar} ${styles.fullPage}` : styles.sidebar;

  return (
    <aside className={wrapClass}>
      {/* Upload section */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}><Upload size={11}/>Upload Documents</div>

        <div
          className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" multiple accept=".pdf"
            onChange={handleSelect} style={{ display:'none' }} />
          <div className={styles.dropIcon}><FileText size={28} strokeWidth={1.5}/></div>
          <p className={styles.dropText}>
            {pending.length > 0
              ? <><strong>{pending.length} file{pending.length > 1 ? 's' : ''} selected</strong></>
              : <><strong>Drop PDFs here</strong><br/>or click to browse</>}
          </p>
          <span className={styles.dropHint}>PDF only · multiple files OK</span>
        </div>

        <AnimatePresence>
          {pending.length > 0 && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
              exit={{opacity:0,height:0}} className={styles.pendingList}>
              {pending.map((f,i) => (
                <div key={i} className={styles.pendingItem}>
                  <span className={styles.pendingName}>{f.name}</span>
                  <span className={styles.pendingSize}>{formatSize(f.size)}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button className={styles.uploadBtn} disabled={!pending.length || uploading} onClick={handleUpload}>
          {uploading
            ? <><Loader size={14} className={styles.spin}/>Indexing…</>
            : <><Upload size={14}/>Upload {pending.length > 0 ? `${pending.length} File${pending.length>1?'s':''}` : 'Files'}</>}
        </button>
      </div>

      {/* Indexed files */}
      <div className={styles.filesSection}>
        <div className={styles.sectionLabel}>
          <Database size={11}/>Knowledge Base
          <span className={styles.filesBadge}>{files.filter(f=>f.status==='ok').length}</span>
        </div>

        <div className={styles.filesList}>
          <AnimatePresence>
            {files.length === 0
              ? <div className={styles.filesEmpty}>No documents indexed yet.<br/>Upload PDFs to get started.</div>
              : files.map((f,i) => (
                  <motion.div key={f.name+i} className={styles.fileItem}
                    initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}>
                    <div className={styles.fileIconBox}>PDF</div>
                    <div className={styles.fileInfo}>
                      <span className={styles.fileName} title={f.name}>{f.name}</span>
                      <span className={styles.fileMeta}>{formatSize(f.size)}</span>
                    </div>
                    <div className={`${styles.fileStatus} ${styles[f.status]}`}>
                      {f.status==='ok'      && <CheckCircle size={13}/>}
                      {f.status==='error'   && <AlertCircle size={13}/>}
                      {f.status==='loading' && <Loader size={13} className={styles.spin}/>}
                    </div>
                  </motion.div>
                ))
            }
          </AnimatePresence>
        </div>
      </div>

      {/* Footer info — only in sidebar mode */}
      {!fullPage && (
        <div className={styles.sidebarFooter}>
          <div className={styles.footerRow}><span>Endpoint</span><span className={styles.footerVal}>:8000</span></div>
          <div className={styles.footerRow}><span>LLM</span><span className={styles.footerVal}>llama-3.3-70b</span></div>
          <div className={styles.footerRow}><span>Embeddings</span><span className={styles.footerVal}>gemini-001</span></div>
          <div className={styles.footerRow}><span>Vector DB</span><span className={styles.footerVal}>Pinecone</span></div>
        </div>
      )}
    </aside>
  );
}
