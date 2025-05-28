import { createQuiz, createUnlockCondition } from '../quiz/utils';
import { Question, Quiz, QuizMode, QuizImages } from '../quiz/types';
import { QuestionWithAnimal, AnimalKey } from './types';
import { ANIMAL_LIST } from './data';

// ====== ANIMAL-QUESTION CREATION (VEREINFACHT) ======

export function createAnimalQuestion(
  id: number,
  animalKey: AnimalKey,
  images: QuizImages
): Question {
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
    contentKey: String(animalKey), // Einfacher String statt Generic
  };
}

// ====== ANIMAL-QUIZ CREATION (VEREINFACHT) ======

export interface AnimalQuizConfig {
  id: string;
  title: string;
  animalQuestions: QuestionWithAnimal[];
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
  initiallyLocked?: boolean;
  // TODO besser machen
  requiresQuiz?: string;
  requiresDescription?: string;
}

export function createAnimalQuiz(config: AnimalQuizConfig): Quiz {
  // Konvertiere Animal-Questions zu Questions
  const questions = config.animalQuestions.map(aq =>
    createAnimalQuestion(aq.id, aq.animal, aq.images)
  );

  // Erstelle Unlock-Condition wenn requiresQuiz gesetzt
  const unlockCondition = config.requiresQuiz
    ? createUnlockCondition(config.requiresQuiz, config.requiresDescription)
    : undefined;

  return createQuiz({
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

// ====== CONVENIENCE-FUNKTIONEN (VEREINFACHT) ======

export function createSimpleAnimalQuiz(
  id: string,
  title: string,
  animalQuestions: QuestionWithAnimal[]
): Quiz {
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
  order: number = 1,
  requiredDescription?: string
): Quiz {
  return createAnimalQuiz({
    id,
    title,
    animalQuestions,
    order,
    initiallyLocked: true,
    requiresQuiz: requiredQuizId,
    requiresDescription: requiredDescription
  });
}

// ====== LEGACY COMPATIBILITY (VEREINFACHT) ======

export function createAnimalQuestions(animalQuestions: QuestionWithAnimal[]): Question[] {
  return animalQuestions.map(aq =>
    createAnimalQuestion(aq.id, aq.animal, aq.images)
  );
}