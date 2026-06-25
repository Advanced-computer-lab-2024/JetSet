import React, { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

/* ── Icon & class map ────────────────────────────────────── */
const TOAST_CONFIG = {
  success: { icon: faCheckCircle, className: 'toast-success' },
  error:   { icon: faExclamationCircle, className: 'toast-error' },
  warning: { icon: faExclamationTriangle, className: 'toast-warning' },
  info:    { icon: faInfoCircle, className: 'toast-info' },
};

/* ── Context ─────────────────────────────────────────────── */
const ToastContext = createContext(null);

/* ── Single toast item ───────────────────────────────────── */
function ToastItem({ id, type, message, onClose }) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose(id), 300);
  }, [id, onClose]);

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, 4000);
    return () => clearTimeout(timerRef.current);
  }, [dismiss]);

  return (
    <div className={`toast ${config.className} ${exiting ? 'toast-exit' : ''}`} role="alert">
      <FontAwesomeIcon icon={config.icon} className="toast-icon" />
      <span className="toast-body">{message}</span>
      <button className="toast-close" onClick={dismiss} aria-label="Close">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
}

/* ── Container ───────────────────────────────────────────── */
export function ToastContainer({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    {
      success: (msg) => addToast(msg, 'success'),
      error:   (msg) => addToast(msg, 'error'),
      warning: (msg) => addToast(msg, 'warning'),
      info:    (msg) => addToast(msg, 'info'),
      add:     addToast,
    },
    [addToast],
  );

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = React.useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ── Hook ─────────────────────────────────────────────────── */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Provide a no-op fallback so components work outside a ToastContainer
    return {
      success: () => {},
      error:   () => {},
      warning: () => {},
      info:    () => {},
      add:     () => {},
    };
  }
  return ctx;
}

export default ToastContainer;
