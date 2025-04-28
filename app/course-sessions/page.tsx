"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import CourseSessionForm from "@/components/course-sessions/CourseSessionForm";
import { Badge } from "@/components/ui/badge";
import { CourseSessionStatus } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { formatTime, getStatusBadge } from '@/lib/utils'

const statusColors = {
  PLANNED: "bg-blue-500",
  ONGOING: "bg-yellow-500",
  COMPLETED: "bg-green-500",
  CANCELED: "bg-red-500",
};

const statusLabels = {
  PLANNED: "Planifié",
  ONGOING: "En cours",
  COMPLETED: "Terminé",
  CANCELED: "Annulé",
};

type CourseSession = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  content?: string;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
  classId: string;
  courseId: string;
  teacherId: string;
  class: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    }
  };
};

interface Class {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

type Filters = {
  classId?: string;
  courseId?: string;
  teacherId?: string;
  status?: string;
  date?: Date | null;
};

export default function CourseSessionsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedSession, setSelectedSession] = useState<CourseSession | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchSessions(),
          fetchClasses(),
          fetchCourses(),
          fetchTeachers(),
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [filters]);

  const fetchSessions = async () => {
    try {
      let url = '/api/course-sessions';
      const params = new URLSearchParams();
      
      if (filters.classId) params.append('classId', filters.classId);
      if (filters.courseId) params.append('courseId', filters.courseId);
      if (filters.teacherId) params.append('teacherId', filters.teacherId);
      if (filters.status) params.append('status', filters.status);
      if (filters.date) params.append('date', format(filters.date, 'yyyy-MM-dd'));
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Échec de la récupération des sessions');
      }
      
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les sessions de cours',
        variant: 'destructive',
      });
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Échec de la récupération des classes');
      }
      
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les classes',
        variant: 'destructive',
      });
      setClasses([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Échec de la récupération des matières');
      }
      
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les matières',
        variant: 'destructive',
      });
      setCourses([]);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Échec de la récupération des enseignants');
      }
      
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des enseignants:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les enseignants',
        variant: 'destructive',
      });
      setTeachers([]);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchSessions();
  };

  const handleResetFilters = () => {
    setFilters({
      classId: '',
      courseId: '',
      teacherId: '',
      status: '',
      date: null,
    });
    fetchSessions();
  };

  const handleAddSession = () => {
    setSelectedSession(null);
    setIsFormOpen(true);
  };

  const handleEditSession = (session: CourseSession) => {
    setSelectedSession(session);
    setIsFormOpen(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) return;

    try {
      const response = await fetch(`/api/course-sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression de la séance');

      toast({
        title: 'Succès',
        description: 'La séance a été supprimée avec succès',
      });

      fetchSessions();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la séance',
        variant: 'destructive',
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const url = selectedSession
        ? `/api/course-sessions/${selectedSession.id}`
        : '/api/course-sessions';
      
      const response = await fetch(url, {
        method: selectedSession ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde de la séance');

      toast({
        title: 'Succès',
        description: `La séance a été ${selectedSession ? 'modifiée' : 'ajoutée'} avec succès`,
      });

      setIsFormOpen(false);
      fetchSessions();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la séance',
        variant: 'destructive',
      });
    }
  };

  const formatSessionData = (sessions: CourseSession[]) => {
    return sessions.map(session => {
      const teacherName = session.teacher?.user ? 
        `${session.teacher.user.firstName} ${session.teacher.user.lastName}` : 
        "Enseignant inconnu";
      
      return {
        id: session.id,
        date: format(new Date(session.date), 'dd/MM/yyyy'),
        time: `${session.startTime} - ${session.endTime}`,
        class: session.class.name,
        course: session.course.name,
        teacher: teacherName,
        status: session.status,
        // ... other fields
      };
    });
  };

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des séances de cours</h1>
        <Button onClick={handleAddSession}>Ajouter une séance</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Select
                value={filters.classId || ''}
                onValueChange={(value) => handleFilterChange('classId', value || undefined)}
              >
                <SelectTrigger id="filter-class">
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les classes</SelectItem>
                  {classes.map((classe) => (
                    <SelectItem key={classe.id} value={classe.id}>
                      {classe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filters.courseId || ''}
                onValueChange={(value) => handleFilterChange('courseId', value || undefined)}
              >
                <SelectTrigger id="filter-course">
                  <SelectValue placeholder="Matière" />
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
                value={filters.teacherId || ''}
                onValueChange={(value) => handleFilterChange('teacherId', value || undefined)}
              >
                <SelectTrigger id="filter-teacher">
                  <SelectValue placeholder="Professeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les professeurs</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value || undefined)}
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="PLANNED">Planifiée</SelectItem>
                  <SelectItem value="ONGOING">En cours</SelectItem>
                  <SelectItem value="COMPLETED">Terminée</SelectItem>
                  <SelectItem value="CANCELED">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {filters.date ? (
                      format(filters.date, 'dd/MM/yyyy')
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.date || undefined}
                    onSelect={(date) => handleFilterChange('date', date)}
                    locale={fr}
                  />
                  {filters.date && (
                    <div className="p-2 border-t flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFilterChange('date', null)}
                      >
                        Effacer
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              Réinitialiser
            </Button>
            <Button onClick={handleApplyFilters}>Appliquer les filtres</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Horaires</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Enseignant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">Chargement...</TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">Aucune séance trouvée</TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{format(new Date(session.date), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                    <TableCell>{formatTime(session.startTime)} - {formatTime(session.endTime)}</TableCell>
                    <TableCell>{session.class?.name || 'N/A'}</TableCell>
                    <TableCell>{session.course?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {session.teacher ? `${session.teacher.firstName} ${session.teacher.lastName}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const { className, label } = getStatusBadge(session.status);
                        return <span className={className}>{label}</span>;
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSession(session)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isFormOpen && (
        <CourseSessionForm
          session={selectedSession || undefined}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          classes={classes}
          courses={courses}
          teachers={teachers}
        />
      )}
    </div>
  );
} 