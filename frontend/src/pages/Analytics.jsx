import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import api from '../services/api'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import { toast } from 'react-toastify'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAnalytics() }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await api.get('/analytics/dashboard')
      setStats(res.data.data)
    } catch (err) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const categoryChartData = stats ? {
    labels: stats.categoryDistribution.map(c => c.name),
    datasets: [{
      label: 'Tickets',
      data: stats.categoryDistribution.map(c => c.value),
      backgroundColor: [
        'rgba(59, 130, 246, 0.85)', 'rgba(239, 68, 68, 0.85)', 'rgba(16, 185, 129, 0.85)',
        'rgba(245, 158, 11, 0.85)', 'rgba(139, 92, 246, 0.85)', 'rgba(236, 72, 153, 0.85)',
        'rgba(107, 114, 128, 0.85)', 'rgba(20, 184, 166, 0.85)', 'rgba(249, 115, 22, 0.85)', 'rgba(99, 102, 241, 0.85)'
      ],
      borderRadius: 8,
      borderSkipped: false,
    }]
  } : null

  const priorityChartData = stats ? {
    labels: stats.priorityDistribution.map(p => p.name),
    datasets: [{
      data: stats.priorityDistribution.map(p => p.value),
      backgroundColor: ['rgba(239, 68, 68, 0.85)', 'rgba(245, 158, 11, 0.85)', 'rgba(16, 185, 129, 0.85)'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  } : null

  const statusChartData = stats ? {
    labels: stats.statusDistribution.map(s => s.name),
    datasets: [{
      label: 'Tickets',
      data: stats.statusDistribution.map(s => s.value),
      backgroundColor: ['rgba(59, 130, 246, 0.85)', 'rgba(245, 158, 11, 0.85)', 'rgba(16, 185, 129, 0.85)', 'rgba(107, 114, 128, 0.85)'],
      borderRadius: 8,
      borderSkipped: false,
    }]
  } : null

  const monthlyChartData = stats ? {
    labels: stats.monthlyTickets.map(m => m.month),
    datasets: [{
      label: 'Tickets Created',
      data: stats.monthlyTickets.map(m => m.count),
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
      borderColor: 'rgba(59, 130, 246, 0.9)',
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 7,
    }]
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { family: 'Inter', size: 12 } } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { font: { family: 'Inter', size: 11 } } }
    }
  }

  const doughnutOptions = {
    ...chartOptions,
    cutout: '70%',
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { family: 'Inter', size: 12 } } } }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Deep insights and trends from your AI-classified support tickets</p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Tickets" value={stats.totalTickets} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m3-19.5v-.75a.75.75 0 00-.75-.75h-.75m0 0v.75m0-.75a.75.75 0 00-.75.75h.75m0 0H9m11.25 0h.75m0 0v.75m0-.75a.75.75 0 00-.75-.75h-.75m0 0v.75" /></svg>} />
            <StatCard title="Open" value={stats.openTickets} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title="Resolved" value={stats.resolvedTickets} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title="Closed" value={stats.closedTickets} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <ChartCard title="Category Distribution">
              <div className="h-80">{categoryChartData && <Bar data={categoryChartData} options={chartOptions} />}</div>
            </ChartCard>
            <ChartCard title="Priority Distribution">
              <div className="h-80 flex items-center justify-center">{priorityChartData && <Doughnut data={priorityChartData} options={doughnutOptions} />}</div>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard title="Status Overview">
              <div className="h-80">{statusChartData && <Bar data={statusChartData} options={chartOptions} />}</div>
            </ChartCard>
            <ChartCard title="Monthly Ticket Volume">
              <div className="h-80">{monthlyChartData && <Line data={monthlyChartData} options={chartOptions} />}</div>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics