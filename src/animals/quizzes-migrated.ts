// src/animals/quizzes-migrated.ts
// Neue Version mit Store-Integration
import { defineQuiz, validateQuizRegistration } from '@/src/stores/quizRegistry';
import { namibia, emojiAnimals, weirdAnimals } from './data/quizzes';

// Quiz-Definitionen mit Store-Registrierung
export const namibiaQuiz = defineQuiz({
  id: 'namibia',
  title: 'Tiere Namibias',
  questions: namibia,
  titleImage: require('./data/quizzes/namibia/img/namibia_title.jpg'),
});

export const emojiAnimalsQuiz = defineQuiz({
  id: 'emoji_animals', 
  title: 'Emojis',
  questions: emojiAnimals,
  titleImage: require('./data/quizzes/emoji_animals/img/emoji_title.png'),
});

export const weirdAnimalsQuiz = defineQuiz({
  id: 'weird_animals',
  title: 'Weird Animals', 
  questions: weirdAnimals,
  titleImage: require('./data/quizzes/weird_animals/img/weird_animals_title.jpg'),
});

// Debug: Validate registration in development
if (__DEV__) {
  // Warte kurz und dann validiere
  setTimeout(() => {
    validateQuizRegistration();
  }, 100);
}

// Export als Array für Kompatibilität
export const allMigratedQuizzes = [
  namibiaQuiz,
  emojiAnimalsQuiz, 
  weirdAnimalsQuiz
];

if (__DEV__) {
  console.log('[QuizzesMigrated] Exported quizzes:', allMigratedQuizzes.map(q => q.id));
}