import { ContentKey } from '@/src/core/content/types';
import { Quiz } from '@/src/quiz/types';

export interface QuizRegistryEntry {
  quiz: Quiz<any>;
  contentType: string;
}

export interface QuizRegistryService {
  registerQuiz: <T extends ContentKey = ContentKey>(
    id: string, 
    quiz: Quiz<T>,
    contentType?: string
  ) => void;
  getQuizById: <T extends ContentKey = ContentKey>(id: string) => Quiz<T> | undefined;
  getAllQuizzes: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  getQuizzesByContentType: <T extends ContentKey = ContentKey>(contentType: string) => Quiz<T>[];
  updateQuiz: <T extends ContentKey = ContentKey>(
    id: string, 
    updatedQuiz: Quiz<T>,
    contentType?: string
  ) => void;
}

export const createQuizRegistryService = (
  initialRegistry: Map<string, QuizRegistryEntry> = new Map()
): QuizRegistryService => {
  // Private state
  let quizRegistry = initialRegistry;
  
  console.log('[QuizRegistryService] Creating new service instance');

  return {
    registerQuiz: <T extends ContentKey = ContentKey>(
      id: string, 
      quiz: Quiz<T>,
      contentType: string = 'generic'
    ): void => {
      console.log(`[QuizRegistryService] Registering quiz '${id}' of type '${contentType}'`);
      quizRegistry.set(id, { quiz, contentType });
    },
  
    getQuizById: <T extends ContentKey = ContentKey>(id: string): Quiz<T> | undefined => {
      console.log(`[QuizRegistryService] Getting quiz by id: ${id}`);
      const entry = quizRegistry.get(id);
      return entry ? entry.quiz as Quiz<T> : undefined;
    },
  
    getAllQuizzes: <T extends ContentKey = ContentKey>(): Quiz<T>[] => {
      const quizzes = Array.from(quizRegistry.values()).map(entry => entry.quiz) as Quiz<T>[];
      console.log(`[QuizRegistryService] Getting all quizzes. Count: ${quizzes.length}`);
      return quizzes;
    },
  
    getQuizzesByContentType: <T extends ContentKey = ContentKey>(contentType: string): Quiz<T>[] => {
      const filteredQuizzes = Array.from(quizRegistry.values())
        .filter(entry => entry.contentType === contentType)
        .map(entry => entry.quiz) as Quiz<T>[];
      
      console.log(`[QuizRegistryService] Getting quizzes by content type '${contentType}'. Count: ${filteredQuizzes.length}`);
      return filteredQuizzes;
    },
  
    updateQuiz: <T extends ContentKey = ContentKey>(
      id: string, 
      updatedQuiz: Quiz<T>,
      contentType?: string
    ): void => {
      console.log(`[QuizRegistryService] Updating quiz '${id}'`);
      const existingEntry = quizRegistry.get(id);
      quizRegistry.set(id, { 
        quiz: updatedQuiz, 
        contentType: contentType || (existingEntry ? existingEntry.contentType : 'generic') 
      });
    }
  };
};