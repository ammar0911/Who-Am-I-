"use client";
import React from "react";
import { AppProvider } from "../contexts/AppContext";
import { Header } from "../components/Header";
import { PageContent } from "../components/PageContent";

export default function RootPage() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <PageContent />
      </div>
    </AppProvider>
  );
}
