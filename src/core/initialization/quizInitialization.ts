import { Quiz } from '@/src/quiz/types';
import { ContentKey } from '../content/types';
import { registerQuiz } from '@/src/quiz/services';

/**
 * Typ für eine Quiz-Initialisierungsfunktion
 * Diese Funktion registriert ein bestimmtes Quiz mit seinen Konfigurationen
 */
export type QuizInitializer<T extends ContentKey = ContentKey> = () => {
  id: string;
  quiz: Quiz<T>;
  contentType: string;
}[];

// Registry für Initialisierer
const quizInitializers: QuizInitializer[] = [];

/**
 * Fügt einen Quiz-Initialisierer hinzu
 * Diese Funktion kann sicher vor der App-Initialisierung aufgerufen werden
 */
export function registerQuizInitializer(initializer: QuizInitializer): void {
  quizInitializers.push(initializer);
}

/**
 * Initialisiert alle registrierten Quizzes
 * Diese Funktion sollte explizit während des App-Starts aufgerufen werden
 */
export function initializeAllQuizzes(): void {
  console.log("Starting quiz initialization...");
  console.log(`Found ${quizInitializers.length} initializers`);
  // Durchlaufe alle registrierten Initialisierer
  quizInitializers.forEach((initializer, index) => {
    console.log(`Running initializer ${index + 1}...`);
    const quizzes = initializer();
    console.log(`Initializer ${index + 1} created ${quizzes.length} quizzes`);

    quizzes.forEach(({ id, quiz, contentType }) => {
      console.log(`Registering quiz '${id}' of type '${contentType}'`);
      registerQuiz(id, quiz, contentType);
    });
  });

  console.log(`Initialized ${quizInitializers.length} quiz categories`);
}