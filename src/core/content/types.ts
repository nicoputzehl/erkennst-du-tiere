/**
 * Basis-Interface für jeden Inhaltstyp (Animals, Movies, etc.)
 */
export interface ContentItem {
  name: string;
  alternativeNames?: string[];
  funFact?: string;
  wikipediaName?: string;
}

/**
 * Basis für jeden Content-spezifischen Key
 */
export type ContentKey = string;

/**
 * Definition für eine Frage, die mit einem Inhaltstyp verknüpft ist
 */
export interface ContentQuestion {
  id: number;
  imageUrl: string;
  thumbnailUrl?: string;
  contentKey: ContentKey;
}