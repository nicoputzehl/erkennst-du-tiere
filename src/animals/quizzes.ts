import { registerQuizDefinitions } from '../common/utils';
import { emojiAnimals, namibia, weirdAnimals } from './data/quizzes';
import { createQuiz, createUnlockCondition } from '../quiz';

export const ANIMAL_CONTENT_TYPE = 'animal';


const animalQuizDefinitions = [
  {
    id: 'namibia',
    quiz: createQuiz({ id: 'namibia', title: 'Tiere Namibias', titleimage: require('./data/quizzes/namibia/img/namibia_title.jpg'), questions: namibia }),
    contentType: ANIMAL_CONTENT_TYPE
  },

  {
    id: 'emoji_animals',
    quiz: createQuiz(
      {
        id: 'emoji_animals',
        title: 'Emojis',
        questions: emojiAnimals,
        titleimage: require('./data/quizzes/emoji_animals/img/emoji_title.png'),
        order: 2,
        initiallyLocked: false,
        unlockCondition: createUnlockCondition('namibia', 'Schließe das Quiz "Tiere Namibias" ab, um dieses Quiz freizuschalten.')
      }),
    contentType: ANIMAL_CONTENT_TYPE
  },

  {
    id: 'weird_animals',
    quiz: createQuiz(
      {
        id: 'weird_animals',
        title: 'Weird Animals',
        titleimage: require('./data/quizzes/weird_animals/img/weird_animals_title.jpg'),
        questions: weirdAnimals,
        order: 3,
        initiallyLocked: true,
        unlockCondition: createUnlockCondition('emoji_animals', 'Schließe das Quiz "Emojis" ab, um dieses Quiz freizuschalten.')
      }),

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