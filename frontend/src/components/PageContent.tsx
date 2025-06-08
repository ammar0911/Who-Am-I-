"use client";

import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import HomePage from "../app/pages/home/page";
import SearchPage from "../app/pages/search/page";
import ProfilePage from "../app/pages/profile/page";
import LoginPage from "../app/pages/login/page";

export function PageContent() {
  const { page } = useContext(AppContext);

  switch (page) {
    case "search":
      return <SearchPage />;
    case "profile":
      return <ProfilePage />;
    case "login":
      return <LoginPage />;
    default:
      return <HomePage />;
  }
}
