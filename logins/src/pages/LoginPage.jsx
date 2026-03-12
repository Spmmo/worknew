import AnimatedBackground from '../components/login/AnimatedBackground.jsx'
import AuthCard from '../components/login/AuthCard.jsx'
import LoginForm from '../components/login/LoginForm.jsx'

export default function LoginPage() {
  return (
    <main className="page">
      <AnimatedBackground />
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue to ThamKapPhuean"
      >
        <LoginForm />
      </AuthCard>
    </main>
  )
}
