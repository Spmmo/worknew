import AnimatedBackground from '../components/login/AnimatedBackground.jsx'
import AuthCard from '../components/login/AuthCard.jsx'
import RegisterForm from '../components/login/RegisterForm.jsx'

export default function RegisterPage() {
  return (
    <main className="page">
      <AnimatedBackground />
      <AuthCard
        title="Create Account"
        subtitle="Join ThamKapPhuean and collaborate with your team"
      >
        <RegisterForm />
      </AuthCard>
    </main>
  )
}
