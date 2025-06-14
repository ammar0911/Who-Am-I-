"use client";
import React, { useContext } from "react";
import { Settings, CalendarMonth, AccessTime } from "@mui/icons-material";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppContext } from "@/contexts/AppContext";
import { AvailabilityChip } from "@/components/AvailabilityChip";
import { WeeklyAvailabilityView } from "@/components/WeeklyAvailabilityView";
import LoginIcon from "@mui/icons-material/Login";
import dynamic from "next/dynamic";

// Dynamically import Material-UI components
const Switch = dynamic(
  () => import("@mui/material").then((mod) => mod.Switch),
  {
    ssr: false,
  }
);
const Button = dynamic(
  () => import("@mui/material").then((mod) => mod.Button),
  {
    ssr: false,
  }
);

export default function ProfilePage() {
  const { users, currentUser, updateUserVisibility, t } =
    useContext(AppContext);
  const params = useParams();

  // Early return if context is not yet available
  if (!t) {
    return null; // Or a loading state
  }

  // Extract userId from params without conversion to number
  const userId = params?.userId || null;
  console.log(
    "Profile page - userId from params:",
    userId,
    "type:",
    typeof userId
  );
  console.log("Profile page - available users:", users);
  console.log("Profile page - current user:", currentUser);

  // Find the user by matching the ID
  const user = users?.find((u) => String(u.id) === String(userId));
  console.log("Profile page - found user:", user);

  // Additional debugging to check all user IDs and their types
  if (users?.length > 0) {
    console.log(
      "User ID types in users array:",
      users.map((u) => ({ id: u.id, type: typeof u.id }))
    );
  }

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

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
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
                  status={user.currentStatus}
                  isPublic={user.isPublic}
                  isLoggedIn={!!currentUser}
                />
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                {t("profileSettings")}
              </h3>
              <div className="space-y-4">
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
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CalendarMonth />}>
                  {t("connectGoogle")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {canView ? (
            <WeeklyAvailabilityView
              predictedAvailability={user.predictedAvailability}
              calendarEvents={user.calendarEvents}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
              <AccessTime className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
                {t("availabilityPrivate")}
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {t("availabilityPrivateDesc", {
                  name: user.name.split(" ").slice(1).join(" "),
                })}
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                <LoginIcon className="w-4 h-4 mr-2" /> {t("loginToView")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
