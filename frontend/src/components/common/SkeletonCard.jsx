import React from 'react'

const SkeletonCard = ({ lines = 3 }) => (
  <div className="card animate-pulse space-y-3">
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    {[...Array(lines)].map((_, idx) => (
      <div key={idx} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    ))}
  </div>
)

export default SkeletonCard 