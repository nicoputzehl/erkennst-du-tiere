import { animalContentProvider } from '../adapter/AnimalContentProvider';
import { AnimalKey } from '../types';

export const validateAnimalKey = (animal: string): animal is AnimalKey => {
  return animalContentProvider.isValidContentKey(animal);
};

export const getValidAnimals = (): string[] => {
  return animalContentProvider.getAllContentKeys();
};

export const findClosestAnimal = (animal: string): string | null => {
  return animalContentProvider.findSimilarContentKey(animal);
};