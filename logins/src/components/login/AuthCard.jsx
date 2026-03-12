import { Link } from 'react-router-dom'

export default function AuthCard({ children, title, subtitle }) {
  return (
    <div className="auth-card-wrapper">
      {/* Logo */}
      <div className="auth-card__logo">
        <img src="/01.png" alt="ทำกับเพื่อน" />
      </div>

      {/* Glass Card */}
      <div className="auth-card">
        <div className="auth-card__glow" />

        <div className="auth-card__header">
          <h1 className="auth-card__title">{title}</h1>
          <p className="auth-card__subtitle">{subtitle}</p>
        </div>

        {children}
      </div>

      {/* Footer */}
      <p className="auth-card__footer">
        {'By continuing, you agree to our '}
        <Link to="#">Terms of Service</Link>
        {' and '}
        <Link to="#">Privacy Policy</Link>
      </p>
    </div>
  )
}
