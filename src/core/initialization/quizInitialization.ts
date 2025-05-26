// src/core/initialization/quizInitialization.ts - Vereinfacht
import { Quiz } from '@/src/quiz/types';
import { ContentKey } from '../content/types';

/**
 * Vereinfachte Quiz-Initialisierung ohne Service-Layer
 */
export type QuizInitializer<T extends ContentKey = ContentKey> = () => {
  id: string;
  quiz: Quiz<T>;
  contentType: string;
}[];

// Registry für Initialisierer (bleibt gleich)
const quizInitializers: QuizInitializer[] = [];

/**
 * Fügt einen Quiz-Initialisierer hinzu
 */
export function registerQuizInitializer(initializer: QuizInitializer): void {
  quizInitializers.push(initializer);
}

/**
 * Initialisiert alle registrierten Quizzes
 * Jetzt direkt über den globalen Provider
 */
export async function initializeAllQuizzes(): Promise<void> {
  console.log("Starting quiz initialization...");
  console.log(`Found ${quizInitializers.length} initializers`);
  
  // Check if provider is available
  const registerQuizInProvider = (globalThis as any).registerQuizInProvider;
  if (!registerQuizInProvider) {
    console.warn('[QuizInitialization] Provider not ready yet, will retry...');
    // Provider wird später verfügbar sein
    setTimeout(() => initializeAllQuizzes(), 100);
    return;
  }
  
  // Durchlaufe alle registrierten Initialisierer
  for (let index = 0; index < quizInitializers.length; index++) {
    const initializer = quizInitializers[index];
    console.log(`Running initializer ${index + 1}...`);
    const quizzes = initializer();
    console.log(`Initializer ${index + 1} created ${quizzes.length} quizzes`);

    for (const { id, quiz, contentType } of quizzes) {
      console.log(`Registering quiz '${id}' of type '${contentType}'`);
      registerQuizInProvider(id, quiz);
    }
  }

  console.log(`Initialized ${quizInitializers.length} quiz categories`);
}