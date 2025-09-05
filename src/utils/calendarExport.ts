import { Trip, Activity } from '../types';

export function generateICSFile(trip: Trip): string {
  const lines: string[] = [];
  
  // ICS header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Travel Genie//Travel Itinerary//EN');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  
  // Add events for each activity
  trip.itinerary.forEach(day => {
    day.activities.forEach(activity => {
      const event = createEventFromActivity(activity, day.date, trip.destination);
      lines.push(...event);
    });
  });
  
  // ICS footer
  lines.push('END:VCALENDAR');
  
  return lines.join('\r\n');
}

function createEventFromActivity(activity: Activity, date: string, destination: string): string[] {
  const lines: string[] = [];
  
  // Parse time and create start/end times
  const { startTime, endTime } = parseActivityTime(activity.time, activity.duration);
  const startDateTime = formatDateTime(date, startTime);
  const endDateTime = formatDateTime(date, endTime);
  
  // Generate unique ID
  const uid = `${activity.id}-${date}@travelgenie.com`;
  
  lines.push('BEGIN:VEVENT');
  lines.push(`UID:${uid}`);
  lines.push(`DTSTART:${startDateTime}`);
  lines.push(`DTEND:${endDateTime}`);
  lines.push(`SUMMARY:${escapeICSText(activity.name)}`);
  lines.push(`LOCATION:${escapeICSText(`${activity.neighborhood}, ${destination}`)}`);
  
  // Create description with details
  const description = [
    activity.description,
    `Duration: ${activity.duration}`,
    `Cost: ${activity.cost}`,
    activity.travelNote ? `Travel: ${activity.travelNote}` : ''
  ].filter(Boolean).join('\\n');
  
  lines.push(`DESCRIPTION:${escapeICSText(description)}`);
  lines.push(`CATEGORIES:${activity.type}`);
  lines.push(`CREATED:${formatDateTime(new Date().toISOString().split('T')[0], '00:00')}`);
  lines.push('END:VEVENT');
  
  return lines;
}

function parseActivityTime(timeStr: string, duration: string): { startTime: string; endTime: string } {
  // Parse time like "9:00 AM" or "2:30 PM"
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!timeMatch) {
    return { startTime: '09:00', endTime: '11:00' }; // Default fallback
  }
  
  let hours = parseInt(timeMatch[1]);
  const minutes = parseInt(timeMatch[2]);
  const period = timeMatch[3].toUpperCase();
  
  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  // Parse duration and calculate end time
  const durationMatch = duration.match(/(\d+)/);
  const durationMinutes = durationMatch ? parseInt(durationMatch[1]) * 60 : 120; // Default 2 hours
  
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + durationMinutes;
  const endHours = Math.floor(endMinutes / 60) % 24;
  const endMins = endMinutes % 60;
  
  const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  
  return { startTime, endTime };
}

function formatDateTime(date: string, time: string): string {
  // Convert YYYY-MM-DD and HH:MM to YYYYMMDDTHHMMSS format
  const dateOnly = date.replace(/-/g, '');
  const timeOnly = time.replace(':', '');
  return `${dateOnly}T${timeOnly}00`;
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

export function downloadICSFile(trip: Trip): void {
  const icsContent = generateICSFile(trip);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  // Generate filename like "paris-2025-10-12.ics"
  const destination = trip.destination.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const startDate = trip.startDate;
  const filename = `${destination}-${startDate}.ics`;
  
  // Create download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(link.href);
}