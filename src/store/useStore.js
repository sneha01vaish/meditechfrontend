import { useState, useCallback } from 'react';

// Simple module-level state shared via a custom hook pattern
let _messages = [];
let _files = [];
let _listeners = new Set();

function notify() { _listeners.forEach(fn => fn()); }

export function useStore() {
  const [, rerender] = useState(0);

  // Subscribe on mount
  useCallback(() => {
    const fn = () => rerender(n => n + 1);
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  }, [])();

  return {
    messages: _messages,
    files: _files,
    addMessage(msg) {
      _messages = [..._messages, { id: Date.now() + Math.random(), ...msg }];
      notify();
    },
    updateLastMessage(patch) {
      const last = _messages[_messages.length - 1];
      if (last) {
        _messages = [..._messages.slice(0, -1), { ...last, ...patch }];
        notify();
      }
    },
    clearMessages() {
      _messages = [];
      notify();
    },
    addFile(file) {
      _files = [..._files, file];
      notify();
    },
    clearFiles() {
      _files = [];
      notify();
    },
  };
}
