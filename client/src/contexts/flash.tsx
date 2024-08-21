import React, { createContext, useContext, useState } from 'react';

interface FlashContextProps {
  message: string | null;
  severity: 'error' | 'success' | 'info' | 'warning' | null;
  showFlash: boolean;
  setFlash: (message: string, severity: 'error' | 'success' | 'info' | 'warning') => void;
  clearFlash: () => void;
}

const FlashContext = createContext<FlashContextProps | undefined>(undefined);

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (context === undefined) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
};

export const FlashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'error' | 'success' | 'info' | 'warning' | null>(null);
  const [showFlash, setShowFlash] = useState<boolean>(false);

  const setFlash = (msg: string, sev: 'error' | 'success' | 'info' | 'warning') => {
    setMessage(msg);
    setSeverity(sev);
    setShowFlash(true);
  };

  const clearFlash = () => {
    setMessage(null);
    setSeverity(null);
    setShowFlash(false);
  };

  return (
    <FlashContext.Provider value={{ message, severity, showFlash, setFlash, clearFlash }}>
      {children}
    </FlashContext.Provider>
  );
};

