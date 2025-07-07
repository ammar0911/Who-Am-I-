import retrieveAndSaveGoogleCalendarEvents from '@/webhooks/retrieveAndSaveGoogleCalendarEvents';

export const POST = async () => {
  try {
    await retrieveAndSaveGoogleCalendarEvents();

    return new Response('Google Calendar events retrieved successfully', {
      status: 200,
    });
  } catch (error) {
    console.error('Error retrieving Google Calendar events:', error);
    return new Response('Failed to retrieve Google Calendar events', {
      status: 500,
    });
  }
};
