import { ContentHandler } from '../../core/content/ContentHandler';
import { Question } from '../../quiz/types';
import { ANIMAL_LIST } from '../data/animal_list';
import { AnimalKey } from '../types';

/**
 * Adapter für den alten AnimalHandler zum neuen ContentHandler Interface
 */
export class AnimalContentHandlerAdapter implements ContentHandler<AnimalKey> {
  createQuestion(id: number, imageUrl: string, contentKey: AnimalKey, thumbnailUrl?: string): Question<AnimalKey> {
    const animalData = ANIMAL_LIST[contentKey];

    // Fehlerbehandlung
    if (!animalData) {
      console.error(`Unknown animal: ${contentKey}`);
      throw new Error(`Animal "${contentKey}" not found in ANIMALS data. Available animals: ${Object.keys(ANIMAL_LIST).join(', ')}`);
    }

    return {
      id,
      imageUrl,
      thumbnailUrl,
      answer: animalData.name,
      alternativeAnswers: animalData.alternativeNames,
      funFact: animalData.funFact,
      wikipediaName: animalData.wikipediaName,
      data: { content: contentKey }
    };
  }

  getAnswer(contentKey: AnimalKey): string {
    const animalData = ANIMAL_LIST[contentKey];
    if (!animalData) {
      throw new Error(`Animal "${contentKey}" not found`);
    }
    return animalData.name;
  }

  getAlternativeAnswers(contentKey: AnimalKey): string[] | undefined {
    const animalData = ANIMAL_LIST[contentKey];
    if (!animalData) {
      throw new Error(`Animal "${contentKey}" not found`);
    }
    return animalData.alternativeNames;
  }

  getMetadata(contentKey: AnimalKey): { funFact?: string; wikipediaName?: string } {
    const animalData = ANIMAL_LIST[contentKey];
    if (!animalData) {
      throw new Error(`Animal "${contentKey}" not found`);
    }
    return {
      funFact: animalData.funFact,
      wikipediaName: animalData.wikipediaName
    };
  }
}

// Singleton-Instanz für einfachen Zugriff
export const animalContentHandler = new AnimalContentHandlerAdapter();