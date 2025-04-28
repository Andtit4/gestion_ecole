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

interface ScheduleEntry {
  id: string;
  timeSlotId: string;
  dayOfWeek: string;
  room: string;
  course: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
}

export default function TeacherDashboardPage() {
  const { data: session } = useSession();
  const [myClasses, setMyClasses] = useState<Class[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [mySchedule, setMySchedule] = useState<ScheduleEntry[]>([]);
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
        fetchClasses(teacherId),
        fetchCourses(teacherId),
        fetchSchedule(teacherId),
      ]);
    } catch (error) {
      toast.error('Impossible de charger les données du professeur');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedule = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/timetable/schedule?teacherId=${teacherId}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de l\'emploi du temps');
      const data = await response.json();
      setMySchedule(data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'emploi du temps:', error);
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

  const getWeekDayName = (dayOfWeek: string) => {
    switch (dayOfWeek) {
      case 'MONDAY': return 'Lundi';
      case 'TUESDAY': return 'Mardi';
      case 'WEDNESDAY': return 'Mercredi';
      case 'THURSDAY': return 'Jeudi';
      case 'FRIDAY': return 'Vendredi';
      default: return dayOfWeek;
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
            <CardTitle className="text-lg">Heures de cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mySchedule.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="schedule">Mon emploi du temps</TabsTrigger>
          <TabsTrigger value="classes">Mes classes</TabsTrigger>
          <TabsTrigger value="courses">Mes matières</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Mon emploi du temps hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Chargement...</p>
              ) : mySchedule.length === 0 ? (
                <p>Aucun cours programmé pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {mySchedule.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {entry.course.name} - {entry.class.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {getWeekDayName(entry.dayOfWeek)}
                          </p>
                          <p className="text-sm">
                            Salle: {entry.room}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end mt-4">
                    <Button asChild>
                      <Link href="/timetable">Voir l'emploi du temps complet</Link>
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