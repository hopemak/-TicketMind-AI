import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import { toast } from 'react-toastify'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentTickets, setRecentTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsRes, recentRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/recent?limit=10')
      ])
      setStats(statsRes.data.data)
      setRecentTickets(recentRes.data.data)
    } catch (err) {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">System-wide overview and management</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Tickets" value={stats.totalTickets} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m3-19.5v-.75a.75.75 0 00-.75-.75h-.75m0 0v.75m0-.75a.75.75 0 00-.75.75h.75m0 0H9m11.25 0h.75m0 0v.75m0-.75a.75.75 0 00-.75-.75h-.75m0 0v.75" /></svg>} />
          <StatCard title="Open" value={stats.openTickets} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatCard title="Resolved" value={stats.resolvedTickets} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatCard title="Closed" value={stats.closedTickets} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ChartCard title="All Recent Tickets">
            {recentTickets.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-500">No tickets found</div>
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
                      <th>Created By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTickets.map((ticket) => (
                      <tr key={ticket._id}>
                        <td className="font-semibold text-primary-600">{ticket.ticketId}</td>
                        <td className="text-slate-700 max-w-xs truncate font-medium">{ticket.title}</td>
                        <td className="text-slate-500">{ticket.category}</td>
                        <td>{getPriorityBadge(ticket.priority)}</td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td className="text-slate-500 font-medium">{ticket.createdBy?.name || 'Unknown'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>
        </div>

        <div className="space-y-6">
          <ChartCard title="Category Breakdown">
            <div className="space-y-4">
              {stats?.categoryDistribution.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: `hsl(${230 + i * 20}, 65%, 55%)` }}>
                    {cat.value}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                      <span className="text-xs font-bold text-slate-400">{((cat.value / stats.totalTickets) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(cat.value / stats.totalTickets) * 100}%`, background: `hsl(${230 + i * 20}, 65%, 55%)` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Priority Breakdown">
            <div className="space-y-3">
              {stats?.priorityDistribution.map((pri) => (
                <div key={pri.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${pri.name === 'High' ? 'bg-danger-500' : pri.name === 'Medium' ? 'bg-warning-500' : 'bg-success-500'}`} />
                    <span className="text-sm font-semibold text-slate-700">{pri.name}</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{pri.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
