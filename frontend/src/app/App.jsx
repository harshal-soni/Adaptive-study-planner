import { useState } from 'react'
import './App.css'
import { Link, NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Login from '../pages/auth/Login.jsx'
import Register from '../pages/auth/Register.jsx'
import AdaptivePlans from '../pages/adaptive-plans/AdaptivePlans.jsx'
import ContentRecommendations from '../pages/recommendations/ContentRecommendations.jsx'
import ProgressInsights from '../pages/insights/ProgressInsights.jsx'
import Dashboard from '../pages/dashboard/Dashboard.jsx'
import ProtectedRoute from '../routes/ProtectedRoute.jsx'
import StudentReviews from '../components/reviews/StudentReviews.jsx'
import AdminLogin from '../admin/pages/AdminLogin.jsx'
import AdminDashboard from '../admin/pages/AdminDashboard.jsx'
import AdminUsers from '../admin/pages/AdminUsers.jsx'
import AdminPlans from '../admin/pages/AdminPlans.jsx'
import AdminReviews from '../admin/pages/AdminReviews.jsx'
import AdminAnalytics from '../admin/pages/AdminAnalytics.jsx'
import AdminResources from '../admin/pages/AdminResources.jsx'
import AdminProtectedRoute from '../admin/components/AdminProtectedRoute.jsx'
import AdminLayout from '../admin/components/AdminLayout.jsx'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { auth, logout } = useAuth()
  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
      <div className="container nav-inner">
        <div className="brand">PLRS</div>

        <button className="nav-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><a href="#features" onClick={closeMenu}>Features</a></li>
          <li><NavLink to="/adaptive-plans" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : undefined}>Adaptive Plans</NavLink></li>
          <li><NavLink to="/content-recommendations" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : undefined}>Content</NavLink></li>
          <li><NavLink to="/progress-insights" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : undefined}>Insights</NavLink></li>
          <li><NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : undefined}>Dashboard</NavLink></li>
          <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
        </ul>

        <div className="nav-actions">
          {auth ? (
            <>
              <Link className="cta button-solid" to="/dashboard" onClick={closeMenu}>Dashboard</Link>
              <button className="cta button-outline logout-button" onClick={() => { logout(); closeMenu() }}>Logout</button>
            </>
          ) : (
            <>
              <Link className="cta button-solid" to="/login">Login</Link>
              <Link className="cta button-outline" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <header className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1>Personalized Learning Recommendations</h1>
          <p className="subtitle">Adaptive study plans and content suggestions tailored to each student's strengths, goals and pace.</p>
          <div className="hero-actions">
            <a className="btn primary" href="#get-started">Try it free</a>
            <a className="btn ghost" href="#how">Learn more</a>
          </div>
        </div>
        <div className="hero-card">
          <svg className="hero-illustration" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <rect x="8" y="8" width="224" height="144" rx="12" fill="#0f1724" stroke="url(#g)" strokeWidth="1.5" />
            <g transform="translate(24,28)" fill="none" stroke="url(#g)" strokeWidth="2">
              <path d="M0 20h140" strokeOpacity="0.12" />
              <path d="M0 44h100" strokeOpacity="0.12" />
              <circle cx="120" cy="40" r="20" fill="#0f1724" stroke="url(#g)" strokeWidth="2" />
            </g>
          </svg>
        </div>
      </div>
    </header>
  )
}

function FeatureCard({icon, title, text, onClick}) {
  const handleKeyDown = (event) => {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={`card feature-card${onClick ? ' clickable' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="icon" aria-hidden dangerouslySetInnerHTML={{__html:icon}} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

function Features() {
  const navigate = useNavigate()
  const items = [
    {
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 8h14" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      title: 'Adaptive Plans',
      text: 'Smartly sequence topics and exercises to fit each learner’s pace.',
      path: '/adaptive-plans'
    },
    {
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/><path d="M12 3v18" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round"/></svg>',
      title: 'Content Recommendations',
      text: 'Curated lessons, readings and quizzes matched to needs.',
      path: '/content-recommendations'
    },
    
    {
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 17l6-6 4 4 6-8" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      title: 'Progress Insights',
      text: 'Visualize strengths and gaps with clear, actionable reports.',
      path: '/progress-insights'
    }
  ]

  const handleCardClick = (path) => {
    navigate(path)
  }

  return (
    <section id="features" className="container features">
      <h2 className="section-title">Key Features</h2>
      <div className="grid">
        {items.map((it, idx) => (
          <FeatureCard
            key={idx}
            icon={it.icon}
            title={it.title}
            text={it.text}
            onClick={it.path ? () => handleCardClick(it.path) : undefined}
          />
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how" className="container how">
      <h2 className="section-title">How it works</h2>
      <div className="how-grid">
        <div className="step">1. Assess — quick diagnostic to find gaps.</div>
        <div className="step">2. Recommend — personalized content & schedule.</div>
        <div className="step">3. Improve — monitor progress and iterate.</div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-grid">
        <div className="footer-branding">
          <div className="footer-logo">PLRS</div>
          <p className="footer-tagline">Personalized Learning Recommendations for Smarter Study.</p>
          <p className="footer-description">A modern learning platform that helps students learn more efficiently with tailored plans, content guidance, and actionable progress insights.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-list">
            <li><a href="/">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="/adaptive-plans">Adaptive Plans</a></li>
            <li><a href="/content-recommendations">Content Recommendations</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul className="footer-contact-list">
            <li>
              <span>Email</span>
              <a href="mailto:sharshal714@gmail.com">sharshal714@gmail.com</a>
            </li>
            <li>
              <span>Phone</span>
              <a href="tel:+917976130157">+91 79761 30157</a>
            </li>
            <li>
              <span>Location</span>
              <span>Remote / India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Personalized Learning Recommendation System (PLRS). All Rights Reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

export default function AppRoutes(){
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<>
            <Hero />
            <Features />
            <HowItWorks />
            <StudentReviews />
          </>} />
          <Route path="/adaptive-plans" element={<AdaptivePlans />} />
          <Route path="/content-recommendations" element={<ContentRecommendations />} />
          <Route path="/progress-insights" element={<ProgressInsights />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/users" element={<AdminProtectedRoute><AdminLayout><AdminUsers /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/plans" element={<AdminProtectedRoute><AdminLayout><AdminPlans /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/reviews" element={<AdminProtectedRoute><AdminLayout><AdminReviews /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/analytics" element={<AdminProtectedRoute><AdminLayout><AdminAnalytics /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/resources" element={<AdminProtectedRoute><AdminLayout><AdminResources /></AdminLayout></AdminProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
