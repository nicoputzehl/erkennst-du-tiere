# Storage System

## Überblick

Das Storage System stellt eine plattformunabhängige Abstraktion für Datenpersistierung bereit und ermöglicht den Austausch der Storage-Implementierung ohne Code-Änderungen.

## Zweck

- **Abstraktion**: Plattformunabhängige Storage-API
- **Flexibilität**: Austauschbare Storage-Implementierungen
- **Consistency**: Einheitliche asynchrone API
- **Error Handling**: Strukturierte Fehlerbehandlung

## Dateien

### `StorageService.ts`

**Generisches Storage Interface**

```typescript
interface StorageService {
  save<T>(key: string, data: T): Promise<void>
  load<T>(key: string): Promise<T | null>
  remove(key: string): Promise<void>
}
```

**Features**:

- Vollständig asynchrone API
- Generische Typisierung für Type Safety
- Einheitliche Promise-basierte Interfaces

### `AsyncStorageService.ts`

**React Native AsyncStorage Implementierung**

```typescript
const createAsyncStorageService = (): StorageService => {
  return {
    save: async (key, data) => {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    },
    load: async (key) => {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    },
    remove: async (key) => {
      await AsyncStorage.removeItem(key);
    }
  };
};
```

**Features**:

- Automatische JSON-Serialisierung
- Null-Handling für nicht vorhandene Keys
- Comprehensive Error Logging
- Factory Pattern für Service-Erstellung

### `index.ts`

**Zentraler Export und Service-Factory**

```typescript
export const getStorageService = (): StorageService => {
  if (!storageService) {
    storageService = createAsyncStorageService();
  }
  return storageService;
};

export const saveData = <T>(key: string, data: T): Promise<void>
export const loadData = <T>(key: string): Promise<T | null>
export const removeData = (key: string): Promise<void>
```

**Pattern**: Singleton-Pattern für Service-Instanz mit Convenience-Funktionen.

## Verwendung

### 1. Direkter Service-Zugriff

```typescript
const storage = getStorageService();
await storage.save('quiz_state', quizData);
const data = await storage.load<QuizState>('quiz_state');
```

### 2. Convenience-Funktionen

```typescript
await saveData('user_settings', settings);
const settings = await loadData<UserSettings>('user_settings');
await removeData('temp_data');
```

### 3. Service Injection

```typescript
const createMyService = (storage: StorageService) => {
  return {
    saveConfig: (config) => storage.save('config', config)
  };
};
```

## Error Handling

Alle Storage-Operationen können Fehler werfen:

```typescript
try {
  await saveData('key', data);
} catch (error) {
  console.error('Storage error:', error);
  // Fallback-Strategie
}
```

## Erweiterbarkeit

### Neue Storage-Implementierungen

```typescript
// Z.B. Web localStorage
const createWebStorageService = (): StorageService => {
  return {
    save: async (key, data) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    // ...
  };
};
```

### Environment-basierte Auswahl

```typescript
export const getStorageService = (): StorageService => {
  if (Platform.OS === 'web') {
    return createWebStorageService();
  }
  return createAsyncStorageService();
};
```

## Design-Prinzipien

- **Dependency Inversion**: Abhängigkeit von Abstraktion, nicht Implementierung
- **Single Responsibility**: Nur Storage-Verantwortlichkeiten
- **Factory Pattern**: Konsistente Service-Erstellung
- **Platform Agnostic**: Funktioniert auf allen unterstützten Plattformen
