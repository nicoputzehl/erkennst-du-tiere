import { MultipleChoiceQuestion, Question } from "../../quiz/types";
import { ANIMAL_LIST } from "../data/animal_list";

// AnimalKey Definition
export type AnimalKey = keyof typeof ANIMAL_LIST;

// Tierbezogene Typen
export interface Animal {
  name: string;
  alternativeNames?: string[];
  funFact?: string;
  wikipediaName?: string;
}

// Struktur für Text-Fragebereitstellung vom Client
export interface QuestionWithAnimal {
  id: number;
  imageUrl: string;
  thumbnailUrl?: string; // HINZUFÜGEN
  animal: AnimalKey;
}

export interface MultipleChoiceQuestionWithAnimal extends QuestionWithAnimal {
  choices?: string[]; // Optional, da wir sie automatisch generieren können
}

// Typen für die konkreten Implementierungen
export type AnimalQuestion = Question<AnimalKey>;
export type AnimalMultipleChoiceQuestion = MultipleChoiceQuestion<AnimalKey>;