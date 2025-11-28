import React, { useState, createContext, useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import IQOverlay from './IQOverlay';

interface LayoutContextType {
  isIQOpen: boolean;
  openIQ: () => void;
  closeIQ: () => void;
}

const LayoutContext = createContext<LayoutContextType>({
  isIQOpen: false,
  openIQ: () => {},
  closeIQ: () => {}
});

export const useLayout = () => useContext(LayoutContext);

interface LayoutProps {
  children: React.ReactNode;
}

const getInitialIQState = () => {
  const sessionStarted = sessionStorage.getItem('flipiq_session_started');
  if (!sessionStarted) {
    sessionStorage.setItem('flipiq_session_started', 'true');
    return true;
  }
  return false;
};

export default function Layout({ children }: LayoutProps) {
  const [isIQOpen, setIsIQOpen] = useState(getInitialIQState);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const openIQ = () => setIsIQOpen(true);
  const closeIQ = () => setIsIQOpen(false);

  return (
    <LayoutContext.Provider value={{ isIQOpen, openIQ, closeIQ }}>
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar 
          onIQClick={openIQ} 
          onCloseIQ={closeIQ}
          isIQActive={isIQOpen} 
          onCollapseChange={setIsSidebarCollapsed}
        />
        
        <main className="flex-1 relative">
          {children}
        </main>
        
        <IQOverlay 
          isOpen={isIQOpen} 
          onClose={closeIQ}
          userName="Josh"
          sidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </LayoutContext.Provider>
  );
}
