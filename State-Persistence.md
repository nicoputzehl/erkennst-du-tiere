# Persistenzstrategie - Implementierung

## Übersicht

In diesem Schritt haben wir eine Persistenzstrategie für die Quiz-App "Erkennst du das Tier?" umgesetzt, wie in Punkt 3 der TODO-Liste gefordert. Die Implementierung ermöglicht es, Quiz-Fortschritte zwischen App-Starts zu speichern und zu laden.

## Implementierte Komponenten

### 1. Storage-Interface und AsyncStorage-Service

- `StorageService` - Generisches Interface für Datenpersistenz
- `AsyncStorageService` - Implementierung mit React Native's AsyncStorage
- Zentraler Exportpunkt für einfachen Zugriff

```typescript
// StorageService.ts
export interface StorageService {
  save<T>(key: string, data: T): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
}

// AsyncStorageService.ts
export const createAsyncStorageService = (): StorageService => {
  return {
    save: async <T>(key: string, data: T): Promise<void> => {
      // AsyncStorage-Implementierung...
    },
    load: async <T>(key: string): Promise<T | null> => {
      // AsyncStorage-Implementierung...
    },
    remove: async (key: string): Promise<void> => {
      // AsyncStorage-Implementierung...
    }
  };
};
```

### 2. Persistierbare Quiz-Datenstrukturen

- `PersistentQuizState` - Schlanke Version des Quiz-Zustands für Speicherung
- Konvertierungsfunktionen zwischen QuizState und PersistentQuizState

```typescript
export interface PersistentQuizState<T extends ContentKey = ContentKey> {
  id: string;
  completedQuestions: number;
  questionStatuses: {
    id: number;
    status: string;
  }[];
}
```

### 3. Quiz-Persistenz-Service

- `QuizPersistenceService` - Spezifischer Service für Quiz-Datenspeicherung
- Speichern, Laden und Löschen von Quiz-Zuständen
- Versions-Management für zukünftige Migrationen

```typescript
export interface QuizPersistenceService {
  saveQuizState: <T extends ContentKey = ContentKey>(quizState: QuizState<T>) => Promise<void>;
  loadAllQuizStates: () => Promise<Record<string, PersistentQuizState> | null>;
  clearAllQuizStates: () => Promise<void>;
}
```

### 4. Integration in bestehende Services

- Anpassung des `QuizStateManagerService` für asynchrone Persistenz
- Laden gespeicherter Zustände beim Start
- Automatisches Speichern bei Zustandsänderungen

### 5. Asynchrone Provider und Hooks

- Anpassung aller Provider für asynchrone Operationen
- Implementierung von Loading-States und Error-Handling
- Verbesserung der Kontext-Hooks für asynchrone API

### 6. Settings-Seite

- Einfache Settings-Seite zum Zurücksetzen von Quiz-Zuständen
- Möglichkeit, einzelne oder alle Quizzes zurückzusetzen
- Integration mit der Persistenzschicht

## Design-Entscheidungen

1. **Trennung von Zuständen**:
   - Vollständige Quiz-Zustände im Arbeitsspeicher
   - Reduzierte persistente Zustände im Speicher
   - Konvertierung zwischen beiden Formaten bei Bedarf

2. **Asynchrone API**:
   - Alle Persistenz-Operationen sind asynchron (Promise-basiert)
   - Loading-States zur Anzeige von Ladezuständen
   - Fehlerbehandlung an kritischen Stellen

3. **Modularer Aufbau**:
   - Generisches Storage-Interface für verschiedene Implementierungen
   - Spezifischer QuizPersistenceService für Quiz-bezogene Logik
   - Factory-Pattern für saubere Dependency Injection

4. **Versioning**:
   - Speichern der Versionsinfo für zukünftige Datenmigrationen
   - Zeitstempel für Diagnose und potenzielle Synchronisierung

## Herausforderungen und Lösungen

### 1. Asynchrone Flows

**Problem**: Die App verwendete zuvor synchrone Operationen für Quiz-Zustände.

**Lösung**: Umstellung auf asynchrone API mit Promise-basierten Methoden und korrekter Error-Handling-Strategie.

### 2. Fortschrittsanzeige

**Problem**: Fortschrittsanzeigen zeigten keine Daten auf der Startseite.

**Lösung**: Verbesserte Initialisierungslogik und robustere Fortschrittsberechnung mit Debug-Ausgaben.

### 3. Component Lifecycle

**Problem**: React-Hook-Abhängigkeiten wurden nicht korrekt verwaltet.

**Lösung**: Verwendung von `useCallback` für Funktionen, die an `useMemo` übergeben werden.

## Code-Beispiele

### QuizStateManagerService mit Persistenz

```typescript
export const createQuizStateManagerService = (
  quizRegistryService: QuizRegistryService,
  initialStates: Map<string, QuizState<ContentKey>> = new Map()
): QuizStateManagerService => {
  let quizStates = initialStates;
  const persistenceService = getQuizPersistenceService();
  
  const loadSavedStates = async (): Promise<void> => {
    try {
      const savedStates = await persistenceService.loadAllQuizStates();
      if (savedStates) {
        // Anwenden gespeicherter Zustände...
      }
    } catch (error) {
      console.error('[QuizStateManagerService] Error loading saved states:', error);
    }
  };
  
  loadSavedStates();

  return {
    initializeQuizState: async <T extends ContentKey = ContentKey>(quizId: string): Promise<QuizState<T> | null> => {
      // Initialisierungslogik mit Persistenz...
    },
    
    updateQuizState: async <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>): Promise<void> => {
      quizStates.set(quizId, newState as QuizState<ContentKey>);
      
      // Zustand persistieren
      await persistenceService.saveQuizState(newState);
    },
    
    // Weitere Methoden...
  };
};
```

### ProgressBar mit verbesserter Robustheit

```typescript
export const ProgressBar = ({
  progress,
  total,
  completed,
}: ProgressBarProps) => {
  // Stelle sicher, dass progress ein gültiger Wert ist
  const safeProgress = isNaN(progress) ? 0 : Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabelContainer}>
        <Text style={styles.progressLabel}>
          {completed} / {total} Fragen
        </Text>
        <Text style={styles.progressPercentage}>{Math.round(safeProgress)}%</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${safeProgress}%` }
          ]} 
        />
      </View>
    </View>
  );
};
```

## Nächste Schritte

1. **Optimierung der QuizStartScreen**:
   - Verbesserte Initialisierungslogik für bessere Performance
   - Caching-Strategien für schnelleres Laden

2. **Settings-Erweiterungen**:
   - Weitere Einstellungsoptionen wie Sprache, Designs, etc.
   - Import/Export von Spielerdaten

3. **Robustere Fehlerbehandlung**:
   - Zentrale Fehlerbehandlung
   - Automatische Wiederherstellung nach Fehlern

4. **Offline-Modus**:
   - Vollständige Offline-Unterstützung
   - Synchronisierungsstrategie für mehrere Geräte
