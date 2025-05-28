import { createQuiz, createUnlockCondition } from '../quiz/utils';
import { Question, Quiz, QuizMode } from '../quiz/types';
import { QuestionWithAnimal, AnimalKey } from './types';
import { ANIMAL_LIST } from './data';
import { QuizImages } from '../common/utils';

// ====== ANIMAL-QUESTION CREATION ======

export function createAnimalQuestion(
  id: number, 
  animalKey: AnimalKey, 
  images: QuizImages
): Question<string> {
  const animal = ANIMAL_LIST[animalKey as keyof typeof ANIMAL_LIST];
  
  if (!animal) {
    throw new Error(`Animal "${String(animalKey)}" not found in ANIMAL_LIST`);
  }
  
  return {
    id,
    images,
    answer: animal.name,
    alternativeAnswers: animal.alternativeNames,
    funFact: animal.funFact,
    wikipediaName: animal.wikipediaName,
    data: { content: String(animalKey) }, // Convert to string
  };
}

// ====== ANIMAL-QUIZ CREATION ======

export interface AnimalQuizConfig {
  id: string;
  title: string;
  animalQuestions: QuestionWithAnimal[];
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
  initiallyLocked?: boolean;
  requiresQuiz?: string; // Einfacher als unlockCondition
}

export function createAnimalQuiz(config: AnimalQuizConfig): Quiz<string> {
  // Konvertiere Animal-Questions zu Questions
  const questions = config.animalQuestions.map(aq => 
    createAnimalQuestion(aq.id, aq.animal, aq.images)
  ) as Question<string>[];

  // Erstelle Unlock-Condition wenn requiresQuiz gesetzt
  const unlockCondition = config.requiresQuiz 
    ? createUnlockCondition(config.requiresQuiz)
    : undefined;

  return createQuiz<string>({
    id: config.id,
    title: config.title,
    questions,
    initiallyLocked: config.initiallyLocked,
    unlockCondition,
    order: config.order,
    quizMode: config.quizMode,
    initialUnlockedQuestions: config.initialUnlockedQuestions,
  });
}

// ====== CONVENIENCE-FUNKTIONEN ======

export function createSimpleAnimalQuiz(
  id: string,
  title: string,
  animalQuestions: QuestionWithAnimal[]
): Quiz<string> {
  return createAnimalQuiz({
    id,
    title,
    animalQuestions,
    order: 1,
    initiallyLocked: false,
  });
}

export function createLockedAnimalQuiz(
  id: string,
  title: string,
  animalQuestions: QuestionWithAnimal[],
  requiredQuizId: string,
  order: number = 1
): Quiz<string> {
  return createAnimalQuiz({
    id,
    title,
    animalQuestions,
    order,
    initiallyLocked: true,
    requiresQuiz: requiredQuizId,
  });
}

// ====== LEGACY COMPATIBILITY ======

export function createAnimalQuestions(animalQuestions: QuestionWithAnimal[]): Question<string>[] {
  return animalQuestions.map(aq => 
    createAnimalQuestion(aq.id, aq.animal, aq.images)
  ) as Question<string>[];
}