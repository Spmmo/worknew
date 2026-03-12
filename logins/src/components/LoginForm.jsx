'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import {
  MailIcon, LockIcon, EyeIcon, EyeOffIcon,
  ArrowRightIcon, LoaderIcon, GoogleIcon,
} from './Icons.jsx';
import ErrorAlert from './ErrorAlert.jsx';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const navigate = useNavigate();

  // Convert Firebase error codes to English messages
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email format',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/too-many-requests': 'Too many login attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your internet connection',
      'auth/popup-closed-by-user': 'Sign-in cancelled',
      'auth/account-exists-with-different-credential': 'This email is already used with a different sign-in method',
    };
    return errorMessages[errorCode] || 'An error occurred. Please try again';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      console.log('Login successful:', userCredential.user);
      
      // Save remember me and restore userType from registration
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      // Restore the role that was locked at registration
      const savedRole = localStorage.getItem(`userType_${userCredential.user.uid}`);
      if (savedRole) {
        localStorage.setItem('userType', savedRole);
      }
      
      // Navigate to profile
      navigate('/profile');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login successful:', result.user);
      
      // Restore the role that was locked at registration
      const savedRole = localStorage.getItem(`userType_${result.user.uid}`);
      if (savedRole) {
        localStorage.setItem('userType', savedRole);
      }
      navigate('/profile');
      
    } catch (error) {
      console.error('Google login error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Error Alert */}
      {error && (
        <ErrorAlert 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <div className="input-wrapper">
          <MailIcon className="input-icon" />
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password */}
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <div className="input-wrapper">
          <LockIcon className="input-icon" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="form-input form-input--with-right-btn"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="input-toggle-btn"
            disabled={isLoading}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot */}
      <div className="row-between">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id="remember"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            className="checkbox-input"
            disabled={isLoading}
          />
          <label htmlFor="remember" className="checkbox-label">Remember me</label>
        </div>
        <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
      </div>

      {/* Submit */}
      <button type="submit" disabled={isLoading} className="btn btn-primary">
        {isLoading ? (
          <>
            <LoaderIcon />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRightIcon className="btn-arrow" />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="divider">
        <span className="divider__text">Or continue with</span>
      </div>

      {/* Social - Google Only (Centered) */}
      <button 
        type="button" 
        className="btn btn-outline"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        style={{ width: '100%' }}
      >
        <GoogleIcon /> Google
      </button>

      {/* Register Link */}
      <p className="bottom-link">
        {"Don't have an account? "}
        <Link to="/register">Sign up</Link>
      </p>
    </form>
  );
}