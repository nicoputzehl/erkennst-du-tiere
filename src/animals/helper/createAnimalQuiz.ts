import { ContentQuizFactory, CompleteContentQuizConfig } from '../../core/content/ContentQuizFactory';
import { createQuestionsFromAnimals } from '../adapter/AnimalQuestionFactoryAdapter';
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

const createAnimalQuiz = (config: AnimalQuizConfig): Quiz<AnimalKey> => {
  const contentConfig = adaptAnimalQuizConfig(config);
  return ContentQuizFactory.createQuiz<AnimalKey>(contentConfig);
};

export { createAnimalQuiz };