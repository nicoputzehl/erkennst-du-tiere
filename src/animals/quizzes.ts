import { registerQuizDefinitions } from '@/src/core/initialization/quizInitialization';
import { createAnimalQuiz } from './helper/createAnimalQuiz';
import { emojiAnimals, namibia, weirdAnimals } from './data/quizzes';

export const ANIMAL_CONTENT_TYPE = 'animal';

const animalQuizDefinitions = [
  {
    id: 'namibia',
    quiz: createAnimalQuiz({
      id: 'namibia',
      title: 'Tiere Namibias',
      animalQuestions: namibia,
      order: 1,
      initiallyLocked: false, // Startquiz - immer freigeschaltet
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
      initiallyLocked: true,
      unlockCondition: {
        requiredQuizId: 'namibia',
        description: 'Schließe das Quiz "Tiere Namibias" ab, um dieses Quiz freizuschalten.'
      }
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
        requiredQuizId: 'emoji_animals',
        description: 'Schließe das Quiz "Emojis" ab, um dieses Quiz freizuschalten.'
      }
    }),
    contentType: ANIMAL_CONTENT_TYPE
  }
];

registerQuizDefinitions(animalQuizDefinitions);

/**
 * Export für direkten Zugriff (falls nötig)
 */
export const allAnimalQuizCategories = animalQuizDefinitions.map(def => ({
  id: def.id,
  title: def.quiz.title,
  contentType: def.contentType
}));

export { animalQuizDefinitions };