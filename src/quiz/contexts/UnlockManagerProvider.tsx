import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Quiz, UnlockCondition } from '../types';
import * as UnlockService from '../services/unlockManager';
import { useToast } from './ToastProvider';


// Context-Interface
interface UnlockManagerContextType {
  getUnlockProgress: (quizId: string) => {
    condition: UnlockCondition | null;
    progress: number;
    isMet: boolean;
  };
  unlockNextQuiz: () => Quiz | null;
  checkForUnlocks: () => Quiz[];
  checkAllUnlockConditions: () => {
    unlockedQuizzes: Quiz[];
    availableUnlocks: { quiz: Quiz; condition: UnlockCondition }[];
  };
  addUnlockListener: (listener: (unlockedQuiz: Quiz) => void) => void;
  removeUnlockListener: (listener: (unlockedQuiz: Quiz) => void) => void;
}

// Context erstellen
const UnlockManagerContext = createContext<UnlockManagerContextType | null>(null);

// Provider-Komponente
export function UnlockManagerProvider({ children }: { children: ReactNode }) {
  const { showSuccessToast } = useToast();
  
  // Toast-Integration
  useEffect(() => {
    const unlockHandler = (unlockedQuiz: Quiz) => {
      showSuccessToast(
        `🎉 Neues Quiz "${unlockedQuiz.title}" wurde freigeschaltet!`,
        4000
      );
    };
    
    UnlockService.addUnlockListener(unlockHandler);
    
    return () => {
      UnlockService.removeUnlockListener(unlockHandler);
    };
  }, [showSuccessToast]);
  
  const contextValue: UnlockManagerContextType = {
    getUnlockProgress: UnlockService.getUnlockProgress,
    unlockNextQuiz: UnlockService.unlockNextQuiz,
    checkForUnlocks: UnlockService.checkForUnlocks,
    checkAllUnlockConditions: UnlockService.checkAllUnlockConditions,
    addUnlockListener: UnlockService.addUnlockListener,
    removeUnlockListener: UnlockService.removeUnlockListener
  };
  
  return (
    <UnlockManagerContext.Provider value={contextValue}>
      {children}
    </UnlockManagerContext.Provider>
  );
}

// Custom Hook
export function useUnlockManager() {
  const context = useContext(UnlockManagerContext);
  if (!context) {
    throw new Error('useUnlockManager must be used within an UnlockManagerProvider');
  }
  return context;
}