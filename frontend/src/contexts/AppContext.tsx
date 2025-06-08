"use client";
import React, { createContext, useState, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { AppContextType, User, Language, TranslationStrings } from "../types";
import { translations } from "../app/translations";

const getDesignTokens = (mode: "light" | "dark") => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#4f46e5" },
          background: { paper: "#ffffff", default: "#f9fafb" },
        }
      : {
          primary: { main: "#818cf8" },
          background: { paper: "#1f2937", default: "#111827" },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export const AppContext = createContext<AppContextType>({} as AppContextType);

export interface AppProviderProps {
  children: React.ReactNode;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Dr. Eleanor Vance",
    title: "Professor of Computer Science",
    department: "Engineering & CS",
    email: "eleanor.vance@university.edu",
    avatar: "https://placehold.co/100x100/E0E7FF/4F46E5?text=EV",
    currentStatus: "Available",
    isPublic: true,
    predictedAvailability: {
      Monday: [0.1, 0.1, 0.8, 0.9, 0.9, 0.2, 0.7, 0.6, 0.1, 0.1, 0.1],
      Tuesday: [0.2, 0.2, 0.3, 0.8, 0.8, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      Wednesday: [0.1, 0.1, 0.9, 0.9, 0.9, 0.3, 0.8, 0.7, 0.1, 0.1, 0.1],
      Thursday: [0.3, 0.3, 0.2, 0.7, 0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      Friday: [0.1, 0.1, 0.8, 0.9, 0.9, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1],
      Saturday: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    },
    calendarEvents: [
      { day: "Monday", start: "14:00", end: "16:00" },
      { day: "Wednesday", start: "10:00", end: "12:00" },
    ],
  },
  {
    id: 2,
    name: "Dr. Marcus Cole",
    title: "Head of History Department",
    department: "Arts & Humanities",
    email: "marcus.cole@university.edu",
    avatar: "https://placehold.co/100x100/FFE4E6/9F1239?text=MC",
    currentStatus: "Not Available",
    isPublic: false,
    predictedAvailability: {
      Monday: [0.7, 0.8, 0.2, 0.2, 0.2, 0.6, 0.6, 0.1, 0.1, 0.1, 0.1],
      Tuesday: [0.8, 0.9, 0.1, 0.1, 0.1, 0.8, 0.8, 0.1, 0.1, 0.1, 0.1],
      Wednesday: [0.7, 0.8, 0.1, 0.1, 0.1, 0.5, 0.5, 0.1, 0.1, 0.1, 0.1],
      Thursday: [0.9, 0.9, 0.1, 0.1, 0.1, 0.9, 0.9, 0.1, 0.1, 0.1, 0.1],
      Friday: [0.6, 0.7, 0.2, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      Saturday: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    },
    calendarEvents: [
      { day: "Tuesday", start: "09:00", end: "11:00" },
      { day: "Thursday", start: "14:00", end: "15:00" },
    ],
  },
  {
    id: 3,
    name: "Dr. Lena Petrova",
    title: "Senior Lecturer in Physics",
    department: "Sciences",
    email: "lena.petrova@university.edu",
    avatar: "https://placehold.co/100x100/D1FAE5/065F46?text=LP",
    currentStatus: "Available",
    isPublic: true,
    predictedAvailability: {
      Monday: [0.9, 0.9, 0.9, 0.2, 0.2, 0.8, 0.8, 0.8, 0.1, 0.1, 0.1],
      Tuesday: [0.1, 0.1, 0.1, 0.8, 0.8, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      Wednesday: [0.9, 0.9, 0.9, 0.1, 0.1, 0.7, 0.7, 0.7, 0.1, 0.1, 0.1],
      Thursday: [0.1, 0.1, 0.1, 0.9, 0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      Friday: [0.8, 0.8, 0.8, 0.2, 0.2, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1],
      Saturday: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    },
    calendarEvents: [],
  },
];

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setMode(savedTheme);
    }
  }, []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [page, setPage] = useState<string>("home");
  const [pageData, setPageData] = useState<Record<string, unknown> | null>(
    null
  );
  const [language, setLanguage] = useState<Language>("en");

  const theme = createTheme(getDesignTokens(mode));

  useEffect(() => {
    document.documentElement.className = mode;
    document.documentElement.lang = language;
  }, [mode, language]);

  // Translation type helpers
  type ArrayTranslationKeys = "daysOfWeek" | "dayAbbreviations";
  type TranslationKey = keyof TranslationStrings;
  type IsArrayKey<T extends TranslationKey> = T extends ArrayTranslationKeys
    ? true
    : false;
  type TranslationReturn<T extends TranslationKey> = IsArrayKey<T> extends true
    ? string[]
    : string;

  const t = <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>
  ): TranslationReturn<T> => {
    const value = translations[language][key] || translations["en"][key];

    if (typeof value === "function" && params && params.name) {
      return value({ name: params.name }) as TranslationReturn<T>;
    }

    if (Array.isArray(value)) {
      return value as TranslationReturn<T>;
    }

    if (typeof value === "string") {
      return value as TranslationReturn<T>;
    }

    return String(value) as TranslationReturn<T>;
  };

  const navigate = (
    newPage: string,
    data: Record<string, unknown> | null = null
  ) => {
    setPage(newPage);
    setPageData(data);
  };

  const login = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      navigate("profile", { userId: user.id });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigate("home");
  };

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newMode);
      return newMode;
    });
  };

  const updateUserVisibility = (userId: number, isPublic: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isPublic } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, isPublic } : null));
    }
  };

  const value: AppContextType = {
    currentUser,
    users,
    login,
    logout,
    navigate,
    updateUserVisibility,
    page,
    pageData,
    mode,
    toggleTheme,
    language,
    setLanguage,
    t,
  };

  return (
    <AppContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};
