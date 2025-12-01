import type { StateCreator } from "zustand";
import { HintUtils } from "../../domain/hints";
import { QuizUtils } from "../../domain/quiz";
import { QuestionStatus, type ContextualHint, type PointTransaction, type Quiz, type QuizConfig, type QuizState, type UnlockCondition } from "../../types";
import type { QuizStore } from "../Store";

export interface AnswerResult {
  isCorrect: boolean;
  newState?: QuizState;
  nextQuestionId?: number;
  unlockedQuizzes: Quiz[];
  completedQuiz: boolean;
  triggeredHints?: ContextualHint[];
}


export interface QuizSlice {
  // === DATEN ===
  quizzes: Record<string, Quiz>;
  quizConfigs: Record<string, QuizConfig>;
  isQuizDataLoaded: boolean;

  // === ZUSTÄNDE ===
  quizStates: Record<string, QuizState>;

  // === UNLOCK-STATE ===
  pendingUnlocks: {
    quizId: string;
    quizTitle: string;
    unlockedAt: number;
    shown: boolean;
  }[];

  // === DATA ACTIONS ===
  registerQuiz: (config: QuizConfig) => void;
  setQuizDataLoaded: (loaded: boolean) => void;

  // === STATE ACTIONS ===
  initializeQuizState: (quizId: string) => QuizState | null;
  updateQuizState: (quizId: string, newState: QuizState) => void;
  resetQuizState: (quizId: string) => QuizState | null;
  resetAllQuizStates: () => void;
  answerQuestion: (quizId: string, questionId: number, answer: string) => Promise<AnswerResult>;
  solveAllQuizQuestions: (quizId: string) => void;

  // === UNLOCK ACTIONS ===
  checkForUnlocks: () => Quiz[];
  isQuizUnlocked: (quizId: string) => boolean;
  getUnlockProgress: (quizId: string) => { condition: UnlockCondition | null; progress: number; isMet: boolean };
  detectMissedUnlocks: () => void;
  addPendingUnlock: (quizId: string, quizTitle: string) => void;

  // === PROGRESS GETTERS ===
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
}

