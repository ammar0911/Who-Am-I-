import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  COLLECTIONS,
  Office,
  OfficeDoc,
  OfficeDTO,
  Sensor,
  SensorDoc,
  SensorDTO,
  User,
  UserDoc,
  UserDTO,
  WorkingBlock,
  WorkingBlockDoc,
  WorkingBlockDTO,
} from '../types';
import convertFirebaseTimestampsToDate from './convertFirebaseTimestampsToDate';
import { db } from './firebase';
import mapUserDocToDTO from './mapUserDocToDto';
import mapWorkingBlockDocToDto from './mapWorkingBlockDocToDto';
import mapSensorDocToDTO from './mapSensorDocToDto';
import mapOfficeDocToDTO from './mapOfficeDocToDto';

export const userApi = {
  async getById(id: string): Promise<UserDTO | null> {
    try {
      const docRef = doc(db, COLLECTIONS.USER, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...convertFirebaseTimestampsToDate(docSnap.data()),
        } as UserDoc;

        return mapUserDocToDTO(data);
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async getByEmail(email: string): Promise<UserDTO | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.USER),
        where('email', '==', email),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const userDoc = {
          id: doc.id,
          ...convertFirebaseTimestampsToDate(doc.data()),
        } as UserDoc;

        return mapUserDocToDTO(userDoc);
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  async getAll(): Promise<UserDTO[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.USER));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertFirebaseTimestampsToDate(doc.data()),
      })) as UserDoc[];

      return data.map(mapUserDocToDTO);
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  async create(userData: Omit<User, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.USER), userData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async update(id: string, userData: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USER, id);
      await updateDoc(docRef, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

export const workingBlockApi = {
  async getByUserId(userId: string): Promise<WorkingBlockDTO[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.WORKING_BLOCK),
        where('user_id', '==', userId),
        orderBy('start_ms', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertFirebaseTimestampsToDate(doc.data()),
      })) as WorkingBlockDoc[];

      return data.map(mapWorkingBlockDocToDto);
    } catch (error) {
      console.error('Error getting working blocks by user:', error);
      throw error;
    }
  },

  async create(workingBlockData: Omit<WorkingBlock, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, COLLECTIONS.WORKING_BLOCK),
        workingBlockData
      );
      return docRef.id;
    } catch (error) {
      console.error('Error creating working block:', error);
      throw error;
    }
  },

  async update(
    id: string,
    workingBlockData: Partial<WorkingBlock>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.WORKING_BLOCK, id);
      await updateDoc(docRef, workingBlockData);
    } catch (error) {
      console.error('Error updating working block:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.WORKING_BLOCK, id));
    } catch (error) {
      console.error('Error deleting working block:', error);
      throw error;
    }
  },
};

export const sensorApi = {
  async getById(id: string): Promise<SensorDTO | null> {
    try {
      const docRef = doc(db, COLLECTIONS.SENSOR, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...convertFirebaseTimestampsToDate(docSnap.data()),
        } as SensorDoc;

        return mapSensorDocToDTO(data);
      }
      return null;
    } catch (error) {
      console.error('Error getting sensor:', error);
      throw error;
    }
  },

  async getAll(): Promise<SensorDTO[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.SENSOR),
        orderBy('input_time', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertFirebaseTimestampsToDate(doc.data()),
      })) as SensorDoc[];

      return data.map(mapSensorDocToDTO);
    } catch (error) {
      console.error('Error getting sensors:', error);
      throw error;
    }
  },

  async create(sensorData: Omit<Sensor, 'id' | 'input_time'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.SENSOR), {
        ...sensorData,
        input_time: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating sensor:', error);
      throw error;
    }
  },

  async update(
    id: string,
    sensorData: Partial<Omit<Sensor, 'input_time'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.SENSOR, id);
      await updateDoc(docRef, sensorData);
    } catch (error) {
      console.error('Error updating sensor:', error);
      throw error;
    }
  },
};

export const officeApi = {
  async getById(id: string): Promise<OfficeDTO | null> {
    try {
      const docRef = doc(db, COLLECTIONS.OFFICE, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...convertFirebaseTimestampsToDate(docSnap.data()),
        } as OfficeDoc;

        return mapOfficeDocToDTO(data);
      }
      return null;
    } catch (error) {
      console.error('Error getting office:', error);
      throw error;
    }
  },

  async getAll(): Promise<OfficeDTO[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.OFFICE));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertFirebaseTimestampsToDate(doc.data()),
      })) as OfficeDoc[];

      return data.map(mapOfficeDocToDTO);
    } catch (error) {
      console.error('Error getting offices:', error);
      throw error;
    }
  },

  async getBySensorId(sensorId: string): Promise<OfficeDTO | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.OFFICE),
        where('sensor_id', '==', sensorId),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = {
          id: doc.id,
          ...convertFirebaseTimestampsToDate(doc.data()),
        } as OfficeDoc;

        return mapOfficeDocToDTO(data);
      }
      return null;
    } catch (error) {
      console.error('Error getting office by sensor ID:', error);
      throw error;
    }
  },

  async create(officeData: Omit<Office, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, COLLECTIONS.OFFICE),
        officeData
      );
      return docRef.id;
    } catch (error) {
      console.error('Error creating office:', error);
      throw error;
    }
  },

  async update(id: string, officeData: Partial<Office>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.OFFICE, id);
      await updateDoc(docRef, officeData);
    } catch (error) {
      console.error('Error updating office:', error);
      throw error;
    }
  },
};
