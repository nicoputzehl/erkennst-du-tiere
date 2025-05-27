import { Quiz } from '@/src/quiz/types';
import { ContentKey } from '../content/types';

/**
 * Vereinfachte Quiz-Definition - direktes Array statt Registry
 */
export interface QuizDefinition<T extends ContentKey = ContentKey> {
  id: string;
  quiz: Quiz<T>;
  contentType: string;
}

// Direktes Array für alle Quiz-Definitionen
const allQuizDefinitions: QuizDefinition[] = [];

/**
 * Fügt Quiz-Definitionen direkt hinzu (statt komplexer Initializer)
 */
export function registerQuizDefinitions(definitions: QuizDefinition[]): void {
  console.log(`[QuizInit] Registering ${definitions.length} quiz definitions`);
  allQuizDefinitions.push(...definitions);
}

/**
 * Initialisiert alle Quizzes direkt über den Provider
 * Viel einfacher als vorher
 */
export async function initializeAllQuizzes(): Promise<void> {
  console.log(`[QuizInit] Starting initialization of ${allQuizDefinitions.length} quizzes`);
  
  // Check if provider is available
  const registerQuizInProvider = (globalThis as any).registerQuizInProvider;
  if (!registerQuizInProvider) {
    console.warn('[QuizInit] Provider not ready yet, will retry...');
    setTimeout(() => initializeAllQuizzes(), 100);
    return;
  }
  
  // Direkte Registrierung - keine komplexe Initializer-Logik
  for (const { id, quiz, contentType } of allQuizDefinitions) {
    console.log(`[QuizInit] Registering quiz '${id}' of type '${contentType}'`);
    registerQuizInProvider(id, quiz);
  }

  console.log(`[QuizInit] Successfully initialized ${allQuizDefinitions.length} quizzes`);
}

/**
 * Optional: Hilfsfunktion um alle Definitionen zu bekommen (für Debugging)
 */
export function getAllQuizDefinitions(): QuizDefinition[] {
  return [...allQuizDefinitions];
}