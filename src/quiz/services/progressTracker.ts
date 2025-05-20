// src/quiz/services/progressTracker.ts

import { createProgressTrackerService } from './factories/progressTrackerFactory';
import { getQuizStateManagerService } from './quizStateManager';

// Instanz des ProgressTrackerService erstellen
const progressTrackerService = createProgressTrackerService(getQuizStateManagerService());

// Re-export der Funktionen
export const getQuizProgress = (quizId: string): number => 
  progressTrackerService.getQuizProgress(quizId);

export const getQuizProgressString = (quizId: string): string | null => 
  progressTrackerService.getQuizProgressString(quizId);

export const isQuizCompleted = (quizId: string): boolean => 
  progressTrackerService.isQuizCompleted(quizId);

export const getNextActiveQuestion = (quizId: string, currentQuestionId?: number): number | null => 
  progressTrackerService.getNextActiveQuestion(quizId, currentQuestionId);

// Export für andere Services, die Zugriff benötigen
export const getProgressTrackerService = () => progressTrackerService;