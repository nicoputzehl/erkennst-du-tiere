import { QuizImages } from "@/src/core/content/types";
import { Question } from "../../quiz/types";
import { ANIMAL_LIST } from "../data/animal_list";

export type AnimalKey = keyof typeof ANIMAL_LIST;

export interface Animal {
  name: string;
  alternativeNames?: string[];
  funFact?: string;
  wikipediaName?: string;
}

export interface QuestionWithAnimal {
  id: number;
  images: QuizImages;
  animal: AnimalKey;
}

export type AnimalQuestion = Question<AnimalKey>;