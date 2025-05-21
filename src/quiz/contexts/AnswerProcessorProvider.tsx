import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { QuizState } from '../types';
import { 
  answerQuizQuestion as answerQuizQuestionService, 
  getMultipleChoiceOptions,
  getAnswerProcessorService 
} from '../services/answerProcessor';
import { AnswerProcessorService } from '../services/factories/answerProcessorFactory';

interface AnswerProcessorContextProps {
  answerProcessorService: AnswerProcessorService;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMultipleChoiceOptions: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number
  ) => string[] | null;
}

const AnswerProcessorContext = createContext<AnswerProcessorContextProps | null>(null);

export function AnswerProcessorProvider({ children }: { children: ReactNode }) {
  const answerProcessorService = getAnswerProcessorService();
  
  // Memoize context value
  const contextValue = useMemo(() => {
    console.log('[AnswerProcessorProvider] Creating memoized context value');
    
    return {
      answerProcessorService,
      answerQuizQuestion: async <T extends ContentKey = ContentKey>(
        quizId: string,
        questionId: number,
        answer: string
      ) => {
        try {
          return await answerQuizQuestionService<T>(quizId, questionId, answer);
        } catch (error) {
          console.error(`[AnswerProcessorProvider] Error processing answer for quiz ${quizId}, question ${questionId}:`, error);
          return { isCorrect: false };
        }
      },
      getMultipleChoiceOptions
    };
  }, [answerProcessorService]);
  
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