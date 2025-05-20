import { Question } from '@/src/quiz/types';
import { AnimalKey } from '../types';
import { ANIMAL_LIST } from '../data/animal_list';
import { ContentHandler } from '@/src/quiz/handler';

const createQuestion = (id: number, imageUrl: string, animal: AnimalKey): Question<AnimalKey> => {
  const animalData = ANIMAL_LIST[animal];

  // Fehlerbehandlung
  if (!animalData) {
    console.error(`Unknown animal: ${animal}`);
    throw new Error(`Animal "${animal}" not found in ANIMALS data. Available animals: ${Object.keys(ANIMAL_LIST).join(', ')}`);
  }

  return {
    id,
    imageUrl,
    answer: animalData.name,
    alternativeAnswers: animalData.alternativeNames,
    funFact: animalData.funFact,
    wikipediaName: animalData.wikipediaName,
    data: { content: animal }
  };
};

const getAnswer = (animal: AnimalKey): string => {
  const animalData = ANIMAL_LIST[animal];
  if (!animalData) {
    throw new Error(`Animal "${animal}" not found`);
  }
  return animalData.name;
};

const getAlternativeAnswers = (animal: AnimalKey): string[] | undefined => {
  const animalData = ANIMAL_LIST[animal];
  if (!animalData) {
    throw new Error(`Animal "${animal}" not found`);
  }
  return animalData.alternativeNames;
};

const getMetadata = (animal: AnimalKey): { funFact?: string; wikipediaName?: string } => {
  const animalData = ANIMAL_LIST[animal];
  if (!animalData) {
    throw new Error(`Animal "${animal}" not found`);
  }
  return {
    funFact: animalData.funFact,
    wikipediaName: animalData.wikipediaName
  };
};

export const animalHandler: ContentHandler<AnimalKey> = {
  createQuestion,
  getAnswer,
  getAlternativeAnswers,
  getMetadata,
};