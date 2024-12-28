import React, { useState } from 'react';
import { SettingsContext } from './SettingsContext';

function SettingsProvider ({ children }) {
  const darkMode = {
    backgroundColorMain: "#444444",
    backgroundColor: "white",
    colorMain: "white",
    color: "#444444",
  }
  const lightMode = {
    backgroundColorMain: "white",
    backgroundColor: "#444444",
    colorMain: "#444444",
    color: "white",
  }  

  const [theme, setTheme] = useState(lightMode);
  
  const toggleTheme = () => {
    setTheme((prev) => (prev.backgroundColor === lightMode.backgroundColor ? darkMode : lightMode));
  };

  const value = {
    theme,
    toggleTheme
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider