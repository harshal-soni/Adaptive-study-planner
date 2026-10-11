import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import API_BASE from '../../config/api.js'

const staticProgress = {
  studyHours: 30,
  completedTasks: 18,
  weeklyProgress: 72,
  streak: 5,
  consistency: 86,
  weakAreas: ['Algebra', 'Writing', 'Time management'],
  strongAreas: ['Coding', 'Reading', 'Presentation'],
}

export default function Dashboard() {
  const { auth, fetchWithAuth } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [plans, setPlans] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [plansError, setPlansError] = useState('')
  const [deletingPlanId, setDeletingPlanId] = useState(null)
  const [deletingRecId, setDeletingRecId] = useState(null)

  useEffect(() => {
    async function loadDashboard() {
      if (!auth?.token) {
        setLoading(false)
        return
      }

      try {
        // Fetch dashboard data
        const dashResponse = await fetchWithAuth(`${API_BASE}/api/dashboard`)

        const dashData = await dashResponse.json()
        if (!dashResponse.ok) {
          throw new Error(dashData.error || dashData.message || 'Unable to load dashboard')
        }

        setDashboardData(dashData)
        setPlans(dashData.plans || [])

        // Fetch saved recommendations
        try {
          const recResponse = await fetchWithAuth(`${API_BASE}/api/recommendations`)

          const recData = await recResponse.json()
          if (recResponse.ok && recData.recommendations) {
            setRecommendations(recData.recommendations)
          }
        } catch {
          console.log('Recommendations not yet available')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [auth])

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return

    setDeletingPlanId(planId)
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/plans/${planId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to delete plan')
      }

      const updatedPlans = plans.filter(p => p._id !== planId)
      setPlans(updatedPlans)
      setDashboardData(prev => prev ? {
        ...prev,
        plans: updatedPlans,
        totalPlans: updatedPlans.length,
        recentActivity: updatedPlans.slice(0, 3).map(plan => ({
          id: plan._id,
          goal: plan.goal,
          skillLevel: plan.skillLevel,
          dailyHours: plan.dailyHours,
          createdAt: plan.createdAt,
          weakSubjects: plan.weakSubjects || []
        }))
      } : prev)
    } catch (err) {
      setPlansError(err.message)
      setTimeout(() => setPlansError(''), 5000)
    } finally {
      setDeletingPlanId(null)
    }
  }

  const handleDeleteRecommendation = async (recId) => {
    if (!window.confirm('Are you sure you want to delete this recommendation?')) return

    setDeletingRecId(recId)
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/recommendations/${recId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to delete recommendation')
      }

      const updatedRecs = recommendations.filter(r => r._id !== recId)
      setRecommendations(updatedRecs)
    } catch (err) {
      setPlansError(err.message)
      setTimeout(() => setPlansError(''), 5000)
    } finally {
      setDeletingRecId(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const progress = dashboardData?.progress || staticProgress
  const recentActivity = dashboardData?.recentActivity || []
  const recommendedResources = dashboardData?.recommendedResources || []
  const userName = dashboardData?.user?.name || auth?.user?.name || auth?.user?.email?.split('@')[0]
  const weakAreas = progress?.weakAreas || staticProgress.weakAreas

  return (
    <section className="dashboard-page">
      <div className="container dashboard-inner">
        <div className="dashboard-header card">
          <div>
            <span className="eyebrow">Student dashboard</span>
            <h1>Welcome back, {userName}</h1>
            <p>Track your streak, progress, study plans, and learning recommendations in one polished dashboard.</p>
          </div>
          <div className="dashboard-cta">
            <Link to="/adaptive-plans" className="btn primary">Generate plan</Link>
            <Link to="/content-recommendations" className="btn ghost">Explore resources</Link>
          </div>
        </div>

        {loading ? (
          <div className="card loading-card">Loading dashboard…</div>
        ) : error ? (
          <div className="card error-card">{error}</div>
        ) : (
          <>
            <div className="dashboard-grid">
              <div className="card stat-card">
                <span>Study streak</span>
                <strong>{progress.streak} days</strong>
                <p>Keep momentum with consistent sessions and simple wins.</p>
              </div>
              <div className="card stat-card">
                <span>Completed tasks</span>
                <strong>{progress.completedTasks}</strong>
                <p>Tasks completed from your plans, challenges and reviews.</p>
              </div>
              <div className="card stat-card">
                <span>Weekly progress</span>
                <strong>{progress.weeklyProgress}%</strong>
                <p>How close you are to your weekly study goals.</p>
              </div>
              <div className="card stat-card">
                <span>Consistency</span>
                <strong>{progress.consistency}%</strong>
                <p>Reliable effort across the week keeps learning steady.</p>
              </div>
            </div>

            <div className="dashboard-summary-grid">
              <div className="card summary-card">
                <h2>Adaptive plan summary</h2>
                <p>{plans?.length ? `You have ${plans.length} active adaptive plan${plans.length !== 1 ? 's' : ''}.` : 'No adaptive plans yet. Generate one to unlock focused recommendations.'}</p>
                <div className="summary-meta">
                  <span>{plans.length} plans saved</span>
                  <span>{progress.studyHours} study hours</span>
                </div>
              </div>
              <div className="card summary-card">
                <h2>Weak subject analysis</h2>
                <p>Track your most important improvement areas and keep them front of mind.</p>
                <div className="pill-list">
                  {weakAreas.length > 0 ? (
                    weakAreas.map((subject, index) => (
                      <span key={index} className="pill">{subject}</span>
                    ))
                  ) : (
                    <span className="pill">No weak subjects tracked yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className="activity-panel">
              <div className="card activity-list">
                <div className="card-header">
                  <h2>Recent activity</h2>
                  <p>Latest plan entries and study focus for quick review.</p>
                </div>
                {recentActivity.length > 0 ? (
                  <div className="activity-grid">
                    {recentActivity.map((item) => (
                      <div key={item.id} className="activity-card">
                        <div>
                          <h4>{item.goal}</h4>
                          <span>{item.skillLevel} · {item.dailyHours}h/day</span>
                        </div>
                        <p>{item.weakSubjects?.slice(0, 2).join(', ') || 'No weak subjects listed'}</p>
                        <small>Created {formatDate(item.createdAt)}</small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-card">No recent activity yet. Start with a new plan to build your study history.</div>
                )}
              </div>
              <div className="card resource-panel">
                <div className="card-header">
                  <h2>Recommended resources</h2>
                  <p>Actionable suggestions based on your progress and weak subjects.</p>
                </div>
                <div className="resource-list">
                  {recommendedResources.length > 0 ? (
                    recommendedResources.map((resource, idx) => (
                      <div key={idx} className="resource-item">
                        <h4>{resource.title}</h4>
                        <p>{resource.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state-card">No recommendations available yet. Generate a plan or review your progress to get tailored guidance.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="card plan-management-card">
              <div className="card-header">
                <h2>My adaptive plans</h2>
                <p>Manage saved plans, remove old drafts, and explore the latest schedule suggestions.</p>
              </div>
              {plans.length > 0 ? (
                <>
                  {plansError && <div className="notification error">⚠️ {plansError}</div>}
                  <div className="plan-grid">
                    {plans.map((plan) => (
                      <div key={plan._id} className="card plan-card">
                        <div>
                          <h3>{plan.goal}</h3>
                          <p className="plan-meta">{plan.skillLevel} · {plan.dailyHours}h/day</p>
                          <div className="pill-list">
                            {plan.weakSubjects?.slice(0, 3).map((subject, idx) => (
                              <span key={idx} className="pill">{subject}</span>
                            ))}
                          </div>
                        </div>
                        <div className="plan-actions">
                          <Link className="btn primary" to={`/adaptive-plans?planId=${plan._id}`}>View</Link>
                          <button
                            className="btn ghost"
                            onClick={() => handleDeletePlan(plan._id)}
                            disabled={deletingPlanId === plan._id}
                          >
                            {deletingPlanId === plan._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                        <small className="plan-created">Created {formatDate(plan.createdAt)}</small>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state-card">You don’t have saved plans yet. Generate your first plan to see it here.</div>
              )}
            </div>

            <div className="card recommendation-management-card">
              <div className="card-header">
                <h2>📚 Saved Content Recommendations</h2>
                <p>Your personalized learning roadmaps and recommended resources.</p>
              </div>
              {recommendations.length > 0 ? (
                <>
                  {plansError && <div className="notification error">⚠️ {plansError}</div>}
                  <div className="recommendation-grid-dashboard">
                    {recommendations.map((rec) => (
                      <div key={rec._id} className="card recommendation-card">
                        <div>
                          <h3>{rec.subject}</h3>
                          <p className="rec-meta">{rec.skillLevel} Level · {rec.resources?.length || 0} Resources</p>
                          <div className="pill-list">
                            {rec.preferredLearningTypes?.slice(0, 3).map((type, idx) => (
                              <span key={idx} className="pill">{type}</span>
                            ))}
                          </div>
                        </div>
                        <div className="rec-summary">
                          <span className="summary-item">
                            <strong>📚 {rec.resources?.length || 0}</strong> Resources
                          </span>
                          <span className="summary-item">
                            <strong>🗺️ 4</strong> Week Roadmap
                          </span>
                        </div>
                        <div className="rec-actions">
                          <Link 
                            className="btn secondary" 
                            to={`/content-recommendations?recId=${rec._id}`}
                          >
                            View Details
                          </Link>
                          <button
                            className="btn ghost"
                            onClick={() => handleDeleteRecommendation(rec._id)}
                            disabled={deletingRecId === rec._id}
                          >
                            {deletingRecId === rec._id ? 'Deleting...' : 'Remove'}
                          </button>
                        </div>
                        <small className="rec-created">Created {formatDate(rec.createdAt)}</small>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state-card">
                  No saved recommendations yet. Generate content recommendations to build your learning library.
                </div>
              )}
            </div>

            <div className="dashboard-actions">
              <Link className="card action-card" to="/adaptive-plans">
                <h3>New Adaptive Plan</h3>
                <p>Create a custom study schedule based on your goals.</p>
              </Link>
              <Link className="card action-card" to="/content-recommendations">
                <h3>Personalized Resources</h3>
                <p>Generate content recommendations for your current topic.</p>
              </Link>
              <Link className="card action-card" to="/progress-insights">
                <h3>View Insights</h3>
                <p>Explore your weekly progress, weak areas, and streak analytics.</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
