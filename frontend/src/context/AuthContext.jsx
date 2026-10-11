/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import API_BASE from '../config/api.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const readStoredAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  const userValue = localStorage.getItem(USER_KEY)

  if (!token || !userValue) {
    return null
  }

  try {
    return { token, user: JSON.parse(userValue) }
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth)
  const [authLoading, setAuthLoading] = useState(true)

  const persistAuth = useCallback(({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setAuth({ token, user })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setAuth(null)
  }, [])

  useEffect(() => {
    const verifyStoredSession = async () => {
      const storedAuth = readStoredAuth()

      if (!storedAuth?.token) {
        setAuthLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${storedAuth.token}`
          }
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Session expired')
        }

        persistAuth({ token: storedAuth.token, user: data.user })
      } catch {
        logout()
      } finally {
        setAuthLoading(false)
      }
    }

    verifyStoredSession()
  }, [logout, persistAuth])

  const getAuthHeaders = useCallback(() => {
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}
  }, [auth])

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      ...getAuthHeaders()
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (response.status === 401) {
      logout()
    }

    return response
  }, [getAuthHeaders, logout])

  const value = useMemo(() => ({
    auth,
    authLoading,
    login: persistAuth,
    logout,
    getAuthHeaders,
    fetchWithAuth,
    isAuthenticated: Boolean(auth?.token),
    isAdmin: auth?.user?.role === 'admin'
  }), [auth, authLoading, fetchWithAuth, getAuthHeaders, logout, persistAuth])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
