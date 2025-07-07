import { GoogleCalendarEvent, WorkingBlockDTO } from '@/types';

function mapGoogleCalendarEventToWorkingBlock(
  event: GoogleCalendarEvent,
  userId: string,
): Omit<WorkingBlockDTO, 'id'> {
  return {
    startTime: new Date(event.start.dateTime).toISOString(),
    endTime: new Date(event.end.dateTime).toISOString(),
    source: 'Calendar',
    availability: 'NotAvailable',
    userId,
    googleCalendarEventId: event.id || null,
  };
}

export default mapGoogleCalendarEventToWorkingBlock;
