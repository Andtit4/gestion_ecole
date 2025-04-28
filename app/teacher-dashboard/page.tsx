'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

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
}

interface Class {
  id: string;
  name: string;
  level: string;
  studentsCount: number;
}

interface Course {
  id: string;
  name: string;
  level: string;
}

export default function TeacherDashboardPage() {
  const { data: session } = useSession();
  const [upcomingSessions, setUpcomingSessions] = useState<CourseSession[]>([]);
  const [myClasses, setMyClasses] = useState<Class[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserInfo(session.user.id);
      fetchTeacherData(session.user.id);
    }
  }, [session]);

  const fetchUserInfo = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserName({
          firstName: userData.firstName || '',
          lastName: userData.lastName || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
    }
  };

  const fetchTeacherData = async (teacherId: string) => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchUpcomingSessions(teacherId),
        fetchClasses(teacherId),
        fetchCourses(teacherId),
      ]);
    } catch (error) {
      toast.error('Impossible de charger les données du professeur');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingSessions = async (teacherId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/course-sessions?teacherId=${teacherId}&startDate=${today}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des séances');
      const data = await response.json();
      setUpcomingSessions(data.slice(0, 5)); // Prendre les 5 premières séances à venir
    } catch (error) {
      console.error('Erreur lors de la récupération des séances:', error);
    }
  };

  const fetchClasses = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/teachers/${teacherId}/classes`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des classes');
      const data = await response.json();
      setMyClasses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
    }
  };

  const fetchCourses = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/courses?teacherId=${teacherId}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des matières');
      const data = await response.json();
      setMyCourses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800';
      case 'ONGOING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'Planifiée';
      case 'ONGOING':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELED':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

  if (session.user.role !== 'TEACHER') {
    return (
      <div className="container mx-auto py-6">
        <p>Cette page est réservée aux professeurs.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        Tableau de bord Professeur {userName.firstName} {userName.lastName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mes classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{myClasses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mes matières</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{myCourses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Prochaines séances</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcomingSessions.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sessions">Prochaines séances</TabsTrigger>
          <TabsTrigger value="classes">Mes classes</TabsTrigger>
          <TabsTrigger value="courses">Mes matières</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Prochaines séances de cours</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Chargement...</p>
              ) : upcomingSessions.length === 0 ? (
                <p>Aucune séance prévue prochainement.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {session.course.name} - {session.class.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(session.date), 'EEEE d MMMM yyyy', { locale: fr })}
                          </p>
                          <p className="text-sm">
                            {session.startTime} - {session.endTime}
                          </p>
                        </div>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}
                        >
                          {getStatusLabel(session.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end mt-4">
                    <Button asChild>
                      <Link href="/course-sessions">Voir toutes les séances</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Mes classes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Chargement...</p>
              ) : myClasses.length === 0 ? (
                <p>Vous n'êtes responsable d'aucune classe pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {myClasses.map((cls) => (
                    <div key={cls.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{cls.name}</h3>
                          <p className="text-sm text-gray-500">Niveau: {cls.level}</p>
                          <p className="text-sm">{cls.studentsCount} élèves</p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/classes/${cls.id}`}>Détails</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Mes matières</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Chargement...</p>
              ) : myCourses.length === 0 ? (
                <p>Vous n'enseignez aucune matière pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {myCourses.map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{course.name}</h3>
                          <p className="text-sm text-gray-500">Niveau: {course.level}</p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/courses/${course.id}`}>Détails</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 