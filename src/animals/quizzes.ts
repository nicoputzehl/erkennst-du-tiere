import { registerQuizDefinitions } from '@/src/core/initialization/quizInitialization';
import { createSimpleAnimalQuiz, createLockedAnimalQuiz } from './helper/createAnimalQuiz';
import { emojiAnimals, namibia, weirdAnimals } from './data/quizzes';

export const ANIMAL_CONTENT_TYPE = 'animal';

const animalQuizDefinitions = [
  {
    id: 'namibia',
    quiz: createSimpleAnimalQuiz('namibia', 'Tiere Namibias', namibia),
    contentType: ANIMAL_CONTENT_TYPE
  },
  {
    id: 'emoji_animals',
    quiz: createLockedAnimalQuiz('emoji_animals', 'Emojis', emojiAnimals, 'namibia', 2),
    contentType: ANIMAL_CONTENT_TYPE
  },
  {
    id: 'weird_animals',
    quiz: createLockedAnimalQuiz('weird_animals', 'Weird Animals', weirdAnimals, 'emoji_animals', 3),
    contentType: ANIMAL_CONTENT_TYPE
  }
];

registerQuizDefinitions(animalQuizDefinitions);


export const allAnimalQuizCategories = animalQuizDefinitions.map(def => ({
  id: def.id,
  title: def.quiz.title,
  contentType: def.contentType,
  order: def.quiz.order || 1,
  isLocked: def.quiz.initiallyLocked || false,
}));

export { animalQuizDefinitions };