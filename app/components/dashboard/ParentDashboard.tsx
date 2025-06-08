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
      schedule: { next: 'Aujourd\'hui - Mathématiques (10:00)' }
    },
    {
      id: 2,
      name: 'Emma Martin',
      class: '4ème B',
      lastGrade: { subject: 'Français', grade: 15, date: '2024-03-27' },
      attendance: { present: 44, absent: 1, late: 3 },
      schedule: { next: 'Demain - Histoire (08:00)' }
    },
  ])

  const [notifications] = useState([
    {
      id: 1,
      type: 'grade',
      message: 'Nouvelle note en Mathématiques pour Lucas',
      date: '2024-03-28',
      link: '/parent/grades/1'
    },
    {
      id: 2,
      type: 'absence',
      message: 'Absence justifiée pour Emma le 25/03',
      date: '2024-03-25',
      link: '/parent/absences/2'
    },
    {
      id: 3,
      type: 'message',
      message: 'Message du professeur de français concernant Emma',
      date: '2024-03-23',
      link: '/parent/messages/3'
    },
  ])

  const quickActions = [
    {
      title: 'Messages',
      description: 'Communiquer avec les enseignants',
      href: '/parent/messages',
      icon: (
        <svg className="w-6 h-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-amber-50 to-orange-50',
      border: 'border-amber-100',
    },
    {
      title: 'Justifier une absence',
      description: 'Gérer les absences',
      href: '/parent/absences',
      icon: (
        <svg className="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-50 to-indigo-50',
      border: 'border-blue-100',
    },
    {
      title: 'Calendrier scolaire',
      description: 'Voir les événements à venir',
      href: '/parent/calendar',
      icon: (
        <svg className="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-50 to-indigo-50',
      border: 'border-purple-100',
    }
  ]

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne de gauche - Vue d'ensemble des enfants */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Mes enfants
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {children.map((child) => (
              <div
                key={child.id}
                className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                      <svg className="h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {child.name}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {child.class}
                        </span>
                      </div>
                      <div className="mt-3 text-sm">
                        <div className="flex items-center text-green-700">
                          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Présences: <strong>{child.attendance.present}</strong></span>
                        </div>
                        <div className="flex items-center mt-1 text-red-700">
                          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Absences: <strong>{child.attendance.absent}</strong></span>
                        </div>
                        <div className="flex items-center mt-1 text-amber-700">
                          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Retards: <strong>{child.attendance.late}</strong></span>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-2">
                          <p className="text-xs text-gray-500">Dernière note</p>
                          <p className="text-sm font-medium">
                            {child.lastGrade.subject}{' '}
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium ${
                              child.lastGrade.grade >= 16 ? 'bg-green-100 text-green-800' : 
                              child.lastGrade.grade >= 12 ? 'bg-blue-100 text-blue-800' : 
                              child.lastGrade.grade >= 10 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {child.lastGrade.grade}/20
                            </span>
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-2">
                          <p className="text-xs text-gray-500">Prochain cours</p>
                          <p className="text-sm font-medium">{child.schedule.next}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                  <Link
                    href={`/parent/child/${child.id}`}
                    className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors flex items-center"
                  >
                    <span>Voir le détail</span>
                    <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <div className="flex space-x-3">
                    <Link
                      href={`/parent/child/${child.id}/grades`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Notes
                    </Link>
                    <Link
                      href={`/parent/child/${child.id}/absences`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Absences
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notifications récentes */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications récentes
              </h2>
              <Link 
                href="/parent/notifications" 
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
              >
                Voir toutes les notifications
                <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
              <ul role="list" className="divide-y divide-gray-200">
                {notifications.map((notif) => (
                  <li key={notif.id} className="hover:bg-gray-50 transition-colors">
                    <Link href={notif.link} className="block">
                      <div className="px-6 py-4 flex items-center">
                        <div className="flex-shrink-0">
                          {notif.type === 'grade' ? (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                          ) : notif.type === 'absence' ? (
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="ml-2">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Colonne de droite - Actions et résumé */}
        <div className="space-y-6">
          {/* Résumé */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm border border-orange-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800">Bienvenue, {user.name}</h3>
            <p className="mt-2 text-sm text-gray-600">Vous avez <span className="font-medium text-amber-700">{notifications.length} notifications</span> récentes pour vos <span className="font-medium text-blue-700">{children.length} enfants</span>.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs font-medium text-gray-500">Enfants</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-xl font-semibold text-gray-900">
                    {children.length}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs font-medium text-gray-500">Messages non lus</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-xl font-semibold text-gray-900">
                    {notifications.filter(n => n.type === 'message').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Actions rapides
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className={`flex-shrink-0 bg-${action.color.split('-')[1]} rounded-lg p-2`}>
                    {action.icon}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-800">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <div className="ml-auto">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Calendrier ou Événements à venir */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Événements à venir
              </h3>
            </div>
            <div className="p-4">
              <div className="border-l-4 border-purple-400 pl-4 py-2 mb-3">
                <p className="text-sm font-medium text-gray-800">Réunion parents-professeurs</p>
                <p className="text-xs text-gray-500">20 avril 2024, 18:00</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4 py-2 mb-3">
                <p className="text-sm font-medium text-gray-800">Journée portes ouvertes</p>
                <p className="text-xs text-gray-500">15 mai 2024, 09:00 - 17:00</p>
              </div>
              <div className="border-l-4 border-green-400 pl-4 py-2">
                <p className="text-sm font-medium text-gray-800">Fin du trimestre</p>
                <p className="text-xs text-gray-500">30 juin 2024</p>
              </div>
              <div className="mt-4">
                <Link
                  href="/parent/calendar"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span>Voir le calendrier complet</span>
                  <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 


