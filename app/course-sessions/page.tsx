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

interface CourseSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  content: string;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
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
    firstName: string;
    lastName: string;
  };
}

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

export default function CourseSessionsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedSession, setSelectedSession] = useState<CourseSession | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    classId: '',
    courseId: '',
    teacherId: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchSessions();
    fetchClasses();
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchSessions = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.classId) queryParams.append('classId', filters.classId);
      if (filters.courseId) queryParams.append('courseId', filters.courseId);
      if (filters.teacherId) queryParams.append('teacherId', filters.teacherId);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const response = await fetch(`/api/course-sessions?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des séances');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les séances de cours',
        variant: 'destructive',
      });
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Erreur lors de la récupération des classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les classes',
        variant: 'destructive',
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Erreur lors de la récupération des matières');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les matières',
        variant: 'destructive',
      });
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers');
      if (!response.ok) throw new Error('Erreur lors de la récupération des enseignants');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les enseignants',
        variant: 'destructive',
      });
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
      startDate: '',
      endDate: '',
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select
                value={filters.classId}
                onValueChange={(value) => handleFilterChange('classId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classe) => (
                    <SelectItem key={classe.id} value={classe.id}>
                      {classe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Matière</Label>
              <Select
                value={filters.courseId}
                onValueChange={(value) => handleFilterChange('courseId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les matières" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Enseignant</Label>
              <Select
                value={filters.teacherId}
                onValueChange={(value) => handleFilterChange('teacherId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les enseignants" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNED">Planifiée</SelectItem>
                  <SelectItem value="ONGOING">En cours</SelectItem>
                  <SelectItem value="COMPLETED">Terminée</SelectItem>
                  <SelectItem value="CANCELED">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date de début</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
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
                <TableHead>Heure</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Enseignant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    {format(new Date(session.date), 'PPP', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {session.startTime} - {session.endTime}
                  </TableCell>
                  <TableCell>{session.class.name}</TableCell>
                  <TableCell>{session.course.name}</TableCell>
                  <TableCell>
                    {session.teacher.firstName} {session.teacher.lastName}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        session.status === 'PLANNED'
                          ? 'bg-blue-100 text-blue-800'
                          : session.status === 'ONGOING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : session.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {session.status === 'PLANNED'
                        ? 'Planifiée'
                        : session.status === 'ONGOING'
                        ? 'En cours'
                        : session.status === 'COMPLETED'
                        ? 'Terminée'
                        : 'Annulée'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
              ))}
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