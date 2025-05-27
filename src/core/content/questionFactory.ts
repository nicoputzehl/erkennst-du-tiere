
import { ContentQuestion } from './types';
import { Question } from '../../quiz/types';
import { ANIMAL_LIST } from '@/src/animals/data/animal_list';
import { AnimalKey } from '@/src/animals/types';

/**
 * Erstellt Fragen direkt aus Animal-Keys - keine generische Abstraktion mehr
 * Viel einfacher als vorher!
 */
export const createQuestionsFromContent = (questions: ContentQuestion[]): Question[] => {
  return questions.map(q => {
    // Direkte Validierung gegen ANIMAL_LIST
    const animalKey = q.contentKey as AnimalKey;
    
    if (!(animalKey in ANIMAL_LIST)) {
      const availableKeys = Object.keys(ANIMAL_LIST);
      const similar = availableKeys.find(key => 
        key.toLowerCase().includes(animalKey.toLowerCase()) ||
        animalKey.toLowerCase().includes(key.toLowerCase())
      );

      const errorMessage = `Invalid animal key: "${animalKey}" for question ${q.id}`;
      if (similar) {
        console.error(`${errorMessage}. Did you mean "${similar}"?`);
      } else {
        console.error(`${errorMessage}. Valid keys: ${availableKeys.join(', ')}`);
      }
      throw new Error(errorMessage);
    }

    // Direkte Erstellung der Question - kein Interface-Layer
    const animal = ANIMAL_LIST[animalKey];
    
    return {
      id: q.id,
      images: q.images,
      answer: animal.name,
      alternativeAnswers: animal.alternativeNames,
      funFact: animal.funFact,
      wikipediaName: animal.wikipediaName,
      data: { content: animalKey }
    };
  });
};