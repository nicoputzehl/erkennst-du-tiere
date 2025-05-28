// src/quiz/hooks/index.ts - Angepasst für vereinfachte Types

export { useAnswerProcessing } from './useAnswerProcessing';
export type { AnswerResult, UseAnswerProcessingReturn } from './useAnswerProcessing';

export { useUnlockSystem } from './useUnlockSystem';
export type { UnlockProgress, UseUnlockSystemReturn } from './useUnlockSystem';

export { useQuizOperations } from './useQuizOperations';
export type { UseQuizOperationsReturn } from './useQuizOperations';

export { useDataManagement } from './useDataManagement';
export type { UseDataManagementReturn } from './useDataManagement';

export { useQuizWorkflow } from './useQuizWorkflow';
export type { QuizWorkflowReturn } from './useQuizWorkflow';

export { useUnlockDetection } from './useUnlockDetection';

// Re-export existing hooks
export * from './useImageDisplay';