import { ContentKey } from '@/src/core/content/types';
import { QuizState } from '@/src/quiz/types';
import { calculateAnswerResult, getNextActiveQuestionId } from '@/src/quiz/domain/quizLogic';
import { QuizStateManagerService } from './quizStateManagerFactory';
import { normalizeString } from '@/utils/helper';
import { UnlockManagerService } from './unlockManagerFactory';

export interface AnswerProcessorService {
  answerQuizQuestion: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string
  ) => Promise<{
    isCorrect: boolean;
    newState?: QuizState<T>;
    nextQuestionId?: number;
    unlockedQuiz?: any;
  }>;
}

export const createAnswerProcessorService = (
  quizStateManagerService: QuizStateManagerService,
  unlockManagerService: UnlockManagerService
): AnswerProcessorService => {
  console.log('[AnswerProcessorService] Creating new service instance');

  return {
    answerQuizQuestion: async <T extends ContentKey = ContentKey>(
      quizId: string,
      questionId: number,
      answer: string
    ): Promise<{
      isCorrect: boolean;
      newState?: QuizState<T>;
      nextQuestionId?: number;
      unlockedQuiz?: any;
    }> => {
      console.log(`[AnswerProcessorService] Processing answer for quiz '${quizId}', question '${questionId}'`);
      const currentState = quizStateManagerService.getQuizState<T>(quizId);

      if (!currentState) {
        console.error(`[AnswerProcessorService] Quiz with ID ${quizId} not found`);
        throw new Error(`Quiz with ID ${quizId} not found`);
      }

      // Finden der aktuellen Frage
      const question = currentState.questions.find(q => q.id === questionId);

      if (!question) {
        console.error(`[AnswerProcessorService] Question with ID ${questionId} not found in quiz ${quizId}`);
        throw new Error(`Question with ID ${questionId} not found in quiz ${quizId}`);
      }

      // Antwort normalisieren (nur bei Text-Fragen)
      const processedAnswer = normalizeString(answer);

      // Antwort verarbeiten
      const result = calculateAnswerResult(currentState, questionId, processedAnswer);

      if (result.isCorrect) {
        // Zustand asynchron aktualisieren
        await quizStateManagerService.updateQuizState(quizId, result.newState as QuizState<T>);
        const nextQuestionId = getNextActiveQuestionId(result.newState);
        const unlockedQuiz = unlockManagerService.unlockNextQuiz();

        console.log(`[AnswerProcessorService] Correct answer! Next question: ${nextQuestionId}, Unlocked quiz: ${unlockedQuiz?.id || 'none'}`);
        return {
          isCorrect: true,
          newState: result.newState as QuizState<T>,
          nextQuestionId: nextQuestionId || undefined,
          unlockedQuiz: unlockedQuiz || undefined
        };
      }

      console.log(`[AnswerProcessorService] Incorrect answer`);
      return { isCorrect: false };
    }
  };
};