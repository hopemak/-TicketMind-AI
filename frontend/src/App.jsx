import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CreateTicket from './pages/CreateTicket'
import MyTickets from './pages/MyTickets'
import TicketDetails from './pages/TicketDetails'
import Analytics from './pages/Analytics'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
