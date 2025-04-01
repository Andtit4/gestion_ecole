'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { User } from 'next-auth'

interface TeacherDashboardProps {
  user: User
}

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [myClasses] = useState([
    { id: 1, name: '6ème A', students: 25, nextCourse: 'Mathématiques - 10:00' },
    { id: 2, name: '5ème B', students: 28, nextCourse: 'Français - 14:00' },
    { id: 3, name: '4ème C', students: 22, nextCourse: 'Histoire - 15:30' },
  ])

  const quickActions = [
    {
      title: 'Prendre les présences',
      description: 'Marquer les présences/absences',
      href: '/teacher/attendance',
      icon: '✓',
    },
    {
      title: 'Saisir les notes',
      description: 'Gérer les évaluations',
      href: '/teacher/grades',
      icon: '📝',
    },
    {
      title: 'Planning des cours',
      description: 'Voir mon emploi du temps',
      href: '/teacher/schedule',
      icon: '📅',
    },
    {
      title: 'Messages',
      description: 'Communiquer avec les parents',
      href: '/teacher/messages',
      icon: '✉️',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Mes Classes */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Mes Classes</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {myClasses.map((classe) => (
            <div
              key={classe.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">🏫</div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {classe.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {classe.students} élèves
                    </p>
                    <p className="mt-1 text-sm text-indigo-600">
                      Prochain cours : {classe.nextCourse}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <Link
                  href={`/teacher/classes/${classe.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                >
                  Voir les détails →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Actions rapides</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 text-2xl">{action.icon}</div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 