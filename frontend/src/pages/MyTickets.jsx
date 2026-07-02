import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const MyTickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', priority: '', category: '', search: '' })
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  useEffect(() => { fetchTickets() }, [filters.status, filters.priority, filters.category, filters.search, pagination.page])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      params.append('page', pagination.page)
      params.append('limit', '10')

      const res = await api.get(`/tickets?${params.toString()}`)
      setTickets(res.data.data)
      setPagination({ page: res.data.page, pages: res.data.pages, total: res.data.total })
    } catch (err) {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setPagination({ ...pagination, page: 1 })
  }

  const getPriorityBadge = (priority) => {
    const classes = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' }
    return <span className={classes[priority] || 'badge'}>{priority}</span>
  }

  const getStatusBadge = (status) => {
    const classes = { Open: 'badge-open', 'In Progress': 'badge-inprogress', Resolved: 'badge-resolved', Closed: 'badge-closed' }
    return <span className={classes[status] || 'badge'}>{status}</span>
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">My Tickets</h1>
          <p className="page-subtitle">Manage and track all your support requests</p>
        </div>
        <Link to="/create-ticket" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Ticket
        </Link>
      </div>

      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Search</label>
              <div className="relative">
                <input type="text" name="search" value={filters.search} onChange={handleFilterChange} className="form-input pl-10" placeholder="Search tickets..." />
                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              </div>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange} className="form-select">
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="form-label">Priority</label>
              <select name="priority" value={filters.priority} onChange={handleFilterChange} className="form-select">
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="form-label">Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="form-select">
                <option value="">All Categories</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Billing">Billing</option>
                <option value="Refund">Refund</option>
                <option value="Account Access">Account Access</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Complaint">Complaint</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Shipping">Shipping</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m3-19.5v-.75a.75.75 0 00-.75-.75h-.75m0 0v.75m0-.75a.75.75 0 00-.75.75h.75m0 0H9m11.25 0h.75m0 0v.75m0-.75a.75.75 0 00-.75-.75h-.75m0 0v.75" /></svg>
            </div>
            <p className="text-slate-500 mb-4">No tickets found</p>
            <Link to="/create-ticket" className="btn-primary">Create your first ticket</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>
                      <Link to={`/tickets/${ticket._id}`} className="font-semibold text-primary-600 hover:text-primary-700">{ticket.ticketId}</Link>
                    </td>
                    <td className="text-slate-700 max-w-xs truncate font-medium">{ticket.title}</td>
                    <td className="text-slate-500">{ticket.category}</td>
                    <td>{getPriorityBadge(ticket.priority)}</td>
                    <td>{getStatusBadge(ticket.status)}</td>
                    <td className="text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td className="text-right">
                      <Link to={`/tickets/${ticket._id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <button onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })} disabled={pagination.page === 1} className="btn-secondary text-sm disabled:opacity-40">Previous</button>
            <span className="text-sm font-semibold text-slate-500">Page {pagination.page} of {pagination.pages}</span>
            <button onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })} disabled={pagination.page === pagination.pages} className="btn-secondary text-sm disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTickets