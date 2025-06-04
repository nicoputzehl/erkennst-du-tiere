
import { subscribeWithSelector, persist, StorageValue } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizState } from '../types';
import { create } from 'zustand';
import { createQuizState } from '../utils/quizCreation';

import { createQuizDataSlice, QuizDataSlice } from './QuizData.slice';
import { createQuizStateSlice, QuizStateSlice } from './QuizState.slice';
import { createUISlice, UISlice } from './UI.slice';
import { createUnlockSlice, UnlockSlice } from './Unlock.slice';
import { UserPointsState } from '../types/hint';
import { createHintSlice, HintSlice } from './Hint.slice';
import { HintUtils } from '../domain/hints';

export interface QuizStore extends QuizDataSlice, QuizStateSlice, UISlice, UnlockSlice, HintSlice {
  // GLOBALE User Points (NEU)
  userPoints: UserPointsState;
  // Persistence-Aktion auf der obersten Ebene
  clearPersistedData: () => Promise<void>;

}

const STORAGE_KEY = 'quiz_store_v1';

// Definieren des Typs für die persistierten Eigenschaften
type PersistedQuizStore = Pick<QuizStore, 'quizStates' | 'navigationHistory' | 'pendingUnlocks' | 'userPoints'>;

export const useQuizStore = create<QuizStore>()(
  persist(
    subscribeWithSelector((set, get, store) => ({ // Added 'store' argument here
      // Kombiniere die Slices
      ...createQuizDataSlice(set, get, store), // Pass 'store' to slice creators
      ...createQuizStateSlice(set, get, store), // Pass 'store' to slice creators
      ...createUISlice(set, get, store), // Pass 'store' to slice creators
      ...createUnlockSlice(set, get, store), // Pass 'store' to slice creators
      ...createHintSlice(set, get, store), // Pass 'store' to slice creators


      userPoints: HintUtils.getInitialUserPoints(),

      // Aktionen, die den gesamten Store betreffen oder Slices koordinieren
      // src/quiz/store/Quiz.store.ts - FIXED resetAllQuizStates function

      // In der useQuizStore create function, ersetzen Sie die resetAllQuizStates Funktion:

      resetAllQuizStates: () => {
        console.log('[QuizStore] Resetting all quiz states (global action)...');

        const { quizzes, quizConfigs } = get();

        // WICHTIG: Prüfe ob Quizzes vorhanden sind
        if (Object.keys(quizzes).length === 0) {
          console.warn('[QuizStore] No quizzes available for reset. This might indicate a problem.');

          // Setze trotzdem alle Flags zurück
          set((state) => ({
            quizStates: {},
            pendingUnlocks: [],
            navigationHistory: [],
            currentQuizId: null,
            isLoading: false,
            loadingOperations: new Set(),
            toast: null,
            isQuizDataLoaded: false, // WICHTIG: Reset auch das data loaded flag
            userPoints: HintUtils.getInitialUserPoints(),
          }));

          console.log('[QuizStore] Reset completed despite missing quizzes.');
          return;
        }

        const newQuizStates: Record<string, QuizState> = {};

        try {
          Object.values(quizzes).forEach(quiz => {
            const config = quizConfigs[quiz.id];
            if (config) {
              const newQuizState = createQuizState(quiz, {
                initialUnlockedQuestions: config.initialUnlockedQuestions || 2
              });
              if (newQuizState) {
                newQuizStates[quiz.id] = newQuizState;
              }
            } else {
              console.warn(`[QuizStore] No config found for quiz ${quiz.id}`);
            }
          });

          console.log(`[QuizStore] Created ${Object.keys(newQuizStates).length} new quiz states`);

          set((state) => ({
            quizStates: newQuizStates,
            pendingUnlocks: [],
            navigationHistory: [],
            currentQuizId: null,
            isLoading: false,
            loadingOperations: new Set(),
            toast: null,
            // WICHTIG: isQuizDataLoaded NICHT zurücksetzen, da die Quizzes noch geladen sind
            // isQuizDataLoaded: false, // <- Das war das Problem!
            userPoints: HintUtils.getInitialUserPoints(),
          }));

          console.log('[QuizStore] All quiz states reset complete.');

        } catch (error) {
          console.error('[QuizStore] Error during reset:', error);

          // Bei Fehler sicherheitshalber alles zurücksetzen
          set((state) => ({
            quizStates: {},
            pendingUnlocks: [],
            navigationHistory: [],
            currentQuizId: null,
            isLoading: false,
            loadingOperations: new Set(),
            toast: null,
            isQuizDataLoaded: false,
            userPoints: HintUtils.getInitialUserPoints(),
          }));
        }
      },
      clearPersistedData: async () => {
        try {
          await AsyncStorage.removeItem(STORAGE_KEY);
          // Setze den gesamten Store auf den Initialzustand zurück, indem die Zustandseigenschaften direkt zurückgesetzt werden.
          // Dies vermeidet den Fehler "Expected 3 arguments, but got 2" bei der erneuten Initialisierung der Slices.
          set({
            // Reset QuizDataSlice state
            quizzes: {},
            quizConfigs: {},
            isQuizDataLoaded: false,
            // Reset QuizStateSlice state
            quizStates: {},
            // Reset UISlice state
            currentQuizId: null,
            isLoading: false,
            loadingOperations: new Set(),
            toast: null,
            navigationHistory: [],
            // Reset UnlockSlice state
            pendingUnlocks: [],
            userPoints: HintUtils.getInitialUserPoints(),
          });
          console.log('[QuizStore] All persisted data cleared and store reset.');
        } catch (error) {
          console.error('[QuizStore] Failed to clear persisted data:', error);
          throw error;
        }
      }
    })),
    {
      name: STORAGE_KEY,
      storage: {
        getItem: async (name: string) => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error(`[QuizStore] Failed to get item from storage (${name}):`, error);
            throw error;
          }
        },
        setItem: async (name: string, value: StorageValue<PersistedQuizStore>) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error(`[QuizStore] Failed to set item to storage (${name}):`, error);
            throw error;
          }
        },
        removeItem: async (name: string) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error(`[QuizStore] Failed to remove item from storage (${name}):`, error);
            throw error;
          }
        },
      },
      partialize: (state): PersistedQuizStore => ({
        quizStates: state.quizStates,
        navigationHistory: state.navigationHistory,
        pendingUnlocks: state.pendingUnlocks,
        userPoints: state.userPoints
      }),
      onRehydrateStorage: (state) => {
        console.log('[QuizStore] Rehydrating store - START onRehydrateStorage callback');
        return (persistedState, error) => {
          if (error) {
            console.error('[QuizStore] Hydration failed', error);
            useQuizStore.getState().showToast('Fehler beim Laden der Daten!', 'error', 5000);
          } else {
            console.log('[QuizStore] Hydration successful. Now performing post-hydration tasks.');
            useQuizStore.getState().detectMissedUnlocks(); // Aufruf einer Aktion aus UnlockSlice
          }
          console.log('[QuizStore] Rehydrating store - END onRehydrateStorage callback');
        };
      },
    }
  )
);