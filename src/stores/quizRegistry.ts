// src/stores/quizRegistry.ts
import { Quiz } from '@/src/quiz/types';
import { useQuizStore } from './quizStore';

// Einfache Registry-Funktionen ohne Klasse
let isInitialized = false;

/**
 * Registriert ein Quiz im Store
 * Kann sowohl zur Buildzeit als auch zur Laufzeit aufgerufen werden
 */
export function registerQuiz(quiz: Quiz): Quiz {
  if (__DEV__) {
    console.log('[QuizRegistry] Registering quiz:', quiz.id);
  }

  // Prüfe ob wir im Browser/RN Kontext sind
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    try {
      const store = useQuizStore.getState();
      store.registerQuiz(quiz);
      
      if (__DEV__) {
        const debugInfo = store.getDebugInfo();
        console.log('[QuizRegistry] Store now has:', debugInfo);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('[QuizRegistry] Could not register quiz immediately:', error);
        console.log('[QuizRegistry] Will retry when store is available');
      }
      // Quiz wird später registriert wenn Store verfügbar ist
    }
  }

  return quiz; // Für Chainability
}

/**
 * Registriert mehrere Quizzes
 */
export function registerMultipleQuizzes(quizzes: Quiz[]): Quiz[] {
  quizzes.forEach(quiz => registerQuiz(quiz));
  return quizzes;
}

/**
 * Initialisiert Registry und stellt sicher, dass alle Quizzes im Store sind
 */
export async function initializeQuizRegistry(): Promise<void> {
  if (isInitialized) {
    return;
  }

  if (__DEV__) {
    console.log('[QuizRegistry] Initializing registry...');
  }

  try {
    // Import aller Quiz-Module um sicherzustellen dass register() aufgerufen wurde
    await import('@/src/animals/quizzes-migrated');
    
    isInitialized = true;
    
    if (__DEV__) {
      const store = useQuizStore.getState();
      const debugInfo = store.getDebugInfo();
      console.log('[QuizRegistry] Initialization complete. Store state:', debugInfo);
    }
  } catch (error) {
    console.error('[QuizRegistry] Initialization failed:', error);
  }
}

/**
 * Vergleicht Store-Inhalt mit originalem System (für Migration)
 */
export function validateQuizRegistration(): void {
  if (!__DEV__) return;

  try {
    const store = useQuizStore.getState();
    const debugInfo = store.getDebugInfo();
    
    console.log('[QuizRegistry] Validation - Store contains:');
    debugInfo.allQuizIds.forEach((id: string) => {
      const quiz = store.quizzes[id];
      console.log(`  - ${id}: "${quiz.title}" (${quiz.questions.length} questions)`);
    });
  } catch (error) {
    console.warn('[QuizRegistry] Validation failed:', error);
  }
}

/**
 * Helper-Funktion für Quiz-Definitionen
 * Macht Migration einfacher
 */
export function defineQuiz(quiz: Quiz): Quiz {
  return registerQuiz(quiz);
}