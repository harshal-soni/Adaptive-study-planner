import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth()

  if (authLoading) {
    return <div className="card loading-card">Checking session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
