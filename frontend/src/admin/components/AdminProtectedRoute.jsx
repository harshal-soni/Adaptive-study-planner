import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminProtectedRoute({ children }) {
  const { authLoading, isAuthenticated, isAdmin } = useAuth()

  if (authLoading) {
    return <div className="admin-card admin-loading">Checking admin session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
