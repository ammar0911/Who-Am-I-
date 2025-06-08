// Types and interfaces for the application

import { ReactNode } from 'react';

// Translation types
export type ArrayTranslationKeys = 'daysOfWeek' | 'dayAbbreviations';
export type TranslationKey = keyof TranslationStrings;
export type IsArrayKey<T extends TranslationKey> = T extends ArrayTranslationKeys ? true : false;
export type TranslationReturn<T extends TranslationKey> = IsArrayKey<T> extends true ? string[] : string;

export type TranslationValue = string | string[] | ((params: Record<string, string>) => string);

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

export type AvailabilityStatus = 'Available' | 'Not Available' | 'Private';
export type Language = 'en' | 'de';

export interface User {
    id: number;
    name: string;
    title: string;
    department: string;
    email: string;
    avatar: string;
    currentStatus: AvailabilityStatus;
    isPublic: boolean;
    predictedAvailability: {
        [key: string]: number[];
    };
    calendarEvents: CalendarEvent[];
}

export interface CalendarEvent {
    day: string;
    start: string;
    end: string;
}

export interface AppContextType {
    currentUser: User | null;
    users: User[];
    login: (userId: number) => void;
    logout: () => void;
    navigate: (page: string, data?: Record<string, unknown> | null) => void;
    updateUserVisibility: (userId: number, isPublic: boolean) => void;
    page: string;
    pageData: Record<string, unknown> | null;
    mode: 'light' | 'dark';
    toggleTheme: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    t: <T extends TranslationKey>(key: T, params?: Record<string, string>) => TranslationReturn<T>;
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
    navigate: (page: string, data?: Record<string, unknown> | null) => void;
    t: <T extends TranslationKey>(key: T, params?: Record<string, string>) => TranslationReturn<T>;
    users: User[];
    currentUser: User | null;
}

export interface ProfilePageProps {
    users: User[];
    currentUser: User | null;
    pageData: Record<string, unknown> | null;
    updateUserVisibility: (userId: number, isPublic: boolean) => void;
    navigate: (page: string, data?: Record<string, unknown> | null) => void;
    t: <T extends TranslationKey>(key: T, params?: Record<string, string>) => TranslationReturn<T>;
}

export interface SearchPageProps {
    users: User[];
    currentUser: User | null;
    navigate: (page: string, data?: Record<string, unknown> | null) => void;
    pageData: Record<string, unknown> | null;
    t: <T extends TranslationKey>(key: T, params?: Record<string, string>) => TranslationReturn<T>;
}

export interface LoginPageProps {
    login: (userId: number) => void;
    t: <T extends TranslationKey>(key: T, params?: Record<string, string>) => TranslationReturn<T>;
}

export interface AppProviderProps {
    children: ReactNode;
}
