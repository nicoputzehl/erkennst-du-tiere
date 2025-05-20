import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Quiz, UnlockCondition } from '../types';
import { 
  getUnlockProgress, 
  unlockNextQuiz, 
  checkForUnlocks, 
  checkAllUnlockConditions,
  addUnlockListener,
  removeUnlockListener,
  getUnlockManagerService 
} from '../services/unlockManager';
import { UnlockManagerService } from '../services/factories/unlockManagerFactory';
import { useToast } from './ToastProvider';

interface UnlockManagerContextType {
  unlockManagerService: UnlockManagerService;
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

const UnlockManagerContext = createContext<UnlockManagerContextType | null>(null);

export function UnlockManagerProvider({ children }: { children: ReactNode }) {
  const { showSuccessToast } = useToast();
  
  const unlockManagerService = getUnlockManagerService();
  
  useEffect(() => {
    const unlockHandler = (unlockedQuiz: Quiz) => {
      showSuccessToast(
        `🎉 Neues Quiz "${unlockedQuiz.title}" wurde freigeschaltet!`,
        4000
      );
    };
    
    addUnlockListener(unlockHandler);
    
    return () => {
      removeUnlockListener(unlockHandler);
    };
  }, [showSuccessToast]);
  
  const contextValue: UnlockManagerContextType = {
    unlockManagerService,
    getUnlockProgress,
    unlockNextQuiz,
    checkForUnlocks,
    checkAllUnlockConditions,
    addUnlockListener,
    removeUnlockListener
  };
  
  return (
    <UnlockManagerContext.Provider value={contextValue}>
      {children}
    </UnlockManagerContext.Provider>
  );
}

export function useUnlockManager() {
  const context = useContext(UnlockManagerContext);
  if (!context) {
    throw new Error('useUnlockManager must be used within an UnlockManagerProvider');
  }
  return context;
}