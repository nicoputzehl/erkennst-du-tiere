import type { StateCreator } from "zustand";
import { HintUtils } from "../../domain/hints";
import type { QuestionBase } from "../../types";
import {
  HintType,
  type AutoFreeHint,
  type Hint,
  type HintTriggerResult,
  type PointTransaction,
  type UseHintResult,
  type UsedHint,
  type VisibleHint,
} from "../../types/hint";
import type { QuizStore } from "../Store";
import { isLetterCountHint, isStandardHint } from "../../domain/hints/validation";
import { getFirstLetter, getLetterCount } from "../../domain/hints/standard";


export interface HintSlice {
  applyHint: (
    quizId: string,
    questionId: number,
    hintId: string,
  ) => Promise<UseHintResult>;
  recordWrongAnswer: (
    quizId: string,
    questionId: number,
    userAnswer: string,
  ) => HintTriggerResult;
  getUsedHints: (quizId: string, questionId: number) => UsedHint[];
  checkAutoFreeHints: (quizId: string, questionId: number) => AutoFreeHint[];

  addPoints: (transaction: PointTransaction) => void;
  deductPoints: (transaction: PointTransaction) => void;
  getPointsBalance: () => number;
  initializeHintState: (quizId: string, questionId: number) => void;
}

const generateUsedHint = (hint: Hint, question: QuestionBase): UsedHint => {
  return {
    id: hint.id,
    title: hint.title ?? "Kleiner Tipp",
    content: hint.content,
  };
};

const generateVisibleHint = (hint: Hint, question: QuestionBase): VisibleHint | null => {
  if (!isStandardHint(hint)) return null
  if (isLetterCountHint(hint)) return { type: HintType.LETTER_COUNT, value: getLetterCount(question) }
  return {
    type: HintType.FIRST_LETTER,
    value: getFirstLetter(question)
  }
}

