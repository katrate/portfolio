import React, { createContext, useContext, useState } from 'react';

interface NavContextValue {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
}

const NavContext = createContext<NavContextValue>({
  isExpanded: false,
  setIsExpanded: () => {},
});

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <NavContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => useContext(NavContext);
