'use client';

import * as React from 'react';

export type FeatureSection = 'home' | 'chat' | 'forum' | 'discussions' | 'events' | 'blog' | 'members';

interface FeatureNavigationState {
  currentSection: FeatureSection;
  isLeftSidebarCollapsed: boolean;
  isRightSidebarCollapsed: boolean;
}

interface FeatureNavigationContext extends FeatureNavigationState {
  setCurrentSection: (section: FeatureSection) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
}

const FeatureNavigationContext = React.createContext<FeatureNavigationContext | undefined>(undefined);

export function FeatureNavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<FeatureNavigationState>({
    currentSection: 'home',
    isLeftSidebarCollapsed: false,
    isRightSidebarCollapsed: false,
  });

  // Load saved state from localStorage
  React.useEffect(() => {
    const savedState = localStorage.getItem('feature-navigation-state');
    if (savedState) {
      setState(JSON.parse(savedState));
    }
  }, []);

  // Save state changes to localStorage
  React.useEffect(() => {
    localStorage.setItem('feature-navigation-state', JSON.stringify(state));
  }, [state]);

  const setCurrentSection = React.useCallback((section: FeatureSection) => {
    setState(prev => ({ ...prev, currentSection: section }));
  }, []);

  const toggleLeftSidebar = React.useCallback(() => {
    setState(prev => ({ ...prev, isLeftSidebarCollapsed: !prev.isLeftSidebarCollapsed }));
  }, []);

  const toggleRightSidebar = React.useCallback(() => {
    setState(prev => ({ ...prev, isRightSidebarCollapsed: !prev.isRightSidebarCollapsed }));
  }, []);

  return (
    <FeatureNavigationContext.Provider
      value={{
        ...state,
        setCurrentSection,
        toggleLeftSidebar,
        toggleRightSidebar,
      }}
    >
      {children}
    </FeatureNavigationContext.Provider>
  );
}

export function useFeatureNavigation() {
  const context = React.useContext(FeatureNavigationContext);
  if (!context) {
    throw new Error('useFeatureNavigation must be used within a FeatureNavigationProvider');
  }
  return context;
} 