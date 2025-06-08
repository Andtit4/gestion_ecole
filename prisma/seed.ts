import { PrismaClient, Role, GradeType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Création d'un utilisateur admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'System',
      password: await bcrypt.hash('admin123', 10),
      role: Role.ADMIN,
    },
  })

  // Création d'un professeur
  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      password: await bcrypt.hash('teacher123', 10),
      role: Role.TEACHER,
      Teacher: {
        create: {
          subjects: {
            create: [
              { name: 'Mathématiques' },
              { name: 'Physique' }
            ]
          }
        },
      },
    },
  })

  // Création d'une classe
  const class1 = await prisma.class.create({
    data: {
      name: '6ème A',
      level: 'Collège',
    },
  })

  // Création d'un étudiant
  const student1 = await prisma.student.create({
    data: {
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie@example.com',
      birthDate: new Date('2010-01-01'),
      classId: class1.id,
    },
  })

  // Création d'un cours
  const course1 = await prisma.course.create({
    data: {
      name: 'Mathématiques',
      coefficient: 2.0,
      level: 'Collège',
      teacherId: (await prisma.teacher.findFirst())!.id,
      classId: class1.id,
    },
  })

  // Création d'une note
  await prisma.grade.create({
    data: {
      value: 15.5,
      type: GradeType.NORMAL,
      date: new Date(),
      comment: 'Excellent travail',
      studentId: student1.id,
      courseId: course1.id,
      teacherId: (await prisma.teacher.findFirst())!.id,
    },
  })

  console.log('Base de données initialisée avec succès')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 


