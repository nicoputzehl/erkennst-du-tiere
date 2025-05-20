// src/features/animals/quizzes/animalQuizzes.ts

import { registerQuizInitializer } from '@/src/core/initialization/quizInitialization';
import { createAnimalQuiz } from '../helper/createAnimalQuiz';
import { emojiAnimals, namibiaAnimals, weirdAnimals } from '../data/quizzes';
import { QuestionType } from '@/src/quiz/types';

export const ANIMAL_CONTENT_TYPE = 'animal';

// Definiere die Animal-Quizzes als Initialisierer
const initializeAnimalQuizzes = () => [
  {
    id: 'namibia_animals',
    quiz: createAnimalQuiz({
      id: 'namibia_animals',
      title: 'Tiere Namibias',
      animalQuestions: namibiaAnimals,
      initiallyLocked: false,
      questionType: QuestionType.MULTIPLE_CHOICE,
      order: 1
    }),
    contentType: ANIMAL_CONTENT_TYPE
  },
  {
    id: 'emoji_animals',
    quiz: createAnimalQuiz({
      id: 'emoji_animals',
      title: 'Emojis',
      animalQuestions: emojiAnimals,
      order: 2,
      initiallyLocked: false,
      questionType: QuestionType.MULTIPLE_CHOICE,
    }),
    contentType: ANIMAL_CONTENT_TYPE
  },
  {
    id: 'weird_animals',
    quiz: createAnimalQuiz({
      id: 'weird_animals',
      title: 'Weird Animals',
      animalQuestions: weirdAnimals,
      order: 3,
      initiallyLocked: true,
      unlockCondition: {
        type: 'specificQuiz',
        requiredQuizId: 'namibia_animals',
        description: 'Schließe das Quiz "Tiere Namibias" ab, um dieses Quiz freizuschalten.'
      },
    }),
    contentType: ANIMAL_CONTENT_TYPE
  }
];

// Registriere den Initialisierer
registerQuizInitializer(initializeAnimalQuizzes);

// Optional: Export der initialisierten Quizzes für direkten Zugriff
export const allAnimalQuizCategories = [
  {
    id: 'weird_animals',
    title: 'Weird Animals',
    contentType: ANIMAL_CONTENT_TYPE
  },
  {
    id: 'emoji_animals',
    title: 'Emoji Animals',
    contentType: ANIMAL_CONTENT_TYPE
  },
  {
    id: 'namibia_animals',
    title: 'Tiere Namibias',
    contentType: ANIMAL_CONTENT_TYPE
  }
];