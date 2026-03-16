import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lock, X } from 'lucide-react';
import '../Modal.css';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADD_PASSWORD;
    if (password === correctPassword) {
      sessionStorage.setItem('auth_password', password);
      onSuccess();
      onClose();
    } else {
      setError('Wrong password. Please try again.');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return createPortal(
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '380px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ margin: 0 }}>Password Required</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-secondary" style={{ margin: 0, fontSize: '0.9rem' }}>
              Enter the password to continue.
            </p>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password..."
              autoComplete="current-password"
              style={{
                background: 'var(--bg-tertiary)',
                border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                padding: '12px 16px',
                transition: 'border-color 0.2s',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            {error && (
              <p style={{ color: 'var(--danger, #f87171)', fontSize: '0.85rem', margin: 0 }}>
                {error}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-md"
                style={{ padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!password.trim()}
                style={{
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  opacity: !password.trim() ? 0.6 : 1,
                  padding: '10px 24px',
                }}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PasswordModal;
