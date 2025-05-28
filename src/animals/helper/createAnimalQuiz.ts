import { createQuiz, createUnlockCondition } from '../../quiz/factories/quizHelpers';
import { Question, Quiz, QuizMode } from '../../quiz/types/base';
import { QuestionWithAnimal, AnimalKey } from '../types';
import { ANIMAL_LIST } from '../data/animal_list';
import { QuizImages } from '@/src/core/content/types';

export function createAnimalQuestion(
  id: number, 
  animalKey: AnimalKey, 
  images: QuizImages
): Question<AnimalKey> {
  const animal = ANIMAL_LIST[animalKey];
  
  if (!animal) {
    throw new Error(`Animal "${animalKey}" not found in ANIMAL_LIST`);
  }
  
  return {
    id,
    images,
    answer: animal.name,
    alternativeAnswers: animal.alternativeNames,
    funFact: animal.funFact,
    wikipediaName: animal.wikipediaName,
    data: { content: animalKey },
  };
}


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

export function createAnimalQuiz(config: AnimalQuizConfig): Quiz<AnimalKey> {
  const questions = config.animalQuestions.map(aq => 
    createAnimalQuestion(aq.id, aq.animal, aq.images)
  );

  const unlockCondition = config.requiresQuiz 
    ? createUnlockCondition(config.requiresQuiz)
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

export function createSimpleAnimalQuiz(
  id: string,
  title: string,
  animalQuestions: QuestionWithAnimal[]
): Quiz<AnimalKey> {
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
): Quiz<AnimalKey> {
  return createAnimalQuiz({
    id,
    title,
    animalQuestions,
    order,
    initiallyLocked: true,
    requiresQuiz: requiredQuizId,
  });
}