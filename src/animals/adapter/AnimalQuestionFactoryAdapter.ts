import { ContentQuestionFactory } from '../../core/content/ContentQuestionFactory';
import { AnimalKey, QuestionWithAnimal } from '../types';
import { animalContentProvider } from './AnimalContentProvider';
import { Question } from '../../quiz/types';
import { animalContentHandler } from './AnimalContentaHandlerAdapter';

/**
 * Adapter, der aus dem QuestionWithAnimal-Typ ContentQuestion macht
 */
const adaptAnimalQuestions = (questions: QuestionWithAnimal[]): { id: number; imageUrl: string; thumbnailUrl?: string; contentKey: string }[] => {
  return questions.map(q => {
    console.log(`[adaptAnimalQuestions] Processing question ${q.id}, ${q.animal}, thumbnailUrl:`, q.thumbnailUrl);
    return {
      id: q.id,
      imageUrl: q.imageUrl,
      thumbnailUrl: q.thumbnailUrl,
      contentKey: q.animal
    };
  });
};

/**
 * Erstellt normale Text-Fragen aus Tier-Definitionen
 */
export const createQuestionsFromAnimals = (questions: QuestionWithAnimal[]): Question[] => {
  const factory = new ContentQuestionFactory<AnimalKey>(
    animalContentHandler,
    animalContentProvider
  );

  return factory.createQuestionsFromContent(adaptAnimalQuestions(questions));
};