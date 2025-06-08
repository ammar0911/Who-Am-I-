"use client";
import React, { useContext } from "react";
import { Settings, CalendarMonth, AccessTime } from "@mui/icons-material";
import { Switch, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppContext } from "../../../contexts/AppContext";
import { AvailabilityChip } from "../../../components/AvailabilityChip";
import { WeeklyAvailabilityView } from "../../../components/WeeklyAvailabilityView";
import LoginIcon from "@mui/icons-material/Login";

export default function ProfilePage() {
  const { users, currentUser, pageData, updateUserVisibility, t } =
    useContext(AppContext);
  const router = useRouter();

  const user = users.find((u) => u.id === pageData?.userId);
  if (!user)
    return (
      <div className="text-center p-10 dark:text-gray-200">
        {t("profileNotFound")}
        <button
          onClick={() => router.push("/home")}
          className="text-indigo-600 hover:underline">
          {t("goHome")}
        </button>
      </div>
    );

  const isOwner = currentUser?.id === user.id;
  const canView = user.isPublic || !!currentUser;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
            <Image
              width={96}
              height={96}
              className="h-24 w-24 rounded-full mb-4 mx-auto"
              src={user.avatar}
              alt={user.name}
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-md text-gray-600 dark:text-gray-300">
              {user.title}
            </p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              {user.department}
            </p>
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
                      updateUserVisibility(user.id, e.target.checked)
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
              <button
                onClick={() => router.push("/login")}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                <LoginIcon className="w-4 h-4 mr-2" /> {t("loginToView")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
