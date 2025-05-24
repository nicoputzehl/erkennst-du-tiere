import { ContentKey } from '@/src/core/content/types';
import { createQuizState } from '@/src/quiz/domain/quizLogic';
import { QuizMode, QuizState } from '@/src/quiz/types';
import { getQuizPersistenceService } from '../../persistence/QuizPersistenceService';
import { applyPersistentState } from '../../persistence/QuizStorageTypes';
import { QuizRegistryService } from './quizRegistryFactory';

export interface QuizStateManagerService {
  initializeQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  getQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | undefined;
  updateQuizState: <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>) => Promise<void>;
  resetQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  getAllQuizStates: () => Map<string, QuizState<ContentKey>>;
}

export const createQuizStateManagerService = (
  quizRegistryService: QuizRegistryService,
  initialStates: Map<string, QuizState<ContentKey>> = new Map()
): QuizStateManagerService => {
  // Private state
  let quizStates = initialStates;

  // Persistence service abrufen
  const persistenceService = getQuizPersistenceService();

  // Initialisierung des Services
  console.log('[QuizStateManagerService] Creating new service instance');

  // Alle gespeicherten Zustände beim Start laden
  const loadSavedStates = async (): Promise<void> => {
    try {
      const savedStates = await persistenceService.loadAllQuizStates();
      if (savedStates) {
        console.log(`[QuizStateManagerService] Found ${Object.keys(savedStates).length} saved quiz states`);
      }
    } catch (error) {
      console.error('[QuizStateManagerService] Error loading saved states:', error);
    }
  };

  // Initialisierung starten
  loadSavedStates();

  return {
    initializeQuizState: async <T extends ContentKey = ContentKey>(quizId: string): Promise<QuizState<T> | null> => {
      console.log(`[QuizStateManagerService] Initializing state for quiz '${quizId}'`);
      const quiz = quizRegistryService.getQuizById(quizId);
      if (!quiz) {
        console.log(`[QuizStateManagerService] Quiz '${quizId}' not found`);
        return null;
      }

      // Prüfen, ob bereits ein Zustand existiert
      if (!quizStates.has(quizId)) {
        // Default-Werte verwenden, falls nicht angegeben
        const quizMode = quiz.quizMode || QuizMode.SEQUENTIAL;
        const initialUnlockedQuestions = quiz.initialUnlockedQuestions || 2;

        const finalQuizMode = quizMode;
        // Neuen Zustand erstellen
        const state = createQuizState(
          quiz.questions,
          quiz.id,
          quiz.title,
          finalQuizMode,
          initialUnlockedQuestions
        );

        // Gespeicherten Zustand laden, falls vorhanden
        try {
          const savedStates = await persistenceService.loadAllQuizStates();
          if (savedStates && savedStates[quizId]) {
            console.log(`[QuizStateManagerService] Found saved state for quiz '${quizId}'`);
            const mergedState = applyPersistentState(state, savedStates[quizId]);
            quizStates.set(quizId, mergedState);
          } else {
            console.log(`[QuizStateManagerService] No saved state found for quiz '${quizId}'`);
            quizStates.set(quizId, state);
          }
        } catch (error) {
          console.error(`[QuizStateManagerService] Error loading saved state for quiz '${quizId}':`, error);
          quizStates.set(quizId, state);
        }

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

    updateQuizState: async <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>): Promise<void> => {
      console.log(`[QuizStateManagerService] Updating state for quiz '${quizId}'`);
      quizStates.set(quizId, newState as QuizState<ContentKey>);

      // Zustand persistieren
      try {
        await persistenceService.saveQuizState(newState);
        console.log(`[QuizStateManagerService] State for quiz '${quizId}' persisted successfully`);
      } catch (error) {
        console.error(`[QuizStateManagerService] Error persisting state for quiz '${quizId}':`, error);
      }
    },

    resetQuizState: async <T extends ContentKey = ContentKey>(quizId: string): Promise<QuizState<T> | null> => {
      console.log(`[QuizStateManagerService] Resetting state for quiz '${quizId}'`);
      const quiz = quizRegistryService.getQuizById(quizId);
      if (!quiz) {
        console.log(`[QuizStateManagerService] Quiz '${quizId}' not found`);
        return null;
      }

      // Default-Werte verwenden, falls nicht angegeben
      const quizMode = quiz.quizMode || QuizMode.SEQUENTIAL;
      const initialUnlockedQuestions = quiz.initialUnlockedQuestions || 2;

      const finalQuizMode = quizMode;

      const newState = createQuizState(
        quiz.questions,
        quiz.id,
        quiz.title,
        finalQuizMode,
        initialUnlockedQuestions
      );

      quizStates.set(quizId, newState);

      // Zustand persistieren
      try {
        await persistenceService.saveQuizState(newState);
        console.log(`[QuizStateManagerService] Reset state for quiz '${quizId}' persisted successfully`);
      } catch (error) {
        console.error(`[QuizStateManagerService] Error persisting reset state for quiz '${quizId}':`, error);
      }

      console.log(`[QuizStateManagerService] Reset completed for quiz '${quizId}'`);
      return newState as QuizState<T>;
    },

    getAllQuizStates: (): Map<string, QuizState<ContentKey>> => {
      console.log(`[QuizStateManagerService] Getting all quiz states`);
      return quizStates;
    }
  };
};