export const createQuizSlice: StateCreator<QuizStore, [], [], QuizSlice> = (set, get) => ({
  // === STATE ===
  quizzes: {},
  quizConfigs: {},
  isQuizDataLoaded: false,
  quizStates: {},
  pendingUnlocks: [],

  // === DATA ACTIONS ===
  registerQuiz: (config: QuizConfig) => {
    console.log(`[QuizSlice] Registering quiz: ${config.id}`);
    const quiz: Quiz = {
      id: config.id,
      title: config.title,
      questions: config.questions,
      titleImage: config.titleImage,
      description: config.description,
    };
    set((state) => ({
      quizzes: { ...state.quizzes, [config.id]: quiz },
      quizConfigs: { ...state.quizConfigs, [config.id]: config },
    }));
  },

  setQuizDataLoaded: (loaded: boolean) => {
    console.log(`[QuizSlice] Setting isQuizDataLoaded to: ${loaded}`);
    set({ isQuizDataLoaded: loaded });
  },

  // === STATE ACTIONS ===
  initializeQuizState: (quizId: string) => {
    const { quizStates, quizzes, quizConfigs } = get();
    if (quizStates[quizId]) {
      return quizStates[quizId];
    }
    const quiz = quizzes[quizId];
    const config = quizConfigs[quizId];
    if (!quiz || !config) {
      console.warn(`[QuizSlice] Quiz ${quizId} not found for initialization`);
      return null;
    }
    const newState = QuizUtils.createQuizState(quiz, {
      initialUnlockedQuestions: config.initialUnlockedQuestions || 2,
    });
    set((state) => ({
      quizStates: { ...state.quizStates, [quizId]: newState },
    }));
    return newState;
  },

  updateQuizState: (quizId: string, newState: QuizState) => {
    console.log(`[QuizSlice] Updating quiz state for ${quizId}`);
    set((state) => ({
      quizStates: { ...state.quizStates, [quizId]: newState },
    }));
  },

solveAllQuizQuestions(quizId: string) {
  const { quizStates, updateQuizState, checkForUnlocks, showToast } = get();
  const state = quizStates[quizId];
  if (!state?.questions?.length) return;


  const updatedQuestions = state.questions.map((question) => ({
    ...question,
    isCorrect: true,
    status: QuestionStatus.SOLVED,
    unlocked: true,
  }));

  const newState: QuizState = {
    ...state,
    questions: updatedQuestions,
    completedQuestions: updatedQuestions.length,
  };

  updateQuizState(quizId, newState);


  if (updatedQuestions.length > 0 && newState.completedQuestions === updatedQuestions.length) {
    checkForUnlocks();

    if (showToast) {
      showToast(`🎉 Quiz "${newState.title}" vollständig gelöst!`, "success", 4000);
    }
  }
},


  resetQuizState: (quizId: string) => {
    const { quizzes, quizConfigs } = get();
    const quiz = quizzes[quizId];
    const config = quizConfigs[quizId];
    if (!quiz || !config) return null;

    const newState = QuizUtils.createQuizState(quiz, {
      initialUnlockedQuestions: config.initialUnlockedQuestions || 2,
    });
    set((state) => ({
      quizStates: { ...state.quizStates, [quizId]: newState },
    }));
    return newState;
  },

  resetAllQuizStates: () => {
    console.log("[QuizSlice] Resetting all quiz states...");
    const { quizzes, quizConfigs } = get();
    const newQuizStates: Record<string, QuizState> = {};

    for (const quiz of Object.values(quizzes)) {
      const config = quizConfigs[quiz.id];
      if (config) {
        const newQuizState = QuizUtils.createQuizState(quiz, {
          initialUnlockedQuestions: config.initialUnlockedQuestions || 2,
        });
        newQuizStates[quiz.id] = newQuizState;
      }
    }

    set({
      quizStates: newQuizStates,
      pendingUnlocks: [], // Reset unlocks too
    });
  },

  answerQuestion: async (quizId: string, questionId: number, answer: string) => {
    console.log(`[QuizSlice] Processing answer for ${quizId}/${questionId}: "${answer}"`);

    const { quizStates, updateQuizState, showToast, addPoints } = get();
    const currentState = quizStates[quizId];

    if (!currentState) {
      console.warn(`[QuizSlice] Quiz state not found for ${quizId}`);
      return { isCorrect: false, unlockedQuizzes: [], completedQuiz: false };
    }

    const result = QuizUtils.calculateAnswerResult(currentState, questionId, answer);

    if (!result.isCorrect) {
      return { isCorrect: false, unlockedQuizzes: [], completedQuiz: false };
    }

    // Update state
    updateQuizState(quizId, result.newState);

    // Award points (using HintSlice)
    const question = result.newState.questions.find((q) => q.id === questionId);
    if (question) {
      const points = calculatePointsForCorrectAnswer(question);
      const transaction = createPointTransaction("earned", points, "Correct answer", quizId, questionId);
      addPoints(transaction);
    }

    // Check completion
    const completed = QuizUtils.isCompleted(result.newState);
    if (completed) {
      showToast(`🎉 Du hast das Quiz "${result.newState.title}" durchgespielt!`, "success", 4000);
    }

    // Check for unlocks (integrated unlock logic)
    const unlockedQuizzes = get().checkForUnlocks();

    return {
      isCorrect: true,
      newState: result.newState,
      nextQuestionId: QuizUtils.getNextActiveQuestionId(result.newState) ?? undefined,
      unlockedQuizzes,
      completedQuiz: completed,
    };
  },

  // === UNLOCK ACTIONS ===
  checkForUnlocks: () => {
    const { quizConfigs, quizStates, quizzes, showToast, addPendingUnlock } = get();
    const unlockedQuizzes: Quiz[] = [];

    for (const config of Object.values(quizConfigs)) {
      if (config.initiallyLocked && config.unlockCondition) {
        const isUnlocked = QuizUtils.isQuizUnlocked(config, quizStates);

        if (isUnlocked) {
          const quiz = quizzes[config.id];
          if (quiz && !get().pendingUnlocks.some((pu) => pu.quizId === quiz.id)) {
            unlockedQuizzes.push(quiz);
            addPendingUnlock(quiz.id, quiz.title);

            setTimeout(() => {
              showToast(`🎉 "${quiz.title}" unlocked!`, "success", 4000);
            }, 300);
          }
        }
      }
    }
    return unlockedQuizzes;
  },

  isQuizUnlocked: (quizId: string) => {
    const { quizConfigs, quizStates } = get();
    const config = quizConfigs[quizId];
    return QuizUtils.isQuizUnlocked(config, quizStates);
  },

  getUnlockProgress: (quizId: string) => {
    const { quizConfigs, quizStates } = get();
    const config = quizConfigs[quizId];
    return QuizUtils.getUnlockProgress(config, quizStates);
  },

  detectMissedUnlocks: () => {
    console.log("[QuizSlice] Checking for missed unlocks...");
    const { quizzes, quizStates, addPendingUnlock } = get();

    for (const [quizId, quizState] of Object.entries(quizStates)) {
      if (QuizUtils.isCompleted(quizState)) {
        const unlockedQuizzes = Object.values(quizzes).filter((quiz) => {
          const config = get().quizConfigs[quiz.id];
          return (
            config?.initiallyLocked &&
            config.unlockCondition &&
            config.unlockCondition.requiredQuizId === quizId
          );
        });

        for (const unlockedQuiz of unlockedQuizzes) {
          if (!get().pendingUnlocks.some((pu) => pu.quizId === unlockedQuiz.id)) {
            addPendingUnlock(unlockedQuiz.id, unlockedQuiz.title);
          }
        }
      }
    }
  },

  addPendingUnlock: (quizId: string, quizTitle: string) => {
    set((state) => {
      const existingUnlock = state.pendingUnlocks.find((unlock) => unlock.quizId === quizId);
      if (existingUnlock) return state;

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

  // === PROGRESS GETTERS ===
  getQuizProgress: (quizId: string) => {
    const { quizStates } = get();
    const state = quizStates[quizId];
    if (!state?.questions?.length) return 0;
    return Math.round((state.completedQuestions / state.questions.length) * 100);
  },

  getQuizProgressString: (quizId: string) => {
    const { quizStates } = get();
    const state = quizStates[quizId];
    if (!state?.questions?.length) return null;
    return `${state.completedQuestions}/${state.questions.length}`;
  },

  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => {
    const { quizStates } = get();
    const state = quizStates[quizId];
    if (!state) return null;
    return QuizUtils.getNextActiveQuestionId(state, currentQuestionId);
  },
});



function calculatePointsForCorrectAnswer(question: any): number {
  return HintUtils.calculatePointsForCorrectAnswer(question);
}

function createPointTransaction(
  type: "earned" | "spent",
  amount: number,
  reason: string,
  quizId?: string,
  questionId?: number
): PointTransaction {
  return HintUtils.createPointTransaction(type, amount, reason, quizId, questionId);
}