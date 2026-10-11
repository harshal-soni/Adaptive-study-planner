import { useEffect, useState } from 'react'
import API_BASE from "../../config/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminPlans() {
  const { fetchWithAuth } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPlans = async () => {
      setError('')
      setLoading(true)
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/admin/plans`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Unable to load plans')
        }
        setPlans(data.plans)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  return (
    <div>
      <div className="admin-page-header">
        <h2>Adaptive plan library</h2>
        <p>Review every generated plan, track plan status, and monitor learner objectives.</p>
      </div>

      {error && <div className="admin-notice admin-error">{error}</div>}
      {loading ? (
        <div className="admin-card admin-loading">Loading adaptive plans…</div>
      ) : (
        <div className="admin-card admin-plans-card">
          {plans.length === 0 ? (
            <div className="admin-empty-state">No adaptive plans have been generated yet.</div>
          ) : (
            <div className="admin-plan-list">
              {plans.map((plan) => (
                <div key={`${plan.studentEmail}-${plan.createdAt}`} className="admin-plan-item">
                  <div className="admin-plan-meta">
                    <span className="eyebrow">{new Date(plan.createdAt).toLocaleDateString()}</span>
                    <h3>{plan.studentName}</h3>
                    <p>{plan.studentEmail}</p>
                  </div>
                  <div className="admin-plan-body">
                    <p><strong>Goal:</strong> {plan.goal || 'Goal not set'}</p>
                    <p><strong>Skill level:</strong> {plan.skillLevel || 'Unknown'}</p>
                    <p><strong>Daily hours:</strong> {plan.dailyHours}h</p>
                    <p><strong>Focus:</strong> {plan.weakSubjects?.join(', ') || 'Core concepts'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
