import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  
  // Si le format est déjà HH:MM, le retourner tel quel
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    return timeString;
  }
  
  // Si le format est HH:MM:SS, supprimer les secondes
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    return timeString.substring(0, 5);
  }
  
  // Sinon, essayer de parser comme date et formater
  try {
    const date = new Date(`2000-01-01T${timeString}`);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } catch (error) {
    console.error('Erreur lors du formatage de l\'heure:', error);
    return timeString;
  }
}

export function getStatusBadge(status: string) {
  let bgColor = '';
  let textColor = '';
  let label = '';
  
  switch (status) {
    case 'PLANNED':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      label = 'Planifiée';
      break;
    case 'ONGOING':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = 'En cours';
      break;
    case 'COMPLETED':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Terminée';
      break;
    case 'CANCELED':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'Annulée';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = status;
  }
  
  return {
    className: `px-2 py-1 rounded-full text-xs ${bgColor} ${textColor}`,
    label
  };
} 