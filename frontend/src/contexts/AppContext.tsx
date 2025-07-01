"use client";
import React, { createContext, useState, useEffect, useCallback } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { AppContextType, User, Language, TranslationStrings } from "../types";
import { translations } from "../app/translations";

// API interfaces
interface ApiUser {
  id: string | number;
  name: string;
  title: string;
  department: string;
  email: string;
  officeId: number;
  isPublic: boolean;
}

interface ApiSensor {
  id: string | number;
  batteryStatus?: number;
  inputTime?: string;
  isOpen: boolean;
}

// API base URL - using local API routes to avoid CORS issues
const API_BASE_URL = "/api";

// API endpoints
const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  SENSORS: `${API_BASE_URL}/sensors`,
};

// Cache to store user and sensor data with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache TTL in milliseconds (3 seconds for live demo)
const CACHE_TTL = 3000; // Changed from 30000 for live demo

// Cache for storing API responses
const apiCache = {
  users: new Map<string, CacheEntry<ApiUser>>(),
  allUsers: null as CacheEntry<ApiUser[]> | null,
  sensors: new Map<number, CacheEntry<ApiSensor[]>>(),

  get: function <T>(
    cache: Map<string | number, CacheEntry<T>> | null,
    key: string | number
  ): T | null {
    if (!cache) return null;

    const entry = cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  },

  // Store data in cache
  set: function <T>(
    cache: Map<string | number, CacheEntry<T>> | null,
    key: string | number,
    data: T
  ): void {
    if (!cache) return;
    cache.set(key, { data, timestamp: Date.now() });
  },

  getAllUsers: function (): ApiUser[] | null {
    if (!this.allUsers) return null;

    const now = Date.now();
    if (now - this.allUsers.timestamp > CACHE_TTL) {
      this.allUsers = null;
      return null;
    }

    return this.allUsers.data;
  },
  setAllUsers: function (users: ApiUser[]): void {
    this.allUsers = { data: users, timestamp: Date.now() };
  },

  // Clear all caches
  clear: function (): void {
    this.users.clear();
    this.allUsers = null;
    this.sensors.clear();
  },
};

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

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setMode(savedTheme);
    }
  }, []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [language, setLanguage] = useState<Language>("en");

  const theme = createTheme(getDesignTokens(mode));

  useEffect(() => {
    document.documentElement.className = mode;
    document.documentElement.lang = language;
  }, [mode, language]);

  // Efficient API fetching functions
  const fetchUserById = useCallback(
    async (userId: string | number): Promise<ApiUser | null> => {
      const cachedUser = apiCache.get(apiCache.users, String(userId));
      if (cachedUser) {
        console.log(`Using cached data for user ${userId}`);
        return cachedUser;
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`);
        if (!response.ok) {
          console.error(`Failed to fetch user ${userId}: ${response.status}`);
          return null;
        }

        const user = await response.json();
        apiCache.set(apiCache.users, String(userId), user);
        return user;
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return null;
      }
    },
    []
  );

  const fetchAllUsers = useCallback(
    async (forceRefresh = false): Promise<ApiUser[]> => {
      if (!forceRefresh) {
        const cachedUsers = apiCache.getAllUsers();
        if (cachedUsers) {
          console.log("Using cached data for all users");
          return cachedUsers;
        }
      }

      try {
        console.log("Fetching all users from API");
        const response = await fetch(API_ENDPOINTS.USERS);
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const users = await response.json();
        // Store each user in cache
        users.forEach((user: ApiUser) => {
          apiCache.set(apiCache.users, String(user.id), user);
        });
        // Store all users in cache
        apiCache.setAllUsers(users);
        return users;
      } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
      }
    },
    []
  );

  const fetchSensorsByOfficeId = useCallback(
    async (officeId: number, forceRefresh = true): Promise<ApiSensor[]> => {
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedSensors = apiCache.get(apiCache.sensors, officeId);
        if (cachedSensors) {
          console.log(`Using cached sensor data for office ${officeId}`);
          return cachedSensors;
        }
      }

      try {
        const response = await fetch(
          `${API_ENDPOINTS.SENSORS}?officeId=${officeId}`
        );
        if (!response.ok) {
          console.error(
            `Failed to fetch sensors for office ${officeId}: ${response.status}`
          );
          return [];
        }

        const sensors = await response.json();
        apiCache.set(apiCache.sensors, officeId, sensors);
        return sensors;
      } catch (error) {
        console.error(`Error fetching sensors for office ${officeId}:`, error);
        return [];
      }
    },
    []
  ); // Helper to transform API user to full User object
  const transformApiUserToUser = useCallback(
    async (apiUser: ApiUser): Promise<User> => {
      // Default to Not Available
      let currentStatus: "Available" | "Not Available" = "Not Available";

      // Only fetch sensor data if user has an officeId
      if (apiUser.officeId) {
        try {
          const sensors = await fetchSensorsByOfficeId(apiUser.officeId);

          if (sensors && sensors.length > 0) {
            const sensor = sensors[0];
            currentStatus = sensor.isOpen ? "Available" : "Not Available";
            console.log(
              `User ${apiUser.name} status set to ${currentStatus} based on sensor.isOpen=${sensor.isOpen}`
            );
          } else {
            console.log(
              `No sensors found for ${apiUser.name}'s office ${apiUser.officeId}`
            );
          }
        } catch (error) {
          console.error(`Error processing sensors for ${apiUser.name}:`, error);
        }
      } else {
        console.log(
          `User ${apiUser.name} has no officeId, setting to Not Available`
        );
      }

      // Generate an avatar if none exists
      // const avatar = `https://placehold.co/100x100/E0E7FF/4F46E5?text=${apiUser.name
      //   .split(" ")
      //   .map((n) => n[0])
      //   .join("")}`;
      const avatar = `https://placehold.co/100x100/E0E7FF/4F46E5?text=LP`;

      // Use mock data for availability and calendar
      const mockPredictedAvailability = {
        Monday: [0.1, 0.1, 0.8, 0.9, 0.9, 0.2, 0.7, 0.6, 0.1, 0.1, 0.1],
        Tuesday: [0.2, 0.2, 0.3, 0.8, 0.8, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        Wednesday: [0.1, 0.1, 0.9, 0.9, 0.9, 0.3, 0.8, 0.7, 0.1, 0.1, 0.1],
        Thursday: [0.3, 0.3, 0.2, 0.7, 0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        Friday: [0.1, 0.1, 0.8, 0.9, 0.9, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1],
        Saturday: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      };

      const mockCalendarEvents = [
        { day: "Monday", start: "14:00", end: "16:00" },
        { day: "Wednesday", start: "10:00", end: "12:00" },
      ];

      return {
        id: apiUser.id,
        name: apiUser.name,
        title: "Professor of Computer Vision", // apiUser.title,
        department: "Computer Science", // apiUser.department,
        email: apiUser.email,
        avatar,
        currentStatus,
        isPublic: true, // apiUser.isPublic,
        predictedAvailability: mockPredictedAvailability,
        calendarEvents: mockCalendarEvents,
      };
    },
    [fetchSensorsByOfficeId]
  );

  // Fetch users on initial load with better efficiency
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all users
        const apiUsers = await fetchAllUsers(true); // Force refresh on initial load

        if (apiUsers.length === 0) {
          throw new Error("No users found");
        }

        const transformedUsers = await Promise.all(
          apiUsers.map(transformApiUserToUser)
        );

        setUsers(transformedUsers);
        setError(null);
      } catch (err) {
        console.error("Error loading users:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();

    // Cleanup function to clear cache when component unmounts
    return () => {
      apiCache.clear();
    };
  }, [transformApiUserToUser, fetchAllUsers]);

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

  const login = async (userId: string | number) => {
    try {
      const user = users.find((u) => String(u.id) === String(userId));
      if (user) {
        // Simply set the current user without changing their status
        console.log(
          `Login: Found existing user ${user.name} with status ${user.currentStatus}`
        );
        setCurrentUser(user);
        return;
      }

      // If not in local state, fetch from API
      const apiUser = await fetchUserById(userId);
      if (!apiUser) {
        throw new Error("Failed to fetch user");
      }

      const fullUser = await transformApiUserToUser(apiUser);

      setCurrentUser(fullUser);

      // Also update the users array if this user wasn't there before
      setUsers((prev) => {
        const exists = prev.some((u) => String(u.id) === String(fullUser.id));
        return exists ? prev : [...prev, fullUser];
      });
    } catch (err) {
      console.error("Error during login:", err);
      setError(err instanceof Error ? err.message : "Failed to login");
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserVisibility = async (
    userId: string | number,
    isPublic: boolean
  ) => {
    try {
      // First update local state
      setUsers((prev) =>
        prev.map((u) =>
          String(u.id) === String(userId) ? { ...u, isPublic } : u
        )
      );

      if (currentUser && String(currentUser.id) === String(userId)) {
        setCurrentUser((prev) => (prev ? { ...prev, isPublic } : null));
      }

      const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user visibility on server");
      }

      // Update cache
      const apiUser = await fetchUserById(userId);
      if (apiUser) {
        apiCache.set(apiCache.users, String(userId), apiUser);
      }
    } catch (err) {
      console.error("Error updating user visibility:", err);
      // Revert changes in case of error
      setUsers((prev) =>
        prev.map((u) =>
          String(u.id) === String(userId) ? { ...u, isPublic: !isPublic } : u
        )
      );

      if (currentUser && String(currentUser.id) === String(userId)) {
        setCurrentUser((prev) =>
          prev ? { ...prev, isPublic: !isPublic } : null
        );
      }

      setError(
        err instanceof Error ? err.message : "Failed to update visibility"
      );
    }
  };

  // Efficient function to refresh a user's status
  const refreshUserStatus = useCallback(
    async (userId: string | number) => {
      try {
        // Find the user in our local state
        const user = users.find((u) => String(u.id) === String(userId));
        if (!user) return;

        // Get user info with office ID
        const apiUser = await fetchUserById(userId);
        if (!apiUser || !apiUser.officeId) return;

        // Get current sensor status with forced refresh
        const sensors = await fetchSensorsByOfficeId(apiUser.officeId, true);

        // Check if we have any sensors before proceeding
        if (!sensors || sensors.length === 0) {
          console.log(
            `No sensors found for user ${apiUser.name}'s office ${apiUser.officeId}`
          );
          return;
        }

        const userSensor = sensors[0];

        // Update status in local state
        if (userSensor) {
          const newStatus = userSensor.isOpen ? "Available" : "Not Available";

          // Only update if status has changed
          if (newStatus !== user.currentStatus) {
            console.log(
              `refreshUserStatus: Updating status from ${user.currentStatus} to ${newStatus}`
            );
            setUsers((prev) =>
              prev.map((u) =>
                String(u.id) === String(userId)
                  ? { ...u, currentStatus: newStatus }
                  : u
              )
            );

            // Also update currentUser if needed
            if (currentUser && String(currentUser.id) === String(userId)) {
              setCurrentUser((prev) =>
                prev ? { ...prev, currentStatus: newStatus } : null
              );
            }
          }
        }
      } catch (err) {
        console.error("Error refreshing user status:", err);
        // Don't set error state for refresh failures
      }
    },
    [users, currentUser, fetchSensorsByOfficeId, fetchUserById]
  );

  // Set up polling to refresh current user's status
  useEffect(() => {
    if (!currentUser) return;

    // Initial refresh
    refreshUserStatus(currentUser.id);

    // Set up interval to refresh every 3 seconds for live demo
    const intervalId = setInterval(() => {
      refreshUserStatus(currentUser.id);
    }, 3000); // Changed from 30000 for live demo

    return () => clearInterval(intervalId);
  }, [currentUser, refreshUserStatus]);

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newMode);
      return newMode;
    });
  };

  const value: AppContextType = {
    currentUser,
    users,
    login,
    logout,
    updateUserVisibility,
    mode,
    toggleTheme,
    language,
    setLanguage,
    loading,
    error,
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
