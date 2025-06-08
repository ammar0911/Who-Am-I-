"use client";
import React, { useState, useContext } from "react";
import { Menu, MenuItem } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Language } from "../types";
import { AppContext } from "../contexts/AppContext";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <span className="font-semibold text-sm">{language.toUpperCase()}</span>
        <ExpandMore className="w-4 h-4 ml-1" />
      </button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleSelect("en")}>English</MenuItem>
        <MenuItem onClick={() => handleSelect("de")}>Deutsch</MenuItem>
      </Menu>
    </>
  );
};
