// Types and interfaces for the application
import { DocumentReference } from 'firebase/firestore';
import { ReactNode } from 'react';

// Translation types
export type ArrayTranslationKeys = 'daysOfWeek' | 'dayAbbreviations';
export type TranslationKey = keyof TranslationStrings;
export type IsArrayKey<T extends TranslationKey> =
  T extends ArrayTranslationKeys ? true : false;
export type TranslationReturn<T extends TranslationKey> =
  IsArrayKey<T> extends true ? string[] : string;

export type TranslationValue =
  | string
  | string[]
  | ((params: Record<string, string>) => string);

export interface TranslationStrings {
  appName: string;
  home: string;
  directory: string;
  login: string;
  homeTitle: string;
  homeTagline: string;
  searchPlaceholder: string;
  searchButton: string;
  currentlyAvailable: string;
  searchDirectory: string;
  available: string;
  noOneAvailable: string;
  profileNotFound: string;
  profileVisibility: string;
  contactInfo: string;
  weeklySchedule: string;
  privateProfile: string;
  goHome: string;
  profileTitle: string;
  currentStatus: string;
  profileSettings: string;
  publicAvailability: string;
  publicAvailabilityDesc: string;
  connectGoogle: string;
  weeklyAvailability: string;
  availabilityPrivate: string;
  availabilityPrivateDesc: (params: { name: string }) => string;
  loginToView: string;
  directoryTitle: string;
  searchByName: string;
  allDepartments: string;
  department: string;
  noResults: string;
  loginTitle: string;
  loginSubtitle: string;
  chooseUser: string;
  signIn: string;
  notAvailable: string;
  weekendNotice: string;
  legend: string;
  legendNotAvailableCalendar: string;
  legendLikelyAvailable: string;
  legendPossiblyAvailable: string;
  legendLikelyNotAvailable: string;
  tooltipNotAvailableCalendar: string;
  tooltipLikelyAvailable: string;
  tooltipPossiblyAvailable: string;
  tooltipLikelyNotAvailable: string;
  daysOfWeek: string[];
  dayAbbreviations: string[];
  footerText: string;
}

export enum AvailabilityStatus {
  Available = 'Available',
  NotAvailable = 'Not Available',
  Private = 'Private',
}

export type Language = 'en' | 'de';

export interface CalendarEvent {
  day: string;
  start: string;
  end: string;
}

export interface AppContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>
  ) => TranslationReturn<T>;
}

export interface AvailabilityChipProps {
  status: AvailabilityStatus;
  isPublic: boolean;
  isLoggedIn: boolean;
}

export interface WeeklyAvailabilityViewProps {
  predictedAvailability: {
    [key: string]: number[];
  };
  calendarEvents: CalendarEvent[];
}

export interface HomePageProps {
  t: <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>
  ) => TranslationReturn<T>;
  users: User[];
  currentUser: User | null;
}

export interface ProfilePageProps {
  users: User[];
  currentUser: User | null;
  updateUserVisibility: (userId: number, isPublic: boolean) => void;
  t: <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>
  ) => TranslationReturn<T>;
}

export interface SearchPageProps {
  users: User[];
  currentUser: User | null;
  t: <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>
  ) => TranslationReturn<T>;
}

export interface LoginPageProps {
  login: (userId: number) => void;
  t: <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>
  ) => TranslationReturn<T>;
}

export interface AppProviderProps {
  children: ReactNode;
}

export interface User {
  id: string | number;
  account_type: number;
  email: string;
  name: string;
  office_id: DocumentReference;
  password: string;
  pronouns: string;
  user_settings: string;

  // Not implemented yet
  title: string;
  department: string;
  avatar: string;
  isPublic: boolean;
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

  // Not implemented yet
  title: string;
  department: string;
  avatar: string;
  isPublic: boolean;
  available: AvailabilityStatus;
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

export enum AccountType {
  Admin = 'Admin',
  Maintainer = 'Maintainer',
  User = 'User',
  Guest = 'Guest',
}
