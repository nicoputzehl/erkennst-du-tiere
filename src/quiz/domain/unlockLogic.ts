import { isCompleted } from "./quizLogic";
import { Quiz, QuizState, UnlockCondition } from "../types";

/**
 * Überprüft, ob eine Freischaltbedingung erfüllt ist
 * Pure Funktion - benötigt alle relevanten Daten als Parameter
 */
const checkUnlockCondition = (
  condition: UnlockCondition,
  allQuizzes: Quiz[],
  quizStates: Map<string, QuizState>
): { isMet: boolean; progress: number } => {
  const unlockedQuizzes = allQuizzes.filter(quiz => !quiz.initiallyLocked);
  
  switch (condition.type) {
    case 'percentage': {
      let totalQuestions = 0;
      let totalCompleted = 0;

      for (const quiz of unlockedQuizzes) {
        const state = quizStates.get(quiz.id);
        if (state) {
          totalQuestions += state.questions.length;
          totalCompleted += state.completedQuestions;
        }
      }

      const currentPercentage = totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0;
      return {
        isMet: currentPercentage >= (condition.requiredPercentage || 0),
        progress: currentPercentage
      };
    }

    case 'completionCount': {
      const completedQuizzes = unlockedQuizzes.filter(quiz => {
        const state = quizStates.get(quiz.id);
        return state ? isCompleted(state) : false;
      }).length;
      
      return {
        isMet: completedQuizzes >= (condition.requiredCount || 0),
        progress: completedQuizzes
      };
    }

    case 'specificQuiz': {
      if (!condition.requiredQuizId) return { isMet: false, progress: 0 };
      
      const state = quizStates.get(condition.requiredQuizId);
      const isSpecificQuizCompleted = state ? isCompleted(state) : false;
      
      return {
        isMet: isSpecificQuizCompleted,
        progress: isSpecificQuizCompleted ? 100 : 0
      };
    }

    default:
      return { isMet: false, progress: 0 };
  }
};

/**
 * Ermittelt das nächste Quiz, das freigeschaltet werden kann
 */
const getNextUnlockableQuiz = (
  allQuizzes: Quiz[],
  quizStates: Map<string, QuizState>
): Quiz | null => {
  const lockedQuizzes = allQuizzes
    .filter(quiz => quiz.initiallyLocked)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  for (const quiz of lockedQuizzes) {
    if (quiz.unlockCondition) {
      const { isMet } = checkUnlockCondition(quiz.unlockCondition, allQuizzes, quizStates);
      if (isMet) {
        return quiz;
      }
    }
  }

  return null;
};

/**
 * Berechnet den Fortschritt für eine Freischaltbedingung
 */
const calculateUnlockProgress = (
  condition: UnlockCondition,
  allQuizzes: Quiz[],
  quizStates: Map<string, QuizState>
): { progress: number; isMet: boolean } => {
  return checkUnlockCondition(condition, allQuizzes, quizStates);
};

export { checkUnlockCondition, getNextUnlockableQuiz, calculateUnlockProgress };