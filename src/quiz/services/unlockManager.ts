// src/quiz/services/unlockManager.ts

import { Quiz, UnlockCondition } from '@/src/quiz/types';
import { createUnlockManagerService } from './factories/unlockManagerFactory';
import { getQuizRegistryService } from './quizRegistry';
import { getQuizStateManagerService } from './quizStateManager';

// Instanz des UnlockManagerService erstellen
const unlockManagerService = createUnlockManagerService(
  getQuizRegistryService(),
  getQuizStateManagerService()
);

// Re-export der Funktionen
export const getUnlockProgress = (quizId: string): {
  condition: UnlockCondition | null;
  progress: number;
  isMet: boolean;
} => unlockManagerService.getUnlockProgress(quizId);

export const unlockNextQuiz = (): Quiz | null => 
  unlockManagerService.unlockNextQuiz();

export const checkForUnlocks = (): Quiz[] => 
  unlockManagerService.checkForUnlocks();

export const checkAllUnlockConditions = (): {
  unlockedQuizzes: Quiz[];
  availableUnlocks: { quiz: Quiz; condition: UnlockCondition }[];
} => unlockManagerService.checkAllUnlockConditions();

export const addUnlockListener = (listener: (unlockedQuiz: Quiz) => void): void => 
  unlockManagerService.addUnlockListener(listener);

export const removeUnlockListener = (listener: (unlockedQuiz: Quiz) => void): void => 
  unlockManagerService.removeUnlockListener(listener);

// Export für andere Services, die Zugriff benötigen
export const getUnlockManagerService = () => unlockManagerService;