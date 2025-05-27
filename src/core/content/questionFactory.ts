import { ContentQuestion } from './types';
import { Question } from '../../quiz/types';
import { ANIMAL_LIST } from '@/src/animals/data/animal_list';

/**
 * Erstellt Fragen aus einer Liste von ContentQuestion-Definitionen
 * Jetzt als einfache Funktion statt Klasse
 */
export const createQuestionsFromContent = (questions: ContentQuestion[]): Question[] => {
  return questions.map(q => {
    // Validierung des Content-Keys
    if (!(q.contentKey in ANIMAL_LIST)) {
      const availableKeys = Object.keys(ANIMAL_LIST);
      const similar = availableKeys.find(key => 
        key.toLowerCase().includes(q.contentKey.toLowerCase()) ||
        q.contentKey.toLowerCase().includes(key.toLowerCase())
      );

      const errorMessage = `Invalid content key: "${q.contentKey}" for question ${q.id}`;

      if (similar) {
        console.error(`${errorMessage}. Did you mean "${similar}"?`);
      } else {
        console.error(`${errorMessage}. Valid keys are: ${availableKeys.join(', ')}`);
      }

      throw new Error(errorMessage);
    }

    // Direkt aus ANIMAL_LIST holen
    const animalData = ANIMAL_LIST[q.contentKey as keyof typeof ANIMAL_LIST];
    
    return {
      id: q.id,
      images: q.images,
      answer: animalData.name,
      alternativeAnswers: animalData.alternativeNames,
      funFact: animalData.funFact,
      wikipediaName: animalData.wikipediaName,
      data: { content: q.contentKey }
    };
  });
};