import React from 'react'

const SkeletonTable = ({ columns = 5, rows = 8 }) => (
  <div className="animate-pulse">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
        <tr>
          {[...Array(columns)].map((_, idx) => (
            <th key={idx} className="px-6 py-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rIdx) => (
          <tr key={rIdx}>
            {[...Array(columns)].map((_, cIdx) => (
              <td key={cIdx} className="px-6 py-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default SkeletonTable 