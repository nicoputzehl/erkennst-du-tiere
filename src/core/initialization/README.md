# Initialization System

## Überblick

Das Initialization System ermöglicht modulare App-Initialisierung, bei der sich verschiedene Module (Animals, Movies, etc.) selbst registrieren und zur Laufzeit initialisiert werden.

## Zweck

- **Modulare Initialisierung**: Module registrieren sich selbstständig
- **Dependency Management**: Kontrolle über Initialisierungs-Reihenfolge
- **Loose Coupling**: Module kennen sich nicht untereinander
- **Plugin Architecture**: Einfaches Hinzufügen neuer Module

## Dateien

### `quizInitialization.ts`

**Zentrale Initialisierungs-Registry**

```typescript
type QuizInitializer<T extends ContentKey> = () => {
  id: string;
  quiz: Quiz<T>;
  contentType: string;
}[];

// Registry für alle Initialisierer
const quizInitializers: QuizInitializer[] = [];

export function registerQuizInitializer(initializer: QuizInitializer): void
export async function initializeAllQuizzes(): Promise<void>
```

## Funktionsweise

### 1. Modul-Registrierung (zur Compile-Zeit)

```typescript
// In src/animals/quizzes/animalQuizzes.ts
const initializeAnimalQuizzes = () => [
  {
    id: 'namibia_animals',
    quiz: createAnimalQuiz(config),
    contentType: 'animal'
  }
];

// Auto-Registrierung beim Module-Load
registerQuizInitializer(initializeAnimalQuizzes);
```

### 2. App-Initialisierung (zur Laufzeit)

```typescript
// In QuizProvider
useEffect(() => {
  const initialize = async () => {
    console.log("Starting quiz initialization...");
    await initializeAllQuizzes();
    setInitialized(true);
  };
  initialize();
}, []);
```

### 3. Initialisierer-Ausführung

```typescript
export async function initializeAllQuizzes(): Promise<void> {
  for (const initializer of quizInitializers) {
    const quizzes = initializer();
    
    for (const { id, quiz, contentType } of quizzes) {
      registerQuiz(id, quiz, contentType);
    }
  }
}
```

## Ablauf

```bash
1. App-Start
   ↓
2. Module werden geladen (import)
   ↓  
3. registerQuizInitializer() wird aufgerufen
   ↓
4. Initialisierer in Registry gespeichert
   ↓
5. QuizProvider startet
   ↓
6. initializeAllQuizzes() ausgeführt
   ↓
7. Alle Initialisierer durchlaufen
   ↓
8. Quizzes in Registry registriert
   ↓
9. App bereit für Nutzung
```

## Verwendung

### Neues Modul hinzufügen

```typescript
// 1. Initialisierer-Funktion erstellen
const initializeMovieQuizzes = () => [
  {
    id: 'classic_movies',
    quiz: createMovieQuiz(config),
    contentType: 'movie'
  }
];

// 2. Registrierung
registerQuizInitializer(initializeMovieQuizzes);

// 3. Module in App importieren
import '@/src/movies/quizzes/movieQuizzes';
```

### Import-Strategie

```typescript
// In QuizProvider - zentrale Imports
import '@/src/animals/quizzes/animalQuizzes';
import '@/src/movies/quizzes/movieQuizzes';  // Neue Module hier hinzufügen
```

## Error Handling

```typescript
export async function initializeAllQuizzes(): Promise<void> {
  console.log(`Found ${quizInitializers.length} initializers`);
  
  for (let index = 0; index < quizInitializers.length; index++) {
    try {
      const initializer = quizInitializers[index];
      const quizzes = initializer();
      
      for (const { id, quiz, contentType } of quizzes) {
        registerQuiz(id, quiz, contentType);
      }
    } catch (error) {
      console.error(`Error in initializer ${index}:`, error);
      // Continue with other initializers
    }
  }
}
```

## Design-Prinzipien

- **Self-Registration**: Module registrieren sich selbst
- **Lazy Execution**: Initialisierer werden erst bei App-Start ausgeführt
- **Error Isolation**: Fehler in einem Modul stoppen andere nicht
- **Plugin Architecture**: Neue Module ohne Core-Änderungen hinzufügbar
- **Separation of Concerns**: Registrierung und Ausführung getrennt

## Debugging

Umfangreiches Logging für Debugging:

```typescript
console.log("Starting quiz initialization...");
console.log(`Found ${quizInitializers.length} initializers`);
console.log(`Running initializer ${index + 1}...`);
console.log(`Registering quiz '${id}' of type '${contentType}'`);
```

## Erweiterungen

### Conditional Loading

```typescript
const initializeMovieQuizzes = () => {
  if (!FEATURE_FLAGS.movies) return [];
  
  return [/* quiz configs */];
};
```

### Priority-based Initialization

```typescript
interface PriorityInitializer {
  priority: number;
  initializer: QuizInitializer;
}

// Sort by priority before execution
```
