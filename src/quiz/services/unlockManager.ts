import { Quiz, UnlockCondition } from '../types';
import { checkUnlockCondition, getNextUnlockableQuiz, calculateUnlockProgress } from '../domain/unlockLogic';
import { getAllQuizzes, updateQuiz } from './quizRegistry';
import { getAllQuizStates } from './quizStateManager';

// Event-System statt einem einzelnen Callback
type UnlockListener = (unlockedQuiz: Quiz) => void;
const unlockListeners: UnlockListener[] = [];

/**
 * Registriert einen Listener für Quiz-Freischaltungen
 */
export const addUnlockListener = (listener: UnlockListener): void => {
  unlockListeners.push(listener);
};

/**
 * Entfernt einen Unlock-Listener
 */
export const removeUnlockListener = (listener: UnlockListener): void => {
  const index = unlockListeners.indexOf(listener);
  if (index !== -1) {
    unlockListeners.splice(index, 1);
  }
};

/**
 * Löst die Benachrichtigung für alle Listener aus
 */
const notifyUnlockListeners = (unlockedQuiz: Quiz): void => {
  unlockListeners.forEach(listener => listener(unlockedQuiz));
};

/**
 * Versucht, das nächste Quiz freizuschalten
 */
export const unlockNextQuiz = (): Quiz | null => {
  const allQuizzes = getAllQuizzes();
  const quizStates = getAllQuizStates();
  const nextUnlockable = getNextUnlockableQuiz(allQuizzes, quizStates);

  if (nextUnlockable) {
    const updatedQuiz = { ...nextUnlockable, initiallyLocked: false };
    updateQuiz(nextUnlockable.id, updatedQuiz);
    
    notifyUnlockListeners(updatedQuiz);
    return updatedQuiz;
  }

  return null;
};

/**
 * Berechnet den Fortschritt für eine Freischaltbedingung
 */
export const getUnlockProgress = (quizId: string): {
  condition: UnlockCondition | null;
  progress: number;
  isMet: boolean;
} => {
  const quiz = getAllQuizzes().find(q => q.id === quizId);
  if (!quiz || !quiz.unlockCondition) {
    return { condition: null, progress: 0, isMet: true };
  }

  const allQuizzes = getAllQuizzes();
  const quizStates = getAllQuizStates();
  const { isMet, progress } = calculateUnlockProgress(
    quiz.unlockCondition,
    allQuizzes,
    quizStates
  );

  return {
    condition: quiz.unlockCondition,
    progress,
    isMet
  };
};

/**
 * Prüft alle Unlock-Bedingungen und gibt Informationen zurück
 */
export const checkAllUnlockConditions = (): {
  unlockedQuizzes: Quiz[];
  availableUnlocks: { quiz: Quiz; condition: UnlockCondition }[]
} => {
  const allQuizzes = getAllQuizzes();
  const quizStates = getAllQuizStates();
  const unlockedQuizzes: Quiz[] = [];
  const availableUnlocks: { quiz: Quiz; condition: UnlockCondition }[] = [];

  for (const quiz of allQuizzes.filter(q => q.initiallyLocked)) {
    if (quiz.unlockCondition) {
      const { isMet } = checkUnlockCondition(quiz.unlockCondition, allQuizzes, quizStates);
      if (isMet) {
        availableUnlocks.push({ quiz, condition: quiz.unlockCondition });
      }
    }
  }

  return { unlockedQuizzes, availableUnlocks };
};

/**
 * Prüft, ob neue Quizzes freigeschaltet werden können
 */
export const checkForUnlocks = (): Quiz[] => {
  const unlockedQuizzes: Quiz[] = [];
  let nextUnlockable = unlockNextQuiz();
  
  while (nextUnlockable) {
    unlockedQuizzes.push(nextUnlockable);
    nextUnlockable = unlockNextQuiz();
  }
  
  return unlockedQuizzes;
};