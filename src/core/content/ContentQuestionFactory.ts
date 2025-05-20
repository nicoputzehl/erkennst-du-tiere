// src/core/content/ContentQuestionFactory.ts

import { ContentHandler, ContentProvider, MultipleChoiceContentHandler } from './ContentHandler';
import { ContentKey, ContentQuestion, ContentMultipleChoiceQuestion } from './types';
import { Question, MultipleChoiceQuestion } from '../../quiz/types';

/**
 * Generische Factory für die Erstellung von Fragen basierend auf Content-Typen
 */
export class ContentQuestionFactory<T extends ContentKey = ContentKey> {
  constructor(
    private contentHandler: ContentHandler<T>,
    private contentProvider: ContentProvider<T>
  ) { }

  /**
   * Erstellt Fragen aus einer Liste von ContentQuestion-Definitionen
   */
  createQuestionsFromContent(questions: ContentQuestion[]): Question[] {
    return questions.map(q => {
      // Validierung des Content-Keys
      if (!this.contentProvider.isValidContentKey(q.contentKey)) {
        const similar = this.contentProvider.findSimilarContentKey(q.contentKey);
        const errorMessage = `Invalid content key: "${q.contentKey}" for question ${q.id}`;

        if (similar) {
          console.error(`${errorMessage}. Did you mean "${similar}"?`);
        } else {
          console.error(`${errorMessage}. Valid keys are: ${this.contentProvider.getAllContentKeys().join(', ')}`);
        }

        throw new Error(errorMessage);
      }

      return this.contentHandler.createQuestion(q.id, q.imageUrl, q.contentKey as T);
    });
  }
}

/**
 * Factory für Multiple-Choice-Fragen
 */
export class MultipleChoiceQuestionFactory<T extends ContentKey = ContentKey> {
  constructor(
    private multipleChoiceHandler: MultipleChoiceContentHandler<T>,
    private contentProvider: ContentProvider<T>
  ) { }

  /**
   * Erstellt Multiple-Choice-Fragen aus ContentQuestion-Definitionen
   */
  createMultipleChoiceQuestionsFromContent(
    questions: ContentMultipleChoiceQuestion[],
    choiceCount: number = 4
  ): MultipleChoiceQuestion[] {
    return questions.map(q => {
      // Validierung
      if (!this.contentProvider.isValidContentKey(q.contentKey)) {
        const similar = this.contentProvider.findSimilarContentKey(q.contentKey);
        const errorMessage = `Invalid content key: "${q.contentKey}" for question ${q.id}`;

        if (similar) {
          console.error(`${errorMessage}. Did you mean "${similar}"?`);
        } else {
          console.error(`${errorMessage}. Valid keys are: ${this.contentProvider.getAllContentKeys().join(', ')}`);
        }

        throw new Error(errorMessage);
      }

      // Content-Key auf T casten, nachdem wir validiert haben
      const contentKey = q.contentKey as T;

      // Wenn bereits Antwortmöglichkeiten angegeben sind, verwende diese
      if (q.choices && q.choices.length > 0) {
        return this.multipleChoiceHandler.createMultipleChoiceQuestion(
          q.id,
          q.imageUrl,
          contentKey,
          q.choices
        );
      }

      // Ansonsten generiere automatisch Antwortmöglichkeiten
      const generatedChoices = this.multipleChoiceHandler.generateChoices?.(contentKey, choiceCount) || [];

      return this.multipleChoiceHandler.createMultipleChoiceQuestion(
        q.id,
        q.imageUrl,
        contentKey,
        generatedChoices
      );
    });
  }
}