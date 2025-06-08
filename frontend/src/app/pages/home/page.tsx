"use client";
import React, { useContext, useRef } from "react";
import { Search } from "@mui/icons-material";
import Image from "next/image";
import { AppContext } from "../../../contexts/AppContext";
import { AvailabilityChip } from "../../../components/AvailabilityChip";

export default function HomePage() {
  const { users, navigate, t } = useContext(AppContext);
  const searchInput = useRef<HTMLInputElement>(null);

  // Early return if context is not yet available
  if (!t || !users) {
    return null; // Or a loading state
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.current) {
      navigate("search", { query: searchInput.current.value });
    }
  };

  // Filter for currently available users
  const availableUsers = users.filter(
    (user) => user.currentStatus === "Available" && user.isPublic
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("homeTitle")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t("homeTagline")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                ref={searchInput}
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                placeholder={t("searchPlaceholder")}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              type="submit"
              className="ml-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
              {t("searchButton")}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t("currentlyAvailable")}
        </h2>
        {availableUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => navigate("profile", { userId: user.id })}
                className="cursor-pointer bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    width={48}
                    height={48}
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.title}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <AvailabilityChip
                    status={user.currentStatus}
                    isPublic={user.isPublic}
                    isLoggedIn={false}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            {t("noOneAvailable")}
          </p>
        )}
      </div>
    </div>
  );
}
