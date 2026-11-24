import { useState, useEffect } from 'react';
import { checkHealth } from '../api/client';

export function useServerStatus() {
  const [status, setStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  async function ping() {
    try {
      await checkHealth();
      setStatus('online');
    } catch {
      setStatus('offline');
    }
  }

  useEffect(() => {
    ping();
    const id = setInterval(ping, 8000);
    return () => clearInterval(id);
  }, []);

  return status;
}
