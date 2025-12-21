import React from "react";
// import { useDarkMode } from "../context/DarkModeContext";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  // const { darkMode, setDarkMode } = useDarkMode();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">Travel Mate</h1>

        <nav className="hidden md:flex gap-8">
          <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Home</a>
          <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Packages</a>
          <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">About</a>
          <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button> */}
          <a href="/login" className="text-blue-600 dark:text-blue-400 font-medium">Login</a>
          <a href="/signup" className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">Sign Up</a>
        </div>
      </div>
    </header>
  );
}