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
  DBOffice,
  OfficeDoc,
  OfficeDTO,
  Sensor,
  SensorDoc,
  SensorDTO,
  SensorInputDoc,
  DBUser,
  UserDoc,
  UserDTO,
  WorkingBlock,
  WorkingBlockDoc,
  WorkingBlockDTO,
} from '@/types';
import convertFirebaseTimestampsToDate from './convertFirebaseTimestampsToDate';
import { db } from './firebase';
import mapUserDocToDTO from './mapUserDocToDto';
import mapWorkingBlockDocToDto from './mapWorkingBlockDocToDto';
import mapSensorDocToDTO from './mapSensorDocToDto';
import mapOfficeDocToDTO from './mapOfficeDocToDto';
import { SensorInputDTO } from '@/hooks/api/requests';
import pick from 'lodash/pick';
import pickPropertiesIfDefined from './pickPropertiesIfDefined';

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

        let officeData = null;

        // Get office data for user
        if (data.office_id) {
          const officeDoc = await officeApi.getById(data.office_id.id);
          if (!officeDoc) {
            throw new Error(
              `Office with ID ${data.office_id.id} does not exist`,
            );
          }
          officeData = officeDoc;
        }

        return mapUserDocToDTO(data, {
          office: officeData,
        });
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
        limit(1),
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

      return data.map((user) => mapUserDocToDTO(user));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  async create(userData: Omit<DBUser, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.USER), userData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async update(id: string, userData: Partial<DBUser>): Promise<void> {
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
        orderBy('start_ms', 'desc'),
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
        workingBlockData,
      );
      return docRef.id;
    } catch (error) {
      console.error('Error creating working block:', error);
      throw error;
    }
  },

  async update(
    id: string,
    workingBlockData: Partial<WorkingBlock>,
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

      if (!docSnap.exists()) {
        return null;
      }
      const data = {
        id: docSnap.id,
        ...convertFirebaseTimestampsToDate(docSnap.data()),
      } as SensorDoc;

      // Find latest sensor input by sensor ID
      const sensorInputQuery = query(
        collection(db, COLLECTIONS.SENSOR_INPUT),
        where('sensor_id', '==', docRef),
        orderBy('input_time', 'desc'),
        limit(1),
      );
      const sensorInputSnap = await getDocs(sensorInputQuery);

      if (sensorInputSnap.empty) {
        return mapSensorDocToDTO(data, null);
      }

      const sensorInputData = sensorInputSnap.docs[0].data();
      const sensorInputDoc = {
        id: sensorInputSnap.docs[0].id,
        ...convertFirebaseTimestampsToDate(sensorInputData),
      } as SensorInputDoc;

      return mapSensorDocToDTO(data, sensorInputDoc);
    } catch (error) {
      console.error('Error getting sensor:', error);
      throw error;
    }
  },

  async getByOfficeId(officeId: string): Promise<SensorDTO | null> {
    try {
      const docRef = doc(db, COLLECTIONS.OFFICE, officeId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Office with ID ${officeId} does not exist`);
      }

      const data = {
        id: docSnap.id,
        ...convertFirebaseTimestampsToDate(docSnap.data()),
      } as OfficeDoc;

      return await sensorApi.getById(data.sensor_id?.id);
    } catch (error) {
      console.error('Error getting sensors by office ID:', error);
      throw error;
    }
  },

  async getAll(): Promise<SensorDTO[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.SENSOR));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertFirebaseTimestampsToDate(doc.data()),
      })) as SensorDoc[];
      // Fetch latest sensor input for each sensor
      const sensorInputs = await Promise.all(
        data.map(async (sensor) => {
          const sensorInputQuery = query(
            collection(db, COLLECTIONS.SENSOR_INPUT),
            where('sensor_id', '==', doc(db, COLLECTIONS.SENSOR, sensor.id)),
            orderBy('input_time', 'desc'),
            limit(1),
          );
          const sensorInputSnap = await getDocs(sensorInputQuery);
          if (!sensorInputSnap.empty) {
            const sensorInputData = sensorInputSnap.docs[0].data();
            return {
              id: sensorInputSnap.docs[0].id,
              ...convertFirebaseTimestampsToDate(sensorInputData),
            } as SensorInputDoc;
          }
          return null;
        }),
      );

      // Map sensor data to DTOs with latest input
      return data.map((sensor, index) => {
        const sensorInput = sensorInputs[index];
        return mapSensorDocToDTO(sensor, sensorInput);
      });
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

  async update(id: string, sensorData: SensorDTO): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.SENSOR, id);
      await updateDoc(docRef, sensorData);
    } catch (error) {
      console.error('Error updating sensor:', error);
      throw error;
    }
  },

  async addSensorInput(
    sensorInputData: Omit<SensorInputDTO, 'id'>,
  ): Promise<void> {
    try {
      const sensorDocRef = doc(
        db,
        COLLECTIONS.SENSOR,
        sensorInputData.sensorId,
      );
      await addDoc(collection(db, COLLECTIONS.SENSOR_INPUT), {
        sensor_id: sensorDocRef,
        input_time: serverTimestamp(),
        is_open: sensorInputData.isOpen,
        battery_status: sensorInputData.batteryStatus,
      });
    } catch (error) {
      console.error('Error adding sensor input:', error);
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

        if (!data.sensor_id) {
          return mapOfficeDocToDTO(data);
        }

        let sensor = await sensorApi.getById(data.sensor_id?.id);

        if (!sensor) {
          sensor = null;
          console.error(`Sensor with ID ${data.sensor_id?.id} does not exist`);
          return mapOfficeDocToDTO(data);
        }

        const dataWithSensor = { sensor, ...data };

        return mapOfficeDocToDTO(dataWithSensor);
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

      const allSensors = await sensorApi.getAll();
      const sensorMap = new Map(allSensors.map((s) => [s.id, s]));
      const dataWithSensors = data.map((office) => {
        const sensor = sensorMap.get(office.sensor_id?.id);
        return {
          ...office,
          sensor: sensor || null,
        };
      });

      return dataWithSensors.map(mapOfficeDocToDTO);
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
        limit(1),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = {
          id: doc.id,
          ...convertFirebaseTimestampsToDate(doc.data()),
        } as OfficeDoc;

        const sensor = await sensorApi.getById(sensorId);
        if (!sensor) {
          throw new Error(`Sensor with ID ${data.sensor_id} does not exist`);
        }
        const dataWithSensor = { sensor, ...data };

        return mapOfficeDocToDTO(dataWithSensor);
      }
      return null;
    } catch (error) {
      console.error('Error getting office by sensor ID:', error);
      throw error;
    }
  },

  async create(officeData: Omit<OfficeDTO, 'id'>): Promise<string> {
    try {
      let newOffice: Partial<DBOffice> = {
        ...officeData,
      };

      if (officeData.sensorId) {
        const sensorDocRef = doc(db, COLLECTIONS.SENSOR, officeData.sensorId);
        const docSnap = await getDoc(sensorDocRef);
        if (!docSnap.exists()) {
          throw new Error(
            `Sensor with ID ${officeData.sensorId} does not exist`,
          );
        }

        newOffice.sensor_id = sensorDocRef;
      }

      const docRef = await addDoc(
        collection(db, COLLECTIONS.OFFICE),
        pickPropertiesIfDefined(newOffice, ['name', 'sensor_id']),
      );
      return docRef.id;
    } catch (error) {
      console.error('Error creating office:', error);
      throw error;
    }
  },

  async update(id: string, officeData: Partial<OfficeDTO>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.OFFICE, id);

      let newOffice: Partial<DBOffice> = {
        ...officeData,
      };

      if (officeData.sensorId) {
        const sensorDocRef = doc(db, COLLECTIONS.SENSOR, officeData.sensorId);
        const docSnap = await getDoc(sensorDocRef);
        if (!docSnap.exists()) {
          throw new Error(
            `Sensor with ID ${officeData.sensorId} does not exist`,
          );
        }

        newOffice.sensor_id = sensorDocRef;
      }

      await updateDoc(
        docRef,
        pickPropertiesIfDefined(newOffice, ['name', 'sensor_id']),
      );
    } catch (error) {
      console.error('Error updating office:', error);
      throw error;
    }
  },
};
