// src/quiz/services/quizStateManager.ts

import { ContentKey } from '@/src/core/content/types';
import { QuizState } from '@/src/quiz/types';
import { createQuizStateManagerService } from './factories/quizStateManagerFactory';
import { getQuizRegistryService } from './quizRegistry';

// Instanz des QuizStateManagerService erstellen
const quizStateManagerService = createQuizStateManagerService(getQuizRegistryService());

// Re-export der Funktionen
export const initializeQuizState = <T extends ContentKey = ContentKey>(quizId: string): QuizState<T> | null => 
  quizStateManagerService.initializeQuizState<T>(quizId);

export const getQuizState = <T extends ContentKey = ContentKey>(quizId: string): QuizState<T> | undefined => 
  quizStateManagerService.getQuizState<T>(quizId);

export const updateQuizState = <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>): void => 
  quizStateManagerService.updateQuizState<T>(quizId, newState);

export const resetQuizState = <T extends ContentKey = ContentKey>(quizId: string): QuizState<T> | null => 
  quizStateManagerService.resetQuizState<T>(quizId);

export const getAllQuizStates = (): Map<string, QuizState<ContentKey>> => 
  quizStateManagerService.getAllQuizStates();

// Export für andere Services, die Zugriff benötigen
export const getQuizStateManagerService = () => quizStateManagerService;