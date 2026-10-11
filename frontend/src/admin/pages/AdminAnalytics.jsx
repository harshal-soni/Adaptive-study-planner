import { useEffect, useState } from 'react'
import API_BASE from '../config/api.js'
import { useAuth } from '../AuthContext.jsx'

export default function AdminAnalytics() {
  const { fetchWithAuth } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      setError('')
      setLoading(true)
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/admin/analytics`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.message || 'Unable to load analytics')
        }
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="admin-card admin-loading">Loading analytics…</div>
  }

  if (error) {
    return <div className="admin-card admin-error">{error}</div>
  }

  return (
    <div className="admin-grid">
      <div className="admin-card analytics-panel">
        <h2>Weekly activity</h2>
        <div className="admin-chart-row">
          {data.weeklyActivity.map((item) => (
            <div key={item.day} className="admin-bar-group">
              <div className="admin-chart-bar" style={{ height: `${Math.max(12, item.count * 12)}px` }} />
              <span>{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card analytics-panel">
        <h2>Popular subjects</h2>
        <ul className="admin-list">
          {data.popularSubjects.map((item) => (
            <li key={item.subject}>
              <span>{item.subject}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-card analytics-panel">
        <h2>Progress tracking</h2>
        <div className="admin-summary-grid">
          <div>
            <strong>{data.progressTracking.averageWeeklyProgress}%</strong>
            <span>Weekly progress</span>
          </div>
          <div>
            <strong>{data.progressTracking.averageConsistency}%</strong>
            <span>Consistency</span>
          </div>
          <div>
            <strong>{data.progressTracking.averageStreak}</strong>
            <span>Average streak</span>
          </div>
        </div>
      </div>

      <div className="admin-card analytics-panel wide-panel">
        <h2>User growth</h2>
        <div className="admin-growth-grid">
          {data.userGrowth.map((item) => (
            <div key={item.month}>
              <div className="growth-bar" style={{ width: `${Math.min(100, item.count * 18)}%` }} />
              <span>{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
