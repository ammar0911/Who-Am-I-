"use client";
import React, { useContext, useState } from "react";
import { Search } from "@mui/icons-material";
import Image from "next/image";
import { AppContext } from "../../../contexts/AppContext";
import { AvailabilityChip } from "../../../components/AvailabilityChip";
import dynamic from "next/dynamic";

// Dynamically import Material-UI components
const FormControl = dynamic(
  () => import("@mui/material").then((mod) => mod.FormControl),
  { ssr: false }
);
const InputLabel = dynamic(
  () => import("@mui/material").then((mod) => mod.InputLabel),
  { ssr: false }
);
const Select = dynamic(
  () => import("@mui/material").then((mod) => mod.Select),
  { ssr: false }
);
const MenuItem = dynamic(
  () => import("@mui/material").then((mod) => mod.MenuItem),
  { ssr: false }
);

export default function SearchPage() {
  const { users, currentUser, navigate, pageData, t } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState<string>(
    (pageData?.query as string) || ""
  );
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  // Early return if context is not yet available
  if (!t || !users) {
    return null; // Or a loading state
  }

  // Set initial department filter after we know t is available
  if (departmentFilter === "") {
    setDepartmentFilter(t("allDepartments"));
  }

  const departments = [
    t("allDepartments"),
    ...new Set(users.map((user) => user.department)),
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === t("allDepartments") ||
      user.department === departmentFilter;

    return (
      (user.isPublic || !!currentUser) && matchesSearch && matchesDepartment
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t("directoryTitle")}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              placeholder={t("searchByName")}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <FormControl className="min-w-[200px]">
            <InputLabel>{t("department")}</InputLabel>
            <Select
              value={departmentFilter}
              label={t("department")}
              onChange={(e) => setDepartmentFilter(e.target.value as string)}>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((person) => (
            <div
              key={person.id}
              onClick={() => navigate("profile", { userId: person.id })}
              className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  width={48}
                  height={48}
                  src={person.avatar}
                  alt={person.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {person.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {person.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {person.department}
                  </p>
                </div>
              </div>
              <AvailabilityChip
                status={person.currentStatus}
                isPublic={person.isPublic}
                isLoggedIn={!!currentUser}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">{t("noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
