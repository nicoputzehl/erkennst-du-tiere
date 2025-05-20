import { ContentKey } from '../../core/content/types';
import { QuestionStatus, QuizState } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PersistentQuizState<T extends ContentKey = ContentKey> {
  id: string;
  completedQuestions: number;
  questionStatuses: {
    id: number;
    status: string;
  }[]; // Hier verwenden wir die T[] Notation statt Array<T>
}

export interface AllPersistentQuizStates {
  version: number;
  states: Record<string, PersistentQuizState>;
  lastUpdated: number;
}

// Konvertierungsfunktionen zwischen vollständigem und persistiertem Zustand
export const convertToPersistent = <T extends ContentKey = ContentKey>(
  quizState: QuizState<T>
): PersistentQuizState<T> => {
  console.log(`[QuizPersistence] Converting quiz state to persistent format: ${quizState.id}`);
  return {
    id: quizState.id,
    completedQuestions: quizState.completedQuestions,
    questionStatuses: quizState.questions.map(q => ({
      id: q.id,
      status: q.status
    }))
  };
};

export const applyPersistentState = <T extends ContentKey = ContentKey>(
  quizState: QuizState<T>,
  persistentState: PersistentQuizState
): QuizState<T> => {
  console.log(`[QuizPersistence] Applying persistent state to quiz: ${quizState.id}`);
  
  if (quizState.id !== persistentState.id) {
    console.warn(`[QuizPersistence] ID mismatch: ${quizState.id} vs ${persistentState.id}`);
    return quizState;
  }
  
  // Neue Frageliste erstellen mit den gespeicherten Status
  const updatedQuestions = quizState.questions.map(question => {
    const savedStatus = persistentState.questionStatuses.find(qs => qs.id === question.id);
    if (savedStatus) {
      return {
        ...question,
        status: savedStatus.status as QuestionStatus
      };
    }
    return question;
  });
  
  return {
    ...quizState,
    questions: updatedQuestions,
    completedQuestions: persistentState.completedQuestions
  };
};