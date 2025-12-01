import React, { useState, createContext, useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import IQOverlay from './IQOverlay';
import AddPropertyModal from './AddPropertyModal';

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
  isAddPropertyOpen: boolean;
  openAddProperty: () => void;
  closeAddProperty: () => void;
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
  showCelebration: false,
  isAddPropertyOpen: false,
  openAddProperty: () => {},
  closeAddProperty: () => {}
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
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

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
  
  const openAddProperty = () => setIsAddPropertyOpen(true);
  const closeAddProperty = () => setIsAddPropertyOpen(false);

  return (
    <LayoutContext.Provider value={{ isIQOpen, openIQ, closeIQ, openIQWithDealComplete, openIQWithCelebration, resetDealComplete, resetCelebration, showDealComplete, showCelebration, isAddPropertyOpen, openAddProperty, closeAddProperty }}>
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar 
          onIQClick={openIQ} 
          onCloseIQ={closeIQ}
          isIQActive={isIQOpen} 
          onCollapseChange={setIsSidebarCollapsed}
          onAddPropertyClick={openAddProperty}
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
        
        <AddPropertyModal 
          isOpen={isAddPropertyOpen}
          onClose={closeAddProperty}
        />
      </div>
    </LayoutContext.Provider>
  );
}
