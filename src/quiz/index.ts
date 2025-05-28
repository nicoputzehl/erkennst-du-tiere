// src/quiz/index.ts - Zentrale Exports für bessere Import-Pfade

// ====== TYPES ======
export * from './types';

// ====== UTILITIES ======
export * from './utils';

// ====== CONTEXTS ======
export { useQuiz } from './contexts/QuizProvider';
export { useQuizData } from './contexts/QuizDataProvider';
export { useQuizState } from './contexts/QuizStateProvider';
export { useUIState, usePendingUnlocks } from './contexts/UIStateProvider';
export { usePersistence } from './contexts/PersistenceProvider';

// ====== HOOKS ======
export * from './hooks';

// ====== COMPONENTS ======
export { Toast } from './components/Toast';

// ====== SCREENS ======
export { QuestionScreen } from './screens/Question/QuestionScreen';
export { QuizScreen } from './screens/Quiz/QuizScreen';
export { default as QuizzesScreen } from './screens/Quizzes/Quizzes';

// ====== PROVIDERS (für App-Layout) ======
export { PersistenceProvider } from './contexts/PersistenceProvider';
export { QuizDataProvider } from './contexts/QuizDataProvider';  
export { QuizStateProvider } from './contexts/QuizStateProvider';
export { UIStateProvider } from './contexts/UIStateProvider';
export { QuizProvider } from './contexts/QuizProvider';