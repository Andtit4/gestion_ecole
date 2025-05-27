import Link from 'next/link'

export default function Home() {
  const modules = [
    {
      title: 'Gestion des Classes',
      description: 'Gérez les salles, emplois du temps et affectations',
      icon: '🏫',
      href: '/classes'
    },
    {
      title: 'Gestion Académique',
      description: 'Notes, bulletins et suivi des élèves',
      icon: '📚',
      href: '/grades'
    },
    {
      title: 'Administration',
      description: 'Inscriptions et gestion administrative',
      icon: '📋',
      href: '/students'
    },
    {
      title: 'Communication',
      description: 'Messagerie et notifications',
      icon: '💬',
      href: '/dashboard'
    }
  ]

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            <span className="text-blue-600">Ecole</span>Gestion
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Une solution complète pour la gestion de votre établissement scolaire
          </p>
          <div className="mt-8">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module, index) => (
              <Link
                key={index}
                href={module.href}
                className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200"
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 mx-auto">
                  <span className="text-2xl">{module.icon}</span>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    {module.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EcoleGestion - Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  )
} 