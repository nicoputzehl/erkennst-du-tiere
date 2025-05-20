import React, { createContext, useContext, ReactNode } from 'react';
import { QuizState } from '../types';
import * as AnswerService from '../services/answerProcessor';


interface AnswerProcessorContextType {
  answerQuizQuestion: <T = any>(
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
  getMultipleChoiceOptions: <T = any>(
    quizId: string,
    questionId: number
  ) => string[] | null;
}

// Context erstellen
const AnswerProcessorContext = createContext<AnswerProcessorContextType | null>(null);

// Provider-Komponente
export function AnswerProcessorProvider({ children }: { children: ReactNode }) {
  const contextValue: AnswerProcessorContextType = {
    answerQuizQuestion: AnswerService.answerQuizQuestion,
    getMultipleChoiceOptions: AnswerService.getMultipleChoiceOptions // Neue Funktion hinzufügen
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