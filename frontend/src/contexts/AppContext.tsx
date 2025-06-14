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
  SENSORS_BY_OFFICE: `${API_BASE_URL}/sensors/byOfficeId`,
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
  }, [mode, language]); // Fetch all users and their related data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching users from local API route");

        // Fetch all users
        const usersResponse = await fetch(API_ENDPOINTS.USERS);
        if (!usersResponse.ok) {
          const errorText = await usersResponse.text();
          throw new Error(
            `Failed to fetch users: ${usersResponse.status} ${errorText}`
          );
        }

        const apiUsers: ApiUser[] = await usersResponse.json();
        console.log("Users fetched successfully:", apiUsers);

        // We'll make individual sensor requests for each user
        const transformedUsersPromises = apiUsers.map(async (apiUser) => {
          // Default to Not Available
          let currentStatus: "Available" | "Not Available" = "Not Available";

          // Only try to get sensor if user has an officeId
          if (apiUser.officeId) {
            try {
              const sensorResponse = await fetch(
                `${API_ENDPOINTS.SENSORS_BY_OFFICE}?officeId=${apiUser.officeId}`
              );

              if (sensorResponse.ok) {
                const sensors = await sensorResponse.json();
                console.log(
                  `User ${apiUser.name} office ${apiUser.officeId} sensors:`,
                  sensors,
                  `array length: ${sensors.length}`
                );

                // Check if sensors exist and we have at least one
                if (sensors && sensors.length > 0) {
                  const sensor = sensors[0];
                  console.log(`Sensor data for ${apiUser.name}:`, sensor);
                  if (sensor.isOpen) {
                    currentStatus = "Available";
                    console.log(
                      `Setting ${apiUser.name} to Available because sensor.isOpen is true`
                    );
                  } else {
                    console.log(
                      `Setting ${apiUser.name} to Not Available because sensor.isOpen is false`
                    );
                  }
                } else {
                  console.log(
                    `No sensors found for ${apiUser.name}'s office ${apiUser.officeId}`
                  );
                }
              } else {
                console.log(
                  `Failed to fetch sensors for ${apiUser.name}'s office ${apiUser.officeId}`
                );
              }
            } catch (error) {
              console.error(
                `Error fetching sensor for ${apiUser.name}:`,
                error
              );
            }
          } else {
            console.log(
              `User ${apiUser.name} has no officeId, setting to Not Available`
            );
          }

          // Generate an avatar if none exists
          const avatar = `https://placehold.co/100x100/E0E7FF/4F46E5?text=${apiUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")}`;

          // Use mock data for availability and calendar
          const mockPredictedAvailability = {
            Monday: [0.1, 0.1, 0.8, 0.9, 0.9, 0.2, 0.7, 0.6, 0.1, 0.1, 0.1],
            Tuesday: [0.2, 0.2, 0.3, 0.8, 0.8, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
            Wednesday: [0.1, 0.1, 0.9, 0.9, 0.9, 0.3, 0.8, 0.7, 0.1, 0.1, 0.1],
            Thursday: [0.3, 0.3, 0.2, 0.7, 0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
            Friday: [0.1, 0.1, 0.8, 0.9, 0.9, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1],
            Saturday: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
          };

          // Use empty calendar events since API endpoint is not ready
          const mockCalendarEvents = [
            { day: "Monday", start: "14:00", end: "16:00" },
            { day: "Wednesday", start: "10:00", end: "12:00" },
          ];

          // Keep the ID as is (either string or number)
          const id = apiUser.id;

          return {
            id,
            name: apiUser.name,
            title: apiUser.title,
            department: apiUser.department,
            email: apiUser.email,
            avatar,
            currentStatus,
            isPublic: true, // apiUser.isPublic,
            predictedAvailability: mockPredictedAvailability,
            calendarEvents: mockCalendarEvents,
          };
        });

        // Wait for all user transformations to complete
        const transformedUsers = await Promise.all(transformedUsersPromises);
        console.log("Transformed users with sensor data:", transformedUsers);

        setUsers(transformedUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        // Fallback to empty users array if API fails
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
      // First check if user exists in our local state
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
      const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const apiUser: ApiUser = await response.json();

      // Default to Not Available if sensor fetch fails
      let currentStatus: "Available" | "Not Available" = "Not Available";

      // Only try to get sensor status if user has an officeId
      if (apiUser.officeId) {
        const sensorResponse = await fetch(
          `${API_ENDPOINTS.SENSORS_BY_OFFICE}?officeId=${apiUser.officeId}`
        );

        if (sensorResponse.ok) {
          const sensors: ApiSensor[] = await sensorResponse.json();
          if (sensors && sensors.length > 0) {
            const userSensor = sensors[0];
            // Set status based ONLY on the sensor data
            currentStatus = userSensor.isOpen ? "Available" : "Not Available";
            console.log(
              `Login: New user ${apiUser.name}, sensor.isOpen=${userSensor.isOpen}, setting status to ${currentStatus}`
            );
          }
        }
      }

      // Use mock data for availability and calendar since API endpoints are not ready yet
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

      // Create full user object
      const fullUser: User = {
        id: apiUser.id,
        name: apiUser.name,
        title: apiUser.title,
        department: apiUser.department,
        email: apiUser.email,
        avatar: `https://placehold.co/100x100/E0E7FF/4F46E5?text=${apiUser.name
          .split(" ")
          .map((n) => n[0])
          .join("")}`,
        currentStatus: currentStatus,
        isPublic: true, //apiUser.isPublic,
        predictedAvailability: mockPredictedAvailability,
        calendarEvents: mockCalendarEvents,
      };

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

      // Then update on the backend
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

  // Function to refresh a user's status
  const refreshUserStatus = useCallback(
    async (userId: string | number) => {
      try {
        // Find the user in our local state
        const user = users.find((u) => String(u.id) === String(userId));
        if (!user) return;

        // Find the user's office ID
        const userResponse = await fetch(`${API_ENDPOINTS.USERS}/${userId}`);
        if (!userResponse.ok) return;
        const apiUser: ApiUser = await userResponse.json();

        // If user doesn't have an office, we can't check sensor status
        if (!apiUser.officeId) return;

        // Get current sensor status
        const sensorResponse = await fetch(
          `${API_ENDPOINTS.SENSORS_BY_OFFICE}?officeId=${apiUser.officeId}`
        );
        if (!sensorResponse.ok) {
          console.log(
            `Failed to fetch sensor data for user ${apiUser.name}'s office ${apiUser.officeId}`
          );
          return;
        }

        const sensors: ApiSensor[] = await sensorResponse.json();
        console.log(
          `Refreshing status: User ${apiUser.name}, received sensors:`,
          sensors,
          `array length: ${sensors.length}`
        );

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
          console.log(
            `refreshUserStatus: User ${apiUser.name} sensor.isOpen=${userSensor.isOpen}, setting status to ${newStatus}`
          );

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
    [users, currentUser]
  );

  // Set up polling to refresh current user's status
  useEffect(() => {
    if (!currentUser) return;

    // Initial refresh
    refreshUserStatus(currentUser.id);

    // Set up interval to refresh every 30 seconds
    const intervalId = setInterval(() => {
      refreshUserStatus(currentUser.id);
    }, 30000);

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
