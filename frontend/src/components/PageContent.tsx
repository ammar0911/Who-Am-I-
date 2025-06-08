"use client";

import React from "react";

export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</main>
  );
}
