import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import API_BASE from '../../config/api.js'
import './AdaptivePlans.css'

const initialForm = {
  name: '',
  goal: '',
  weakSubjects: '',
  strongSubjects: '',
  dailyHours: '2',
  skillLevel: 'Beginner'
}

export default function AdaptivePlans() {
  const { auth, fetchWithAuth } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    // Check if user is authenticated
    if (!auth?.token) {
      setError('You must be logged in to generate a study plan')
      setLoading(false)
      return
    }

    const requestData = {
      name: form.name,
      goal: form.goal,
      weakSubjects: form.weakSubjects,
      strongSubjects: form.strongSubjects,
      studyHours: form.dailyHours,
      skillLevel: form.skillLevel
    }

    try {
      const response = await fetchWithAuth(`${API_BASE}/api/plans/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      let data = null
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error(response.statusText || 'Invalid server response', { cause: parseError })
      }

      if (!response.ok || !data.success) {
        throw new Error(data?.error || 'Unable to generate plan')
      }

      setPlan(data.plan)
      setSuccess(true)
      // Clear form after successful generation
      setForm(initialForm)
    } catch (err) {
      setError(err.message || 'Unable to reach the Adaptive Plans service')
      setPlan(null)
    } finally {
      setLoading(false)
    }
  }

  const placeholder = (
    <div className="result-card card plan-placeholder">
      <h2>Your personalized study plan will appear here.</h2>
      <p>Enter your goals, strengths, and daily study hours, then generate a tailored neon glass study roadmap.</p>
    </div>
  )

  const authWarning = !auth?.token ? (
    <div className="auth-warning card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444' }}>
      <p><strong>⚠️ Login required:</strong> You must be logged in to generate and save study plans.</p>
    </div>
  ) : null

  return (
    <section className="adaptive-page">
      <div className="container adaptive-inner">
        <div className="adaptive-header">
          <div className="adaptive-copy">
            <span className="eyebrow">Adaptive Learning Plans</span>
            <h1>Personalized study plans that evolve with every session</h1>
            <p>Submit your goals and strengths to receive a tailored roadmap, daily schedule, practice tasks, revision checkpoints, weekly goals and a motivating study tip.</p>
          </div>
          <div className="adaptive-summary card">
            <div className="summary-tag">Adaptive plan preview</div>
            <h2>What you get</h2>
            <ul>
              <li>Daily schedule built around your study hours</li>
              <li>Recommendations that target weak topics</li>
              <li>Weekly goals and motivational guidance</li>
              <li>Realistic revision, review, and productivity tips</li>
            </ul>
          </div>
        </div>

        {authWarning}

        <div className="adaptive-grid">
          <form className="adaptive-form card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label htmlFor="goal">Goal</label>
              <input id="goal" name="goal" value={form.goal} onChange={handleChange} placeholder="E.g. ace math exams" required />
            </div>
            <div className="form-group">
              <label htmlFor="weakSubjects">Weak Subjects</label>
              <input id="weakSubjects" name="weakSubjects" value={form.weakSubjects} onChange={handleChange} placeholder="E.g. algebra, chemistry" />
            </div>
            <div className="form-group">
              <label htmlFor="strongSubjects">Strong Subjects</label>
              <input id="strongSubjects" name="strongSubjects" value={form.strongSubjects} onChange={handleChange} placeholder="E.g. history, writing" />
            </div>
            <div className="form-row">
              <div className="form-group small">
                <label htmlFor="dailyHours">Daily Study Hours</label>
                <input id="dailyHours" name="dailyHours" type="number" min="1" max="12" value={form.dailyHours} onChange={handleChange} required />
              </div>
              <div className="form-group small">
                <label htmlFor="skillLevel">Skill Level</label>
                <select id="skillLevel" name="skillLevel" value={form.skillLevel} onChange={handleChange}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <button className="btn primary submit-btn" type="submit" disabled={loading || !auth?.token}>
              {loading ? (
                <span className="loading-pill" aria-live="polite">
                  <span className="spinner" aria-hidden="true" />
                  Generating plan...
                </span>
              ) : 'Generate plan'}
            </button>
            {error && <div className="form-error" role="alert">{error}</div>}
          </form>

          <div className="adaptive-result">
            {!plan && placeholder}

            {plan && (
              <>
                {success && (
                  <div className="success-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    ✅ Study plan generated and saved successfully · Plan ID: <code style={{ fontSize: '0.8rem' }}>{plan._id?.substring(0, 8)}...</code>
                  </div>
                )}

                <div className="result-card card result-top success-card">
                  <h2>Hi {plan.student}, here is your plan</h2>
                  <p className="muted">Skill level: {plan.skillLevel} · Daily target: {plan.dailyHours} hours</p>
                  <p className="muted">Weak subjects: {plan.weakSubjects.join(', ')}</p>
                  <p className="muted">Strong subjects: {plan.strongSubjects.join(', ') || 'Focus subjects'}</p>
                </div>

                <div className="result-grid">
                  <div className="card plan-card">
                    <h3>Daily Schedule</h3>
                    <ol>
                      {(plan.dailySchedule || []).map((item, index) => <li key={index}>{item}</li>)}
                    </ol>
                  </div>

                  <div className="card plan-card">
                    <h3>Recommendations</h3>
                    <ul className="feature-list">
                      {(plan.recommendations || plan.recommendedTopics || []).map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>

                  <div className="card plan-card">
                    <h3>Weekly Goals</h3>
                    <ul>
                      {(plan.weeklyGoals || []).map((goalItem, index) => <li key={index}>{goalItem}</li>)}
                    </ul>
                  </div>

                  <div className="card plan-card">
                    <h3>Daily Priorities</h3>
                    <ul>
                      {(plan.dailySchedule || []).slice(0, 3).map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>

                  <div className="card plan-card">
                    <h3>Recommended Resources</h3>
                    <ul className="feature-list">
                      {(plan.recommendations || []).map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>

                  <div className="card plan-card">
                    <h3>Practice Targets</h3>
                    <ul>
                      {(plan.practiceTasks || []).map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>

                  <div className="card plan-card">
                    <h3>Revision Checklist</h3>
                    <ul>
                      {(plan.revisionPlan || []).map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>

                  <div className="card plan-card">
                    <h3>Productivity Tips</h3>
                    <ul>
                      {(plan.productivityTips || []).map((tip, index) => <li key={index}>{tip}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="card motivation-card">
                  <h3>Motivational Quote</h3>
                  <p>{plan.motivationTip}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
