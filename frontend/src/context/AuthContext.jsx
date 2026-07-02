import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user] = useState({
    id: '000000000000000000000000',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'admin'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = 'Bearer demo-token'
  }, [])

  const login = async () => ({})
  const register = async () => ({})
  const logout = () => {}

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: true,
      isAdmin: true,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
