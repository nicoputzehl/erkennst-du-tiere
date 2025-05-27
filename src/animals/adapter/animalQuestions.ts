import { createQuestionsFromContent } from '../../core/content/questionFactory';
import { QuestionWithAnimal } from '../types';
import { Question } from '../../quiz/types';
import { QuizImages } from '@/src/core/content/types';

console.debug('[AnimalQuestionFactoryAdapter] createQuestionsFromAnimals');

/**
 * Adapter, der aus dem QuestionWithAnimal-Typ ContentQuestion macht
 * Jetzt als einfache Funktion
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
 * Direkte Funktionen statt Klassen-basierte Factory
 */
export const createQuestionsFromAnimals = (questions: QuestionWithAnimal[]): Question[] => {
  console.debug('[AnimalQuestionFactoryAdapter] createQuestionsFromAnimals');
  
  // Direkt die funktionale createQuestionsFromContent verwenden
  const adaptedQuestions = adaptAnimalQuestions(questions);
  return createQuestionsFromContent(adaptedQuestions);
};