import React from 'react'

const ChartCard = ({ title, children, action }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="section-title">{title}</h3>
        {action}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

export default ChartCard
