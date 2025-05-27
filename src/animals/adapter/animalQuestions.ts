
import { createQuestionsFromContent } from '../../core/content/questionFactory';
import { QuestionWithAnimal } from '../types';
import { Question } from '../../quiz/types';

console.debug('[AnimalQuestions] Simple adapter without complex factory patterns');

/**
 * Direkter Adapter - keine komplexen Transformationen mehr
 */
export const createQuestionsFromAnimals = (animalQuestions: QuestionWithAnimal[]): Question[] => {
  console.debug('[AnimalQuestions] Converting animal questions to generic questions');
  
  // Einfache 1:1 Transformation
  const contentQuestions = animalQuestions.map(aq => ({
    id: aq.id,
    images: aq.images,
    contentKey: aq.animal // Direkt Animal-Key verwenden
  }));
  
  // Direkte Verwendung der vereinfachten Factory
  return createQuestionsFromContent(contentQuestions);
};