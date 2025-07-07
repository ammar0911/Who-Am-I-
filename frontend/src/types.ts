// Types and interfaces for the application
import { DocumentReference } from 'firebase/firestore';
import { ReactNode } from 'react';
import {
  AvailabilityStatus,
  AccountType,
  UserDTO,
  OfficeDTO,
  SensorDTO,
  SensorInputDTO,
  WorkingBlockDTO,
  WorkingBlockSource,
} from './hooks/api/requests';

export type {
  AvailabilityStatus,
  AccountType,
  UserDTO,
  OfficeDTO,
  SensorDTO,
  SensorInputDTO,
  WorkingBlockDTO,
};
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
  disconnectGoogle: string;
  selectCalendars: string;
  loadingCalendars: string;
  noCalendarsAvailable: string;
  saveCalendarSelection: string;
  saving: string;
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
  legendLikelyNotAvailable: string;
  tooltipNotAvailableCalendar: string;
  tooltipLikelyAvailable: string;
  tooltipPossiblyAvailable: string;
  tooltipLikelyNotAvailable: string;
  daysOfWeek: string[];
  dayAbbreviations: string[];
  footerText: string;

  // Admin Panel
  adminPanel: string;
  adminPanelDescription: string;
  userManagement: string;
  officeManagement: string;
  sensorManagement: string;
  addOffice: string;
  editUser: string;
  editOffice: string;
  name: string;
  email: string;
  title: string;
  accountType: string;
  office: string;
  status: string;
  actions: string;
  sensor: string;
  users: string;
  batteryStatus: string;
  lastUpdated: string;
  notAssigned: string;
  public: string;
  private: string;
  save: string;
  cancel: string;
  updateUserDetails: string;
  updateOfficeDetails: string;
  newOfficeDetails: string;
  officeName: string;
  userId: string;
  noUserSelected: string;
  officeNameRequired: string;
  userUpdated: string;
  officeUpdated: string;
  officeCreated: string;
  failedToUpdateUser: string;
  failedToSaveOffice: string;
  loading: string;
  tryAgain: string;
  returnToHome: string;
  accessDenied: string;
  noPermission: string;
  noOfficesAvailable: string;
  noOfficeAssigned: string;
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
    params?: Record<string, string>,
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
    params?: Record<string, string>,
  ) => TranslationReturn<T>;
  users: DBUser[];
  currentUser: DBUser | null;
}

export interface ProfilePageProps {
  users: DBUser[];
  currentUser: DBUser | null;
  updateUserVisibility: (userId: number, isPublic: boolean) => void;
  t: <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>,
  ) => TranslationReturn<T>;
}

export interface SearchPageProps {
  users: DBUser[];
  currentUser: DBUser | null;
  t: <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>,
  ) => TranslationReturn<T>;
}

export interface LoginPageProps {
  login: (userId: number) => void;
  t: <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>,
  ) => TranslationReturn<T>;
}

export interface AppProviderProps {
  children: ReactNode;
}

export interface DBUser {
  // Autogenerated
  email: string;
  emailVerified: boolean;
  id: string | number;
  /** File retrieved from OAuth service when creating user account */
  image: string;
  user_settings: string;

  // User input
  available?: AvailabilityStatus;
  /** File uploaded by user for their avatar */
  avatar: string;
  department: string;
  is_public: boolean;
  name: string;
  pronouns: string;
  title: string;

  // Admin-configurable
  account_type: AccountType;
  office_id: DocumentReference;
}

export interface DBWorkingBlock {
  availability: AvailabilityStatus;
  end_time: Date;
  start_time: Date;
  source: WorkingBlockSource;
  user_id: DocumentReference;
}

export interface Sensor {
  name: string;
}

export interface DBOffice {
  name: string;
  sensor_id: DocumentReference;
}

export interface DBSensorInput {
  battery_status: number;
  input_time: Date;
  is_open: boolean;
  sensor_id: DocumentReference;
}

export interface SensorInputDoc extends DBSensorInput {
  id: string;
}

export interface UserDoc extends DBUser {
  id: string;
}

export interface WorkingBlockDoc extends DBWorkingBlock {
  id: string;
}

export interface SensorDoc extends Sensor {
  id: string;
}

export interface OfficeDoc extends DBOffice {
  id: string;
}

// Collection names as constants
export const COLLECTIONS = {
  USER: 'users',
  WORKING_BLOCK: 'working_block',
  SENSOR: 'sensor',
  OFFICE: 'office',
  SENSOR_INPUT: 'sensor_input',
} as const;
