'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { User } from 'next-auth'

interface StudentDashboardProps {
  user: User
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [todayClasses] = useState([
    { id: 1, subject: 'Mathématiques', time: '08:00 - 09:30', teacher: 'M. Martin', room: 'B204' },
    { id: 2, subject: 'Français', time: '09:45 - 11:15', teacher: 'Mme. Bernard', room: 'A105' },
    { id: 3, subject: 'Histoire', time: '13:30 - 15:00', teacher: 'M. Dubois', room: 'C302' },
  ])

  const [recentGrades] = useState([
    { id: 1, subject: 'Mathématiques', grade: 16, date: '2024-03-28' },
    { id: 2, subject: 'Français', grade: 14, date: '2024-03-25' },
    { id: 3, subject: 'Histoire', grade: 15, date: '2024-03-22' },
  ])

  const [homeworkCount] = useState(4)

  // Obtenir le statut d'un cours en fonction de l'heure actuelle
  const getClassStatus = (timeString: string) => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    
    const [startTime, endTime] = timeString.split(' - ')
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    
    // Convertir tout en minutes depuis minuit pour faciliter la comparaison
    const currentTimeInMinutes = hours * 60 + minutes
    const startTimeInMinutes = startHour * 60 + startMinute
    const endTimeInMinutes = endHour * 60 + endMinute
    
    if (currentTimeInMinutes < startTimeInMinutes) {
      return 'upcoming' // Le cours n'a pas encore commencé
    } else if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return 'current' // Le cours est en cours
    } else {
      return 'past' // Le cours est terminé
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'current':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          label: 'En cours'
        }
      case 'upcoming':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          label: 'À venir'
        }
      case 'past':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          label: 'Terminé'
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          label: ''
        }
    }
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne de gauche - Emploi du temps du jour */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Cours d'aujourd'hui
            </h2>
            <Link 
              href="/student/schedule" 
              className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors flex items-center"
            >
              Voir mon emploi du temps
              <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            {todayClasses.length === 0 ? (
              <div className="p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Pas de cours aujourd'hui</h3>
                <p className="mt-1 text-sm text-gray-500">Profitez de votre journée libre!</p>
              </div>
            ) : (
              <ul role="list" className="divide-y divide-gray-200">
                {todayClasses.map((class_) => {
                  const status = getClassStatus(class_.time);
                  const statusStyle = getStatusStyles(status);
                  
                  return (
                    <li key={class_.id} className="hover:bg-gray-50 transition-colors">
                      <div className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="flex items-center">
                                <p className="text-base font-semibold text-gray-800 truncate">
                                  {class_.subject}
                                </p>
                                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                                  {statusStyle.label}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-600">
                                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {class_.teacher}
                              </div>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center">
                              <div className="flex items-center text-sm text-gray-600 mr-4">
                                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {class_.time}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Salle {class_.room}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          
          {/* Notes récentes */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Notes récentes
              </h2>
              <Link 
                href="/student/grades" 
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
              >
                Voir toutes mes notes
                <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentGrades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{grade.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            grade.grade >= 16 ? 'bg-green-100 text-green-800' : 
                            grade.grade >= 12 ? 'bg-blue-100 text-blue-800' : 
                            grade.grade >= 10 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {grade.grade}/20
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(grade.date).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de droite - Cartes d'actions et résumé */}
        <div className="space-y-6">
          {/* Carte de résumé */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800">Bienvenue, {user.name}</h3>
            <p className="mt-2 text-sm text-gray-600">Vous avez <span className="font-medium text-green-700">{homeworkCount} devoirs</span> à faire et <span className="font-medium text-blue-700">{recentGrades.length} notes</span> récentes.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs font-medium text-gray-500">Moyenne</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-xl font-semibold text-gray-900">
                    {(recentGrades.reduce((acc, curr) => acc + curr.grade, 0) / recentGrades.length).toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">/20</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs font-medium text-gray-500">Cours aujourd'hui</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-xl font-semibold text-gray-900">
                    {todayClasses.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Accès rapides</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <Link
                href="/student/schedule"
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-2">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-800">Emploi du temps</h4>
                  <p className="text-sm text-gray-600">Voir mon planning complet</p>
                </div>
                <div className="ml-auto">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/student/grades"
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-800">Mes notes</h4>
                  <p className="text-sm text-gray-600">Consulter toutes mes notes</p>
                </div>
                <div className="ml-auto">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/student/homework"
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 bg-amber-100 rounded-lg p-2">
                  <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-800">Devoirs</h4>
                  <p className="text-sm text-gray-600">Voir mes devoirs à faire</p>
                </div>
                <div className="ml-auto">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              
              <Link
                href="/student/report-cards"
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-2">
                  <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-800">Bulletins</h4>
                  <p className="text-sm text-gray-600">Voir mes bulletins scolaires</p>
                </div>
                <div className="ml-auto">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 


