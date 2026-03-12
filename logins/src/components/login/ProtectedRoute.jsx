import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    // ถ้ายังไม่ได้ login ให้ redirect ไปหน้า login
    return <Navigate to="/login" replace />;
  }

  return children;
}
