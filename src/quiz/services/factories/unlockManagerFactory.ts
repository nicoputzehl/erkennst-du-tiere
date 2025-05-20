import { Quiz, UnlockCondition } from '@/src/quiz/types';
import { checkUnlockCondition, getNextUnlockableQuiz, calculateUnlockProgress } from '@/src/quiz/domain/unlockLogic';
import { QuizRegistryService } from './quizRegistryFactory';
import { QuizStateManagerService } from './quizStateManagerFactory';

export interface UnlockManagerService {
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

export const createUnlockManagerService = (
  quizRegistryService: QuizRegistryService,
  quizStateManagerService: QuizStateManagerService
): UnlockManagerService => {
  // Event-System
  const unlockListeners: ((unlockedQuiz: Quiz) => void)[] = [];

  console.log('[UnlockManagerService] Creating new service instance');

  const notifyUnlockListeners = (unlockedQuiz: Quiz): void => {
    console.log(`[UnlockManagerService] Notifying listeners of unlocked quiz: '${unlockedQuiz.id}'`);
    unlockListeners.forEach(listener => listener(unlockedQuiz));
  };


  // Funktion für unlockNextQuiz außerhalb der Rückgabe definieren, 
  // damit wir sie in checkForUnlocks ohne this nutzen können
  const unlockNextQuiz = (): Quiz | null => {
    console.log(`[UnlockManagerService] Attempting to unlock next quiz`);
    const allQuizzes = quizRegistryService.getAllQuizzes();
    const quizStates = quizStateManagerService.getAllQuizStates();
    const nextUnlockable = getNextUnlockableQuiz(allQuizzes, quizStates);

    if (nextUnlockable) {
      const updatedQuiz = { ...nextUnlockable, initiallyLocked: false };
      quizRegistryService.updateQuiz(nextUnlockable.id, updatedQuiz);
      
      console.log(`[UnlockManagerService] Unlocked quiz: '${updatedQuiz.id}'`);
      notifyUnlockListeners(updatedQuiz);
      return updatedQuiz;
    }

    console.log(`[UnlockManagerService] No quiz to unlock`);
    return null;
  };


  return {
    getUnlockProgress: (quizId: string): {
      condition: UnlockCondition | null;
      progress: number;
      isMet: boolean;
    } => {
      console.log(`[UnlockManagerService] Getting unlock progress for quiz '${quizId}'`);
      const quiz = quizRegistryService.getQuizById(quizId);
      if (!quiz || !quiz.unlockCondition) {
        console.log(`[UnlockManagerService] No unlock condition for quiz '${quizId}'`);
        return { condition: null, progress: 0, isMet: true };
      }
    

      const allQuizzes = quizRegistryService.getAllQuizzes();
      const quizStates = quizStateManagerService.getAllQuizStates();
      const { isMet, progress } = calculateUnlockProgress(
        quiz.unlockCondition,
        allQuizzes,
        quizStates
      );

      console.log(`[UnlockManagerService] Unlock progress for quiz '${quizId}': ${progress}%, met: ${isMet}`);
      return {
        condition: quiz.unlockCondition,
        progress,
        isMet
      };
    },

    unlockNextQuiz,

    checkAllUnlockConditions: (): {
      unlockedQuizzes: Quiz[];
      availableUnlocks: { quiz: Quiz; condition: UnlockCondition }[]
    } => {
      console.log(`[UnlockManagerService] Checking all unlock conditions`);
      const allQuizzes = quizRegistryService.getAllQuizzes();
      const quizStates = quizStateManagerService.getAllQuizStates();
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

      console.log(`[UnlockManagerService] Available unlocks: ${availableUnlocks.length}`);
      return { unlockedQuizzes, availableUnlocks };
    },

    checkForUnlocks: (): Quiz[] => {
      console.log(`[UnlockManagerService] Checking for unlocks`);
      const unlockedQuizzes: Quiz[] = [];
      let nextUnlockable = unlockNextQuiz();
      
      while (nextUnlockable) {
        unlockedQuizzes.push(nextUnlockable);
        nextUnlockable = unlockNextQuiz();
      }
      
      console.log(`[UnlockManagerService] Unlocked ${unlockedQuizzes.length} quizzes`);
      return unlockedQuizzes;
    },

    addUnlockListener: (listener: (unlockedQuiz: Quiz) => void): void => {
      console.log(`[UnlockManagerService] Adding unlock listener`);
      unlockListeners.push(listener);
    },

    removeUnlockListener: (listener: (unlockedQuiz: Quiz) => void): void => {
      console.log(`[UnlockManagerService] Removing unlock listener`);
      const index = unlockListeners.indexOf(listener);
      if (index !== -1) {
        unlockListeners.splice(index, 1);
      }
    }
  };
};