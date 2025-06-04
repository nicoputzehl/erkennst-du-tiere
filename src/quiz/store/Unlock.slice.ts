import { StateCreator } from "zustand";
import { Quiz, UnlockCondition } from "../types";
import { isCompleted } from "../utils/quizStatistics";
import { QuizStore } from "./Quiz.store";

export interface UnlockSlice {
  pendingUnlocks: { // PERSISTED
    quizId: string;
    quizTitle: string;
    unlockedAt: number;
    shown: boolean;
  }[];
  checkForUnlocks: () => Quiz[];
  isQuizUnlocked: (quizId: string) => boolean;
  getUnlockProgress: (quizId: string) => {
    condition: UnlockCondition | null;
    progress: number;
    isMet: boolean;
  };
  detectMissedUnlocks: () => void;
  addPendingUnlock: (quizId: string, quizTitle: string) => void;
}


export const createUnlockSlice: StateCreator<QuizStore, [], [], UnlockSlice> = (set, get, store) => ({
  pendingUnlocks: [],
  checkForUnlocks: () => {
    const { quizConfigs, quizStates, quizzes, showToast, addPendingUnlock } = get(); // Zugriff auf andere Slices
    const unlockedQuizzes: Quiz[] = [];
    Object.values(quizConfigs).forEach(config => {
      if (config.initiallyLocked && config.unlockCondition) {
        const requiredState = quizStates[config.unlockCondition.requiredQuizId];
        if (requiredState && isCompleted(requiredState)) {
          const quiz = quizzes[config.id];
          if (quiz) {
            if (!get().pendingUnlocks.some(pu => pu.quizId === quiz.id)) {
              unlockedQuizzes.push(quiz);
              console.log(`[UnlockSlice] Quiz "${quiz.title}" has been unlocked!`);
              addPendingUnlock(quiz.id, quiz.title);
              setTimeout(() => {
                showToast(`🎉 "${quiz.title}" freigeschaltet!`, 'success', 4000);
              }, 300);
            }
          }
        }
      }
    });
    return unlockedQuizzes;
  },
  isQuizUnlocked: (quizId: string) => {
    const { quizConfigs, quizStates } = get();
    const config = quizConfigs[quizId];
    if (!config || !config.initiallyLocked) return true;
    if (!config.unlockCondition) return true;
    const requiredState = quizStates[config.unlockCondition.requiredQuizId];
    return requiredState ? isCompleted(requiredState) : false;
  },
  getUnlockProgress: (quizId: string) => {
    const { quizConfigs, quizStates, getQuizProgress } = get(); // Zugriff auf getQuizProgress aus QuizStateSlice
    const config = quizConfigs[quizId];
    if (!config?.initiallyLocked || !config.unlockCondition) {
      return { condition: null, progress: 100, isMet: true };
    }
    const requiredState = quizStates[config.unlockCondition.requiredQuizId];
    const isRequiredCompleted = requiredState ? isCompleted(requiredState) : false;
    const progress = isRequiredCompleted ? 100 : getQuizProgress(config.unlockCondition.requiredQuizId);
    return {
      condition: config.unlockCondition,
      progress,
      isMet: isRequiredCompleted
    };
  },
  detectMissedUnlocks: () => {
    console.log('[UnlockSlice] Checking for missed unlocks from completed quizzes');
    const { quizzes, quizStates, addPendingUnlock } = get();
    let unlocksFound = 0;
    Object.entries(quizStates).forEach(([quizId, quizState]) => {
      if (isCompleted(quizState)) {
        const unlockedQuizzes = Object.values(quizzes).filter(quiz => {
          const config = get().quizConfigs[quiz.id];
          return config?.initiallyLocked &&
            config.unlockCondition &&
            config.unlockCondition.requiredQuizId === quizId;
        });
        unlockedQuizzes.forEach(unlockedQuiz => {
          if (!get().pendingUnlocks.some(pu => pu.quizId === unlockedQuiz.id)) {
            console.log(`[UnlockSlice] Quiz "${unlockedQuiz.title}" should be unlocked by completed quiz ${quizId}`);
            addPendingUnlock(unlockedQuiz.id, unlockedQuiz.title);
            unlocksFound++;
          }
        });
      }
    });
    console.log(`[UnlockSlice] Detection complete - found ${unlocksFound} missed unlocks`);
  },
  addPendingUnlock: (quizId: string, quizTitle: string) => {
    set((state) => {
      const existingUnlock = state.pendingUnlocks.find(unlock => unlock.quizId === quizId);
      if (existingUnlock) {
        return state;
      }
      const newUnlock = {
        quizId,
        quizTitle,
        unlockedAt: Date.now(),
        shown: false,
      };
      return {
        ...state,
        pendingUnlocks: [...state.pendingUnlocks, newUnlock],
      };
    });
  },
});
