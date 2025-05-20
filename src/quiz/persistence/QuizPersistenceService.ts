import { ContentKey } from '../../core/content/types';
import { QuizState } from '../types';
import { getStorageService } from '../../core/storage';
import { AllPersistentQuizStates, convertToPersistent, PersistentQuizState } from './QuizStorageTypes';


const QUIZ_STATES_STORAGE_KEY = 'quiz_states';
const CURRENT_VERSION = 1; // Erhöhen, wenn sich das Datenformat ändert

export interface QuizPersistenceService {
  saveQuizState: <T extends ContentKey = ContentKey>(quizState: QuizState<T>) => Promise<void>;
  loadAllQuizStates: () => Promise<Record<string, PersistentQuizState> | null>;
  clearAllQuizStates: () => Promise<void>;
}

export const createQuizPersistenceService = (): QuizPersistenceService => {
  console.log('[QuizPersistenceService] Creating new service instance');

  return {
    saveQuizState: async <T extends ContentKey = ContentKey>(quizState: QuizState<T>): Promise<void> => {
      console.log(`[QuizPersistenceService] Saving quiz state: ${quizState.id}`);

      try {
        // Aktuelle Zustände laden oder neue Struktur erstellen
        const storage = getStorageService();
        const allStates = await storage.load<AllPersistentQuizStates>(QUIZ_STATES_STORAGE_KEY) || {
          version: CURRENT_VERSION,
          states: {},
          lastUpdated: Date.now()
        };

        // Aktuellen Zustand konvertieren und speichern
        const persistentState = convertToPersistent(quizState);
        allStates.states[quizState.id] = persistentState;
        allStates.lastUpdated = Date.now();

        // Alles zurück in den Storage schreiben
        await storage.save(QUIZ_STATES_STORAGE_KEY, allStates);
        console.log(`[QuizPersistenceService] Quiz state saved successfully: ${quizState.id}`);
      } catch (error) {
        console.error(`[QuizPersistenceService] Error saving quiz state ${quizState.id}:`, error);
        throw error;
      }
    },

    loadAllQuizStates: async (): Promise<Record<string, PersistentQuizState> | null> => {
      console.log('[QuizPersistenceService] Loading all quiz states');

      try {
        const storage = getStorageService();
        const allStates = await storage.load<AllPersistentQuizStates>(QUIZ_STATES_STORAGE_KEY);

        if (!allStates) {
          console.log('[QuizPersistenceService] No saved quiz states found');
          return null;
        }

        // Version überprüfen (für zukünftige Migrationen)
        if (allStates.version !== CURRENT_VERSION) {
          console.warn(`[QuizPersistenceService] Version mismatch: saved=${allStates.version}, current=${CURRENT_VERSION}`);
          // Hier könnte eine Migrationsfunktion aufgerufen werden
        }

        console.log(`[QuizPersistenceService] Loaded ${Object.keys(allStates.states).length} quiz states`);
        return allStates.states;
      } catch (error) {
        console.error('[QuizPersistenceService] Error loading quiz states:', error);
        return null;
      }
    },

    clearAllQuizStates: async (): Promise<void> => {
      console.log('[QuizPersistenceService] Clearing all quiz states');

      try {
        const storage = getStorageService();
        await storage.remove(QUIZ_STATES_STORAGE_KEY);
        console.log('[QuizPersistenceService] All quiz states cleared');
      } catch (error) {
        console.error('[QuizPersistenceService] Error clearing quiz states:', error);
        throw error;
      }
    }
  };
};

// Singleton-Instanz
let quizPersistenceService: QuizPersistenceService;

export const getQuizPersistenceService = (): QuizPersistenceService => {
  if (!quizPersistenceService) {
    quizPersistenceService = createQuizPersistenceService();
  }
  return quizPersistenceService;
};