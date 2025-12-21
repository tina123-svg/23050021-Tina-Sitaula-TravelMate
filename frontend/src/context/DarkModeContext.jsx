// import React, { createContext, useContext, useState, useEffect } from "react";

// const DarkModeContext = createContext();

// export const useDarkMode = () => useContext(DarkModeContext);

// export const DarkModeProvider = ({ children }) => {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setDarkMode(JSON.parse(saved));
//     else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
//       setDarkMode(true);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//     if (darkMode) document.documentElement.classList.add("dark");
//     else document.documentElement.classList.remove("dark");
//   }, [darkMode]);

//   return (
//     <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
//       {children}
//     </DarkModeContext.Provider>
//   );
// };