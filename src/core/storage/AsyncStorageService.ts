// src/core/storage/AsyncStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from './StorageService';

export const createAsyncStorageService = (): StorageService => {
  console.log('[AsyncStorageService] Creating new service instance');

  return {
    save: async <T>(key: string, data: T): Promise<void> => {
      try {
        console.log(`[AsyncStorageService] Saving data for key: ${key}`);
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(key, jsonValue);
        console.log(`[AsyncStorageService] Data saved successfully for key: ${key}`);
      } catch (error) {
        console.error(`[AsyncStorageService] Error saving data for key ${key}:`, error);
        throw error;
      }
    },

    load: async <T>(key: string): Promise<T | null> => {
      try {
        console.log(`[AsyncStorageService] Loading data for key: ${key}`);
        const jsonValue = await AsyncStorage.getItem(key);
        if (jsonValue === null) {
          console.log(`[AsyncStorageService] No data found for key: ${key}`);
          return null;
        }
        const data = JSON.parse(jsonValue) as T;
        console.log(`[AsyncStorageService] Data loaded successfully for key: ${key}`);
        return data;
      } catch (error) {
        console.error(`[AsyncStorageService] Error loading data for key ${key}:`, error);
        throw error;
      }
    },

    remove: async (key: string): Promise<void> => {
      try {
        console.log(`[AsyncStorageService] Removing data for key: ${key}`);
        await AsyncStorage.removeItem(key);
        console.log(`[AsyncStorageService] Data removed successfully for key: ${key}`);
      } catch (error) {
        console.error(`[AsyncStorageService] Error removing data for key ${key}:`, error);
        throw error;
      }
    }
  };
};