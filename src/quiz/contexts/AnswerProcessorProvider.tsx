import React, { createContext, useContext, ReactNode } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { QuizState } from '../types';
import { 
  answerQuizQuestion, 
  getMultipleChoiceOptions,
  getAnswerProcessorService 
} from '../services/answerProcessor';
import { AnswerProcessorService } from '../services/factories/answerProcessorFactory';

interface AnswerProcessorContextType {
  answerProcessorService: AnswerProcessorService;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMultipleChoiceOptions: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number
  ) => string[] | null;
}

const AnswerProcessorContext = createContext<AnswerProcessorContextType | null>(null);

export function AnswerProcessorProvider({ children }: { children: ReactNode }) {
  const answerProcessorService = getAnswerProcessorService();
  
  const contextValue: AnswerProcessorContextType = {
    answerProcessorService,
    answerQuizQuestion,
    getMultipleChoiceOptions
  };
  
  return (
    <AnswerProcessorContext.Provider value={contextValue}>
      {children}
    </AnswerProcessorContext.Provider>
  );
}

export function useAnswerProcessor() {
  const context = useContext(AnswerProcessorContext);
  if (!context) {
    throw new Error('useAnswerProcessor must be used within an AnswerProcessorProvider');
  }
  return context;
}