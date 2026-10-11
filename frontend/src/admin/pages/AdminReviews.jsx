import { useEffect, useState } from 'react'
import API_BASE from '../config/api.js'
import { useAuth } from '../AuthContext.jsx'

export default function AdminReviews() {
  const { fetchWithAuth } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadReviews = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/reviews`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to load reviews')
      }
      setReviews(data.reviews)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadReviews, 0)
    return () => clearTimeout(timer)
  }, [])

  const updateStatus = async (reviewId, status) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to update review')
      }
      setReviews((prev) => prev.map((review) => review._id === reviewId ? data.review : review))
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Remove this review from the dashboard?')) return
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete review')
      }
      setReviews((prev) => prev.filter((review) => review._id !== reviewId))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h2>Review moderation</h2>
        <p>Approve, archive, or remove student feedback from the admin console.</p>
      </div>

      {error && <div className="admin-notice admin-error">{error}</div>}
      {loading ? (
        <div className="admin-card admin-loading">Loading reviews…</div>
      ) : (
        <div className="admin-card admin-review-grid">
          {reviews.length === 0 ? (
            <div className="admin-empty-state">No student reviews are available yet.</div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="admin-review-card">
                <div className="review-header">
                  <div>
                    <h3>{review.studentName}</h3>
                    <p className="muted">{review.course}</p>
                  </div>
                  <span className={`status-chip ${review.status}`}>{review.status}</span>
                </div>
                <p className="review-text">{review.review}</p>
                <div className="review-actions">
                  <select value={review.status} onChange={(e) => updateStatus(review._id, e.target.value)}>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button className="btn danger" onClick={() => deleteReview(review._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
