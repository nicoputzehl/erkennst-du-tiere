// src/animals/initQuiz/quizRegistry.ts (aktualisiert)

import { registerQuiz } from '@/src/quiz/services/quizRegistry';
import { createAnimalQuiz } from '../helper/createAnimalQuiz';
import { emojiAnimals, namibiaAnimals, weirdAnimals } from '../data/quizzes';
import { QuestionType } from '@/src/quiz/types';

// Konstante für den Content-Typ
export const ANIMAL_CONTENT_TYPE = 'animal';

/**
 * Initialisiert alle Quizzes in der Anwendung
 */
export function initializeAllQuizzes() {

  // Namibia Animals
  registerQuiz('namibia_animals', createAnimalQuiz({
    id: 'namibia_animals',
    title: 'Tiere Namibias',
    animalQuestions: namibiaAnimals,
    initiallyLocked: false,
    questionType: QuestionType.MULTIPLE_CHOICE,
    order: 1
  }), ANIMAL_CONTENT_TYPE);

  // Emoji Animals
  registerQuiz('emoji_animals', createAnimalQuiz({
    id: 'emoji_animals',
    title: 'Emojis',
    animalQuestions: emojiAnimals,
    order: 2,
    initiallyLocked: false,
    questionType: QuestionType.MULTIPLE_CHOICE,
  }), ANIMAL_CONTENT_TYPE);

  // Weird Animals
  registerQuiz('weird_animals', createAnimalQuiz({
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
  }), ANIMAL_CONTENT_TYPE);

}

// Initialisierung beim Import dieser Datei
initializeAllQuizzes();

// Optional: Export der initialisierten Quizzes für direkten Zugriff
export const allQuizCategories = [
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
  },
  {
    id: 'mc_animals',
    title: 'Multiple Choice Animals',
    contentType: ANIMAL_CONTENT_TYPE
  }
];