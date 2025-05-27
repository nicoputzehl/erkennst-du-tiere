import { createQuiz, CompleteContentQuizConfig } from '../../core/content/quizFactory';
import { createQuestionsFromAnimals } from '../adapter/animalQuestions';
import { QuestionWithAnimal, AnimalKey } from '../types';
import { Quiz, QuizMode, UnlockCondition } from '../../quiz/types';

export interface AnimalQuizConfig {
  id: string;
  title: string;
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
  animalQuestions: QuestionWithAnimal[];
}

/**
 * Adaptiert AnimalQuizConfig zu CompleteContentQuizConfig
 * Jetzt als einfache Funktion
 */
const adaptAnimalQuizConfig = (config: AnimalQuizConfig): CompleteContentQuizConfig<AnimalKey> => {
  const questions = createQuestionsFromAnimals(config.animalQuestions);
  
  return {
    id: config.id,
    title: config.title,
    questions,
    initiallyLocked: config.initiallyLocked,
    unlockCondition: config.unlockCondition,
    order: config.order,
    quizMode: config.quizMode,
    initialUnlockedQuestions: config.initialUnlockedQuestions,
    questionType: 'text'
  };
};

/**
 * Erstellt ein Animal-Quiz aus der gegebenen Konfiguration
 * Direkte funktionale Komposition statt Klassen
 */
const createAnimalQuiz = (config: AnimalQuizConfig): Quiz<AnimalKey> => {
  const contentConfig = adaptAnimalQuizConfig(config);
  return createQuiz<AnimalKey>(contentConfig);
};

export { createAnimalQuiz };