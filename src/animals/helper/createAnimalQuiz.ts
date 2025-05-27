import { createQuiz, CompleteContentQuizConfig } from '../../core/content/quizFactory';
import { createQuestionsFromAnimals } from '../adapter/animalQuestions';
import { QuestionWithAnimal, AnimalKey } from '../types';
import { Question, Quiz, QuizMode, UnlockCondition } from '../../quiz/types';
import { ANIMAL_LIST } from '../data/animal_list';
import { QuizImages } from '@/src/core/content/types';

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

/**
 * Direkte Animal-zu-Question Konvertierung - ganz ohne Adapter!
 */
export const createAnimalQuestion = (
  id: number, 
  animalKey: AnimalKey, 
  images: QuizImages
): Question => {
  const animal = ANIMAL_LIST[animalKey];
  
  if (!animal) {
    throw new Error(`Animal "${animalKey}" not found in ANIMAL_LIST`);
  }
  
  return {
    id,
    images,
    answer: animal.name,
    alternativeAnswers: animal.alternativeNames,
    funFact: animal.funFact,
    wikipediaName: animal.wikipediaName,
    data: { content: animalKey }
  };
};

/**
 * Batch-Konvertierung für mehrere Animal-Questions
 */  
export const createAnimalQuestions = (animalQuestions: QuestionWithAnimal[]): Question[] => {
  return animalQuestions.map(aq => 
    createAnimalQuestion(aq.id, aq.animal, aq.images)
  );
};


export { createAnimalQuiz };