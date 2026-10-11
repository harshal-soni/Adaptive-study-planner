import { useEffect, useState } from 'react'
import API_BASE from "../../config/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminUsers() {
  const { fetchWithAuth } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', status: 'active', streak: 0 })

  const loadUsers = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/users`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to load students')
      }
      setUsers(data.users)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadUsers, 0)
    return () => clearTimeout(timer)
  }, [])

  const beginEdit = (user) => {
    setEditingId(user._id)
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      status: user.status || 'active',
      streak: user.progressData?.streak || 0
    })
  }

  const saveUser = async (userId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...editForm, streak: Number(editForm.streak) })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to save student')
      }
      setEditingId(null)
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this student?')) return
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete student')
      }
      setUsers((prev) => prev.filter((user) => user._id !== userId))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h2>Student management</h2>
        <p>Review registered learners, update their status, and keep the student roster clean.</p>
      </div>

      {error && <div className="admin-notice admin-error">{error}</div>}
      {loading ? (
        <div className="admin-card admin-loading">Loading students…</div>
      ) : (
        <div className="admin-card admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Skill level</th>
                <th>Goal</th>
                <th>Study streak</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const plan = (user.adaptivePlans || [])[0] || {}
                const isEditing = editingId === user._id
                return (
                  <tr key={user._id}>
                    <td>{isEditing ? <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /> : user.name}</td>
                    <td>{isEditing ? <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /> : user.email}</td>
                    <td>{plan.skillLevel || 'N/A'}</td>
                    <td>{plan.goal || 'N/A'}</td>
                    <td>{isEditing ? <input type="number" min="0" value={editForm.streak} onChange={(e) => setEditForm({ ...editForm, streak: e.target.value })} /> : user.progressData?.streak || 0}</td>
                    <td>{isEditing ? (
                      <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                        <option value="suspended">suspended</option>
                      </select>
                    ) : (
                      <span className={`status-chip ${user.status || 'active'}`}>{user.status || 'active'}</span>
                    )}</td>
                    <td className="admin-actions-cell">
                      {isEditing ? (
                        <>
                          <button className="btn secondary" onClick={() => saveUser(user._id)}>Save</button>
                          <button className="btn ghost" onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn secondary" onClick={() => beginEdit(user)}>Edit</button>
                          <button className="btn danger" onClick={() => deleteUser(user._id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
