'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  BanknoteIcon, 
  Receipt, 
  CreditCard, 
  Tags, 
  Tag, 
  FileText, 
  Users, 
  UserPlus,
  BarChart4
} from 'lucide-react'

export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const modules = [
    {
      id: 'feeTypes',
      name: 'Types de frais',
      description: 'Gérer les différentes catégories de frais scolaires',
      icon: <Tag className="h-6 w-6 text-blue-600" />,
      href: '/finances/feeTypes'
    },
    {
      id: 'feeGroups',
      name: 'Groupes de frais',
      description: 'Organiser les frais par niveaux ou classes',
      icon: <Tags className="h-6 w-6 text-indigo-600" />,
      href: '/finances/feeGroups'
    },
    {
      id: 'feeItems',
      name: 'Éléments de frais',
      description: 'Gérer les frais individuels et leurs montants',
      icon: <BanknoteIcon className="h-6 w-6 text-green-600" />,
      href: '/finances/feeItems'
    },
    {
      id: 'invoices',
      name: 'Factures',
      description: 'Créer et gérer les factures des élèves',
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      href: '/finances/invoices'
    },
    {
      id: 'payments',
      name: 'Paiements',
      description: 'Enregistrer et suivre les paiements reçus',
      icon: <Receipt className="h-6 w-6 text-orange-600" />,
      href: '/finances/payments'
    },
    {
      id: 'reports',
      name: 'Rapports financiers',
      description: 'Générer des rapports et analyses financières',
      icon: <BarChart4 className="h-6 w-6 text-red-600" />,
      href: '/finances/reports'
    }
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion Financière</h1>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:flex">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Link href={module.href} key={module.id}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center">
                      {module.icon}
                      <CardTitle className="ml-2 text-xl">{module.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600">{module.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Types et groupes de frais</CardTitle>
                <CardDescription>Configurez les structures de frais pour l'école</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Link href="/finances/feeTypes">
                    <Button variant="outline" className="w-full justify-start">
                      <Tag className="h-4 w-4 mr-2" />
                      Gérer les types de frais
                    </Button>
                  </Link>
                  <Link href="/finances/feeGroups">
                    <Button variant="outline" className="w-full justify-start">
                      <Tags className="h-4 w-4 mr-2" />
                      Gérer les groupes de frais
                    </Button>
                  </Link>
                  <Link href="/finances/feeItems">
                    <Button variant="outline" className="w-full justify-start">
                      <BanknoteIcon className="h-4 w-4 mr-2" />
                      Gérer les éléments de frais
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paramètres de paiement</CardTitle>
                <CardDescription>Configurez les options de paiement et de facturation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Link href="/finances/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Méthodes de paiement
                    </Button>
                  </Link>
                  <Link href="/finances/settings#late-fees">
                    <Button variant="outline" className="w-full justify-start">
                      <Receipt className="h-4 w-4 mr-2" />
                      Frais de retard et pénalités
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestion des factures</CardTitle>
                <Link href="/finances/invoices/new">
                  <Button>Créer une facture</Button>
                </Link>
              </div>
              <CardDescription>Créez et gérez les factures pour les élèves</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Link href="/finances/invoices">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Toutes les factures
                  </Button>
                </Link>
                <Link href="/finances/invoices?status=pending">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Factures en attente
                  </Button>
                </Link>
                <Link href="/finances/invoices?status=overdue">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Factures en retard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestion des paiements</CardTitle>
                <Link href="/finances/payments/new">
                  <Button>Enregistrer un paiement</Button>
                </Link>
              </div>
              <CardDescription>Enregistrez et suivez les paiements des frais scolaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Link href="/finances/payments">
                  <Button variant="outline" className="w-full justify-start">
                    <Receipt className="h-4 w-4 mr-2" />
                    Tous les paiements
                  </Button>
                </Link>
                <Link href="/finances/payments?method=cash">
                  <Button variant="outline" className="w-full justify-start">
                    <BanknoteIcon className="h-4 w-4 mr-2" />
                    Paiements en espèces
                  </Button>
                </Link>
                <Link href="/finances/payments?method=bank_transfer">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Virements bancaires
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rapports financiers</CardTitle>
              <CardDescription>Générez des rapports et analyses financières</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Link href="/finances/reports/income">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart4 className="h-4 w-4 mr-2" />
                    Rapport des revenus
                  </Button>
                </Link>
                <Link href="/finances/reports/outstanding">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart4 className="h-4 w-4 mr-2" />
                    Frais impayés
                  </Button>
                </Link>
                <Link href="/finances/reports/payment-history">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart4 className="h-4 w-4 mr-2" />
                    Historique des paiements
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 


