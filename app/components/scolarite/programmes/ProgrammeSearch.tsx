'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Search, AlertCircle, Eye } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import ProgrammeView from './ProgrammeView'
import TableEmpty from '@/app/components/ui/TableEmpty'

const levels = ['6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale']

export default function ProgrammeSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [viewingProgramme, setViewingProgramme] = useState(null)
  const [showView, setShowView] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des matières')
      }
      const data = await response.json()
      setCourses(data)
    } catch (err) {
      console.error('Erreur lors du chargement des matières:', err)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery && !selectedLevel && !selectedCourse) {
      setError('Veuillez saisir au moins un critère de recherche')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      // Construire les paramètres de requête
      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (selectedLevel) params.append('level', selectedLevel)
      if (selectedCourse) params.append('courseId', selectedCourse)
      
      const response = await fetch(`/api/programmes/search?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche')
      }
      
      const data = await response.json()
      setSearchResults(data)
      
      if (data.length === 0) {
        setError('Aucun programme ne correspond à votre recherche')
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la recherche')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleView = (programme) => {
    setViewingProgramme(programme)
    setShowView(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Brouillon</Badge>
      case 'PUBLISHED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Publié</Badge>
      case 'ARCHIVED':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Archivé</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div>
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Input
              type="text"
              placeholder="Rechercher par mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={selectedCourse}
              onValueChange={setSelectedCourse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les matières</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={selectedLevel}
              onValueChange={setSelectedLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les niveaux</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto">
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? 'Recherche en cours...' : 'Rechercher'}
        </Button>
      </div>

      {error && (
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {searchResults.length === 0 && !error && !isLoading ? (
        <TableEmpty message="Effectuez une recherche pour afficher les programmes correspondants" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((programme) => {
            const course = courses.find(c => c.id === programme.courseId)
            return (
              <Card key={programme.id} className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{programme.title}</CardTitle>
                    {getStatusBadge(programme.status)}
                  </div>
                  <CardDescription>
                    {course?.name || 'Matière inconnue'} - {programme.level}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {programme.description ? (
                    <p className="text-gray-700 line-clamp-3">{programme.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">Aucune description disponible</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="text-sm text-gray-500">
                    Année {programme.year}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleView(programme)}>
                    <Eye className="h-4 w-4 mr-1" /> Voir
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="text-sm text-gray-500 mt-4">
          {searchResults.length} programme(s) trouvé(s)
        </div>
      )}

      {showView && viewingProgramme && (
        <ProgrammeView
          programme={viewingProgramme}
          courses={courses}
          onClose={() => setShowView(false)}
        />
      )}
    </div>
  )
} 