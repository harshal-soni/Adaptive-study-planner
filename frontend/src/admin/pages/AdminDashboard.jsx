import { useEffect, useState } from 'react'
import API_BASE from "../../config/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const formatDate = (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function AdminDashboard() {
  const { fetchWithAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAnalytics() {
      setError('')
      setLoading(true)
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/admin/analytics`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Unable to load analytics')
        }
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="admin-card admin-loading">Loading admin dashboard…</div>
  }

  if (error) {
    return <div className="admin-card admin-error">{error}</div>
  }

  return (
    <div className="admin-grid admin-dashboard-grid">
      <div className="admin-stat-grid">
        <div className="admin-card glow-card">
          <span>Total Users</span>
          <strong>{stats.totalUsers}</strong>
          <p>Registered student accounts across the platform.</p>
        </div>
        <div className="admin-card glow-card">
          <span>Plans Generated</span>
          <strong>{stats.totalPlans}</strong>
          <p>Adaptive plans created by learners.</p>
        </div>
        <div className="admin-card glow-card">
          <span>Active Students</span>
          <strong>{stats.activeStudents}</strong>
          <p>Students with active study hours recorded.</p>
        </div>
        <div className="admin-card glow-card">
          <span>Total Reviews</span>
          <strong>{stats.totalReviews}</strong>
          <p>Testimonials and feedback submitted by learners.</p>
        </div>
        <div className="admin-card glow-card">
          <span>Total Resources</span>
          <strong>{stats.totalResources}</strong>
          <p>Curated learning resources available to students.</p>
        </div>
      </div>

      <div className="admin-card analytics-panel">
        <h2>Users growth</h2>
        <div className="admin-chart-row">
          {stats.userGrowth.map((item) => (
            <div key={item.month} className="admin-bar-group">
              <div className="admin-chart-bar" style={{ height: `${Math.max(16, item.count * 12)}px` }} />
              <span>{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card analytics-panel">
        <h2>Plans generated</h2>
        <div className="admin-chart-row">
          {stats.planGrowth.map((item) => (
            <div key={item.month} className="admin-bar-group">
              <div className="admin-chart-bar" style={{ height: `${Math.max(16, item.count * 12)}px`, background: 'linear-gradient(180deg, rgba(6,182,212,0.95), rgba(124,58,237,0.95))' }} />
              <span>{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card analytics-panel">
        <h2>Subject popularity</h2>
        <ul className="admin-list admin-subject-list">
          {stats.popularSubjects.map((item) => (
            <li key={item.subject}>
              <span>{item.subject}</span>
              <div className="subject-bar-wrap">
                <div className="subject-bar" style={{ width: `${Math.min(100, item.count * 15)}%` }} />
              </div>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-card analytics-panel wide-panel">
        <h2>Recent activity feed</h2>
        <div className="admin-recent-grid">
          <div>
            <h3>Latest users</h3>
            <ul className="admin-feed-list">
              {stats.recentUsers.map((user) => (
                <li key={user.email}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <span>{formatDate(user.createdAt)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Latest plans</h3>
            <ul className="admin-feed-list">
              {stats.recentPlans.map((plan, index) => (
                <li key={`${plan.studentName}-${index}`}>
                  <strong>{plan.studentName}</strong>
                  <span>{plan.goal || 'No goal set'}</span>
                  <span>{formatDate(plan.createdAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
