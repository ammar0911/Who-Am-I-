import { workingBlockApi } from '@/lib/firestoreApi';

export const DELETE = async () => {
  try {
    // Delete all working blocks from the database
    await workingBlockApi.deleteAll();
    return new Response('All working blocks deleted successfully', {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting working blocks:', error);
    return new Response('Failed to delete working blocks', { status: 500 });
  }
};
