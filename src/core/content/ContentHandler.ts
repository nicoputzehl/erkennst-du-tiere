// src/core/content/ContentHandler.ts

import { ContentKey, ContentItem } from './types';
import { MultipleChoiceQuestion, Question } from '../../quiz/types';

/**
 * Generisches Interface für Content-Handler
 * Ersetzt das tierabhängige ContentHandler
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
 * Erweiterung für Multiple-Choice-Fragen
 */
export interface MultipleChoiceContentHandler<T extends ContentKey = ContentKey> extends ContentHandler<T> {
  // Erstellt eine Multiple-Choice-Frage
  createMultipleChoiceQuestion: (
    id: number,
    imageUrl: string,
    contentKey: T,
    choices: string[],
    thumbnailUrl?: string // HINZUFÜGEN als 5. Parameter
  ) => MultipleChoiceQuestion<T>;

  // Generiert Antwortmöglichkeiten
  generateChoices?: (contentKey: T, count: number) => string[];
}

/**
 * Basis-Interface für Content-Provider
 * Diese Klasse verwaltet den Zugriff auf alle verfügbaren Inhalte eines Typs
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