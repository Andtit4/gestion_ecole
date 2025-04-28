import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer les créneaux horaires s'ils n'existent pas déjà
  const timeSlots = [
    { id: '1', dayOfWeek: 'MONDAY', startTime: new Date('2023-01-01T08:00:00'), endTime: new Date('2023-01-01T09:00:00') },
    { id: '2', dayOfWeek: 'MONDAY', startTime: new Date('2023-01-01T09:00:00'), endTime: new Date('2023-01-01T10:00:00') },
    { id: '3', dayOfWeek: 'MONDAY', startTime: new Date('2023-01-01T10:00:00'), endTime: new Date('2023-01-01T11:00:00') },
    { id: '4', dayOfWeek: 'MONDAY', startTime: new Date('2023-01-01T11:00:00'), endTime: new Date('2023-01-01T12:00:00') },
    { id: '5', dayOfWeek: 'MONDAY', startTime: new Date('2023-01-01T13:00:00'), endTime: new Date('2023-01-01T14:00:00') },
    { id: '6', dayOfWeek: 'MONDAY', startTime: new Date('2023-01-01T14:00:00'), endTime: new Date('2023-01-01T15:00:00') },
    { id: '7', dayOfWeek: 'MONDAY', startTime: new Date('2023-01-01T15:00:00'), endTime: new Date('2023-01-01T16:00:00') },
    { id: '8', dayOfWeek: 'MONDAY', startTime: new Date('2023-01-01T16:00:00'), endTime: new Date('2023-01-01T17:00:00') },
    
    { id: '9', dayOfWeek: 'TUESDAY', startTime: new Date('2023-01-01T08:00:00'), endTime: new Date('2023-01-01T09:00:00') },
    { id: '10', dayOfWeek: 'TUESDAY', startTime: new Date('2023-01-01T09:00:00'), endTime: new Date('2023-01-01T10:00:00') },
    { id: '11', dayOfWeek: 'TUESDAY', startTime: new Date('2023-01-01T10:00:00'), endTime: new Date('2023-01-01T11:00:00') },
    { id: '12', dayOfWeek: 'TUESDAY', startTime: new Date('2023-01-01T11:00:00'), endTime: new Date('2023-01-01T12:00:00') },
    { id: '13', dayOfWeek: 'TUESDAY', startTime: new Date('2023-01-01T13:00:00'), endTime: new Date('2023-01-01T14:00:00') },
    { id: '14', dayOfWeek: 'TUESDAY', startTime: new Date('2023-01-01T14:00:00'), endTime: new Date('2023-01-01T15:00:00') },
    { id: '15', dayOfWeek: 'TUESDAY', startTime: new Date('2023-01-01T15:00:00'), endTime: new Date('2023-01-01T16:00:00') },
    { id: '16', dayOfWeek: 'TUESDAY', startTime: new Date('2023-01-01T16:00:00'), endTime: new Date('2023-01-01T17:00:00') },
    
    { id: '17', dayOfWeek: 'WEDNESDAY', startTime: new Date('2023-01-01T08:00:00'), endTime: new Date('2023-01-01T09:00:00') },
    { id: '18', dayOfWeek: 'WEDNESDAY', startTime: new Date('2023-01-01T09:00:00'), endTime: new Date('2023-01-01T10:00:00') },
    { id: '19', dayOfWeek: 'WEDNESDAY', startTime: new Date('2023-01-01T10:00:00'), endTime: new Date('2023-01-01T11:00:00') },
    { id: '20', dayOfWeek: 'WEDNESDAY', startTime: new Date('2023-01-01T11:00:00'), endTime: new Date('2023-01-01T12:00:00') },
    { id: '21', dayOfWeek: 'WEDNESDAY', startTime: new Date('2023-01-01T13:00:00'), endTime: new Date('2023-01-01T14:00:00') },
    { id: '22', dayOfWeek: 'WEDNESDAY', startTime: new Date('2023-01-01T14:00:00'), endTime: new Date('2023-01-01T15:00:00') },
    { id: '23', dayOfWeek: 'WEDNESDAY', startTime: new Date('2023-01-01T15:00:00'), endTime: new Date('2023-01-01T16:00:00') },
    { id: '24', dayOfWeek: 'WEDNESDAY', startTime: new Date('2023-01-01T16:00:00'), endTime: new Date('2023-01-01T17:00:00') },
    
    { id: '25', dayOfWeek: 'THURSDAY', startTime: new Date('2023-01-01T08:00:00'), endTime: new Date('2023-01-01T09:00:00') },
    { id: '26', dayOfWeek: 'THURSDAY', startTime: new Date('2023-01-01T09:00:00'), endTime: new Date('2023-01-01T10:00:00') },
    { id: '27', dayOfWeek: 'THURSDAY', startTime: new Date('2023-01-01T10:00:00'), endTime: new Date('2023-01-01T11:00:00') },
    { id: '28', dayOfWeek: 'THURSDAY', startTime: new Date('2023-01-01T11:00:00'), endTime: new Date('2023-01-01T12:00:00') },
    { id: '29', dayOfWeek: 'THURSDAY', startTime: new Date('2023-01-01T13:00:00'), endTime: new Date('2023-01-01T14:00:00') },
    { id: '30', dayOfWeek: 'THURSDAY', startTime: new Date('2023-01-01T14:00:00'), endTime: new Date('2023-01-01T15:00:00') },
    { id: '31', dayOfWeek: 'THURSDAY', startTime: new Date('2023-01-01T15:00:00'), endTime: new Date('2023-01-01T16:00:00') },
    { id: '32', dayOfWeek: 'THURSDAY', startTime: new Date('2023-01-01T16:00:00'), endTime: new Date('2023-01-01T17:00:00') },
    
    { id: '33', dayOfWeek: 'FRIDAY', startTime: new Date('2023-01-01T08:00:00'), endTime: new Date('2023-01-01T09:00:00') },
    { id: '34', dayOfWeek: 'FRIDAY', startTime: new Date('2023-01-01T09:00:00'), endTime: new Date('2023-01-01T10:00:00') },
    { id: '35', dayOfWeek: 'FRIDAY', startTime: new Date('2023-01-01T10:00:00'), endTime: new Date('2023-01-01T11:00:00') },
    { id: '36', dayOfWeek: 'FRIDAY', startTime: new Date('2023-01-01T11:00:00'), endTime: new Date('2023-01-01T12:00:00') },
    { id: '37', dayOfWeek: 'FRIDAY', startTime: new Date('2023-01-01T13:00:00'), endTime: new Date('2023-01-01T14:00:00') },
    { id: '38', dayOfWeek: 'FRIDAY', startTime: new Date('2023-01-01T14:00:00'), endTime: new Date('2023-01-01T15:00:00') },
    { id: '39', dayOfWeek: 'FRIDAY', startTime: new Date('2023-01-01T15:00:00'), endTime: new Date('2023-01-01T16:00:00') },
    { id: '40', dayOfWeek: 'FRIDAY', startTime: new Date('2023-01-01T16:00:00'), endTime: new Date('2023-01-01T17:00:00') },
  ]

  console.log('Création des créneaux horaires...')
  
  for (const slot of timeSlots) {
    const existingTimeSlot = await prisma.timeslot.findFirst({
      where: { 
        dayOfWeek: slot.dayOfWeek as any,
        startTime: slot.startTime,
        endTime: slot.endTime
      }
    })
    
    if (!existingTimeSlot) {
      await prisma.timeslot.create({
        data: {
          id: slot.id,
          dayOfWeek: slot.dayOfWeek as any,
          startTime: slot.startTime,
          endTime: slot.endTime
        }
      })
      console.log(`Créneau créé: ${slot.dayOfWeek} ${slot.startTime.toTimeString()} - ${slot.endTime.toTimeString()}`)
    } else {
      console.log(`Créneau existant: ${slot.dayOfWeek} ${slot.startTime.toTimeString()} - ${slot.endTime.toTimeString()}`)
    }
  }
  
  console.log('Seeding terminé!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 