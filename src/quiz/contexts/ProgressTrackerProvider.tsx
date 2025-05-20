import React, { createContext, useContext, ReactNode } from 'react';
import { 
  getQuizProgress, 
  getQuizProgressString, 
  isQuizCompleted, 
  getNextActiveQuestion,
  getProgressTrackerService 
} from '../services/progressTracker';
import { ProgressTrackerService } from '../services/factories/progressTrackerFactory';

interface ProgressTrackerContextType {
  progressTrackerService: ProgressTrackerService;
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
}

const ProgressTrackerContext = createContext<ProgressTrackerContextType | null>(null);

export function ProgressTrackerProvider({ children }: { children: ReactNode }) {
  const progressTrackerService = getProgressTrackerService();
  
  const contextValue: ProgressTrackerContextType = {
    progressTrackerService,
    getQuizProgress,
    getQuizProgressString,
    isQuizCompleted,
    getNextActiveQuestion
  };

  return (
    <ProgressTrackerContext.Provider value={contextValue}>
      {children}
    </ProgressTrackerContext.Provider>
  );
}

export function useProgressTracker() {
  const context = useContext(ProgressTrackerContext);
  if (!context) {
    throw new Error('useProgressTracker must be used within a ProgressTrackerProvider');
  }
  return context;
}