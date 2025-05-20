// src/quiz/services/factories/answerProcessorFactory.ts

import { ContentKey } from '@/src/core/content/types';
import { QuizState } from '@/src/quiz/types';
import { calculateAnswerResult, getNextActiveQuestionId, isMultipleChoiceQuestion } from '@/src/quiz/domain/quizLogic';
import { QuizStateManagerService } from './quizStateManagerFactory';
import { normalizeString } from '@/utils/helper';
import { UnlockManagerService } from './unlockManagerFactory';

export interface AnswerProcessorService {
  answerQuizQuestion: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string
  ) => {
    isCorrect: boolean;
    newState?: QuizState<T>;
    nextQuestionId?: number;
    unlockedQuiz?: any;
  };
  getMultipleChoiceOptions: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number
  ) => string[] | null;
}

export const createAnswerProcessorService = (
  quizStateManagerService: QuizStateManagerService,
  unlockManagerService: UnlockManagerService
): AnswerProcessorService => {
  console.log('[AnswerProcessorService] Creating new service instance');

  return {
    answerQuizQuestion: <T extends ContentKey = ContentKey>(
      quizId: string,
      questionId: number,
      answer: string
    ): {
      isCorrect: boolean;
      newState?: QuizState<T>;
      nextQuestionId?: number;
      unlockedQuiz?: any;
    } => {
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

      // Entscheiden, ob wir die Antwort normalisieren müssen (nur bei Text-Fragen)
      let processedAnswer = answer;
      if (!isMultipleChoiceQuestion(question)) {
        processedAnswer = normalizeString(answer);
      }

      // Antwort verarbeiten
      const result = calculateAnswerResult(currentState, questionId, processedAnswer);

      if (result.isCorrect) {
        quizStateManagerService.updateQuizState(quizId, result.newState as QuizState<T>);
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
    },

    getMultipleChoiceOptions: <T extends ContentKey = ContentKey>(
      quizId: string,
      questionId: number
    ): string[] | null => {
      console.log(`[AnswerProcessorService] Getting options for quiz '${quizId}', question '${questionId}'`);
      const quizState = quizStateManagerService.getQuizState<T>(quizId);
      if (!quizState) {
        console.log(`[AnswerProcessorService] Quiz '${quizId}' not found`);
        return null;
      }

      const question = quizState.questions.find(q => q.id === questionId);
      if (!question) {
        console.log(`[AnswerProcessorService] Question '${questionId}' not found`);
        return null;
      }

      if (isMultipleChoiceQuestion(question)) {
        console.log(`[AnswerProcessorService] Found multiple choice options: ${question.choices.length}`);
        return question.choices;
      }

      console.log(`[AnswerProcessorService] No multiple choice options found`);
      return null;
    }
  };
};