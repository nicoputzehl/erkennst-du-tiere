import { QuestionType, QuizMode, QuizState } from '../types';
import { createQuizState } from '../domain/quizLogic';
import { getQuizById } from './quizRegistry';

// Private state
let quizStates: Map<string, QuizState<any>> = new Map();

/**
 * Initialisiert den Zustand eines Quiz
 */
export const initializeQuizState = <T = any>(quizId: string): QuizState<T> | null => {
  const quiz = getQuizById<T>(quizId);
  if (!quiz) return null;

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
  }

  return quizStates.get(quizId) as QuizState<T>;
};
/**
 * Gibt den aktuellen Zustand eines Quiz zurück
 */
export const getQuizState = <T = any>(quizId: string): QuizState<T> | undefined => {
  return quizStates.get(quizId) as QuizState<T> | undefined;
};

/**
 * Aktualisiert den Zustand eines Quiz
 */
export const updateQuizState = <T = any>(quizId: string, newState: QuizState<T>): void => {
  quizStates.set(quizId, newState);
};

/**
 * Setzt einen Quiz-Zustand zurück
 */
export const resetQuizState = <T = any>(quizId: string): QuizState<T> | null => {
  const quiz = getQuizById<T>(quizId);
  if (!quiz) return null;

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
  return newState as QuizState<T>;
};

/**
 * Gibt die Map aller Quiz-Zustände zurück (für Module, die darauf zugreifen müssen)
 */
export const getAllQuizStates = (): Map<string, QuizState<any>> => {
  return quizStates;
};