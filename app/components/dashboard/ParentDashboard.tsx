'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { User } from 'next-auth'

interface ParentDashboardProps {
  user: User
}

export default function ParentDashboard({ user }: ParentDashboardProps) {
  const [children] = useState([
    {
      id: 1,
      name: 'Lucas Martin',
      class: '6ème A',
      lastGrade: { subject: 'Mathématiques', grade: 16, date: '2024-03-28' },
      attendance: { present: 45, absent: 2, late: 1 },
    },
    {
      id: 2,
      name: 'Emma Martin',
      class: '4ème B',
      lastGrade: { subject: 'Français', grade: 15, date: '2024-03-27' },
      attendance: { present: 44, absent: 1, late: 3 },
    },
  ])

  const [notifications] = useState([
    {
      id: 1,
      type: 'grade',
      message: 'Nouvelle note en Mathématiques pour Lucas',
      date: '2024-03-28',
    },
    {
      id: 2,
      type: 'absence',
      message: 'Absence justifiée pour Emma le 25/03',
      date: '2024-03-25',
    },
  ])

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble des enfants */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Mes enfants</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {children.map((child) => (
            <div
              key={child.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">👨‍🎓</div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {child.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Classe : {child.class}
                    </p>
                    <p className="mt-2 text-sm text-indigo-600">
                      Dernière note : {child.lastGrade.subject} -{' '}
                      {child.lastGrade.grade}/20
                    </p>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                      <span>Présences : {child.attendance.present}</span>
                      <span>Absences : {child.attendance.absent}</span>
                      <span>Retards : {child.attendance.late}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <Link
                  href={`/parent/child/${child.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                >
                  Voir le détail →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications récentes */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Notifications récentes
        </h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {notifications.map((notif) => (
              <li key={notif.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {notif.type === 'grade' ? '📊' : '📅'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">{notif.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(notif.date).toLocaleDateString('fr-FR')}
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
          href="/parent/messages"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-2xl">✉️</div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Messages
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Communiquer avec les enseignants
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/parent/absences"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-2xl">📝</div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Justifier une absence
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Gérer les absences
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/parent/calendar"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-2xl">📅</div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Calendrier scolaire
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Voir les événements à venir
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
} 