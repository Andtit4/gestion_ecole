import Link from 'next/link'

const Navbar = () => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <div className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-auto">
              {/* Logo */}
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/students"
                  className={`${
                    pathname === '/students'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } rounded-md px-3 py-2 text-sm font-medium`}
                >
                  Élèves
                </Link>
                <Link
                  href="/classes"
                  className={`${
                    pathname === '/classes'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } rounded-md px-3 py-2 text-sm font-medium`}
                >
                  Classes
                </Link>
                <Link
                  href="/teachers"
                  className={`${
                    pathname === '/teachers'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } rounded-md px-3 py-2 text-sm font-medium`}
                >
                  Professeurs
                </Link>
                <Link
                  href="/courses"
                  className={`${
                    pathname === '/courses'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } rounded-md px-3 py-2 text-sm font-medium`}
                >
                  Matières
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* User dropdown */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar 