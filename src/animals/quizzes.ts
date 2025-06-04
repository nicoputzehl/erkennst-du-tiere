import { createQuizConfig, createUnlockCondition } from '../quiz/utils/quizCreation';
import { emojiAnimals, namibia, weirdAnimals } from './data/quizzes';

const namibiaQuiz = {
  id: 'namibia',
  title: 'Tiere Namibias',
  questions: namibia,
  titleImage: require('./data/quizzes/namibia/img/namibia_title.jpg'),
};

const emojiAnimalsQuiz = {
  id: 'emoji_animals', 
  title: 'Emojis',
  questions: emojiAnimals,
  titleImage: require('./data/quizzes/emoji_animals/img/emoji_title.png'),
};

const weirdAnimalsQuiz = {
  id: 'weird_animals',
  title: 'Weird Animals', 
  questions: weirdAnimals,
  titleImage: require('./data/quizzes/weird_animals/img/weird_animals_title.jpg'),
};

export const animalQuizConfigs = [
  createQuizConfig(namibiaQuiz, {
    order: 1,
    initiallyLocked: false,
  }),

  createQuizConfig(emojiAnimalsQuiz, {
    order: 2,
    initiallyLocked: true,
    unlockCondition: createUnlockCondition(
      'namibia', 
      'Schließe das Quiz "Tiere Namibias" ab, um dieses Quiz freizuschalten.'
    ),
  }),
  createQuizConfig(weirdAnimalsQuiz, {
    order: 3, 
    initiallyLocked: true,
    unlockCondition: createUnlockCondition(
      'emoji_animals',
      'Schließe das Quiz "Emojis" ab, um dieses Quiz freizuschalten.'
    ),
  }),
];
