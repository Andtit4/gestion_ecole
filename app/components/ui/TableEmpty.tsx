import React from 'react'

interface TableEmptyProps {
  message: string
  icon?: React.ReactNode
}

export default function TableEmpty({ message, icon }: TableEmptyProps) {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      {icon && <div className="mb-2">{icon}</div>}
      <p className="text-gray-500">{message}</p>
    </div>
  )
} 


