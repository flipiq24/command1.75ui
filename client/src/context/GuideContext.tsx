import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Guide phases following the daily workflow
export type GuidePhase = 'checkin' | 'dealreview' | 'outreach' | 'stats' | 'complete';

// Guide step interface
export interface GuideStep {
  id: string;
  phase: GuidePhase;
  title: string;
  content: string;
  trigger?: {
    type: 'route-change' | 'click' | 'tab-click' | 'manual' | 'auto';
    targetRoute?: string;
    targetSelector?: string;
    targetTab?: string;
  };
  highlightSelector?: string;
  action?: string;
}

// User progress tracking
interface UserProgress {
  dealsReviewed: number;
  callsMade: number;
  offersSubmitted: number;
  campaignsSent: number;
}

// Guide context state interface
interface GuideContextType {
  // Core state
  isGuideEnabled: boolean;
  currentPhase: GuidePhase;
  currentStepIndex: number;
  completedSteps: string[];
  userProgress: UserProgress;

  // Computed values
  currentStep: GuideStep | null;
  totalStepsInPhase: number;
  overallProgress: number;

  // Actions
  toggleGuide: () => void;
  enableGuide: () => void;
  disableGuide: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipToPhase: (phase: GuidePhase) => void;
  goToStep: (stepId: string) => void;
  markStepComplete: (stepId: string) => void;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
  resetGuide: () => void;

  // Step data
  allSteps: GuideStep[];
  getStepsForPhase: (phase: GuidePhase) => GuideStep[];
}

// Default user progress
const defaultUserProgress: UserProgress = {
  dealsReviewed: 0,
  callsMade: 0,
  offersSubmitted: 0,
  campaignsSent: 0,
};

// localStorage keys
const STORAGE_KEYS = {
  isEnabled: 'flipiq_guide_enabled',
  currentPhase: 'flipiq_guide_phase',
  currentStepIndex: 'flipiq_guide_step_index',
  completedSteps: 'flipiq_guide_completed',
  userProgress: 'flipiq_guide_progress',
  hasSeenGuide: 'flipiq_guide_has_seen',
};

// Create context with default values
const GuideContext = createContext<GuideContextType | undefined>(undefined);

// Import steps data (we'll create this file next)
import { guideSteps } from '@/data/guideSteps';

interface GuideProviderProps {
  children: ReactNode;
}

