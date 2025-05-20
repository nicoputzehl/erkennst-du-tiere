import { findClosestAnimal, getValidAnimals, validateAnimalKey } from "./animalValidator";
import { QuestionWithAnimal } from "../types";
import { Question } from "@/src/quiz/types";
import { animalHandler } from "../handler/AnimalHandler";

const createQuestionsFromAnimals = (questions: QuestionWithAnimal[]): Question[] => {
  return questions.map(q => {
    // Validation hinzufügen
    if (!validateAnimalKey(q.animal)) {
      const closest = findClosestAnimal(q.animal);
      const errorMessage = `Invalid animal key: "${q.animal}" for question ${q.id}`;
      if (closest) {
        console.error(`${errorMessage}. Did you mean "${closest}"?`);
      } else {
        console.error(`${errorMessage}. Valid animals are: ${getValidAnimals().join(', ')}`);
      }
      throw new Error(errorMessage);
    }
    
    return animalHandler.createQuestion(q.id, q.imageUrl, q.animal);
  });
};

export { createQuestionsFromAnimals };