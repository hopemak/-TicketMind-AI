import React from 'react'

const StatCard = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="stat-label">{title}</p>
            <p className="stat-value mt-1">{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trendUp ? 'text-success-600' : 'text-danger-600'}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trendUp ? "M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" : "M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"} />
                </svg>
                {trend}%
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
