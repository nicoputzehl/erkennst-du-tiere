// src/quiz/services/quizRegistry.ts

import { createQuizRegistryService } from './factories/quizRegistryFactory';
import { ContentKey } from '@/src/core/content/types';
import { Quiz } from '@/src/quiz/types';

// Instanz des Quiz-Registrierungsdienstes erstellen
const quizRegistryService = createQuizRegistryService();

// Re-export der Funktionen
export const registerQuiz = <T extends ContentKey = ContentKey>(
  id: string,
  quiz: Quiz<T>,
  contentType: string = 'generic'
): void => quizRegistryService.registerQuiz(id, quiz, contentType);

export const getQuizById = <T extends ContentKey = ContentKey>(
  id: string
): Quiz<T> | undefined => quizRegistryService.getQuizById(id);

export const getAllQuizzes = <T extends ContentKey = ContentKey>(): Quiz<T>[] =>
  quizRegistryService.getAllQuizzes();

export const getQuizzesByContentType = <T extends ContentKey = ContentKey>(
  contentType: string
): Quiz<T>[] => quizRegistryService.getQuizzesByContentType(contentType);

export const updateQuiz = <T extends ContentKey = ContentKey>(
  id: string,
  updatedQuiz: Quiz<T>,
  contentType?: string
): void => quizRegistryService.updateQuiz(id, updatedQuiz, contentType);

// Export für andere Services, die Zugriff benötigen
export const getQuizRegistryService = () => quizRegistryService;