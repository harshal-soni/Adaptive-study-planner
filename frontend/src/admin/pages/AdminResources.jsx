import { useEffect, useState } from 'react'
import API_BASE from "../../config/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  title: '',
  description: '',
  subject: '',
  level: 'All levels',
  link: ''
}

export default function AdminResources() {
  const { fetchWithAuth } = useAuth()
  const [resources, setResources] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)

  const fetchResources = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/resources`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to load resources')
      }
      setResources(data.resources)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchResources, 0)
    return () => clearTimeout(timer)
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setEditId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const method = editId ? 'PUT' : 'POST'
    const path = editId ? `${API_BASE}/api/admin/resources/${editId}` : `${API_BASE}/api/admin/resources`

    try {
      const response = await fetchWithAuth(path, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to save resource')
      }
      resetForm()
      fetchResources()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (resource) => {
    setEditId(resource._id)
    setForm({
      title: resource.title,
      description: resource.description,
      subject: resource.subject,
      level: resource.level,
      link: resource.link
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/resources/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete resource')
      }
      fetchResources()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h2>Learning resources</h2>
        <p>Add, edit and manage the curated study materials available for learners.</p>
      </div>

      {error && <div className="admin-notice admin-error">{error}</div>}

      <div className="admin-resources-grid">
        <div className="admin-card admin-resource-form-card">
          <h3>{editId ? 'Edit resource' : 'Add new resource'}</h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Resource title"
              required
            />
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description"
              rows="4"
              required
            />
            <label>Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Math, Science, Coding"
              required
            />
            <label>Level</label>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <option>All levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <label>Link</label>
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://"
            />
            <div className="admin-form-actions">
              <button className="btn primary" type="submit">{editId ? 'Update' : 'Create'}</button>
              {editId && <button className="btn ghost" type="button" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>

        <div className="admin-card admin-resources-list-card">
          <h3>Resource library</h3>
          {loading ? (
            <div className="admin-loading">Loading resources...</div>
          ) : resources.length === 0 ? (
            <div className="admin-empty-state">No learning resources yet. Add one to get started.</div>
          ) : (
            <div className="admin-resource-list">
              {resources.map((resource) => (
                <div key={resource._id} className="admin-resource-item">
                  <div>
                    <h4>{resource.title}</h4>
                    <p>{resource.description}</p>
                    <div className="admin-resource-meta">
                      <span>{resource.subject}</span>
                      <span>{resource.level}</span>
                    </div>
                  </div>
                  <div className="admin-resource-actions">
                    <button className="btn secondary" onClick={() => handleEdit(resource)}>Edit</button>
                    <button className="btn danger" onClick={() => handleDelete(resource._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
