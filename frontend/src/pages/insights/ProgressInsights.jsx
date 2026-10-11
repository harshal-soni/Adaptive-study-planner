import './ProgressInsights.css'

const insights = {
  studyHours: 28,
  completedTasks: 19,
  weakAreas: ['Algebra', 'Grammar', 'Time management'],
  strongAreas: ['History', 'Design thinking', 'Reading'],
  weeklyProgress: 82,
  consistency: 91,
  streak: 8,
  performanceCategories: [
    { label: 'Focus', value: 86 },
    { label: 'Retention', value: 78 },
    { label: 'Speed', value: 74 },
    { label: 'Accuracy', value: 89 }
  ]
}

export default function ProgressInsights() {
  return (
    <section className="insights-page">
      <div className="container insights-inner">
        <div className="page-header">
          <div>
            <span className="eyebrow">Progress Insights</span>
            <h1>Your study analytics dashboard</h1>
            <p>Track your daily effort, task completion, weak and strong areas, streaks, and performance with neon dashboard visuals.</p>
          </div>
          <div className="status-pill">Futuristic analytics</div>
        </div>

        <div className="stats-grid">
          <div className="card stat-card glow-card">
            <span>Study hours</span>
            <strong>{insights.studyHours}</strong>
            <p>Hours logged this week</p>
          </div>
          <div className="card stat-card glow-card">
            <span>Completed tasks</span>
            <strong>{insights.completedTasks}</strong>
            <p>Tasks finished with progress</p>
          </div>
          <div className="card stat-card glow-card">
            <span>Consistency</span>
            <strong>{insights.consistency}%</strong>
            <p>Weekly study rhythm</p>
          </div>
          <div className="card stat-card glow-card">
            <span>Learning streak</span>
            <strong>{insights.streak} days</strong>
            <p>Active streak of study sessions</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="card chart-card glow-card">
            <h2>Weekly progress</h2>
            <div className="progress-bar-wrap">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${insights.weeklyProgress}%` }} />
              </div>
              <span>{insights.weeklyProgress}% achieved</span>
            </div>
            <div className="circle-row">
              <div className="circle-chart">
                <div className="circle-fill" style={{ '--value': insights.consistency }}>
                  <strong>{insights.consistency}%</strong>
                </div>
                <span>Consistency</span>
              </div>
              <div className="circle-chart">
                <div className="circle-fill" style={{ '--value': insights.studyHours * 3.7 }}>
                  <strong>{insights.studyHours}h</strong>
                </div>
                <span>Study hours</span>
              </div>
            </div>
          </div>

          <div className="card chart-card glow-card">
            <h2>Performance analytics</h2>
            <div className="category-list">
              {insights.performanceCategories.map((item) => (
                <div key={item.label} className="category-row">
                  <span>{item.label}</span>
                  <div className="category-bar-bg">
                    <div className="category-bar-fill" style={{ width: `${item.value}%` }} />
                  </div>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="insights-grid">
          <div className="card glow-card">
            <h2>Weak areas</h2>
            <ul>{insights.weakAreas.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="card glow-card">
            <h2>Strong areas</h2>
            <ul>{insights.strongAreas.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="card glow-card">
            <h2>Achievement badge</h2>
            <div className="badge-card">
              <span>Streak Master</span>
              <strong>{insights.streak} days</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
