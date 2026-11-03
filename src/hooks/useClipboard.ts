import { useEffect, useRef, useState } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; clearTimeout(timeout.current); };
  }, []);

  const copy = async (text: string, label: string) => {
    clearTimeout(timeout.current);
    setCopied(null);
    setError('');
    try {
      await navigator.clipboard.writeText(text);
      if (!mounted.current) return;
      setCopied(label);
      timeout.current = setTimeout(() => setCopied(null), 2500);
    } catch {
      if (mounted.current) setError('Copy unavailable. Select the contact address below to copy it manually.');
    }
  };
  return { copied, error, copy };
}
