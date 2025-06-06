// src/quiz/store/Hint.slice.ts - ENHANCED VERSION
import { StateCreator } from "zustand";
import { AvailableHint, AutoFreeHint, ContextualHint, PointTransaction, UseHintResult } from "../types/hint";
import { QuizStore } from "./Quiz.store";
import { HintUtils } from "../domain/hints";

export interface HintSlice {
  applyHint: (quizId: string, questionId: number, hintId: string) => Promise<UseHintResult>;
  recordWrongAnswer: (quizId: string, questionId: number, userAnswer: string) => ContextualHint[];
  getAvailableHints: (quizId: string, questionId: number) => AvailableHint[];
  
  // NEUE FUNKTION: Separate Auto-Free Hint Logic
  checkAutoFreeHints: (quizId: string, questionId: number) => AutoFreeHint[];
  
  // NEUE FUNKTION: Mark Auto-Free Hint als verwendet
  markAutoFreeHintAsUsed: (quizId: string, questionId: number, hintId: string) => void;
  
  // GLOBALE Points-Methoden (ohne quizId Parameter)
  addPoints: (transaction: PointTransaction) => void;
  deductPoints: (transaction: PointTransaction) => void;
  getPointsBalance: () => number;
  
  initializeHintState: (quizId: string, questionId: number) => void;
}

export const createHintSlice: StateCreator<QuizStore, [], [], HintSlice> = (set, get) => ({
  applyHint: async (quizId: string, questionId: number, hintId: string): Promise<UseHintResult> => {
    const quizState = get().quizStates[quizId];
    const globalUserPoints = get().userPoints;
    
    if (!quizState) {
      return { success: false, error: 'Quiz nicht gefunden' };
    }

    const question = quizState.questions.find(q => q.id === questionId);
    const hint = question?.hints?.find(h => h.id === hintId);
    const hintState = quizState.hintStates[questionId];

    if (!question || !hint || !hintState || !globalUserPoints) {
      return { success: false, error: 'Daten nicht gefunden' };
    }

    // Validierung mit globalen Points
    const validation = HintUtils.canUseHint(hint, hintState, globalUserPoints);
    if (!validation.canUse) {
      return { success: false, error: validation.reason };
    }

    // Content generieren
    const content = HintUtils.generateHintContent(hint, question);

    // Points transaction mit Quiz-Kontext
    const transaction = HintUtils.createPointTransaction(
      'spent',
      hint.cost,
      `Hint verwendet: ${hint.title}`,
      quizId,
      questionId,
      hintId
    );

    // State Update - Quiz State
    set((state) => ({
      quizStates: {
        ...state.quizStates,
        [quizId]: {
          ...state.quizStates[quizId],
          hintStates: {
            ...state.quizStates[quizId].hintStates,
            [questionId]: {
              ...state.quizStates[quizId].hintStates[questionId],
              usedHints: [...state.quizStates[quizId].hintStates[questionId].usedHints, hintId]
            }
          }
        }
      },
      // GLOBALE Points Update
      userPoints: {
        ...state.userPoints,
        totalPoints: state.userPoints.totalPoints - hint.cost,
        spentPoints: state.userPoints.spentPoints + hint.cost,
        pointsHistory: [...state.userPoints.pointsHistory, transaction]
      }
    }));

    return {
      success: true,
      hintContent: content,
      pointsDeducted: hint.cost
    };
  },

  recordWrongAnswer: (quizId: string, questionId: number, userAnswer: string): ContextualHint[] => {
    const quizState = get().quizStates[quizId];
    const question = quizState?.questions.find(q => q.id === questionId);
    const hintState = quizState?.hintStates[questionId];

    if (!question || !hintState) return [];

    const triggeredHints = HintUtils.checkForContextualHints(userAnswer, question, hintState);

    // State Update
    set((state) => ({
      quizStates: {
        ...state.quizStates,
        [quizId]: {
          ...state.quizStates[quizId],
          hintStates: {
            ...state.quizStates[quizId].hintStates,
            [questionId]: {
              ...state.quizStates[quizId].hintStates[questionId],
              wrongAttempts: state.quizStates[quizId].hintStates[questionId].wrongAttempts + 1,
              contextualHintsTriggered: [
                ...state.quizStates[quizId].hintStates[questionId].contextualHintsTriggered,
                ...triggeredHints.map(h => h.id)
              ]
            }
          }
        }
      }
    }));

    return triggeredHints;
  },

  // NEUE FUNKTION: Check Auto-Free Hints
  checkAutoFreeHints: (quizId: string, questionId: number): AutoFreeHint[] => {
    const quizState = get().quizStates[quizId];
    const question = quizState?.questions.find(q => q.id === questionId);
    const hintState = quizState?.hintStates[questionId];

    if (!question?.hints || !hintState) return [];

    // Filter für Auto-Free Hints die verfügbar sind
    return question.hints
      .filter((hint): hint is AutoFreeHint => 
        hint.type === 'auto_free' && 
        !hintState.usedHints.includes(hint.id) &&
        hintState.wrongAttempts >= hint.triggerAfterAttempts
      );
  },

  // NEUE FUNKTION: Mark Auto-Free Hint als verwendet
  markAutoFreeHintAsUsed: (quizId: string, questionId: number, hintId: string) => {
    set((state) => ({
      quizStates: {
        ...state.quizStates,
        [quizId]: {
          ...state.quizStates[quizId],
          hintStates: {
            ...state.quizStates[quizId].hintStates,
            [questionId]: {
              ...state.quizStates[quizId].hintStates[questionId],
              usedHints: [...state.quizStates[quizId].hintStates[questionId].usedHints, hintId]
            }
          }
        }
      }
    }));
  },

  getAvailableHints: (quizId: string, questionId: number): AvailableHint[] => {
    const quizState = get().quizStates[quizId];
    const globalUserPoints = get().userPoints;
    const question = quizState?.questions.find(q => q.id === questionId);
    const hintState = quizState?.hintStates[questionId];

    if (!question?.hints || !hintState || !globalUserPoints) return [];

    return question.hints.map(hint => {
      const validation = HintUtils.canUseHint(hint, hintState, globalUserPoints);
      return {
        hint,
        canUse: validation.canUse,
        reason: validation.reason,
        content: validation.canUse ? HintUtils.generateHintContent(hint, question) : undefined
      };
    });
  },

  // GLOBALE Points-Methoden
  addPoints: (transaction: PointTransaction) => {
    set((state) => ({
      userPoints: {
        ...state.userPoints,
        totalPoints: state.userPoints.totalPoints + transaction.amount,
        earnedPoints: state.userPoints.earnedPoints + transaction.amount,
        pointsHistory: [...state.userPoints.pointsHistory, transaction]
      }
    }));
  },

  deductPoints: (transaction: PointTransaction) => {
    set((state) => ({
      userPoints: {
        ...state.userPoints,
        totalPoints: state.userPoints.totalPoints - transaction.amount,
        spentPoints: state.userPoints.spentPoints + transaction.amount,
        pointsHistory: [...state.userPoints.pointsHistory, transaction]
      }
    }));
  },

  getPointsBalance: (): number => {
    return get().userPoints?.totalPoints || 0;
  },

  initializeHintState: (quizId: string, questionId: number) => {
    set((state) => {
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
                  contextualHintsTriggered: []
                }
              }
            }
          }
        };
      }
      return state;
    });
  }
});