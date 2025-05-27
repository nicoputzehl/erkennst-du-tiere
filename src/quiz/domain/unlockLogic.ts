import { isCompleted } from "./quizLogic";
import { Quiz, QuizState, SimpleUnlockCondition } from "../types";

export const checkSimpleUnlockCondition = (
  condition: SimpleUnlockCondition,
  quizStates: Record<string, QuizState>
): { isMet: boolean; progress: number } => {
  const requiredQuizState = quizStates[condition.requiredQuizId];
  const isRequiredQuizCompleted = requiredQuizState ? isCompleted(requiredQuizState) : false;
  
  return {
    isMet: isRequiredQuizCompleted,
    progress: isRequiredQuizCompleted ? 100 : 0
  };
};

export const getNextUnlockableQuiz = (
  allQuizzes: Quiz[],
  quizStates: Record<string, QuizState>
): Quiz | null => {
  const lockedQuizzes = allQuizzes
    .filter(quiz => quiz.initiallyLocked && quiz.unlockCondition)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  for (const quiz of lockedQuizzes) {
    if (quiz.unlockCondition) {
      const { isMet } = checkSimpleUnlockCondition(quiz.unlockCondition, quizStates);
      if (isMet) {
        return quiz;
      }
    }
  }

  return null;
};

export const calculateSimpleUnlockProgress = (
  condition: SimpleUnlockCondition,
  quizStates: Record<string, QuizState>
): { progress: number; isMet: boolean } => {
  return checkSimpleUnlockCondition(condition, quizStates);
};

export const canUnlockQuiz = (
  quiz: Quiz,
  quizStates: Record<string, QuizState>
): boolean => {
  if (!quiz.initiallyLocked || !quiz.unlockCondition) {
    return true; // Kein Unlock erforderlich
  }
  
  const { isMet } = checkSimpleUnlockCondition(quiz.unlockCondition, quizStates);
  return isMet;
};

export { checkSimpleUnlockCondition as checkUnlockCondition }; // Backward compatibility
export { calculateSimpleUnlockProgress as calculateUnlockProgress }; // Backward compatibility