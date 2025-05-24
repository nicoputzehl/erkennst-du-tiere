import { ContentHandler, ContentProvider } from './ContentHandler';
import { ContentKey, ContentQuestion } from './types';
import { Question } from '../../quiz/types';

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

      return this.contentHandler.createQuestion(q.id, q.imageUrl, q.contentKey as T, q.thumbnailUrl);
    });
  }
}