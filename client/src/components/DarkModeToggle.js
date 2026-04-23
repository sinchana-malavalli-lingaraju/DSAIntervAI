import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const DarkModeToggle = ({ size = 24, className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`dark-mode-toggle ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <MdLightMode size={size} />
      ) : (
        <MdDarkMode size={size} />
      )}
    </button>
  );
};

export default DarkModeToggle;




