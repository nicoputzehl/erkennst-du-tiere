import { ContentKey } from '@/src/core/content/types';
import { QuizState } from '@/src/quiz/types';
import { createAnswerProcessorService } from './factories/answerProcessorFactory';
import { getQuizStateManagerService } from './quizStateManager';
import { getUnlockManagerService } from './unlockManager';

const answerProcessorService = createAnswerProcessorService(
  getQuizStateManagerService(),
  getUnlockManagerService()
);

// Re-export der Funktionen
export const answerQuizQuestion = <T extends ContentKey = ContentKey>(
  quizId: string,
  questionId: number,
  answer: string
): Promise<{
  isCorrect: boolean;
  newState?: QuizState<T>;
  nextQuestionId?: number;
  unlockedQuiz?: any;
}> => answerProcessorService.answerQuizQuestion<T>(quizId, questionId, answer);

// Export für andere Services, die Zugriff benötigen
export const getAnswerProcessorService = () => answerProcessorService;