import { ANIMAL_LIST } from '../data/animal_list';
import { AnimalKey } from '../types';

export const validateAnimalKey = (animal: string): animal is AnimalKey => {
  return animal in ANIMAL_LIST;
};

export const getValidAnimals = (): string[] => {
  return Object.keys(ANIMAL_LIST);
};

export const findClosestAnimal = (animal: string): string | null => {
  const validAnimals = getValidAnimals();
  // Einfache String-Ähnlichkeit
  const closest = validAnimals.find(valid =>
    valid.toLowerCase().includes(animal.toLowerCase()) ||
    animal.toLowerCase().includes(valid.toLowerCase())
  );
  return closest || null;
};