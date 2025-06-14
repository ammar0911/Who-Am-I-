"use client";
import React, { useState } from "react";
import Link from "next/link";

// Define more specific types for API responses
interface ApiStatus {
  [key: string]: {
    status: "pending" | "loading" | "success" | "error";
    data: Record<string, unknown> | Array<Record<string, unknown>> | null;
    error?: string;
  };
}

export default function ApiDebugPage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    users: { status: "pending", data: null },
    userById: { status: "pending", data: null },
    sensors: { status: "pending", data: null },
  });

  const [userId, setUserId] = useState<string>("");

  const checkApiEndpoint = async (endpoint: string, key: string) => {
    try {
      setApiStatus((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: "loading" },
      }));

      const response = await fetch(endpoint);
      const data = await response.json();

      setApiStatus((prev) => ({
        ...prev,
        [key]: { status: "success", data },
      }));

      return data;
    } catch (error) {
      setApiStatus((prev) => ({
        ...prev,
        [key]: {
          status: "error",
          data: null,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    }
  };

  const checkUserById = async () => {
    if (!userId) return;
    await checkApiEndpoint(`/api/users/${userId}`, "userById");
  };

  const runFullDiagnostic = async () => {
    const users = await checkApiEndpoint("/api/users", "users");
    await checkApiEndpoint("/api/sensors", "sensors");

    if (users && Array.isArray(users) && users.length > 0) {
      setUserId(String(users[0].id));
      await checkApiEndpoint(`/api/users/${users[0].id}`, "userById");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">API Diagnostic Tool</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={runFullDiagnostic}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded">
          Run Full Diagnostic
        </button>
        <Link
          href="/api-test"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded">
          Go to API Test Page
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users API Check */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">All Users Endpoint</h2>
            <button
              onClick={() => checkApiEndpoint("/api/users", "users")}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded">
              Test
            </button>
          </div>
          <div className="text-sm mb-2">
            <span className="font-medium">Endpoint:</span> /api/users
          </div>
          <div className="text-sm mb-4">
            <span className="font-medium">Status:</span>
            <span
              className={`ml-2 ${
                apiStatus.users.status === "success"
                  ? "text-green-600"
                  : apiStatus.users.status === "error"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}>
              {apiStatus.users.status}
            </span>
          </div>
          {apiStatus.users.error && (
            <div className="text-red-600 text-sm mb-4">
              Error: {apiStatus.users.error}
            </div>
          )}
          {apiStatus.users.data && (
            <div className="mt-4">
              <div className="font-medium mb-2">Response:</div>
              <div className="max-h-60 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm">
                <pre>{JSON.stringify(apiStatus.users.data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* User by ID API Check */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">User by ID Endpoint</h2>
            <button
              onClick={checkUserById}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
              disabled={!userId}>
              Test
            </button>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="text-sm mb-2">
            <span className="font-medium">Endpoint:</span> /api/users/
            {userId || "[userId]"}
          </div>
          <div className="text-sm mb-4">
            <span className="font-medium">Status:</span>
            <span
              className={`ml-2 ${
                apiStatus.userById.status === "success"
                  ? "text-green-600"
                  : apiStatus.userById.status === "error"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}>
              {apiStatus.userById.status}
            </span>
          </div>
          {apiStatus.userById.error && (
            <div className="text-red-600 text-sm mb-4">
              Error: {apiStatus.userById.error}
            </div>
          )}
          {apiStatus.userById.data && (
            <div className="mt-4">
              <div className="font-medium mb-2">Response:</div>
              <div className="max-h-60 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm">
                <pre>{JSON.stringify(apiStatus.userById.data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Sensors API Check */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Sensors Endpoint</h2>
            <button
              onClick={() => checkApiEndpoint("/api/sensors", "sensors")}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded">
              Test
            </button>
          </div>
          <div className="text-sm mb-2">
            <span className="font-medium">Endpoint:</span> /api/sensors
          </div>
          <div className="text-sm mb-4">
            <span className="font-medium">Status:</span>
            <span
              className={`ml-2 ${
                apiStatus.sensors.status === "success"
                  ? "text-green-600"
                  : apiStatus.sensors.status === "error"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}>
              {apiStatus.sensors.status}
            </span>
          </div>
          {apiStatus.sensors.error && (
            <div className="text-red-600 text-sm mb-4">
              Error: {apiStatus.sensors.error}
            </div>
          )}
          {apiStatus.sensors.data && (
            <div className="mt-4">
              <div className="font-medium mb-2">Response:</div>
              <div className="max-h-60 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm">
                <pre>{JSON.stringify(apiStatus.sensors.data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
