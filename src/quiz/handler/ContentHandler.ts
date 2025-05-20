
import { MultipleChoiceQuestion, Question } from '../types';

export interface ContentHandler<T = any> {
  // Konvertiert rohe Content-Daten zu Question-Objekten
  createQuestion: (id: number, imageUrl: string, content: T) => Question<T>;
  
  // Extrahiert die richtige Antwort aus dem Content
  getAnswer: (content: T) => string;
  
  // Extrahiert alternative Antworten
  getAlternativeAnswers?: (content: T) => string[] | undefined;
  
  // Extrahiert Metadaten wie Fun Facts
  getMetadata?: (content: T) => { funFact?: string; wikipediaName?: string };
}

// Neue Interface für Multiple-Choice-Content-Handler
export interface MultipleChoiceContentHandler<T = any> extends ContentHandler<T> {
  // Erzeugt eine Multiple-Choice-Frage anstatt einer Text-Frage
  createMultipleChoiceQuestion: (
    id: number, 
    imageUrl: string, 
    content: T, 
    choices: string[]
  ) => MultipleChoiceQuestion<T>;
  
  // Generiert automatisch falsche Antwortmöglichkeiten (optional)
  generateChoices?: (content: T, count: number) => string[];
}