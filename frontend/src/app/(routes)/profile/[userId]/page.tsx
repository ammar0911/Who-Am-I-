"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Settings, CalendarMonth, AccessTime } from "@mui/icons-material";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppContext } from "@/contexts/AppContext";
import { AvailabilityChip } from "@/components/AvailabilityChip";
import { WeeklyAvailabilityView } from "@/components/WeeklyAvailabilityView";
import LoginIcon from "@mui/icons-material/Login";
import { AvailabilityStatus, CalendarEvent, WorkingBlockDTO } from "@/types";
import CalendarSelection from "@/components/CalendarSelection";
import { Switch, Button } from "@mui/material";

export default function ProfilePage() {
  const { users, currentUser, updateUserVisibility, t } =
    useContext(AppContext);
  const params = useParams();

  // State management
  const [isConnectedToGoogle, setIsConnectedToGoogle] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const [availableCalendars, setAvailableCalendars] = useState<
    Array<{ id: string; summary: string }>
  >([]);
  const [isLoadingCalendars, setIsLoadingCalendars] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const userId = params?.userId || null;

  // Find the user by matching the ID
  const user = users?.find((u) => String(u.id) === String(userId));

  // Function to fetch available calendars
  const fetchAvailableCalendars = useCallback(async () => {
    if (!userId) return;

    setIsLoadingCalendars(true);
    try {
      const response = await fetch(`/api/users/${userId}/calendar`);
      if (!response.ok) {
        throw new Error(`Failed to fetch calendars: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        const calendars = data.items.map(
          (cal: { id: string; summary?: string }) => ({
            id: cal.id,
            summary: cal.summary || "Unnamed Calendar",
          })
        );

        setAvailableCalendars(calendars);
      }
    } catch (error) {
      console.error("Error fetching calendars:", error);
    } finally {
      setIsLoadingCalendars(false);
    }
  }, [userId]);

  // Function to fetch user's calendar settings
  const fetchUserCalendarSettings = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch user settings: ${response.statusText}`
        );
      }

      const userData = await response.json();
      if (userData.userSettings) {
        try {
          const settings = JSON.parse(userData.userSettings);

          if (settings.googleAuth?.accessToken) {
            setIsConnectedToGoogle(true);
            fetchAvailableCalendars();
          }

          if (
            settings.selectedCalendars &&
            Array.isArray(settings.selectedCalendars)
          ) {
            setSelectedCalendarIds(settings.selectedCalendars);
          }
        } catch (e) {
          console.error("Error parsing user settings:", e);
        }
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }
  }, [userId, fetchAvailableCalendars]);

  // Function to save selected calendars
  const saveSelectedCalendars = useCallback(async () => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${userId}/calendar/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ calendarIds: selectedCalendarIds }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to save calendar settings: ${response.statusText}`
        );
      }

      // Show success notification or feedback
      console.log("Calendar settings saved successfully");
    } catch (error) {
      console.error("Error saving calendar settings:", error);
    } finally {
      setIsSaving(false);
    }
  }, [userId, selectedCalendarIds]);

  useEffect(() => {
    if (userId) {
      const fetchWorkingBlocks = async () => {
        try {
          const response = await fetch(`/api/users/${userId}/workingBlock`);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch working blocks: ${response.statusText}`
            );
          }

          const workingBlocks = await response.json();

          if (!workingBlocks || workingBlocks.length === 0) {
            console.log("No working blocks found for this user");
            setCalendarEvents([]);
            return;
          }

          const events: CalendarEvent[] = workingBlocks.map(
            (block: WorkingBlockDTO) => {
              const startDate = new Date(block.startMs);
              const endDate = new Date(block.startMs + block.durationMs);

              const days = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              const day = days[block.weekDay];

              const formatTime = (date: Date) => {
                return date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
              };

              return {
                day,
                start: formatTime(startDate),
                end: formatTime(endDate),
              };
            }
          );

          setCalendarEvents(events);
        } catch (error) {
          console.error("Error fetching working blocks:", error);
          setCalendarEvents([]);
        }
      };

      fetchWorkingBlocks();
      fetchUserCalendarSettings();
    }
  }, [userId, fetchUserCalendarSettings]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleConnectStatus = urlParams.get("google_connect");

    if (googleConnectStatus === "success") {
      setIsConnectedToGoogle(true);
      // Remove query parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("google_connect");
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );

      fetchAvailableCalendars();
    }
  }, [fetchAvailableCalendars]);

  if (!t) {
    return null; // Loading state
  }

  // Connect to Google Calendar
  const connectGoogleCalendar = async () => {
    try {
      // Pass the current user ID to the Google OAuth endpoint
      const response = await fetch(`/api/auth/google?userId=${userId}`);
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to get authentication URL");
      }

      // Open popup for OAuth flow
      const popup = window.open(
        data.url,
        "google-auth",
        "width=600,height=700"
      );

      // Listen for message from popup
      window.addEventListener(
        "message",
        (event) => {
          if (event.origin !== window.location.origin) {
            return;
          }

          const { status, error } = event.data;

          if (status === "success") {
            console.log("Google Calendar connected successfully!");
            setIsConnectedToGoogle(true);
            fetchAvailableCalendars();

            if (popup) popup.close();
          } else {
            console.error("Authentication failed:", error);
            if (popup) popup.close();
          }
        },
        { once: true }
      );
    } catch (error) {
      console.error("Error initiating Google Calendar connection:", error);
    }
  };

  const disconnectGoogleCalendar = async () => {
    // Implementation for disconnecting from Google Calendar
    if (!userId) return;

    try {
      // This would need an API endpoint to remove Google tokens from user settings
      // For now, we'll just update the UI state
      setIsConnectedToGoogle(false);
      setAvailableCalendars([]);
      setSelectedCalendarIds([]);

      // TODO: Add API call to remove Google tokens from user settings
      console.log("Disconnected from Google Calendar");
    } catch (error) {
      console.error("Error disconnecting from Google Calendar:", error);
    }
  };

  const onCalendarSelectionChange = (selectedIds: string[]) => {
    setSelectedCalendarIds(selectedIds);
  };

  if (!users || !user) {
    return (
      <div className="text-center p-10 dark:text-gray-200">
        {t("profileNotFound")}
        <Link href="/" className="text-indigo-600 hover:underline">
          {t("goHome")}
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && String(currentUser.id) === String(user.id);
  const canView = user.isPublic || !!currentUser;

  // JSX for the calendar selection UI
  const calendarSelectionUI = (
    <div className="mt-4 p-4 border rounded-lg dark:border-gray-700">
      <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
        Select Calendars
      </h4>
      {isLoadingCalendars ? (
        <p className="text-sm text-gray-500">Loading calendars...</p>
      ) : (
        <>
          <CalendarSelection
            availableCalendars={availableCalendars}
            selectedCalendarIds={selectedCalendarIds}
            onCalendarSelectionChange={onCalendarSelectionChange}
          />
          <Button
            variant="contained"
            color="primary"
            className="mt-3"
            fullWidth
            disabled={isSaving}
            onClick={saveSelectedCalendars}
          >
            {isSaving ? "Saving..." : "Save Calendar Selection"}
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* User profile card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
            <Image
              width={64}
              height={64}
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full mb-4 mx-auto"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.title}</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                {user.department}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {t("currentStatus")}
              </h3>
              <div className="flex justify-center">
                <AvailabilityChip
                  status={AvailabilityStatus.Available}
                  isPublic={user.isPublic}
                  isLoggedIn={!!currentUser}
                />
              </div>
            </div>
          </div>

          {/* Settings section (only for profile owner) */}
          {isOwner && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                {t("profileSettings")}
              </h3>
              <div className="space-y-4">
                {/* Public availability toggle */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                      {t("publicAvailability")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("publicAvailabilityDesc")}
                    </p>
                  </div>
                  <Switch
                    checked={user.isPublic}
                    onChange={(e) =>
                      updateUserVisibility(String(user.id), e.target.checked)
                    }
                  />
                </div>

                {/* Google Calendar integration */}
                {isConnectedToGoogle ? (
                  <>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<CalendarMonth />}
                      onClick={disconnectGoogleCalendar}
                    >
                      Disconnect Google Calendar
                    </Button>
                    {calendarSelectionUI}
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CalendarMonth />}
                    onClick={connectGoogleCalendar}
                  >
                    {t("connectGoogle")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Calendar/availability view */}
        <div className="lg:col-span-2 space-y-6">
          {canView ? (
            <WeeklyAvailabilityView
              predictedAvailability={{}}
              calendarEvents={calendarEvents}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
              <AccessTime className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
                {t("availabilityPrivate")}
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {t("availabilityPrivateDesc", {
                  name: user.name.split(" ")[0],
                })}
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LoginIcon className="w-4 h-4 mr-2" /> {t("loginToView")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
