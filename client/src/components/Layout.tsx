import React, { useState, createContext, useContext } from 'react';
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

export default function Layout({ children }: LayoutProps) {
  const [isIQOpen, setIsIQOpen] = useState(false);

  const openIQ = () => setIsIQOpen(true);
  const closeIQ = () => setIsIQOpen(false);

  return (
    <LayoutContext.Provider value={{ isIQOpen, openIQ, closeIQ }}>
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar onIQClick={openIQ} isIQActive={isIQOpen} />
        
        <main className="flex-1 relative">
          {children}
        </main>
        
        <IQOverlay 
          isOpen={isIQOpen} 
          onClose={closeIQ}
          userName="Josh"
        />
      </div>
    </LayoutContext.Provider>
  );
}
