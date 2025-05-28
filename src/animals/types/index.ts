import { Question, QuizImages } from "@/src/quiz";
import { ANIMAL_LIST } from "../data";

// ====== TIER-DATEN TYPES ======

export type AnimalKey = keyof typeof ANIMAL_LIST;

export interface Animal {
  name: string;
  alternativeNames?: string[];
  funFact?: string;
  wikipediaName?: string;
}

// ====== FRAGEN-TYPES (VEREINFACHT) ======

// Vereinfachte Animal-Question ohne Generics
export interface QuestionWithAnimal {
  id: number;
  images: QuizImages;
  animal: AnimalKey;
}

// ====== LEGACY COMPATIBILITY ======

export type AnimalQuestion = Question;