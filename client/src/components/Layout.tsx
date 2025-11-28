import React, { useState, createContext, useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import IQOverlay from './IQOverlay';

interface LayoutContextType {
  isIQOpen: boolean;
  openIQ: () => void;
  closeIQ: () => void;
  openIQWithSummary: () => void;
  showSummary: boolean;
}

const LayoutContext = createContext<LayoutContextType>({
  isIQOpen: false,
  openIQ: () => {},
  closeIQ: () => {},
  openIQWithSummary: () => {},
  showSummary: false
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
  const [showSummary, setShowSummary] = useState(false);

  const openIQ = () => setIsIQOpen(true);
  const closeIQ = () => {
    setIsIQOpen(false);
    setShowSummary(false);
  };
  const openIQWithSummary = () => {
    setShowSummary(true);
    setIsIQOpen(true);
  };

  return (
    <LayoutContext.Provider value={{ isIQOpen, openIQ, closeIQ, openIQWithSummary, showSummary }}>
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
          userName="Tony"
          sidebarCollapsed={isSidebarCollapsed}
          showSummary={showSummary}
        />
      </div>
    </LayoutContext.Provider>
  );
}
