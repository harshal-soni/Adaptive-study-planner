import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import API_BASE from '../../config/api.js'


export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function submit(e){
    e.preventDefault()
    setError('')

    const normalizedEmail = email.trim().toLowerCase()

    if(!normalizedEmail || !password){
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in')
      }

      login({ token: data.token, user: data.user })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card container">
        <h2>Sign in to your account</h2>
        <form onSubmit={submit} className="auth-form">
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          {error && <div className="auth-error">{error}</div>}
          <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="auth-footer">Don't have an account? <Link to="/register">Create one</Link></div>
      </div>
    </div>
  )
}
