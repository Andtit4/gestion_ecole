'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Teacher {
  id: string
  firstName: string
  lastName: string
  email?: string
}

interface ClassFormProps {
  classId?: string
  onClose?: () => void
}

export default function ClassForm({ classId, onClose }: ClassFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    year: new Date().getFullYear(),
    teacherId: ''
  })

  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true);
      try {
        if (classId === 'new') {
          // Utiliser notre nouvelle route dédiée pour la création
          const response = await fetch('/api/classes/new');
          if (response.ok) {
            const data = await response.json();
            // Vérifier que les données sont bien structurées
            console.log('Data from /api/classes/new:', data);
            if (Array.isArray(data.teachers) && data.teachers.length > 0) {
              setTeachers(data.teachers);
              setFormData({
                ...formData,
                year: data.currentYear || new Date().getFullYear(),
                teacherId: data.teachers.length > 0 ? data.teachers[0].id : ''
              });
            } else {
              console.error('La structure des teachers est incorrecte:', data.teachers);
              setTeachers([]);
              setError('Aucun enseignant disponible');
            }
          } else {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Erreur lors de l\'initialisation du formulaire');
          }
        } else if (classId) {
          // Charger les données d'une classe existante
          await Promise.all([fetchTeachers(), fetchClassData()]);
        } else {
          // Juste charger les enseignants pour un nouveau formulaire sans contexte
          await fetchTeachers();
        }
      } catch (err) {
        console.error('Erreur dans initializeForm:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    initializeForm();
  }, [classId]);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des enseignants')
      }
      const data = await response.json()
      
      // S'assurer que nous avons le bon format pour chaque enseignant
      const formattedTeachers = data.map((teacher: any) => ({
        id: teacher.id, // Utilise l'ID du teacher, pas l'ID de l'utilisateur
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        email: teacher.email
      }))
      
      setTeachers(formattedTeachers)
      if (formattedTeachers.length > 0 && !classId) {
        setFormData(prev => ({ ...prev, teacherId: formattedTeachers[0].id }))
      }
    } catch (err) {
      console.error('Erreur fetchTeachers:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const fetchClassData = async () => {
    if (!classId || classId === 'new') return;
    
    try {
      const response = await fetch(`/api/classes/${classId}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la classe')
      }
      const data = await response.json()
      setFormData({
        name: data.name,
        level: data.level,
        year: data.year,
        teacherId: data.teacherId
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Toujours utiliser /api/classes pour la création, même si l'ID est 'new'
      const url = classId && classId !== 'new' ? `/api/classes/${classId}` : '/api/classes'
      const method = classId && classId !== 'new' ? 'PATCH' : 'POST'

      console.log(`Envoi des données vers ${url} avec méthode ${method}:`, formData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log(`Réponse du serveur: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        // Essayer de parser la réponse, mais gérer le cas où elle n'est pas en JSON valide
        let errorMessage = 'Erreur lors de l\'enregistrement de la classe';
        
        try {
          const data = await response.json();
          errorMessage = data.message || data.error || errorMessage;
        } catch (parseError) {
          console.error('Erreur lors du parsing de la réponse:', parseError);
          errorMessage = `Erreur ${response.status}: ${response.statusText || 'Réponse invalide du serveur'}`;
        }
        
        throw new Error(errorMessage);
      }

      if (onClose) {
        onClose()
      } else {
        router.push('/admin/classes')
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du formulaire:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (isLoading && !teachers.length) {
    return <div className="flex justify-center p-4">Chargement en cours...</div>
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {classId && classId !== 'new' ? 'Modifier la classe' : 'Ajouter une nouvelle classe'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom de la classe
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">
            Niveau
          </label>
          <input
            type="text"
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Année scolaire
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min={2000}
            max={2100}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">
            Professeur principal
          </label>
          <select
            id="teacherId"
            name="teacherId"
            value={formData.teacherId || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Sélectionner un professeur</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName || ''} {teacher.lastName || ''}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Enregistrement...' : classId && classId !== 'new' ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  )
} 


