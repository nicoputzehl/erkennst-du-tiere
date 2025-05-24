import { AnimalKey, AnimalMultipleChoiceQuestion } from "../types";
import { MultipleChoiceContentHandler } from "../../quiz/handler/ContentHandler";
import { Question, QuestionType } from "../../quiz/types";
import { ANIMAL_LIST } from "../data/animal_list";

// Hilfsfunktion zum Zufälligen Auswählen von n Elementen aus einem Array
const getRandomElements = <T>(array: T[], n: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const createQuestion = (id: number, imageUrl: string, animal: AnimalKey): Question<AnimalKey> => {
  const animalData = ANIMAL_LIST[animal];

  // Fehlerbehandlung hinzufügen
  if (!animalData) {
    console.error(`Unknown animal: ${animal}`);
    throw new Error(`Animal "${animal}" not found in ANIMALS data. Available animals: ${Object.keys(ANIMAL_LIST).join(', ')}`);
  }

  return {
    id,
    imageUrl,
    answer: animalData.name,
    alternativeAnswers: animalData.alternativeNames,
    funFact: animalData.funFact,
    wikipediaName: animalData.wikipediaName,
    questionType: QuestionType.TEXT,
    data: { content: animal }
  };
};

const createMultipleChoiceQuestion = (
  id: number,
  imageUrl: string,
  animal: AnimalKey,
  choices: string[],
  thumbnailUrl?: string // HINZUFÜGEN
): AnimalMultipleChoiceQuestion => {
  const animalData = ANIMAL_LIST[animal];

  // Fehlerbehandlung
  if (!animalData) {
    console.error(`Unknown animal: ${animal}`);
    throw new Error(`Animal "${animal}" not found in ANIMALS data. Available animals: ${Object.keys(ANIMAL_LIST).join(', ')}`);
  }

  return {
    id,
    imageUrl,
    thumbnailUrl,
    answer: animalData.name,
    alternativeAnswers: animalData.alternativeNames,
    funFact: animalData.funFact,
    wikipediaName: animalData.wikipediaName,
    questionType: QuestionType.MULTIPLE_CHOICE,
    choices,
    data: { content: animal }
  };
};

const getAnswer = (animal: AnimalKey): string => {
  const animalData = ANIMAL_LIST[animal];
  if (!animalData) {
    throw new Error(`Animal "${animal}" not found`);
  }
  return animalData.name;
};

const getAlternativeAnswers = (animal: AnimalKey): string[] | undefined => {
  const animalData = ANIMAL_LIST[animal];
  if (!animalData) {
    throw new Error(`Animal "${animal}" not found`);
  }
  return animalData.alternativeNames;
};

const getMetadata = (animal: AnimalKey): { funFact?: string; wikipediaName?: string } => {
  const animalData = ANIMAL_LIST[animal];
  if (!animalData) {
    throw new Error(`Animal "${animal}" not found`);
  }
  return {
    funFact: animalData.funFact,
    wikipediaName: animalData.wikipediaName
  };
};

/**
 * Generiert automatisch falsche Antwortmöglichkeiten für Multiple-Choice-Fragen
 * 
 * @param animal Das korrekte Tier
 * @param totalChoiceCount Gesamtanzahl der gewünschten Antwortmöglichkeiten (inklusive richtiger Antwort)
 * @returns Array mit der richtigen Antwort und den falschen Antwortmöglichkeiten in zufälliger Reihenfolge
 */
const generateChoices = (animal: AnimalKey, totalChoiceCount: number = 4): string[] => {
  const correctAnswer = getAnswer(animal);
  const allAnimals = Object.keys(ANIMAL_LIST) as AnimalKey[];

  // Filtere das aktuelle Tier aus
  const otherAnimals = allAnimals.filter(a => a !== animal);

  // Bestimme, wie viele falsche Antworten wir benötigen (totalChoiceCount - 1)
  const wrongChoiceCount = Math.min(totalChoiceCount - 1, otherAnimals.length);

  // Wähle zufällige andere Tiere
  const randomAnimals = getRandomElements(otherAnimals, wrongChoiceCount);

  // Erstelle Antwortmöglichkeiten mit den Namen der Tiere
  const wrongAnswers = randomAnimals.map(a => ANIMAL_LIST[a].name);

  // Füge die richtige Antwort hinzu und mische alle Optionen
  const allChoices = [correctAnswer, ...wrongAnswers];
  return getRandomElements(allChoices, allChoices.length);
};

export const multipleChoiceAnimalHandler: MultipleChoiceContentHandler<AnimalKey> = {
  createQuestion,
  createMultipleChoiceQuestion,
  getAnswer,
  getAlternativeAnswers,
  getMetadata,
  generateChoices
};