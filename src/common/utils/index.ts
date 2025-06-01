import { QuizConfig } from "@/src/quiz";

const allQuizConfigs: QuizConfig[] = [];

export function registerQuizzes(quizConfigs: QuizConfig[]): void {
  console.log(`[QuizInit] Registering ${quizConfigs.length} quiz configs`);
  allQuizConfigs.push(...quizConfigs);
}

export async function initializeAllQuizzes(): Promise<void> {
  console.log(`[QuizInit] Starting initialization of ${allQuizConfigs.length} quiz configs`);
  
  const registerQuizInProvider = (globalThis as any).registerQuizInProvider;
  if (!registerQuizInProvider) {
    console.warn('[QuizInit] Provider not ready yet, will retry...');
    setTimeout(() => initializeAllQuizzes(), 100);
    return;
  }
  
  for (const config of allQuizConfigs) {
    console.log(`[QuizInit] Registering quiz config '${config.id}'`);
    registerQuizInProvider(config.id, config);
  }

  console.log(`[QuizInit] Successfully initialized ${allQuizConfigs.length} quiz configs`);
}

export function getAllQuizConfigs(): QuizConfig[] {
  return [...allQuizConfigs];
}