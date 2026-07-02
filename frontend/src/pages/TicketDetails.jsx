import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const TicketDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => { fetchTicket() }, [id])

  const fetchTicket = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/tickets/${id}`)
      setTicket(res.data.data)
    } catch (err) {
      toast.error('Failed to load ticket details')
      navigate('/my-tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await api.put(`/tickets/${id}`, { status: newStatus })
      setTicket(res.data.data)
      toast.success(`Status updated to ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return
    try {
      await api.delete(`/tickets/${id}`)
      toast.success('Ticket deleted')
      navigate('/my-tickets')
    } catch (err) {
      toast.error('Failed to delete ticket')
    }
  }

  const getPriorityBadge = (priority) => {
    const classes = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' }
    return <span className={classes[priority] || 'badge'}>{priority}</span>
  }

  const getStatusBadge = (status) => {
    const classes = { Open: 'badge-open', 'In Progress': 'badge-inprogress', Resolved: 'badge-resolved', Closed: 'badge-closed' }
    return <span className={classes[status] || 'badge'}>{status}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!ticket) return null

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/my-tickets" className="hover:text-primary-600">My Tickets</Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold">{ticket.ticketId}</span>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{ticket.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {getPriorityBadge(ticket.priority)}
              {getStatusBadge(ticket.status)}
              <span className="badge bg-slate-100 text-slate-600 border border-slate-200">{ticket.category}</span>
              {ticket.confidence > 0 && (
                <span className="badge bg-primary-50 text-primary-700 border border-primary-200">
                  AI Confidence: {ticket.confidence.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          <button onClick={handleDelete} className="btn-danger text-sm py-2 px-4">
            Delete
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Details</h3>
              <dl className="space-y-3">
                {[
                  ['Ticket ID', ticket.ticketId],
                  ['Created', new Date(ticket.createdAt).toLocaleString()],
                  ['Updated', new Date(ticket.updatedAt).toLocaleString()],
                  ['Created By', ticket.createdBy?.name || 'Unknown'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center">
                    <dt className="text-sm text-slate-500">{label}</dt>
                    <dd className="text-sm font-semibold text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Actions</h3>
              <div className="space-y-2">
                {ticket.status !== 'Open' && (
                  <button onClick={() => handleStatusChange('Open')} disabled={updating} className="w-full btn-secondary text-sm py-2.5 justify-start gap-2">
                    Mark as Open
                  </button>
                )}
                {ticket.status !== 'In Progress' && (
                  <button onClick={() => handleStatusChange('In Progress')} disabled={updating} className="w-full btn-secondary text-sm py-2.5 justify-start gap-2">
                    Mark as In Progress
                  </button>
                )}
                {ticket.status !== 'Resolved' && (
                  <button onClick={() => handleStatusChange('Resolved')} disabled={updating} className="w-full btn-success text-sm py-2.5 justify-start gap-2">
                    Mark as Resolved
                  </button>
                )}
                {ticket.status !== 'Closed' && (
                  <button onClick={() => handleStatusChange('Closed')} disabled={updating} className="w-full btn-secondary text-sm py-2.5 justify-start gap-2">
                    Mark as Closed
                  </button>
                )}
              </div>
            </div>
          </div>

          {ticket.resolution && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="text-sm font-bold text-success-800 uppercase tracking-wider">Resolution</h3>
              </div>
              <p className="text-success-700 text-sm leading-relaxed">{ticket.resolution}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketDetails