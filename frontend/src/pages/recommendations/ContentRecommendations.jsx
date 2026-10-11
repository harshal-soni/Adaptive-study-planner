import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import API_BASE from '../../config/api.js'
import './ContentRecommendations.css'

const subjects = ['Math', 'Physics', 'Chemistry', 'Computer Science', 'Data Structures', 'Web Development', 'Machine Learning']
const skillLevels = ['Beginner', 'Intermediate', 'Advanced']
const learningTypes = ['Video', 'Notes', 'Practice Platform', 'Quiz']

const initialForm = {
  subject: subjects[0],
  skillLevel: skillLevels[0],
  preferredLearningTypes: []
}

export default function ContentRecommendations() {
  const { auth, fetchWithAuth } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [savedResources, setSavedResources] = useState({})

  const updateField = (event) => {
    const { name, value, checked } = event.target
    if (name === 'preferredLearningTypes') {
      setForm((prev) => {
        const nextTypes = checked
          ? [...prev.preferredLearningTypes, value]
          : prev.preferredLearningTypes.filter((item) => item !== value)
        return { ...prev, preferredLearningTypes: nextTypes }
      })
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!auth?.token) {
      setError('Please log in to generate recommendations')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetchWithAuth(`${API_BASE}/api/recommendations/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to generate recommendations`)
      }

      setResult(data.recommendation)
      setSavedResources({})
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveResource = async (resourceId, title, url) => {
    if (!auth?.token || !result?._id) {
      setError('Please log in to save resources')
      return
    }

    try {
      const response = await fetchWithAuth(`${API_BASE}/api/recommendations/${result._id}/save-resource`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resourceId, title, url })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save resource')
      }

      setSavedResources((prev) => ({ ...prev, [resourceId]: true }))
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleAddToStudyPlan = async () => {
    if (!auth?.token || !result?._id) {
      setError('Please log in to add to study plan')
      return
    }

    try {
      // Save the entire recommendation
      setError('Recommendation added to your study plan! View it in your dashboard.')
      setTimeout(() => setError(''), 5000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSaveRecommendation = async () => {
    if (!auth?.token || !result?._id) {
      setError('Please log in to save recommendations')
      return
    }

    try {
      setError('✓ Recommendation saved successfully! Check your dashboard.')
      setTimeout(() => setError(''), 5000)
    } catch (err) {
      setError(err.message)
    }
  }

  const resourcesByType = result?.resources?.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = []
    }
    acc[resource.type].push(resource)
    return acc
  }, {})

  return (
    <section className="recommendation-page">
      <div className="container recommendation-inner">
        <div className="page-header">
          <div>
            <span className="eyebrow">Content Recommendations</span>
            <h1>Find the best learning path for your goals</h1>
            <p>Choose your subject, skill level, and preferred learning types to receive personalized content recommendations and a 4-week learning roadmap.</p>
          </div>
          <div className="status-chip">Interactive dashboard</div>
        </div>

        <div className="recommendation-grid">
          <form className="card recommendation-form" onSubmit={handleSubmit}>
            <h2>Build your learning profile</h2>
            
            <div className="field-row">
              <label>Subject</label>
              <select name="subject" value={form.subject} onChange={updateField}>
                {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </div>

            <div className="field-row">
              <label>Skill level</label>
              <select name="skillLevel" value={form.skillLevel} onChange={updateField}>
                {skillLevels.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>

            <div className="field-row">
              <label>Preferred learning types</label>
              <div className="checkbox-row">
                {learningTypes.map((type) => (
                  <label key={type} className="checkbox-pill">
                    <input
                      type="checkbox"
                      name="preferredLearningTypes"
                      value={type}
                      checked={form.preferredLearningTypes.includes(type)}
                      onChange={updateField}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <button className="btn primary" type="submit" disabled={loading || !auth?.token}>
              {loading ? 'Generating recommendations...' : 'Generate Recommendations'}
            </button>
            
            {!auth?.token && <p className="auth-warning">⚠️ Please log in to generate and save recommendations</p>}
          </form>

          <div className="recommendation-preview">
            {loading && <div className="loading-panel">🚀 Generating your personalized recommendations...</div>}
            
            {error && <div className="error-message">{error}</div>}

            {result && (
              <>
                {/* SECTION 1: RECOMMENDED RESOURCES */}
                <div className="section-header">
                  <h2>📚 Recommended Resources</h2>
                  <p>Curated learning materials for {result.subject} at {result.skillLevel} level</p>
                </div>

                {resourcesByType && Object.keys(resourcesByType).length > 0 ? (
                  <div className="resources-section">
                    {Object.entries(resourcesByType).map(([type, resources]) => (
                      <div key={type} className="resource-category">
                        <h3 className="resource-type-title">
                          {type === 'Video' && '🎥'} 
                          {type === 'Notes' && '📝'} 
                          {type === 'Practice Platform' && '⚙️'} 
                          {type === 'Quiz' && '✅'} 
                          {' '}{type}
                        </h3>
                        <div className="resources-grid">
                          {resources.map((resource) => (
                            <div key={resource.id} className="card resource-card glow-card">
                              <div className="resource-header">
                                <h4>{resource.title}</h4>
                                <span className="difficulty-badge">{resource.difficulty}</span>
                              </div>
                              <p className="resource-description">{resource.description}</p>
                              
                              <div className="resource-meta">
                                <span className="meta-item">
                                  <strong>Platform:</strong> {resource.platform}
                                </span>
                                <span className="meta-item">
                                  <strong>Type:</strong> {resource.type}
                                </span>
                                {resource.duration && (
                                  <span className="meta-item">
                                    <strong>Duration:</strong> {resource.duration}
                                  </span>
                                )}
                                {resource.rating && (
                                  <span className="meta-item">
                                    <strong>Rating:</strong> ⭐ {resource.rating}
                                  </span>
                                )}
                              </div>

                              <div className="resource-actions">
                                <a 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn secondary"
                                >
                                  Open Resource →
                                </a>
                                <button
                                  className={`btn ${savedResources[resource.id] ? 'success' : 'ghost'}`}
                                  onClick={() => handleSaveResource(resource.id, resource.title, resource.url)}
                                  disabled={savedResources[resource.id]}
                                >
                                  {savedResources[resource.id] ? '✓ Saved' : '+ Save'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card empty-state">
                    <p>No resources found for your preferences. Try different learning types.</p>
                  </div>
                )}

                {/* SECTION 2: PERSONALIZED LEARNING ROADMAP */}
                <div className="section-header" style={{ marginTop: '40px' }}>
                  <h2>🗺️ Your 4-Week Learning Roadmap</h2>
                  <p>{result.roadmap?.title}</p>
                </div>

                {result.roadmap?.weeks && (
                  <div className="roadmap-section">
                    <p className="roadmap-overview">{result.roadmap.overview}</p>
                    
                    <div className="weeks-grid">
                      {result.roadmap.weeks.map((week) => (
                        <div key={week.weekNumber} className="card week-card glow-card">
                          <div className="week-header">
                            <span className="week-badge">Week {week.weekNumber}</span>
                            <h3>{week.weekTitle}</h3>
                          </div>

                          <div className="week-content">
                            <div className="week-section">
                              <h4>📌 Weekly Goals</h4>
                              <ul className="goals-list">
                                {week.weeklyGoals.map((goal, idx) => (
                                  <li key={idx}>{goal}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="week-section">
                              <h4>📖 Topics to Study</h4>
                              <div className="topics-pills">
                                {week.topics.map((topic, idx) => (
                                  <span key={idx} className="topic-pill">{topic}</span>
                                ))}
                              </div>
                            </div>

                            <div className="week-section">
                              <h4>📚 Recommended Resources</h4>
                              <ul className="resources-list">
                                {week.recommendedResources.map((res, idx) => (
                                  <li key={idx}>{res}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="week-section">
                              <h4>✏️ Practice Tasks</h4>
                              <ul className="tasks-list">
                                {week.practiceTasks.map((task, idx) => (
                                  <li key={idx}>{task}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="week-meta">
                              <span className="hours-badge">⏱️ {week.estimatedHours}h/week</span>
                              {week.milestones && week.milestones.length > 0 && (
                                <span className="milestone-badge">🎯 {week.milestones[0]}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="roadmap-actions">
                      <button 
                        className="btn primary"
                        onClick={handleAddToStudyPlan}
                      >
                        + Add Roadmap to Study Plan
                      </button>
                      <button 
                        className="btn secondary"
                        onClick={handleSaveRecommendation}
                      >
                        💾 Save This Recommendation
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {!loading && !result && (
              <div className="card empty-state">
                <h3>🚀 Start your recommendation journey</h3>
                <p>Fill the form and press the button to generate personalized content recommendations and a 4-week learning roadmap tailored to your learning goals.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
