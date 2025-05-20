import { MultipleChoiceQuestion } from "@/src/quiz/types";
import { findClosestAnimal, getValidAnimals, validateAnimalKey } from "./animalValidator";
import { MultipleChoiceQuestionWithAnimal } from "../types";
import { multipleChoiceAnimalHandler } from "../handler/MultipleChoiceAnimalHandler";

/**
 * Erstellt Multiple-Choice-Fragen aus den gegebenen Tier-Definitionen
 * @param questions Die Fragendefinitionen mit Tier-IDs und optionalen Antwortmöglichkeiten
 * @param choiceCount Anzahl der Antwortmöglichkeiten, falls keine explizit angegeben sind
 * @returns Ein Array von Multiple-Choice-Fragen
 */
const createMultipleChoiceQuestionsFromAnimals = (
  questions: MultipleChoiceQuestionWithAnimal[],
  choiceCount: number = 4
): MultipleChoiceQuestion[] => {
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

    // Wenn bereits Antwortmöglichkeiten angegeben sind, verwende diese
    if (q.choices && q.choices.length > 0) {
      return multipleChoiceAnimalHandler.createMultipleChoiceQuestion(
        q.id,
        q.imageUrl,
        q.animal,
        q.choices
      );
    }

    // Ansonsten generiere automatisch Antwortmöglichkeiten
    const generatedChoices = multipleChoiceAnimalHandler.generateChoices?.(q.animal, choiceCount) || [];

    return multipleChoiceAnimalHandler.createMultipleChoiceQuestion(
      q.id,
      q.imageUrl,
      q.animal,
      generatedChoices
    );
  });
};

export { createMultipleChoiceQuestionsFromAnimals };