// src/quiz/services/factories/quizStateManagerFactory.ts

import { ContentKey } from '@/src/core/content/types'; // ContentKey importieren
import { QuestionType, QuizMode, QuizState } from '@/src/quiz/types';
import { createQuizState } from '@/src/quiz/domain/quizLogic';
import { QuizRegistryService } from './quizRegistryFactory';

export interface QuizStateManagerService {
  initializeQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | null;
  getQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | undefined;
  updateQuizState: <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>) => void;
  resetQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | null;
  getAllQuizStates: () => Map<string, QuizState<ContentKey>>;
}

export const createQuizStateManagerService = (
  quizRegistryService: QuizRegistryService,
  initialStates: Map<string, QuizState<ContentKey>> = new Map()
): QuizStateManagerService => {
  // Private state
  let quizStates = initialStates;
  
  console.log('[QuizStateManagerService] Creating new service instance');

  return {
    initializeQuizState: <T extends ContentKey = ContentKey>(quizId: string): QuizState<T> | null => {
      console.log(`[QuizStateManagerService] Initializing state for quiz '${quizId}'`);
      const quiz = quizRegistryService.getQuizById(quizId);
      if (!quiz) {
        console.log(`[QuizStateManagerService] Quiz '${quizId}' not found`);
        return null;
      }

      if (!quizStates.has(quizId)) {
        // Default-Werte verwenden, falls nicht angegeben
        const quizMode = quiz.quizMode || QuizMode.SEQUENTIAL;
        const initialUnlockedQuestions = quiz.initialUnlockedQuestions || 2;
        
        // Bei Multiple-Choice-Fragen immer alle Fragen freischalten, wenn nicht anders angegeben
        const hasMultipleChoiceQuestions = quiz.questions.some(q => 
          q.questionType === QuestionType.MULTIPLE_CHOICE
        );
        
        const finalQuizMode = hasMultipleChoiceQuestions && quizMode === QuizMode.SEQUENTIAL ? 
          QuizMode.ALL_UNLOCKED : quizMode;
        
        const state = createQuizState(
          quiz.questions, 
          quiz.id, 
          quiz.title, 
          finalQuizMode, 
          initialUnlockedQuestions
        );
        
        quizStates.set(quizId, state);
        console.log(`[QuizStateManagerService] Created new state for quiz '${quizId}'`);
      } else {
        console.log(`[QuizStateManagerService] Using existing state for quiz '${quizId}'`);
      }

      return quizStates.get(quizId) as QuizState<T>;
    },

    getQuizState: <T extends ContentKey = ContentKey>(quizId: string): QuizState<T> | undefined => {
      console.log(`[QuizStateManagerService] Getting state for quiz '${quizId}'`);
      return quizStates.get(quizId) as QuizState<T> | undefined;
    },

    updateQuizState: <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>): void => {
      console.log(`[QuizStateManagerService] Updating state for quiz '${quizId}'`);
      quizStates.set(quizId, newState as QuizState<ContentKey>);
    },

    resetQuizState: <T extends ContentKey = ContentKey>(quizId: string): QuizState<T> | null => {
      console.log(`[QuizStateManagerService] Resetting state for quiz '${quizId}'`);
      const quiz = quizRegistryService.getQuizById(quizId);
      if (!quiz) {
        console.log(`[QuizStateManagerService] Quiz '${quizId}' not found`);
        return null;
      }

      // Default-Werte verwenden, falls nicht angegeben
      const quizMode = quiz.quizMode || QuizMode.SEQUENTIAL;
      const initialUnlockedQuestions = quiz.initialUnlockedQuestions || 2;
      
      // Bei Multiple-Choice-Fragen immer alle Fragen freischalten, wenn nicht anders angegeben
      const hasMultipleChoiceQuestions = quiz.questions.some(q => 
        q.questionType === QuestionType.MULTIPLE_CHOICE
      );
      
      const finalQuizMode = hasMultipleChoiceQuestions && quizMode === QuizMode.SEQUENTIAL ? 
        QuizMode.ALL_UNLOCKED : quizMode;
      
      const newState = createQuizState(
        quiz.questions, 
        quiz.id, 
        quiz.title, 
        finalQuizMode, 
        initialUnlockedQuestions
      );
      
      quizStates.set(quizId, newState);
      console.log(`[QuizStateManagerService] Reset completed for quiz '${quizId}'`);
      return newState as QuizState<T>;
    },

    getAllQuizStates: (): Map<string, QuizState<ContentKey>> => {
      console.log(`[QuizStateManagerService] Getting all quiz states`);
      return quizStates;
    }
  };
};