'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import {
  MailIcon, ArrowRightIcon, LoaderIcon,
  ArrowLeftIcon, CheckCircleIcon,
} from './Icons.jsx';
import ErrorAlert from './ErrorAlert.jsx';

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Convert Firebase error codes to English messages
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email format',
      'auth/user-not-found': 'No account found with this email',
      'auth/too-many-requests': 'Too many requests. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your internet connection',
    };
    return errorMessages[errorCode] || 'An error occurred. Please try again';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAnotherEmail = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
  };

  if (isSubmitted) {
    return (
      <div className="success-state">
        <div className="success-icon-wrapper">
          <CheckCircleIcon />
        </div>
        <h2 className="success-title">Check your email</h2>
        <p className="success-text">
          {"We've sent a password reset link to "}
          <strong>{email}</strong>
        </p>
        <p className="success-hint">
          {"Didn't receive the email? Check your spam folder or"}
        </p>
        <button
          type="button"
          onClick={handleTryAnotherEmail}
          className="btn btn-outline"
          style={{ marginBottom: '1rem' }}
        >
          Try another email
        </button>
        <br />
        <Link to="/login" className="back-link">
          <ArrowLeftIcon />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Error Alert */}
      {error && (
        <ErrorAlert 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      <div className="forgot-icon-section">
        <div className="forgot-icon-wrapper">
          <MailIcon />
        </div>
        <p className="forgot-desc">
          {"Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <div className="input-wrapper">
          <MailIcon className="input-icon" />
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={isLoading} className="btn btn-primary">
        {isLoading ? (
          <>
            <LoaderIcon />
            Sending...
          </>
        ) : (
          <>
            Send Reset Link
            <ArrowRightIcon className="btn-arrow" />
          </>
        )}
      </button>

      {/* Back to Login */}
      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/login" className="back-to-login">
          <ArrowLeftIcon />
          Back to login
        </Link>
      </div>
    </form>
  );
}