export function GuideProvider({ children }: GuideProviderProps) {
  // Initialize state from localStorage or defaults
  const [isGuideEnabled, setIsGuideEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.isEnabled);
    const hasSeenGuide = localStorage.getItem(STORAGE_KEYS.hasSeenGuide);

    // Auto-enable for first-time users
    if (!hasSeenGuide) {
      return true;
    }

    return stored ? JSON.parse(stored) : false;
  });

  const [currentPhase, setCurrentPhase] = useState<GuidePhase>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.currentPhase);
    return stored ? (JSON.parse(stored) as GuidePhase) : 'checkin';
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.currentStepIndex);
    return stored ? JSON.parse(stored) : 0;
  });

  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.completedSteps);
    return stored ? JSON.parse(stored) : [];
  });

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.userProgress);
    return stored ? JSON.parse(stored) : defaultUserProgress;
  });

  // All steps data
  const allSteps = guideSteps;

  // Get steps for a specific phase
  const getStepsForPhase = useCallback((phase: GuidePhase): GuideStep[] => {
    return allSteps.filter(step => step.phase === phase);
  }, [allSteps]);

  // Current phase steps
  const currentPhaseSteps = getStepsForPhase(currentPhase);
  const totalStepsInPhase = currentPhaseSteps.length;

  // Current step
  const currentStep = currentPhaseSteps[currentStepIndex] || null;

  // Calculate overall progress
  const overallProgress = Math.round((completedSteps.length / allSteps.length) * 100);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.isEnabled, JSON.stringify(isGuideEnabled));
  }, [isGuideEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.currentPhase, JSON.stringify(currentPhase));
  }, [currentPhase]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.currentStepIndex, JSON.stringify(currentStepIndex));
  }, [currentStepIndex]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.completedSteps, JSON.stringify(completedSteps));
  }, [completedSteps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.userProgress, JSON.stringify(userProgress));
  }, [userProgress]);

  // Mark that user has seen the guide on first enable
  useEffect(() => {
    if (isGuideEnabled) {
      localStorage.setItem(STORAGE_KEYS.hasSeenGuide, 'true');
    }
  }, [isGuideEnabled]);

  // Actions
  const toggleGuide = useCallback(() => {
    setIsGuideEnabled(prev => !prev);
  }, []);

  const enableGuide = useCallback(() => {
    setIsGuideEnabled(true);
  }, []);

  const disableGuide = useCallback(() => {
    setIsGuideEnabled(false);
  }, []);

  const markStepComplete = useCallback((stepId: string) => {
    setCompletedSteps(prev => {
      if (prev.includes(stepId)) return prev;
      return [...prev, stepId];
    });
  }, []);

  const nextStep = useCallback(() => {
    // Mark current step as complete
    if (currentStep) {
      markStepComplete(currentStep.id);
    }

    // Check if we can move to next step in current phase
    if (currentStepIndex < currentPhaseSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Move to next phase
      const phases: GuidePhase[] = ['checkin', 'dealreview', 'outreach', 'stats', 'complete'];
      const currentPhaseIndex = phases.indexOf(currentPhase);

      if (currentPhaseIndex < phases.length - 1) {
        setCurrentPhase(phases[currentPhaseIndex + 1]);
        setCurrentStepIndex(0);
      }
    }
  }, [currentStep, currentStepIndex, currentPhaseSteps.length, currentPhase, markStepComplete]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      // Move to previous phase
      const phases: GuidePhase[] = ['checkin', 'dealreview', 'outreach', 'stats', 'complete'];
      const currentPhaseIndex = phases.indexOf(currentPhase);

      if (currentPhaseIndex > 0) {
        const prevPhase = phases[currentPhaseIndex - 1];
        const prevPhaseSteps = getStepsForPhase(prevPhase);
        setCurrentPhase(prevPhase);
        setCurrentStepIndex(prevPhaseSteps.length - 1);
      }
    }
  }, [currentStepIndex, currentPhase, getStepsForPhase]);

  const skipToPhase = useCallback((phase: GuidePhase) => {
    setCurrentPhase(phase);
    setCurrentStepIndex(0);
  }, []);

  const goToStep = useCallback((stepId: string) => {
    const step = allSteps.find(s => s.id === stepId);
    if (step) {
      setCurrentPhase(step.phase);
      const phaseSteps = getStepsForPhase(step.phase);
      const stepIndex = phaseSteps.findIndex(s => s.id === stepId);
      if (stepIndex !== -1) {
        setCurrentStepIndex(stepIndex);
      }
    }
  }, [allSteps, getStepsForPhase]);

  const updateUserProgress = useCallback((progress: Partial<UserProgress>) => {
    setUserProgress(prev => ({ ...prev, ...progress }));
  }, []);

  const resetGuide = useCallback(() => {
    setCurrentPhase('checkin');
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setUserProgress(defaultUserProgress);
  }, []);

  const value: GuideContextType = {
    isGuideEnabled,
    currentPhase,
    currentStepIndex,
    completedSteps,
    userProgress,
    currentStep,
    totalStepsInPhase,
    overallProgress,
    toggleGuide,
    enableGuide,
    disableGuide,
    nextStep,
    prevStep,
    skipToPhase,
    goToStep,
    markStepComplete,
    updateUserProgress,
    resetGuide,
    allSteps,
    getStepsForPhase,
  };

  return (
    <GuideContext.Provider value={value}>
      {children}
    </GuideContext.Provider>
  );
}

// Custom hook to use guide context
export function useGuide(): GuideContextType {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
}

export default GuideContext;
