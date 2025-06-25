import { DocumentReference } from 'firebase/firestore';

export interface User {
  account_type: number;
  email: string;
  name: string;
  office_id: DocumentReference;
  password: string;
  pronouns: string;
  user_settings: string;
}

export interface WorkingBlock {
  duration_ms: number;
  source: string;
  start_ms: number;
  user_id: DocumentReference;
  week_day: number;
}

export interface Sensor {
  battery_status: number;
  input_time: Date; // Firestore timestamp
  is_open: boolean;
}

export interface Office {
  name: string;
  sensor_id: DocumentReference;
}

export interface UserDoc extends User {
  id: string;
}

export interface UserDTO {
  id: string;
  accountType: number;
  email: string;
  name: string;
  officeId: string;
  password: string;
  pronouns: string;
  userSettings: string;
}

export interface WorkingBlockDoc extends WorkingBlock {
  id: string;
}

export interface WorkingBlockDTO {
  id: string;
  durationMs: number;
  source: string;
  startMs: number;
  userId: string;
  weekDay: number;
}

export interface SensorDoc extends Sensor {
  id: string;
}

export interface SensorDTO {
  id: string;
  batteryStatus: number;
  inputTime: Date;
  isOpen: boolean;
}

export interface OfficeDoc extends Office {
  id: string;
}

export interface OfficeDTO {
  id: string;
  name: string;
  sensorId: string;
}

// Collection names as constants
export const COLLECTIONS = {
  USER: 'user',
  WORKING_BLOCK: 'working_block',
  SENSOR: 'sensor',
  OFFICE: 'office',
} as const;
