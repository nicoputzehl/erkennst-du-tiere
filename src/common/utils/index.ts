import { Quiz } from "@/src/quiz";

const allQuizzes: Quiz[] = [];

export function registerQuizzes(quizzes: Quiz[]): void {
  console.log(`[QuizInit] Registering ${quizzes.length} quizzes`);
  allQuizzes.push(...quizzes);
}

export async function initializeAllQuizzes(): Promise<void> {
  console.log(`[QuizInit] Starting initialization of ${allQuizzes.length} quizzes`);
  
  const registerQuizInProvider = (globalThis as any).registerQuizInProvider;
  if (!registerQuizInProvider) {
    console.warn('[QuizInit] Provider not ready yet, will retry...');
    setTimeout(() => initializeAllQuizzes(), 100);
    return;
  }
  
  for (const quiz of allQuizzes) {
    console.log(`[QuizInit] Registering quiz '${quiz.id}'`);
    registerQuizInProvider(quiz.id, quiz);
  }

  console.log(`[QuizInit] Successfully initialized ${allQuizzes.length} quizzes`);
}

export function getAllQuizzes(): Quiz[] {
  return [...allQuizzes];
}
