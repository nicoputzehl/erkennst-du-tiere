import { calculateAnswerResult, getNextActiveQuestionId, isMultipleChoiceQuestion } from '../domain/quizLogic';
import { QuizState } from '../types';
import { getQuizState, updateQuizState } from './quizStateManager';
import { unlockNextQuiz } from './unlockManager';
import { normalizeString } from '@/utils/helper';

/**
 * Verarbeitet eine Antwort auf eine Quiz-Frage
 * Unterstützt sowohl Text- als auch Multiple-Choice-Fragen
 */
export const answerQuizQuestion = <T = any>(
  quizId: string,
  questionId: number,
  answer: string
): {
  isCorrect: boolean;
  newState?: QuizState<T>;
  nextQuestionId?: number;
  unlockedQuiz?: any;
} => {
  const currentState = getQuizState<T>(quizId);

  if (!currentState) {
    throw new Error(`Quiz with ID ${quizId} not found`);
  }

  // Finden der aktuellen Frage
  const question = currentState.questions.find(q => q.id === questionId);

  if (!question) {
    throw new Error(`Question with ID ${questionId} not found in quiz ${quizId}`);
  }

  // Entscheiden, ob wir die Antwort normalisieren müssen (nur bei Text-Fragen)
  let processedAnswer = answer;
  if (!isMultipleChoiceQuestion(question)) {
    processedAnswer = normalizeString(answer);
  }

  // Antwort verarbeiten
  const result = calculateAnswerResult(currentState, questionId, processedAnswer);

  if (result.isCorrect) {
    updateQuizState(quizId, result.newState as QuizState<T>);
    const nextQuestionId = getNextActiveQuestionId(result.newState);
    const unlockedQuiz = unlockNextQuiz();

    return {
      isCorrect: true,
      newState: result.newState as QuizState<T>,
      nextQuestionId: nextQuestionId || undefined,
      unlockedQuiz: unlockedQuiz || undefined
    };
  }

  return { isCorrect: false };
};
/**
 * Holt die Antwortmöglichkeiten für eine Multiple-Choice-Frage
 * @param quizId Die ID des Quiz
 * @param questionId Die ID der Frage
 * @returns Ein Array von Antwortmöglichkeiten oder null, wenn keine gefunden wurden
 */
export const getMultipleChoiceOptions = <T = any>(
  quizId: string,
  questionId: number
): string[] | null => {
  const quizState = getQuizState<T>(quizId);
  if (!quizState) return null;

  const question = quizState.questions.find(q => q.id === questionId);
  if (!question) return null;

  if (isMultipleChoiceQuestion(question)) {
    return question.choices;
  }

  return null;
};