import { Check, Copy } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { useClipboard } from '../hooks/useClipboard';

export function CopyEmailButton() {
  const { copied, error, copy } = useClipboard();
  return <div className="copy-email-action">
    <button type="button" className="btn-arch btn-arch-outline" onClick={() => copy(PERSONAL_INFO.email, 'email')}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      <span>{copied ? 'Copied!' : 'Copy email'}</span>
    </button>
    <span className={error ? 'copy-feedback' : 'sr-only'} role="status" aria-live="polite">
      {error ? <>{error} <a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</a></> : copied ? 'Email copied to clipboard.' : ''}
    </span>
  </div>;
}
