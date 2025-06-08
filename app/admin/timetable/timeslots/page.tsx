'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import TimeSlotList from '@/components/timetable/TimeSlotList'
import TimeSlotForm from '@/components/timetable/TimeSlotForm'

export default function TimeSlotPage() {
  const { data: session, status } = useSession()
  const [isAddingTimeSlot, setIsAddingTimeSlot] = useState(false)

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Acc�s non autoris�</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestion des cr�neaux horaires
          </h1>
          <button
            onClick={() => setIsAddingTimeSlot(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Ajouter un cr�neau horaire
          </button>
        </div>

        {isAddingTimeSlot && (
          <div className="mt-6">
            <TimeSlotForm onClose={() => setIsAddingTimeSlot(false)} />
          </div>
        )}

        <div className="mt-6">
          <TimeSlotList />
        </div>
      </div>
    </div>
  )
} 


