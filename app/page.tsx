export default function Home() {
  const modules = [
    {
      title: 'Gestion des Classes',
      description: 'Gérez les salles, emplois du temps et affectations',
      icon: '🏫'
    },
    {
      title: 'Gestion Académique',
      description: 'Notes, bulletins et suivi des élèves',
      icon: '📚'
    },
    {
      title: 'Administration',
      description: 'Inscriptions et gestion administrative',
      icon: '📋'
    },
    {
      title: 'Communication',
      description: 'Messagerie et notifications',
      icon: '💬'
    }
  ]

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Plateforme de Gestion Scolaire
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Une solution complète pour la gestion de votre établissement
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module, index) => (
              <div
                key={index}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <span className="text-2xl">{module.icon}</span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 text-center">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {module.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    {module.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 