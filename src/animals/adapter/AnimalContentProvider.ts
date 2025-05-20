// src/animals/adapter/AnimalContentProvider.ts

import { ContentProvider } from '@/src/core/content/ContentHandler';
import { ContentItem } from '../../core/content/types';
import { ANIMAL_LIST } from '../data/animal_list';
import { AnimalKey } from '../types';

/**
 * Adapter für Animal-Daten zum neuen ContentProvider Interface
 */
export class AnimalContentProvider implements ContentProvider<AnimalKey> {
  /**
   * Gibt alle verfügbaren Tier-Keys zurück
   */
  getAllContentKeys(): AnimalKey[] {
    return Object.keys(ANIMAL_LIST) as AnimalKey[];
  }

  /**
   * Gibt ein Tier-Item für einen Key zurück
   */
  getContentItem(key: AnimalKey): ContentItem {
    const animalData = ANIMAL_LIST[key];
    if (!animalData) {
      throw new Error(`Animal "${key}" not found in ANIMAL_LIST`);
    }
    return animalData;
  }

  /**
   * Prüft, ob ein Key ein gültiger AnimalKey ist
   */
  isValidContentKey(key: string): key is AnimalKey {
    return key in ANIMAL_LIST;
  }

  /**
   * Findet den nächsten ähnlichen Tier-Key
   */
  findSimilarContentKey(key: string): AnimalKey | null {
    // Implementiere die bestehende findClosestAnimal Logik
    const validAnimals = this.getAllContentKeys();
    const closest = validAnimals.find(valid =>
      valid.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(valid.toLowerCase())
    );
    return closest || null;
  }
}

// Singleton-Instanz für einfachen Zugriff
export const animalContentProvider = new AnimalContentProvider();