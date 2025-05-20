import { ContentHandler, MultipleChoiceContentHandler } from '../../core/content/ContentHandler';
import { Question, MultipleChoiceQuestion, QuestionType } from '../../quiz/types';
import { ANIMAL_LIST } from '../data/animal_list';
import { AnimalKey } from '../types';
import { animalContentProvider } from './AnimalContentProvider';

/**
 * Adapter für den alten AnimalHandler zum neuen ContentHandler Interface
 */
export class AnimalContentHandlerAdapter implements ContentHandler<AnimalKey> {
  createQuestion(id: number, imageUrl: string, contentKey: AnimalKey): Question<AnimalKey> {
    const animalData = ANIMAL_LIST[contentKey];

    // Fehlerbehandlung
    if (!animalData) {
      console.error(`Unknown animal: ${contentKey}`);
      throw new Error(`Animal "${contentKey}" not found in ANIMALS data. Available animals: ${Object.keys(ANIMAL_LIST).join(', ')}`);
    }

    return {
      id,
      imageUrl,
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

/**
 * Adapter für MultipleChoiceAnimalHandler
 */
export class AnimalMultipleChoiceHandlerAdapter extends AnimalContentHandlerAdapter implements MultipleChoiceContentHandler<AnimalKey> {
  createMultipleChoiceQuestion(
    id: number,
    imageUrl: string,
    contentKey: AnimalKey,
    choices: string[]
  ): MultipleChoiceQuestion<AnimalKey> {
    const baseQuestion = super.createQuestion(id, imageUrl, contentKey);
    
    return {
      ...baseQuestion,
      questionType: QuestionType.MULTIPLE_CHOICE,
      choices
    };
  }

  // Hilfsfunktion zum Zufälligen Auswählen von n Elementen aus einem Array
  private getRandomElements<T>(array: T[], n: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  generateChoices(contentKey: AnimalKey, totalChoiceCount: number = 4): string[] {
    const correctAnswer = this.getAnswer(contentKey);
    const allAnimals = animalContentProvider.getAllContentKeys();
    
    // Filtere das aktuelle Tier aus
    const otherAnimals = allAnimals.filter(a => a !== contentKey);
    
    // Bestimme, wie viele falsche Antworten wir benötigen
    const wrongChoiceCount = Math.min(totalChoiceCount - 1, otherAnimals.length);
    
    // Wähle zufällige andere Tiere
    const randomAnimals = this.getRandomElements(otherAnimals, wrongChoiceCount);
    
    // Erstelle Antwortmöglichkeiten mit den Namen der Tiere
    const wrongAnswers = randomAnimals.map(a => ANIMAL_LIST[a].name);
    
    // Füge die richtige Antwort hinzu und mische alle Optionen
    const allChoices = [correctAnswer, ...wrongAnswers];
    return this.getRandomElements(allChoices, allChoices.length);
  }
}

// Singleton-Instanzen für einfachen Zugriff
export const animalContentHandler = new AnimalContentHandlerAdapter();
export const animalMultipleChoiceContentHandler = new AnimalMultipleChoiceHandlerAdapter();