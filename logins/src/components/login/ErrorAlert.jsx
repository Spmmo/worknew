import { AlertCircleIcon } from './Icons.jsx';

export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="error-alert">
      <div className="error-alert__content">
        <AlertCircleIcon className="error-alert__icon" />
        <span className="error-alert__message">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="error-alert__close"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
}
