"use client";
import React, { useState, useEffect } from "react";

interface Sensor {
  id: string | number;
  officeId: number;
  isOpen: boolean;
  batteryStatus?: number;
  inputTime?: string;
}

interface User {
  id: string | number;
  name: string;
  title: string;
  department: string;
  email: string;
  officeId: number;
  isPublic: boolean;
}

// Consolidated debug page with tabs for different tests
export default function ApiDebugPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "sensors" | "advanced"
  >("general");
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<
    Record<string, unknown> | Array<Record<string, unknown>> | null
  >(null);
  const [endpointUrl, setEndpointUrl] = useState<string>("/api/users");
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [refreshTimes, setRefreshTimes] = useState<
    { url: string; time: number; size: number }[]
  >([]);

  // Fetch basic data on initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data based on the refresh count
  useEffect(() => {
    const testEndpoint = async () => {
      try {
        setLoading(true);
        setError(null);
        setApiResponse(null);

        const startTime = performance.now();
        const response = await fetch(endpointUrl);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        const endTime = performance.now();

        setApiResponse(data);

        // Add to refresh times
        setRefreshTimes((prev) => [
          ...prev,
          {
            url: endpointUrl,
            time: Math.round(endTime - startTime),
            size: JSON.stringify(data).length,
          },
        ]);

        console.log(`API response from ${endpointUrl}:`, data);
      } catch (err) {
        console.error("Error testing endpoint:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (refreshCount > 0) {
      testEndpoint();
    }
  }, [refreshCount, endpointUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch sensors
      const startTime = performance.now();
      const sensorResponse = await fetch("/api/sensors");
      if (!sensorResponse.ok) {
        throw new Error(`Failed to fetch sensors: ${sensorResponse.status}`);
      }

      const sensorData = await sensorResponse.json();
      const endTime = performance.now();

      console.log("Sensors:", sensorData);
      setSensors(sensorData);

      // Add to refresh times
      setRefreshTimes((prev) => [
        ...prev,
        {
          url: "/api/sensors",
          time: Math.round(endTime - startTime),
          size: JSON.stringify(sensorData).length,
        },
      ]);

      // Fetch users
      const userStartTime = performance.now();
      const userResponse = await fetch("/api/users");
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch users: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      const userEndTime = performance.now();

      console.log("Users:", userData);
      setUsers(userData);

      // If we have users, set the first one as the selected user
      if (userData.length > 0) {
        setUserId(String(userData[0].id));
      }

      // Add to refresh times
      setRefreshTimes((prev) => [
        ...prev,
        {
          url: "/api/users",
          time: Math.round(userEndTime - userStartTime),
          size: JSON.stringify(userData).length,
        },
      ]);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Remove the duplicate testEndpoint function
  const handleUserSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newUserId = event.target.value;
    setUserId(newUserId);

    if (newUserId) {
      setEndpointUrl(`/api/users/${newUserId}`);
      setRefreshCount((prev) => prev + 1);
    }
  };

  const handleSensorsByOffice = async (officeId: number) => {
    setEndpointUrl(`/api/sensors?officeId=${officeId}`);
    setRefreshCount((prev) => prev + 1);
  };

  // Test direct external API (for comparison)
  const testDirectApi = async () => {
    try {
      setLoading(true);
      setError(null);

      const startTime = performance.now();
      const response = await fetch(
        "https://ubi-sys-lab-no-knock.vercel.app/api/users"
      );

      if (!response.ok) {
        throw new Error(
          `External API responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      const endTime = performance.now();

      setApiResponse(data);

      // Add to refresh times
      setRefreshTimes((prev) => [
        ...prev,
        {
          url: "External API - users",
          time: Math.round(endTime - startTime),
          size: JSON.stringify(data).length,
        },
      ]);

      console.log("External API response:", data);
    } catch (err) {
      console.error("Error testing external API:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear cache by forcing a refresh
  const clearApiCache = async () => {
    try {
      setLoading(true);
      setError(null);

      // Force a cache-busting request
      const timestamp = new Date().getTime();
      const response = await fetch(`${endpointUrl}?_=${timestamp}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
      console.log(`Cache cleared for ${endpointUrl}:`, data);

      // Refresh data
      fetchData();
    } catch (err) {
      console.error("Error clearing cache:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">API Debug Console</h1>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("general")}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "general"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}>
              General
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("sensors")}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "sensors"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}>
              Sensors
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("advanced")}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "advanced"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}>
              Advanced
            </button>
          </li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* General Tab */}
      {activeTab === "general" && (
        <div>
          <div className="mb-6">
            <button
              onClick={fetchData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
              disabled={loading}>
              {loading ? "Loading..." : "Refresh All Data"}
            </button>
            <button
              onClick={clearApiCache}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              disabled={loading}>
              Clear Cache
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Test Custom Endpoint</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className="border p-2 rounded flex-grow"
                placeholder="/api/users"
              />
              <button
                onClick={() => setRefreshCount((prev) => prev + 1)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                disabled={loading}>
                Test
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick API Tests</h2>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEndpointUrl("/api/users");
                    setRefreshCount((prev) => prev + 1);
                  }}
                  className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                  Get All Users
                </button>
                <button
                  onClick={() => {
                    setEndpointUrl("/api/sensors");
                    setRefreshCount((prev) => prev + 1);
                  }}
                  className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                  Get All Sensors
                </button>

                <div className="py-2">
                  <label className="block mb-2">Get User by ID:</label>
                  <select
                    value={userId}
                    onChange={handleUserSelect}
                    className="w-full p-2 border rounded">
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} (ID: {user.id})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={testDirectApi}
                  className="block w-full text-left px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded">
                  Test External API Directly
                </button>
              </div>
            </div>

            {/* API Response */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">API Response</h2>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : apiResponse ? (
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500">
                  No data. Click a test button to see results.
                </p>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              API Performance Metrics
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-4 py-2 text-left">API Endpoint</th>
                    <th className="px-4 py-2 text-left">Response Time (ms)</th>
                    <th className="px-4 py-2 text-left">
                      Response Size (bytes)
                    </th>
                    <th className="px-4 py-2 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {refreshTimes
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{item.url}</td>
                        <td className="px-4 py-2">{item.time}</td>
                        <td className="px-4 py-2">{item.size}</td>
                        <td className="px-4 py-2">
                          {new Date().toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  {refreshTimes.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-2 text-center text-gray-500">
                        No metrics recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sensors Tab */}
      {activeTab === "sensors" && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Sensor Data</h2>

            <div className="flex flex-wrap gap-4 mb-6">
              {users
                .filter((user) => user.officeId)
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSensorsByOffice(user.officeId)}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded text-sm">
                    {user.name}&apos;s Office ({user.officeId})
                  </button>
                ))}
            </div>

            {sensors.length === 0 ? (
              <p className="text-gray-500">No sensors found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">ID</th>
                      <th className="px-4 py-2 border-b">Office ID</th>
                      <th className="px-4 py-2 border-b">Status</th>
                      <th className="px-4 py-2 border-b">Battery</th>
                      <th className="px-4 py-2 border-b">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensors.map((sensor, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
                        }>
                        <td className="px-4 py-2 border-b">{sensor.id}</td>
                        <td className="px-4 py-2 border-b">
                          {sensor.officeId}
                        </td>
                        <td className="px-4 py-2 border-b">
                          <span
                            className={`px-2 py-1 rounded ${
                              sensor.isOpen
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {sensor.isOpen
                              ? "Open (Available)"
                              : "Closed (Not Available)"}
                          </span>
                        </td>
                        <td className="px-4 py-2 border-b">
                          {sensor.batteryStatus !== undefined
                            ? `${sensor.batteryStatus}%`
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {sensor.inputTime
                            ? new Date(sensor.inputTime).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">User-Sensor Mapping</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">User</th>
                    <th className="px-4 py-2 border-b">Office ID</th>
                    <th className="px-4 py-2 border-b">Has Sensor</th>
                    <th className="px-4 py-2 border-b">Sensor Status</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const userSensor = sensors.find(
                      (s) => s.officeId === user.officeId
                    );
                    return (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
                        }>
                        <td className="px-4 py-2 border-b">{user.name}</td>
                        <td className="px-4 py-2 border-b">
                          {user.officeId || "None"}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {userSensor ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {userSensor ? (
                            <span
                              className={`px-2 py-1 rounded ${
                                userSensor.isOpen
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                              {userSensor.isOpen
                                ? "Available"
                                : "Not Available"}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {user.officeId && (
                            <button
                              onClick={() =>
                                handleSensorsByOffice(user.officeId)
                              }
                              className="text-blue-600 hover:text-blue-800 text-sm">
                              Check Sensor
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === "advanced" && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Advanced Testing</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">API Cache Test</h3>
                <p className="mb-4 text-sm">
                  Test the cache effectiveness by making multiple requests:
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      // Make 3 consecutive requests to the same endpoint
                      setEndpointUrl("/api/users");
                      setRefreshCount((prev) => prev + 1);
                      setTimeout(
                        () => setRefreshCount((prev) => prev + 1),
                        500
                      );
                      setTimeout(
                        () => setRefreshCount((prev) => prev + 1),
                        1000
                      );
                    }}
                    className="block w-full text-left px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded">
                    Test Users Cache (3 consecutive requests)
                  </button>

                  <button
                    onClick={() => {
                      // Make 3 consecutive requests to the same endpoint
                      if (userId) {
                        setEndpointUrl(`/api/users/${userId}`);
                        setRefreshCount((prev) => prev + 1);
                        setTimeout(
                          () => setRefreshCount((prev) => prev + 1),
                          500
                        );
                        setTimeout(
                          () => setRefreshCount((prev) => prev + 1),
                          1000
                        );
                      } else {
                        setError("Please select a user first");
                      }
                    }}
                    className="block w-full text-left px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded">
                    Test Single User Cache
                  </button>

                  <button
                    onClick={clearApiCache}
                    className="block w-full text-left px-4 py-2 bg-red-100 hover:bg-red-200 rounded">
                    Clear Cache and Refresh
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Performance Test</h3>
                <p className="mb-4 text-sm">
                  Compare performance of different API calls:
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      // Test multiple endpoints in sequence
                      const endpoints = [
                        "/api/users",
                        "/api/sensors",
                        userId ? `/api/users/${userId}` : null,
                      ].filter(Boolean);

                      endpoints.forEach((endpoint, index) => {
                        if (endpoint) {
                          setTimeout(() => {
                            setEndpointUrl(endpoint);
                            setRefreshCount((prev) => prev + 1);
                          }, index * 1000);
                        }
                      });
                    }}
                    className="block w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded">
                    Run Performance Benchmark
                  </button>

                  <button
                    onClick={() => {
                      // Clear all refresh times
                      setRefreshTimes([]);
                    }}
                    className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                    Clear Performance Metrics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
