import { registerQuizzes } from '../common/utils';
import { emojiAnimals, namibia, weirdAnimals } from './data/quizzes';
import { createQuiz, createUnlockCondition, Quiz } from '../quiz';


const animalQuizzes: Quiz[] = [
  createQuiz({
    id: 'namibia',
    title: 'Tiere Namibias',
    titleImage: require('./data/quizzes/namibia/img/namibia_title.jpg'),
    questions: namibia
  }),

  createQuiz({
    id: 'emoji_animals',
    title: 'Emojis',
    questions: emojiAnimals,
    titleImage: require('./data/quizzes/emoji_animals/img/emoji_title.png'),
    order: 2,
    initiallyLocked: false,
    unlockCondition: createUnlockCondition('namibia', 'Schließe das Quiz "Tiere Namibias" ab, um dieses Quiz freizuschalten.')
  }),

  createQuiz({
    id: 'weird_animals',
    title: 'Weird Animals',
    titleImage: require('./data/quizzes/weird_animals/img/weird_animals_title.jpg'),
    questions: weirdAnimals,
    order: 3,
    initiallyLocked: true,
    unlockCondition: createUnlockCondition('emoji_animals', 'Schließe das Quiz "Emojis" ab, um dieses Quiz freizuschalten.')
  })
];

registerQuizzes(animalQuizzes);
