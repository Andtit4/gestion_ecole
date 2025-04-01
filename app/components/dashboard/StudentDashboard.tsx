'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { User } from 'next-auth'

interface StudentDashboardProps {
  user: User
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [todayClasses] = useState([
    { id: 1, subject: 'Mathématiques', time: '08:00 - 09:30', teacher: 'M. Martin' },
    { id: 2, subject: 'Français', time: '09:45 - 11:15', teacher: 'Mme. Bernard' },
    { id: 3, subject: 'Histoire', time: '13:30 - 15:00', teacher: 'M. Dubois' },
  ])

  const [recentGrades] = useState([
    { id: 1, subject: 'Mathématiques', grade: 16, date: '2024-03-28' },
    { id: 2, subject: 'Français', grade: 14, date: '2024-03-25' },
    { id: 3, subject: 'Histoire', grade: 15, date: '2024-03-22' },
  ])

  return (
    <div className="space-y-6">
      {/* Emploi du temps du jour */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Cours d'aujourd'hui</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {todayClasses.map((class_) => (
              <li key={class_.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {class_.subject}
                      </p>
                      <p className="ml-4 text-sm text-gray-500">
                        avec {class_.teacher}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <p className="text-sm text-gray-500">{class_.time}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Notes récentes */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Notes récentes</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {recentGrades.map((grade) => (
              <li key={grade.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {grade.subject}
                      </p>
                      <p className="ml-4 text-sm text-gray-500">
                        Note : {grade.grade}/20
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {new Date(grade.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/student/schedule"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-2xl">📅</div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Emploi du temps
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Voir mon planning complet
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/student/grades"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-2xl">📊</div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Mes notes
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Consulter toutes mes notes
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/student/homework"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-2xl">📚</div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Devoirs
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Voir mes devoirs à faire
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
} 