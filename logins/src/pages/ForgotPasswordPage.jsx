import AnimatedBackground from '../components/login/AnimatedBackground.jsx'
import AuthCard from '../components/login/AuthCard.jsx'
import ForgotPasswordForm from '../components/login/ForgotPasswordForm.jsx'

export default function ForgotPasswordPage() {
  return (
    <main className="page">
      <AnimatedBackground />
      <AuthCard
        title="Forgot Password?"
        subtitle="No worries, we'll help you reset it"
      >
        <ForgotPasswordForm />
      </AuthCard>
    </main>
  )
}
