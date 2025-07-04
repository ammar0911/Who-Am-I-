"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Edit as EditIcon,
  Battery20 as BatteryLowIcon,
  Battery50 as BatteryMidIcon,
  Battery80 as BatteryHighIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import { OfficeDTO, SensorDTO, UserDTO, AccountType } from "@/types";
import { useSession } from "next-auth/react";
import { AppContext } from "@/contexts/AppContext";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const currentUser = session?.user;
  const { t } = useContext(AppContext);

  const [users, setUsers] = useState<UserDTO[]>([]);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const [offices, setOffices] = useState<OfficeDTO[]>([]);
  const [sensors, setSensors] = useState<SensorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [officeModalOpen, setOfficeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<OfficeDTO | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({
    name: "",
    title: "",
    department: "",
    accountType: AccountType.Guest,
    officeId: "",
    isPublic: false,
  });

  const [officeForm, setOfficeForm] = useState({
    name: "",
    sensorId: "",
  });

  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const isAdmin = currentUser?.accountType === AccountType.Admin;

  // Debug information
  useEffect(() => {
    if (currentUser) {
      console.log("Admin Page - Current User:", {
        id: currentUser.id,
        name: currentUser.name,
        accountType: currentUser.accountType,
        isAdmin: currentUser.accountType === AccountType.Admin,
      });
    } else if (status === "loading") {
      console.log("Admin Page - Session is still loading");
    } else {
      console.log("Admin Page - No current user");
    }
  }, [currentUser, status]);

  // Helper functions for modals
  const handleOpenUserModal = (user: UserDTO) => {
    setSelectedUser(user);
    const userSettings = user.userSettings ? JSON.parse(user.userSettings) : {};
    console.log("Opening user modal for:", user);
    console.log(user.officeId);
    setUserForm({
      name: user.name || "",
      title: user.title || "",
      department: user.department || "",
      accountType: user.accountType || AccountType.Guest,
      officeId: user.officeId || "",
      isPublic: user.isPublic || userSettings.isPublic || false,
    });
    setUserModalOpen(true);
  };

  const handleOpenOfficeModal = (office: OfficeDTO | null = null) => {
    if (office) {
      setSelectedOffice(office);
      setOfficeForm({
        name: office.name,
        sensorId: office.sensorId || "",
      });
    } else {
      setSelectedOffice(null);
      setOfficeForm({
        name: "",
        sensorId: "",
      });
    }
    setOfficeModalOpen(true);
  };

  const handleCloseModals = () => {
    setUserModalOpen(false);
    setOfficeModalOpen(false);
  };

  const showNotification = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Form submit handlers
  const handleUserSubmit = async () => {
    try {
      if (!selectedUser) {
        showNotification(t("noUserSelected"), "error");
        handleCloseModals();
        return;
      }

      // Update existing user
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userForm.name,
          title: userForm.title,
          department: userForm.department,
          accountType: userForm.accountType,
          officeId: userForm.officeId || null,
          isPublic: userForm.isPublic,
          userSettings: JSON.stringify({ isPublic: userForm.isPublic }),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      showNotification(t("userUpdated").replace("{name}", selectedUser.name));

      handleCloseModals();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: unknown) {
      console.error("Error updating user:", error);
      showNotification(
        t("failedToUpdateUser").replace(
          "{error}",
          error instanceof Error ? error.message : "Unknown error"
        ),
        "error"
      );
    }
  };

  const handleOfficeSubmit = async () => {
    try {
      if (!officeForm.name) {
        showNotification(t("officeNameRequired"), "error");
        return;
      }

      let response;
      if (selectedOffice) {
        // Update existing office
        response = await fetch(`/api/offices/${selectedOffice.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: officeForm.name,
            sensorId: officeForm.sensorId || null,
          }),
        });
      } else {
        // Create new office
        response = await fetch("/api/offices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: officeForm.name,
            sensorId: officeForm.sensorId || null,
          }),
        });
      }

      if (!response.ok) {
        throw new Error(
          `Failed to ${selectedOffice ? "update" : "create"} office: ${
            response.status
          }`
        );
      }

      showNotification(
        selectedOffice
          ? t("officeUpdated").replace("{name}", officeForm.name)
          : t("officeCreated").replace("{name}", officeForm.name)
      );
      handleCloseModals();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: unknown) {
      console.error("Error submitting office:", error);
      showNotification(
        t("failedToSaveOffice").replace(
          "{error}",
          error instanceof Error ? error.message : "Unknown error"
        ),
        "error"
      );
    }
  };

  // Form change handlers
  const handleUserFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value =
      (e.target as HTMLInputElement).type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setUserForm((prev) => ({
      ...prev,
      [name]: name === "accountType" ? (value as AccountType) : value,
    }));
  };

  const handleOfficeFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setOfficeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Redirect if not logged in
  useEffect(() => {
    // Only proceed if we know the session state (not loading)
    if (status === "loading") {
      console.log("Admin Page - Session is still loading, waiting...");
      return;
    }

    if (!currentUser) {
      console.log("Admin Page - Redirecting to login: No current user");
      router.push("/login");
      return;
    }

    // Check if user is admin, if not redirect to home
    if (currentUser.accountType !== AccountType.Admin) {
      // Not an admin
      console.log("Admin Page - User is not an admin, redirecting to home");
      router.push("/home");
      return;
    }

    // Fetch offices and sensors
    const fetchData = async () => {
      try {
        // Fetch offices
        try {
          // FIX: The API endpoint is not implemented yet, so we will use a placeholder
          const officesResponse = await fetch("/api/offices");
          if (!officesResponse.ok) {
            console.warn(`Failed to fetch offices: ${officesResponse.status}`);
            setOffices([]);
          } else {
            const officesData = await officesResponse.json();
            setOffices(officesData);
          }
        } catch (officeError) {
          console.error("Error fetching offices:", officeError);
          setOffices([]);
        }

        // Fetch sensors
        try {
          const sensorsResponse = await fetch("/api/sensors");
          if (!sensorsResponse.ok) {
            console.warn(`Failed to fetch sensors: ${sensorsResponse.status}`);
            setSensors([]);
          } else {
            const sensorsData = await sensorsResponse.json();
            setSensors(sensorsData);
          }
        } catch (sensorError) {
          console.error("Error fetching sensors:", sensorError);
          setSensors([]);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch users data
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          console.warn(`Failed to fetch users: ${response.status}`);
          setUsers([]);
          return;
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchData();
    fetchUsers();
  }, [currentUser, router, status]);

  // Helper function to display account type
  const getAccountTypeDisplay = (
    accountType: AccountType | string | undefined
  ): string => {
    if (accountType === undefined) return "Unknown";
    return accountType as string;
  };

  const renderBatteryStatus = (status: number) => {
    if (status < 30) {
      return (
        <div className="flex items-center text-red-500">
          <BatteryLowIcon className="mr-1" />
          <span>{status}%</span>
        </div>
      );
    } else if (status < 70) {
      return (
        <div className="flex items-center text-yellow-500">
          <BatteryMidIcon className="mr-1" />
          <span>{status}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-green-500">
          <BatteryHighIcon className="mr-1" />
          <span>{status}%</span>
        </div>
      );
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[70vh]">
        <p className="text-gray-600 dark:text-gray-300">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          className="mt-4 text-indigo-600 hover:text-indigo-800"
          onClick={() => window.location.reload()}
        >
          {t("tryAgain")}
        </button>
        <Link href="/home" className="mt-2 text-gray-600 hover:text-gray-800">
          {t("returnToHome")}
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">{t("accessDenied")}</strong>
          <span className="block sm:inline"> {t("noPermission")}</span>
        </div>
        <Link
          href="/home"
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          {t("returnToHome")}
        </Link>
      </div>
    );
  }

  // Add the modals at the end of the component
  return (
    <>
      {/* Main content */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("adminPanel")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t("adminPanelDescription")}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "users"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {t("users")}
            </button>
            <button
              onClick={() => setActiveTab("offices")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "offices"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {t("officeManagement")}
            </button>
            <button
              onClick={() => setActiveTab("sensors")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "sensors"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {t("sensorManagement")}
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {t("userManagement")}
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("name")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("email")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("department")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("accountType")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("office")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("status")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user: UserDTO) => (
                      <tr
                        key={String(user.id)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image
                                src={user.avatar || "/placeholder-avatar.png"}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {getAccountTypeDisplay(user.accountType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {offices.find((o) => o.id === (user.officeId || ""))
                            ?.name || t("notAssigned")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isPublic ||
                              JSON.parse(user.userSettings || "{}").isPublic
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.isPublic ||
                            JSON.parse(user.userSettings || "{}").isPublic
                              ? t("public")
                              : t("private")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"
                            onClick={() => handleOpenUserModal(user)}
                          >
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Offices Tab */}
        {activeTab === "offices" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {t("officeManagement")}
              </h2>
              <button
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                onClick={() => handleOpenOfficeModal()}
              >
                <AddIcon className="mr-2" /> {t("addOffice")}
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("name")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("sensor")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("users")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {offices.map((office) => (
                      <tr
                        key={office.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {office.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {sensors.find((s) => s.id === office.sensorId)?.id ||
                            t("notAssigned")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {
                            users.filter(
                              (u: UserDTO) => u.officeId === office.id
                            ).length
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"
                            onClick={() => handleOpenOfficeModal(office)}
                          >
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sensors Tab */}
        {activeTab === "sensors" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {t("sensorManagement")}
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("batteryStatus")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("status")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("lastUpdated")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("office")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sensors.map((sensor) => (
                      <tr
                        key={sensor.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {sensor.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderBatteryStatus(sensor.batteryStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              sensor.isOpen
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {sensor.isOpen ? t("available") : t("notAvailable")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(sensor.inputTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {offices.find((o) => o.sensorId === sensor.id)
                            ?.name || t("notAssigned")}
                        </td>
                        {/* Edit button removed */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User Modal */}
        <Dialog
          open={userModalOpen}
          onClose={handleCloseModals}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {t("editUser")}
            <IconButton
              aria-label="close"
              onClick={handleCloseModals}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText className="mb-4">
              {selectedUser
                ? `${t("updateUserDetails")} ${selectedUser.name}`
                : t("noUserSelected")}
            </DialogContentText>

            <Box component="form" sx={{ mt: 1 }}>
              {selectedUser && (
                <Typography variant="subtitle1" gutterBottom>
                  {t("userId")}: {selectedUser.id}
                </Typography>
              )}

              <TextField
                margin="dense"
                id="name"
                name="name"
                label={t("name")}
                type="text"
                fullWidth
                value={userForm.name}
                onChange={handleUserFormChange}
                required
              />

              <TextField
                margin="dense"
                id="title"
                name="title"
                label={t("title")}
                type="text"
                fullWidth
                value={userForm.title}
                onChange={handleUserFormChange}
              />

              <TextField
                margin="dense"
                id="department"
                name="department"
                label={t("department")}
                type="text"
                fullWidth
                value={userForm.department}
                onChange={handleUserFormChange}
              />

              <FormControl fullWidth margin="dense">
                <InputLabel id="account-type-label">
                  {t("accountType")}
                </InputLabel>
                <Select
                  labelId="account-type-label"
                  id="account-type"
                  value={userForm.accountType}
                  name="accountType"
                  label={t("accountType")}
                  onChange={handleUserFormChange}
                >
                  <MenuItem value={AccountType.Admin}>
                    {AccountType.Admin}
                  </MenuItem>
                  <MenuItem value={AccountType.Maintainer}>
                    {AccountType.Maintainer}
                  </MenuItem>
                  <MenuItem value={AccountType.User}>
                    {AccountType.User}
                  </MenuItem>
                  <MenuItem value={AccountType.Guest}>
                    {AccountType.Guest}
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                id="officeId"
                name="officeId"
                label={t("office")}
                type="text"
                fullWidth
                value={userForm.officeId}
                onChange={handleUserFormChange}
              />

              {/* <FormControl fullWidth margin="dense">
                <InputLabel id="office-select-label">Office</InputLabel>
                <Select
                  labelId="office-select-label"
                  id="office-select"
                  value={userForm.officeId}
                  name="officeId"
                  label="Office"
                  onChange={handleUserFormChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {offices.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}

              <FormControlLabel
                control={
                  <Switch
                    checked={userForm.isPublic}
                    onChange={handleUserFormChange}
                    name="isPublic"
                  />
                }
                label={t("publicAvailability")}
                sx={{ mt: 2, display: "block" }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModals}>{t("cancel")}</Button>
            <Button variant="contained" onClick={handleUserSubmit}>
              {t("save")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Office Modal */}
        <Dialog
          open={officeModalOpen}
          onClose={handleCloseModals}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {selectedOffice ? t("editOffice") : t("addOffice")}
            <IconButton
              aria-label="close"
              onClick={handleCloseModals}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText className="mb-4">
              {selectedOffice
                ? `${t("updateOfficeDetails")} ${selectedOffice.name}`
                : t("newOfficeDetails")}
            </DialogContentText>

            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="dense"
                id="name"
                name="name"
                label={t("officeName")}
                type="text"
                fullWidth
                value={officeForm.name}
                onChange={handleOfficeFormChange}
                required
              />

              <FormControl fullWidth margin="dense">
                <InputLabel id="sensor-select-label">{t("sensor")}</InputLabel>
                <Select
                  labelId="sensor-select-label"
                  id="sensor-select"
                  value={officeForm.sensorId}
                  name="sensorId"
                  label={t("sensor")}
                  onChange={(e) => handleOfficeFormChange(e)}
                >
                  <MenuItem value="">
                    <em>{t("notAssigned")}</em>
                  </MenuItem>
                  {sensors
                    .filter(
                      (s) =>
                        !offices.some(
                          (o) =>
                            o.sensorId === s.id &&
                            (selectedOffice ? o.id !== selectedOffice.id : true)
                        )
                    )
                    .map((sensor) => (
                      <MenuItem key={sensor.id} value={sensor.id}>
                        {sensor.id} - {t("batteryStatus")}:{" "}
                        {sensor.batteryStatus}%
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModals}>{t("cancel")}</Button>
            <Button variant="contained" onClick={handleOfficeSubmit}>
              {t("save")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
