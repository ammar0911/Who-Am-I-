"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { AppContext } from "@/contexts/AppContext";
import dynamic from "next/dynamic";

// Dynamically import Material-UI components
const Button = dynamic(
  () => import("@mui/material").then((mod) => mod.Button),
  {
    ssr: false,
  }
);

export default function LoginPage() {
  const { users, login, t } = useContext(AppContext);

  // Early return if context is not yet available
  if (!t || !users) {
    return null; // Or a loading state
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          {t("loginTitle")}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            {t("chooseUser")}
          </p>
          <div className="space-y-4">
            {users.map((user) => (
              <Button
                key={user.id}
                fullWidth
                variant="outlined"
                onClick={() => login(user.id)}
                className="!justify-start !normal-case !text-left">
                <div className="flex items-center space-x-3">
                  <Image
                    width={32}
                    height={32}
                    src={user.avatar}
                    alt={user.name}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.title}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
