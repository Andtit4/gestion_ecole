'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProgrammeList from '@/components/scolarite/programmes/ProgrammeList'
import ProgrammeSearch from '@/components/scolarite/programmes/ProgrammeSearch'

export default function ProgrammesPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('liste')

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Programmes Scolaires</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-10 bg-gray-100/80 p-1.5 rounded-lg">
          <TabsTrigger value="liste" className="text-sm sm:text-base font-medium">Liste des Programmes</TabsTrigger>
          <TabsTrigger value="recherche" className="text-sm sm:text-base font-medium">Recherche</TabsTrigger>
        </TabsList>
        
        <TabsContent value="liste" className="mt-6">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-gray-800">Programmes par Mati�re</CardTitle>
              <CardDescription className="text-gray-600">
                Consultez et g�rez les programmes scolaires par mati�re et par niveau.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ProgrammeList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recherche" className="mt-6">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-gray-800">Recherche de Programmes</CardTitle>
              <CardDescription className="text-gray-600">
                Recherchez des programmes par mot-cl�, niveau ou mati�re.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ProgrammeSearch />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 


