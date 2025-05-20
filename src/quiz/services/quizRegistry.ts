import { ContentKey } from '../../core/content/types';
import { Quiz } from '../types';

// Typ für den Registry-Eintrag
interface QuizRegistryEntry {
  quiz: Quiz<any>;
  contentType: string;
}

// Private state (nur in diesem Modul sichtbar)
let quizRegistry: Map<string, QuizRegistryEntry> = new Map();

/**
 * Registriert ein neues Quiz im System
 * @param id Eindeutige ID des Quiz
 * @param quiz Quiz-Objekt
 * @param contentType Typ des Contents (z.B. 'animal', 'movie')
 */
export const registerQuiz = <T extends ContentKey = ContentKey>(
  id: string, 
  quiz: Quiz<T>,
  contentType: string = 'generic'
): void => {
  quizRegistry.set(id, { quiz, contentType });
};

/**
 * Gibt ein Quiz anhand seiner ID zurück
 */
export const getQuizById = <T extends ContentKey = ContentKey>(id: string): Quiz<T> | undefined => {
  const entry = quizRegistry.get(id);
  return entry ? entry.quiz as Quiz<T> : undefined;
};

/**
 * Gibt alle registrierten Quizzes zurück
 */
export const getAllQuizzes = <T extends ContentKey = ContentKey>(): Quiz<T>[] => {
  const quizzes = Array.from(quizRegistry.values()).map(entry => entry.quiz) as Quiz<T>[];
  console.log(`getAllQuizzes returning ${quizzes.length} quizzes`);
  return quizzes;
};

/**
 * Gibt alle Quizzes eines bestimmten Content-Typs zurück
 */
export const getQuizzesByContentType = <T extends ContentKey = ContentKey>(contentType: string): Quiz<T>[] => {
  return Array.from(quizRegistry.values())
    .filter(entry => entry.contentType === contentType)
    .map(entry => entry.quiz) as Quiz<T>[];
};

/**
 * Aktualisiert ein Quiz in der Registry
 */
export const updateQuiz = <T extends ContentKey = ContentKey>(
  id: string, 
  updatedQuiz: Quiz<T>,
  contentType?: string
): void => {
  const existingEntry = quizRegistry.get(id);
  quizRegistry.set(id, { 
    quiz: updatedQuiz, 
    contentType: contentType || (existingEntry ? existingEntry.contentType : 'generic') 
  });
};