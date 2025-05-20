import { isCompleted, getNextActiveQuestionId } from '../domain/quizLogic';
import { getQuizState } from './quizStateManager';

/**
 * Berechnet den prozentualen Fortschritt eines Quiz
 */
export const getQuizProgress = (quizId: string): number => {
  const state = getQuizState(quizId);
  return state ? (state.completedQuestions / state.questions.length) * 100 : 0;
};

/**
 * Gibt den Fortschritt eines Quiz als formatierten String zurück
 */
export const getQuizProgressString = (quizId: string): string | null => {
  const state = getQuizState(quizId);
  return state ? `${state.completedQuestions} von ${state.questions.length} gelöst` : null;
};

/**
 * Prüft, ob ein Quiz vollständig abgeschlossen ist
 */
export const isQuizCompleted = (quizId: string): boolean => {
  const state = getQuizState(quizId);
  return state ? isCompleted(state) : false;
};

/**
 * Gibt die ID der nächsten aktiven Frage zurück
 * Verwendet die optimierte Logik aus quizLogic
 */
export const getNextActiveQuestion = (quizId: string, currentQuestionId?: number): number | null => {
  const state = getQuizState(quizId);
  return state ? getNextActiveQuestionId(state, currentQuestionId) : null;
};