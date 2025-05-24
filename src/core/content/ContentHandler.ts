import { ContentKey, ContentItem } from './types';
import { Question } from '../../quiz/types';

/**
 * Generisches Interface für Content-Handler
 */
export interface ContentHandler<T extends ContentKey = ContentKey> {
  // Konvertiert Content-Key zu Question-Objekten
  createQuestion: (id: number, imageUrl: string, contentKey: T, thumbnailUrl?: string) => Question<T>;

  // Holt die richtige Antwort für einen Content-Key
  getAnswer: (contentKey: T) => string;

  // Holt alternative Antworten für einen Content-Key
  getAlternativeAnswers?: (contentKey: T) => string[] | undefined;

  // Holt zusätzliche Metadaten für einen Content-Key
  getMetadata?: (contentKey: T) => { funFact?: string; wikipediaName?: string };
}

/**
 * Basis-Interface für Content-Provider
 */
export interface ContentProvider<T extends ContentKey = ContentKey> {
  // Gibt alle verfügbaren Content-Keys zurück
  getAllContentKeys: () => T[];

  // Gibt ein ContentItem für einen Key zurück
  getContentItem: (key: T) => ContentItem;

  // Prüft, ob ein Content-Key gültig ist
  isValidContentKey: (key: string) => key is T;

  // Gibt den nächsten ähnlichen Content-Key zurück (für Fehlerbehandlung)
  findSimilarContentKey: (key: string) => T | null;
}