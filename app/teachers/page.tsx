'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface FormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function TeachersPage() {
  const { data: session } = useSession();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/teachers${searchQuery ? `?search=${searchQuery}` : ''}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des professeurs');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      toast.error('Impossible de charger les professeurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers();
  };

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    setIsFormOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      id: teacher.id,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      password: '', // Mot de passe vide pour l'édition
    });
    setIsFormOpen(true);
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTeacher) return;

    try {
      const response = await fetch(`/api/teachers?id=${selectedTeacher.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression du professeur');

      toast.success('Le professeur a été supprimé');
      fetchTeachers();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Impossible de supprimer le professeur');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.email || (!formData.id && !formData.password)) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const url = formData.id ? `/api/teachers` : '/api/teachers';
      const method = formData.id ? 'PUT' : 'POST';
      
      // Ne pas envoyer le mot de passe s'il est vide lors d'une modification
      const payload = formData.id && !formData.password 
        ? { 
            id: formData.id, 
            firstName: formData.firstName, 
            lastName: formData.lastName, 
            email: formData.email,
            role: 'TEACHER'
          }
        : {
            ...formData,
            role: 'TEACHER'
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'enregistrement du professeur');
      }

      toast.success(`Le professeur a été ${formData.id ? 'modifié' : 'ajouté'} avec succès`);
      fetchTeachers();
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible d\'enregistrer le professeur');
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Professeurs</h1>
        <Button onClick={handleAddTeacher}>Ajouter un professeur</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rechercher des professeurs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Rechercher par nom, prénom ou email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Rechercher</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucun professeur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.lastName}</TableCell>
                    <TableCell>{teacher.firstName}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      {format(new Date(teacher.createdAt), 'PPP', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTeacher(teacher)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher)}
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

      {/* Formulaire d'ajout/modification d'un professeur */}
      {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white border-2 shadow-lg backdrop-blur-none">
            <DialogHeader className="border-b pb-4 mb-2">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {selectedTeacher ? 'Modifier un professeur' : 'Ajouter un professeur'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4 my-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                    className="border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                    className="border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  {selectedTeacher
                    ? 'Mot de passe (laisser vide pour ne pas modifier)'
                    : 'Mot de passe'}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required={!selectedTeacher}
                  className="border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <DialogFooter className="mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="mr-2">
                  Annuler
                </Button>
                <Button type="submit" className="font-medium">
                  {selectedTeacher ? 'Modifier' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialogue de confirmation de suppression */}
      {isDeleteDialogOpen && selectedTeacher && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Êtes-vous sûr de vouloir supprimer le professeur{' '}
                <strong>
                  {selectedTeacher.firstName} {selectedTeacher.lastName}
                </strong>
                ? Cette action est irréversible.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 


