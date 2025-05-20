import { Quiz } from '../types';

// Private state (nur in diesem Modul sichtbar)
let quizRegistry: Map<string, Quiz<any>> = new Map();

/**
 * Registriert ein neues Quiz im System
 */
export const registerQuiz = <T = any>(id: string, quiz: Quiz<T>): void => {
  quizRegistry.set(id, quiz);
};

/**
 * Gibt ein Quiz anhand seiner ID zurück
 */
export const getQuizById = <T = any>(id: string): Quiz<T> | undefined => {
  return quizRegistry.get(id) as Quiz<T> | undefined;
};

/**
 * Gibt alle registrierten Quizzes zurück
 */
export const getAllQuizzes = <T = any>(): Quiz<T>[] => {
  return Array.from(quizRegistry.values()) as Quiz<T>[];
};

/**
 * Aktualisiert ein Quiz in der Registry
 */
export const updateQuiz = <T = any>(id: string, updatedQuiz: Quiz<T>): void => {
  quizRegistry.set(id, updatedQuiz);
};