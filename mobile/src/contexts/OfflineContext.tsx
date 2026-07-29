import React, { createContext, useContext, useState } from 'react';

interface OfflineContextType {
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  triggerRetrySync: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType>({} as OfflineContextType);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const triggerRetrySync = async () => {
    setIsOffline(false);
  };

  return (
    <OfflineContext.Provider value={{ isOffline, setIsOffline, triggerRetrySync }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
export default OfflineContext;