export const createHintSlice: StateCreator<QuizStore, [], [], HintSlice> = (
  set,
  get,
) => ({
  applyHint: async (
    quizId: string,
    questionId: number,
    hintId: string,
  ): Promise<UseHintResult> => {
    const state = get();
    const quizState = state.quizStates[quizId];
    const globalUserPoints = state.userPoints;

    if (!quizState) {
      return { success: false, error: "Quiz nicht gefunden." };
    }

    const question = quizState.questions.find((q) => q.id === questionId);
    const hintState = quizState.hintStates[questionId];

    if (!question || !hintState || !globalUserPoints) {
      return { success: false, error: "Benötigte Daten für den Hinweis nicht gefunden." };
    }

    const allAvailableHints = HintUtils.generateAllHints(question);
    const hint = allAvailableHints.find((h) => h.id === hintId);

    if (!hint) {
      return { success: false, error: "Hint nicht gefunden." };
    }

    const validation = HintUtils.canUseHint(hint, hintState, globalUserPoints);
    if (!validation.canUse) {
      return { success: false, error: validation.reason };
    }

    const usedHint = generateUsedHint(hint, question);
    const visibleHint = generateVisibleHint(hint, question);
    const isAutoFree = HintUtils.isAutoFreeHint(hint);

    const costs = isAutoFree || HintUtils.isContextualHint(hint) ? 0 : (hint as any).cost || 0;

    set((currentState) => {
      const newQuizStates = { ...currentState.quizStates };
      const newQuizState = { ...newQuizStates[quizId] };
      const newHintStates = { ...newQuizState.hintStates };
      const newHintState = { ...newHintStates[questionId] };

      // Update usedHints
      newHintState.usedHints = [...newHintState.usedHints, usedHint];

      // Update visbleHints 
      newHintState.visibleHints = visibleHint ? [...newHintState.visibleHints, visibleHint] : newHintState.visibleHints;

      // Spezifisch für Auto-Free Hints
      if (isAutoFree) {
        newHintState.autoFreeHintsUsed = [
          ...(newHintState.autoFreeHintsUsed || []),
          hint.id,
        ];
      }

      newHintStates[questionId] = newHintState;
      newQuizState.hintStates = newHintStates;
      newQuizStates[quizId] = newQuizState;

      // Update global user points if costs apply
      const newUserPoints = { ...currentState.userPoints };
      if (costs > 0) {
        const transaction = HintUtils.createPointTransaction(
          "spent",
          costs,
          `Hint verwendet: ${hint.title}`,
          quizId,
          questionId,
          hintId,
        );
        newUserPoints.totalPoints -= costs;
        newUserPoints.spentPoints += costs;
        newUserPoints.pointsHistory = [...newUserPoints.pointsHistory, transaction];
      }

      return {
        quizStates: newQuizStates,
        userPoints: newUserPoints,
      };
    });

    return {
      success: true,
      hintContent: usedHint.content,
      pointsDeducted: costs,
    };
  },

  recordWrongAnswer: (
    quizId: string,
    questionId: number,
    userAnswer: string,
  ): HintTriggerResult => {
    const quizState = get().quizStates[quizId];
    const question = quizState?.questions.find((q) => q.id === questionId);
    const hintState = quizState?.hintStates[questionId];

    if (!question || !hintState) {
      return { contextualHints: [], autoFreeHints: [] };
    }

    // Aktualisiere wrongAttempts
    set((state) => ({
      quizStates: {
        ...state.quizStates,
        [quizId]: {
          ...state.quizStates[quizId],
          hintStates: {
            ...state.quizStates[quizId].hintStates,
            [questionId]: {
              ...state.quizStates[quizId].hintStates[questionId],
              wrongAttempts: hintState.wrongAttempts + 1,
            },
          },
        },
      },
    }));

    // ==========================================
    // VEREINFACHTE HINT-TRIGGER-LOGIC
    // ==========================================

    // Verwende die neuen Triggering-Funktionen, die mit der strukturierten Hint-Definition arbeiten
    return HintUtils.checkTriggeredHints(userAnswer, question, hintState);
  },

  checkAutoFreeHints: (quizId: string, questionId: number): AutoFreeHint[] => {
    const quizState = get().quizStates[quizId];
    const question = quizState?.questions.find((q) => q.id === questionId);
    const hintState = quizState?.hintStates[questionId];

    if (!question || !hintState) return [];

    // ==========================================
    // NEUE AUTO-FREE-HINTS-LOGIC
    // ==========================================

    // Alle Hints für die Frage generieren und Auto-Free Hints filtern
    const allHints = HintUtils.generateAllHints(question);

    return allHints.filter((hint): hint is AutoFreeHint =>
      HintUtils.isAutoFreeHint(hint) &&
      !hintState.usedHints.some((uh) => uh.id === hint.id) &&
      !hintState.autoFreeHintsUsed?.includes(hint.id) &&
      hintState.wrongAttempts >= hint.triggerAfterAttempts,
    );
  },


  getUsedHints: (quizId: string, questionId: number): UsedHint[] => {
    const quizState = get().quizStates[quizId];
    const hintState = quizState?.hintStates[questionId];
    return hintState?.usedHints || [];
  },

  addPoints: (transaction: PointTransaction) => {
    set((state) => ({
      userPoints: {
        ...state.userPoints,
        totalPoints: state.userPoints.totalPoints + transaction.amount,
        earnedPoints: state.userPoints.earnedPoints + transaction.amount,
        pointsHistory: [...state.userPoints.pointsHistory, transaction],
      },
    }));
  },

  deductPoints: (transaction: PointTransaction) => {
    set((state) => ({
      userPoints: {
        ...state.userPoints,
        totalPoints: state.userPoints.totalPoints - transaction.amount,
        spentPoints: state.userPoints.spentPoints + transaction.amount,
        pointsHistory: [...state.userPoints.pointsHistory, transaction],
      },
    }));
  },

  getPointsBalance: (): number => {
    return get().userPoints?.totalPoints || 0;
  },

  initializeHintState: (quizId: string, questionId: number) => {
    set((state) => {
      if (!state.quizStates[quizId]) {
        console.warn(`Quiz with ID ${quizId} not found during hint state initialization.`);
        return state;
      }

      if (!state.quizStates[quizId].hintStates[questionId]) {
        return {
          quizStates: {
            ...state.quizStates,
            [quizId]: {
              ...state.quizStates[quizId],
              hintStates: {
                ...state.quizStates[quizId].hintStates,
                [questionId]: {
                  questionId,
                  usedHints: [],
                  wrongAttempts: 0,
                  autoFreeHintsUsed: [],
                  visibleHints: []
                },
              },
            },
          },
        };
      }
      return state;
    });
  },
});