"use client";

import { useState, useEffect } from "react";

interface ApiUser {
  id: number;
  name: string;
  title: string;
  department: string;
  email: string;
  officeId: number;
  isPublic: boolean;
}

interface ApiSensor {
  id: number;
  officeId: number;
  isOpen: boolean;
}

export default function ApiTestPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [sensors, setSensors] = useState<ApiSensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Test users endpoint
        const usersResponse = await fetch("/api/users");
        if (!usersResponse.ok) {
          throw new Error(`Users API error: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Test sensors endpoint
        const sensorsResponse = await fetch("/api/sensors");
        if (!sensorsResponse.ok) {
          throw new Error(`Sensors API error: ${sensorsResponse.status}`);
        }
        const sensorsData = await sensorsResponse.json();
        setSensors(sensorsData);
      } catch (err) {
        console.error("Error testing API:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Test fetch directly from the external API (for comparison)
  const testDirectFetch = async () => {
    try {
      const response = await fetch(
        "https://ubi-sys-lab-no-knock.vercel.app/api/users"
      );
      const data = await response.json();
      console.log("Direct API fetch result:", data);
      alert("Check the console for direct fetch results");
    } catch (err) {
      console.error("Error with direct fetch:", err);
      alert(
        `Direct fetch error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <button
        onClick={testDirectFetch}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-6 hover:bg-blue-600">
        Test Direct API Fetch
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          <h2 className="font-bold">Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Users API Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px]">
              {JSON.stringify(users, null, 2)}
            </pre>
          </div>

          <div className="border p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Sensors API Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px]">
              {JSON.stringify(sensors, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
