'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { redirect } from 'next/navigation'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import PeriodList from '@/app/components/scolarite/PeriodList'
import ReportCardList from '@/app/components/scolarite/ReportCardList'
import AttendanceOverview from '@/app/components/scolarite/AttendanceOverview'

export default function ScolaritePage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('periodes')

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session) {
    redirect('/auth/signin')
  }

  // Seuls les administrateurs et les enseignants peuvent accéder à la section scolarité
  if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Gestion de la Scolarité</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-10 bg-gray-100/80 p-1.5 rounded-lg">
          <TabsTrigger value="periodes" className="text-sm sm:text-base font-medium">Périodes Scolaires</TabsTrigger>
          <TabsTrigger value="bulletins" className="text-sm sm:text-base font-medium">Bulletins</TabsTrigger>
          <TabsTrigger value="absences" className="text-sm sm:text-base font-medium">Absences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="periodes" className="mt-6">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-gray-800">Périodes Scolaires</CardTitle>
              <CardDescription className="text-gray-600">
                Gérez les trimestres, semestres et autres périodes de l'année scolaire.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <PeriodList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bulletins" className="mt-6">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-gray-800">Bulletins Scolaires</CardTitle>
              <CardDescription className="text-gray-600">
                Consultez et générez les bulletins de notes pour chaque période.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ReportCardList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="absences" className="mt-6">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-gray-800">Gestion des Absences</CardTitle>
              <CardDescription className="text-gray-600">
                Consultez et gérez les absences des élèves.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <AttendanceOverview />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 