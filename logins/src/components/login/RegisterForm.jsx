'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import {
  MailIcon, LockIcon, EyeIcon, EyeOffIcon,
  ArrowRightIcon, LoaderIcon, UserIcon, GoogleIcon,
  BriefcaseIcon,
} from './Icons.jsx';
import ErrorAlert from './ErrorAlert.jsx';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('employee'); // 'employee' | 'supervisor'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const navigate = useNavigate();

  // Convert Firebase error codes to English messages
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already in use',
      'auth/invalid-email': 'Invalid email format',
      'auth/operation-not-allowed': 'Registration is disabled',
      'auth/weak-password': 'Password must be at least 6 characters long',
      'auth/network-request-failed': 'Network error. Please check your internet connection',
      'auth/popup-closed-by-user': 'Registration cancelled',
      'auth/account-exists-with-different-credential': 'This email is already used with a different sign-up method',
    };
    return errorMessages[errorCode] || 'An error occurred. Please try again';
  };

  // Check password strength
  const getPasswordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return { strength: 0, text: '', level: '' };
    
    let strength = 0;
    let text = '';
    let level = '';

    // Check length
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    
    // Check lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    
    // Check numbers and special characters
    if (/\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

    if (strength <= 25) {
      text = 'Weak';
      level = 'weak';
    } else if (strength <= 50) {
      text = 'Fair';
      level = 'fair';
    } else if (strength <= 75) {
      text = 'Good';
      level = 'good';
    } else {
      text = 'Strong';
      level = 'strong';
    }

    return { strength, text, level };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Create new user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user display name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName,
      });

      console.log('Registration successful:', userCredential.user);
      
      // Save userType permanently — cannot be changed later
      localStorage.setItem('userType', userType);
      localStorage.setItem(`userType_${userCredential.user.uid}`, userType);
      
      // Navigate to profile
      navigate('/profile');
      
    } catch (error) {
      console.error('Register error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google registration successful:', result.user);
      
      // Save userType permanently — cannot be changed later
      // Only set if not already registered (new user)
      if (!localStorage.getItem(`userType_${result.user.uid}`)) {
        localStorage.setItem('userType', userType);
        localStorage.setItem(`userType_${result.user.uid}`, userType);
      }
      
      // Navigate to profile
      navigate('/profile');
      
    } catch (error) {
      console.error('Google register error:', error);
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

      {/* Role Selector */}
      <div className="role-toggle">
        <button
          type="button"
          className={`role-toggle__btn${userType === 'employee' ? ' role-toggle__btn--active' : ''}`}
          onClick={() => setUserType('employee')}
          disabled={isLoading}
        >
          <BriefcaseIcon className="role-toggle__icon" /> Employee
        </button>
        <button
          type="button"
          className={`role-toggle__btn${userType === 'supervisor' ? ' role-toggle__btn--active' : ''}`}
          onClick={() => setUserType('supervisor')}
          disabled={isLoading}
        >
          <UserIcon className="role-toggle__icon" /> Supervisor
        </button>
      </div>

      {/* Full Name */}
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">Full Name</label>
        <div className="input-wrapper">
          <UserIcon className="input-icon" />
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="form-input"
            required
            disabled={isLoading}
          />
        </div>
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
            placeholder="Create a password"
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
        {formData.password && (
          <div className="password-strength">
            <div className="password-strength__bars">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`password-strength__bar ${
                    i < passwordStrength.strength / 25
                      ? `password-strength__bar--${passwordStrength.level}`
                      : ''
                  }`}
                />
              ))}
            </div>
            <p className="password-strength__text">{passwordStrength.text}</p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <div className="input-wrapper">
          <LockIcon className="input-icon" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="form-input form-input--with-right-btn"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="input-toggle-btn"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="password-error">Passwords do not match</p>
        )}
      </div>

      {/* Terms */}
      <div className="terms-wrapper">
        <input
          type="checkbox"
          id="terms"
          checked={formData.agreeTerms}
          onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
          className="checkbox-input"
          required
          disabled={isLoading}
        />
        <label htmlFor="terms" className="terms-label">
          {'I agree to the '}
          <Link to="#">Terms of Service</Link>
          {' and '}
          <Link to="#">Privacy Policy</Link>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !formData.agreeTerms}
        className="btn btn-primary"
      >
        {isLoading ? (
          <>
            <LoaderIcon />
            Creating account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRightIcon className="btn-arrow" />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="divider">
        <span className="divider__text">Or sign up with</span>
      </div>

      {/* Social - Google Only (Centered) */}
      <button 
        type="button" 
        className="btn btn-outline"
        onClick={handleGoogleRegister}
        disabled={isLoading}
        style={{ width: '100%' }}
      >
        <GoogleIcon /> Google
      </button>

      {/* Login Link */}
      <p className="bottom-link">
        {'Already have an account? '}
        <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}