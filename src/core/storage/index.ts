import { StorageService } from './StorageService';
import { createAsyncStorageService } from './AsyncStorageService';

let storageService: StorageService;

export const getStorageService = (): StorageService => {
  if (!storageService) {
    console.log('[Storage] Initializing AsyncStorageService');
    storageService = createAsyncStorageService();
  }
  return storageService;
};

export const saveData = <T>(key: string, data: T): Promise<void> => {
  return getStorageService().save(key, data);
};

export const loadData = <T>(key: string): Promise<T | null> => {
  return getStorageService().load<T>(key);
};

export const removeData = (key: string): Promise<void> => {
  return getStorageService().remove(key);
};