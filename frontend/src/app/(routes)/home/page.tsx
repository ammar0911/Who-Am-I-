"use client";
import React, { useContext, useRef } from "react";
import { Search } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/contexts/AppContext";
import { AvailabilityChip } from "@/components/AvailabilityChip";

export default function HomePage() {
  const { users, t } = useContext(AppContext);
  const router = useRouter();
  const searchInput = useRef<HTMLInputElement>(null);

  // Early return if context is not yet available
  if (!t || !users) {
    return null; // Or a loading state
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.current) {
      router.push(
        `/search?query=${encodeURIComponent(searchInput.current.value)}`
      );
    }
  };

  // Filter for currently available users
  const availableUsers = users.filter(
    (user) => user.currentStatus === "Available" && user.isPublic
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="py-20 text-center bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            {t("homeTitle")}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            {t("homeTagline")}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit}>
            <div className="mt-8 flex justify-center">
              <div className="relative rounded-md shadow-sm w-full max-w-lg flex-1">
                <input
                  ref={searchInput}
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
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
      </div>

      <div className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {t("currentlyAvailable")}
        </h2>
        {availableUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableUsers.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    width={48}
                    height={48}
                    src={user.avatar}
                    alt={user.name}
                    className="h-16 w-16 rounded-full"
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
              </Link>
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
