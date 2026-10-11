import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import "../styles/AdminPanel.css";

export default function AdminLayout({ children }) {
  const { logout, auth } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? 'open' : 'closed'}`}>
        <button className="admin-sidebar-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle sidebar">{open ? '✕' : '☰'}</button>
        <div className="admin-brand">PLRS Admin</div>
        <p className="admin-subtitle">Neon operations hub</p>

        <nav className="admin-sidebar-nav">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/users">Students</NavLink>
          <NavLink to="/admin/plans">Adaptive Plans</NavLink>
          <NavLink to="/admin/reviews">Reviews</NavLink>
          <NavLink to="/admin/analytics">Analytics</NavLink>
          <NavLink to="/admin/resources">Resources</NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-user-label">Signed in as</span>
          <strong>{auth?.user?.name || auth?.user?.email}</strong>
          <button className="btn admin-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <span className="eyebrow">Admin panel</span>
            <h1>Operations dashboard</h1>
          </div>
          <div className="admin-header-actions">
            <button className="btn ghost" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <section className="admin-content">{children}</section>
      </main>
    </div>
  )
}
