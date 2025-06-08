import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Nettoyer les données existantes dans l'ordre correct
  console.log('🧹 Nettoyage des données existantes...')
  await prisma.grade.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.course.deleteMany()
  await prisma.parentstudent.deleteMany()
  await prisma.student.deleteMany()
  await prisma.parent.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.renamedclass.deleteMany()
  await prisma.user.deleteMany()

  // Hasher les mots de passe
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 12)
  const hashedPasswordUser = await bcrypt.hash('password123', 12)

  // Créer un utilisateur administrateur
  console.log('👤 Création de l\'administrateur...')
  await prisma.user.create({
    data: {
      email: 'admin@ecole.fr',
      password: hashedPasswordAdmin,
      firstName: 'Admin',
      lastName: 'Système',
      role: 'ADMIN',
    },
  })

  // Créer des utilisateurs enseignants
  console.log('👩‍🏫 Création des enseignants...')
  const teacher1User = await prisma.user.create({
    data: {
      email: 'marie.dupont@ecole.fr',
      password: hashedPasswordUser,
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'TEACHER',
    },
  })

  const teacher2User = await prisma.user.create({
    data: {
      email: 'jean.martin@ecole.fr',
      password: hashedPasswordUser,
      firstName: 'Jean',
      lastName: 'Martin',  
      role: 'TEACHER',
    },
  })

  // Créer les enseignants
  const teacher1 = await prisma.teacher.create({
    data: {
      userId: teacher1User.id,
    },
  })

  const teacher2 = await prisma.teacher.create({
    data: {
      userId: teacher2User.id,
    },
  })

  // Créer des classes
  console.log('🏫 Création des classes...')
  const class6eme = await prisma.renamedclass.create({
    data: {
      name: '6ème A',
      level: 'SIXIEME',
      year: 2024,
      teacherId: teacher1.id,
    },
  })

  const class5eme = await prisma.renamedclass.create({
    data: {
      name: '5ème B',
      level: 'CINQUIEME',
      year: 2024,
      teacherId: teacher2.id,
    },
  })

  // Créer des utilisateurs parents
  console.log('👨‍👩‍👧‍👦 Création des parents...')
  const parent1User = await prisma.user.create({
    data: {
      email: 'sophie.bernard@email.fr',
      password: hashedPasswordUser,
      firstName: 'Sophie',
      lastName: 'Bernard',
      role: 'PARENT',
    },
  })

  const parent2User = await prisma.user.create({
    data: {
      email: 'pierre.durand@email.fr',
      password: hashedPasswordUser,
      firstName: 'Pierre',
      lastName: 'Durand',
      role: 'PARENT',
    },
  })

  // Créer les parents
  const parent1 = await prisma.parent.create({
    data: {
      userId: parent1User.id,
    },
  })

  const parent2 = await prisma.parent.create({
    data: {
      userId: parent2User.id,
    },
  })

  // Créer des utilisateurs étudiants
  console.log('🎓 Création des étudiants...')
  const student1User = await prisma.user.create({
    data: {
      email: 'lucas.bernard@ecole.fr',
      password: hashedPasswordUser,
      firstName: 'Lucas',
      lastName: 'Bernard',
      role: 'STUDENT',
    },
  })

  const student2User = await prisma.user.create({
    data: {
      email: 'emma.durand@ecole.fr',
      password: hashedPasswordUser,
      firstName: 'Emma',
      lastName: 'Durand',
      role: 'STUDENT',
    },
  })

  // Créer les étudiants
  const student1 = await prisma.student.create({
    data: {
      userId: student1User.id,
      classId: class6eme.id,
    },
  })

  const student2 = await prisma.student.create({
    data: {
      userId: student2User.id,
      classId: class5eme.id,
    },
  })

  // Créer les relations parent-étudiant
  console.log('🔗 Création des relations parent-étudiant...')
  await prisma.parentstudent.create({
    data: {
      studentId: student1.id,
      parentId: parent1.id,
    },
  })

  await prisma.parentstudent.create({
    data: {
      studentId: student2.id,
      parentId: parent2.id,
    },
  })

  // Créer des cours
  console.log('📚 Création des cours...')
  const mathCourse = await prisma.course.create({
    data: {
      name: 'Mathématiques',
      description: 'Cours de mathématiques niveau collège',
      coefficient: 3.0,
      level: 'SIXIEME',
      teacherId: teacher1.id,
    },
  })

  const frenchCourse = await prisma.course.create({
    data: {
      name: 'Français',
      description: 'Cours de français niveau collège',
      coefficient: 4.0,
      level: 'CINQUIEME',
      teacherId: teacher2.id,
    },
  })

  // Créer des notes
  console.log('📋 Création des notes...')
  await prisma.grade.create({
    data: {
      value: 16.5,
      type: 'HOMEWORK',
      date: new Date(),
      coefficient: 1.0,
      comment: 'Très bon travail en géométrie',
      studentId: student1.id,
      courseId: mathCourse.id,
      teacherId: teacher1.id,
    },
  })

  await prisma.grade.create({
    data: {
      value: 14.0,
      type: 'QUIZ',
      date: new Date(),
      coefficient: 1.0,
      comment: 'Bonne expression écrite',
      studentId: student2.id,
      courseId: frenchCourse.id,
      teacherId: teacher2.id,
    },
  })

  // Créer des présences
  console.log('📅 Création des présences...')
  await prisma.attendance.create({
    data: {
      date: new Date(),
      status: 'PRESENT',
      studentId: student1.id,
      userId: teacher1User.id,
    },
  })

  await prisma.attendance.create({
    data: {
      date: new Date(),
      status: 'PRESENT',
      studentId: student2.id,
      userId: teacher2User.id,
    },
  })

  console.log('✅ Seeding terminé avec succès!')
  console.log('🔑 Comptes créés:')
  console.log('   Admin: admin@ecole.fr / admin123')
  console.log('   Enseignant: marie.dupont@ecole.fr / password123')
  console.log('   Enseignant: jean.martin@ecole.fr / password123')
  console.log('   Parent: sophie.bernard@email.fr / password123')
  console.log('   Parent: pierre.durand@email.fr / password123')
  console.log('   Étudiant: lucas.bernard@ecole.fr / password123')
  console.log('   Étudiant: emma.durand@ecole.fr / password123')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 


