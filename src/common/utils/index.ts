import { Quiz } from "@/src/quiz";

export interface QuizImages {
  imageUrl: string;
  thumbnailUrl?: string;
  unsolvedImageUrl?: string;
  unsolvedThumbnailUrl?: string;
}

export interface ContentItem {
  name: string;
  alternativeNames?: string[];
  funFact?: string;
  wikipediaName?: string;
}

export type ContentKey = string;


export interface QuizDefinition {
  id: string;
  quiz: Quiz; 
  contentType: string;
}

const allQuizDefinitions: QuizDefinition[] = [];

export function registerQuizDefinitions(definitions: QuizDefinition[]): void {
  console.log(`[QuizInit] Registering ${definitions.length} quiz definitions`);
  allQuizDefinitions.push(...definitions);
}

export async function initializeAllQuizzes(): Promise<void> {
  console.log(`[QuizInit] Starting initialization of ${allQuizDefinitions.length} quizzes`);
  
  const registerQuizInProvider = (globalThis as any).registerQuizInProvider;
  if (!registerQuizInProvider) {
    console.warn('[QuizInit] Provider not ready yet, will retry...');
    setTimeout(() => initializeAllQuizzes(), 100);
    return;
  }
  
  for (const { id, quiz, contentType } of allQuizDefinitions) {
    console.log(`[QuizInit] Registering quiz '${id}' of type '${contentType}'`);
    registerQuizInProvider(id, quiz);
  }

  console.log(`[QuizInit] Successfully initialized ${allQuizDefinitions.length} quizzes`);
}

export function getAllQuizDefinitions(): QuizDefinition[] {
  return [...allQuizDefinitions];
}