import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_BASE from '../../config/api.js'


export default function Register(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirm,setConfirm] = useState('')
  const [error,setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if(!normalizedName || !normalizedEmail || !password || !confirm){
      setError('Please complete all fields')
      return
    }
    if(password !== confirm){
      setError('Passwords do not match')
      return
    }
    if(password.length < 8){
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: normalizedName, email: normalizedEmail, password })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to create account')
      }

      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card container">
        <h2>Create your account</h2>
        <form onSubmit={submit} className="auth-form">
          <label>Name</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" />
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" />
          <label>Confirm password</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat password" />
          {error && <div className="auth-error">{error}</div>}
          <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
        </form>
        <div className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  )
}
