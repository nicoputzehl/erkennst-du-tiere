export type QuizImages = {
  imageUrl: string;
  thumbnailUrl?: string;
  unsolvedImageUrl?: string;
  unsolvedThumbnailUrl?: string;
}

/**
 * Vereinfachtes ContentItem - weniger abstrakt
 */
export interface ContentItem {
  name: string;
  alternativeNames?: string[];
  funFact?: string;
  wikipediaName?: string;
}

/**
 * Content-Key ist jetzt einfach ein String - keine komplexen Generics
 */
export type ContentKey = string;

/**
 * Content-Question bleibt wie gehabt - funktioniert gut
 */
export interface ContentQuestion {
  id: number;
  images: QuizImages;
  contentKey: ContentKey;
}