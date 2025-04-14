import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import { AuthProvider } from '@/components/providers/AuthProvider'
// import Navbar from '@/components/navigation/Navbar'
import { AuthProvider } from './components/providers/AuthProvider'
import { Navbar } from '@/components/navigation/Navbar'
import { ToastProvider } from './components/providers/ToastProvider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gestion École',
  description: 'Application de gestion scolaire',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <ToastProvider />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
} 