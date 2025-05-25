import { ContentQuestionFactory } from '../../core/content/ContentQuestionFactory';
import { AnimalKey, QuestionWithAnimal } from '../types';
import { animalContentProvider } from './AnimalContentProvider';
import { Question } from '../../quiz/types';
import { animalContentHandler } from './AnimalContentaHandlerAdapter';
import { QuizImages } from '@/src/core/content/types';

console.debug('[AnimalQuestionFactoryAdapter] createQuestionsFromAnimals');

/**
 * Adapter, der aus dem QuestionWithAnimal-Typ ContentQuestion macht
 */
const adaptAnimalQuestions = (questions: QuestionWithAnimal[]): { id: number; images: QuizImages; contentKey: string }[] => {
  console.debug('[AnimalQuestionFactoryAdapter] adaptAnimalQuestions');
  return questions.map(q => {
    console.debug(`[AnimalQuestionFactoryAdapter] Processing question ${q.id}, ${q.animal}, images:`, q.images);
    return {
      id: q.id,
      images: q.images,
      contentKey: q.animal
    };
  });
};

/**
 * Erstellt normale Text-Fragen aus Tier-Definitionen
 */
export const createQuestionsFromAnimals = (questions: QuestionWithAnimal[]): Question[] => {
  console.debug('[AnimalQuestionFactoryAdapter] createQuestionsFromAnimals');
  const factory = new ContentQuestionFactory<AnimalKey>(
    animalContentHandler,
    animalContentProvider
  );

  return factory.createQuestionsFromContent(adaptAnimalQuestions(questions));
};
