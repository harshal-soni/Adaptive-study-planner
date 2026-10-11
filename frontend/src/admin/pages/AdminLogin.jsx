import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE from "../../config/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "../styles/AdminPanel.css";

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in as admin')
      }

      login({ token: data.token, user: data.user })
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div>
          <span className="eyebrow">Admin access</span>
          <h1>Admin sign in</h1>
          <p>Use your administrator credentials to access the secured control center.</p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {error && <div className="auth-error">{error}</div>}
          <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  )
}
