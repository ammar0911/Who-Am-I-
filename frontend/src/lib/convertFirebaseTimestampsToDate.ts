// Helper function to convert Firestore timestamps to JavaScript Date objects

import { Timestamp } from 'firebase/firestore';

/**
 * Converts Firestore Timestamp objects to JavaScript Date objects in the given data.
 * @param data - The data object containing Firestore Timestamp fields.
 * @returns A new object with all Timestamp fields converted to Date objects.
 */
const convertFirebaseTimestampsToDate = (data: Record<string, unknown>) => {
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = new Date(converted[key].toMillis());
    }
  });
  return converted;
};

export default convertFirebaseTimestampsToDate;
