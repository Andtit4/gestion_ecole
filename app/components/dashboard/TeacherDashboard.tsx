'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { User } from 'next-auth'

interface TeacherDashboardProps {
  user: User
}

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [myClasses] = useState([
    { id: 1, name: '6ème A', students: 25, nextDay: 'Lundi - 10:00', subject: 'Mathématiques' },
    { id: 2, name: '5ème B', students: 28, nextDay: 'Mardi - 14:00', subject: 'Mathématiques' },
    { id: 3, name: '4ème C', students: 22, nextDay: 'Jeudi - 15:30', subject: 'Mathématiques' },
  ])

  const quickActions = [
    {
      title: 'Prendre les présences',
      description: 'Marquer les présences/absences',
      href: '/teacher/attendance',
      icon: (
        <svg className="w-6 h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-50 to-emerald-50',
      border: 'border-green-100',
      hoverBg: 'hover:bg-green-50',
    },
    {
      title: 'Saisir les notes',
      description: 'Gérer les évaluations',
      href: '/teacher/grades',
      icon: (
        <svg className="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-blue-50 to-indigo-50',
      border: 'border-blue-100',
      hoverBg: 'hover:bg-blue-50',
    },
    {
      title: 'Emploi du temps',
      description: 'Voir mon emploi du temps',
      href: '/timetable',
      icon: (
        <svg className="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-50 to-indigo-50',
      border: 'border-purple-100',
      hoverBg: 'hover:bg-purple-50',
    },
    {
      title: 'Messages',
      description: 'Communiquer avec les parents',
      href: '/teacher/messages',
      icon: (
        <svg className="w-6 h-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-amber-50 to-orange-50',
      border: 'border-amber-100',
      hoverBg: 'hover:bg-amber-50',
    },
  ]

  return (
    <div className="p-6">
      {/* Résumé et actions rapides */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`bg-gradient-to-br ${action.color} rounded-xl shadow-sm ${action.border} border overflow-hidden transition-all hover:shadow-md ${action.hoverBg}`}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">{action.icon}</div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mes Classes */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Mes Classes
          </h2>
          <Link 
            href="/teacher/classes" 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
          >
            Voir toutes mes classes
            <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myClasses.map((classe) => (
            <div
              key={classe.id}
              className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 transition-all hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    <svg className="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {classe.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {classe.subject}
                      </span>
                      <span className="ml-2">{classe.students} élèves</span>
                    </p>
                    <p className="mt-2 text-sm font-medium text-indigo-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Prochain cours : {classe.nextDay}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <Link
                  href={`/teacher/classes/${classe.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-between"
                >
                  <span>Voir les détails de la classe</span>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activités récentes */}
      <div className="mt-8">
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Activités récentes
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-6 flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Vous avez fait l'appel en 6ème A</p>
                <p className="mt-1 text-sm text-gray-500">Aujourd'hui à 10:15</p>
              </div>
            </div>
            <div className="p-6 flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Vous avez ajouté des notes pour 5ème B</p>
                <p className="mt-1 text-sm text-gray-500">Hier à 15:30</p>
              </div>
            </div>
            <div className="p-6 flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Vous avez reçu un message de parent</p>
                <p className="mt-1 text-sm text-gray-500">Il y a 2 jours</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <Link
              href="/teacher/activity"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <span>Voir toutes les activités</span>
              <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 


