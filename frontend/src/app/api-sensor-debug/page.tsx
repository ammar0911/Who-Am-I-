"use client";
import React, { useState, useEffect } from "react";

interface Sensor {
  id: string | number;
  officeId: number;
  isOpen: boolean;
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

export default function ApiSensorDebugPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch sensors
      const sensorResponse = await fetch("/api/sensors");
      if (!sensorResponse.ok) {
        throw new Error(`Failed to fetch sensors: ${sensorResponse.status}`);
      }

      const sensorData = await sensorResponse.json();
      console.log("Sensors:", sensorData);
      setSensors(sensorData);

      // Fetch users
      const userResponse = await fetch("/api/users");
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch users: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      console.log("Users:", userData);
      setUsers(userData);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sensor Debug Page</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={fetchData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
          disabled={loading}>
          {loading ? "Loading..." : "Refresh Data"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sensors Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sensors</h2>
          {sensors.length === 0 ? (
            <p className="text-gray-500">No sensors found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">ID</th>
                    <th className="px-4 py-2 border-b">Office ID</th>
                    <th className="px-4 py-2 border-b">Is Open</th>
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
                      <td className="px-4 py-2 border-b">{sensor.officeId}</td>
                      <td className="px-4 py-2 border-b">
                        <span
                          className={`inline-block px-2 py-1 rounded ${
                            sensor.isOpen
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {sensor.isOpen
                            ? "Open (Available)"
                            : "Closed (Not Available)"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Users Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Users & Offices</h2>
          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">ID</th>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Office ID</th>
                    <th className="px-4 py-2 border-b">Is Public</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
                      }>
                      <td className="px-4 py-2 border-b">{user.id}</td>
                      <td className="px-4 py-2 border-b">{user.name}</td>
                      <td className="px-4 py-2 border-b">{user.officeId}</td>
                      <td className="px-4 py-2 border-b">
                        <span
                          className={`inline-block px-2 py-1 rounded ${
                            user.isPublic
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {user.isPublic ? "Public" : "Private"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Mapping Section */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User-Sensor Mapping</h2>
        {users.length === 0 || sensors.length === 0 ? (
          <p className="text-gray-500">No data available for mapping.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">User</th>
                  <th className="px-4 py-2 border-b">Office ID</th>
                  <th className="px-4 py-2 border-b">Matching Sensor</th>
                  <th className="px-4 py-2 border-b">Is Open</th>
                  <th className="px-4 py-2 border-b">Expected Status</th>
                  <th className="px-4 py-2 border-b">Is Public</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const matchingSensor = sensors.find(
                    (sensor) => sensor.officeId === user.officeId
                  );
                  return (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
                      }>
                      <td className="px-4 py-2 border-b">{user.name}</td>
                      <td className="px-4 py-2 border-b">
                        {user.officeId || "N/A"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {matchingSensor ? matchingSensor.id : "No sensor"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {matchingSensor ? (
                          <span
                            className={`inline-block px-2 py-1 rounded ${
                              matchingSensor.isOpen
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {matchingSensor.isOpen ? "Open" : "Closed"}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {matchingSensor ? (
                          <span
                            className={`inline-block px-2 py-1 rounded ${
                              matchingSensor.isOpen
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {matchingSensor.isOpen
                              ? "Available"
                              : "Not Available"}
                          </span>
                        ) : (
                          "Not Available (default)"
                        )}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <span
                          className={`inline-block px-2 py-1 rounded ${
                            user.isPublic
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {user.isPublic ? "Public" : "Private"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
