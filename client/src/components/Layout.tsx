import React, { useState, createContext, useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import IQOverlay from './IQOverlay';

interface LayoutContextType {
  isIQOpen: boolean;
  openIQ: () => void;
  closeIQ: () => void;
  openIQWithDealComplete: () => void;
  openIQWithCelebration: () => void;
  resetDealComplete: () => void;
  resetCelebration: () => void;
  showDealComplete: boolean;
  showCelebration: boolean;
}

const LayoutContext = createContext<LayoutContextType>({
  isIQOpen: false,
  openIQ: () => {},
  closeIQ: () => {},
  openIQWithDealComplete: () => {},
  openIQWithCelebration: () => {},
  resetDealComplete: () => {},
  resetCelebration: () => {},
  showDealComplete: false,
  showCelebration: false
});

export const useLayout = () => useContext(LayoutContext);

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isIQOpen, setIsIQOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showDealComplete, setShowDealComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const openIQ = () => setIsIQOpen(true);
  const closeIQ = () => {
    setIsIQOpen(false);
  };
  const openIQWithDealComplete = () => {
    setShowDealComplete(true);
    setShowCelebration(false);
    setIsIQOpen(true);
  };
  const openIQWithCelebration = () => {
    setShowDealComplete(false);
    setShowCelebration(true);
    setIsIQOpen(true);
  };
  const resetDealComplete = () => setShowDealComplete(false);
  const resetCelebration = () => setShowCelebration(false);

  return (
    <LayoutContext.Provider value={{ isIQOpen, openIQ, closeIQ, openIQWithDealComplete, openIQWithCelebration, resetDealComplete, resetCelebration, showDealComplete, showCelebration }}>
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
          showDealComplete={showDealComplete}
          showCelebration={showCelebration}
          onDealCompleteFinished={resetDealComplete}
          onCelebrationFinished={resetCelebration}
        />
      </div>
    </LayoutContext.Provider>
  );
}
