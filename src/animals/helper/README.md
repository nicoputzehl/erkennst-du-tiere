# Animals Helper

## Überblick

Das Helper-Modul stellt Utility-Funktionen und Factory-Pattern Implementierungen für das Animals-Layer bereit. Es fungiert als Brücke zwischen den rohen Tier-Daten und dem Quiz-System.

## Zweck

- **Factory Functions**: Standardisierte Quiz-Erstellung für Tiere
- **Validation**: Überprüfung von Tier-Keys und Daten-Konsistenz
- **Utility Functions**: Hilfsfunktionen für Tier-spezifische Operationen
- **Abstraction**: Vereinfachte APIs für Quiz-Erstellung

## Dateien

### `createAnimalQuiz.ts`

**Zentrale Factory für Tier-Quiz-Erstellung**

#### Interface Definitionen

```typescript
export interface AnimalQuizConfig {
  id: string;                           // Eindeutige Quiz-ID
  title: string;                        // Anzeige-Name des Quiz
  animalQuestions: QuestionWithAnimal[]; // Tier-Fragen-Definitionen
  initiallyLocked?: boolean;            // Startzustand (gesperrt/frei)
  unlockCondition?: UnlockCondition;    // Freischaltbedingungen
  order?: number;                       // Sortierreihenfolge
  quizMode?: QuizMode;                  // Sequential/All Unlocked
  initialUnlockedQuestions?: number;    // Anzahl initial freigeschalteter Fragen
}
```

#### Factory Implementation

```typescript
const createAnimalQuiz = (config: AnimalQuizConfig): Quiz<AnimalKey> => {
  // 1. Adapter-Transformation: AnimalQuizConfig → ContentQuizConfig
  const contentConfig = adaptAnimalQuizConfig(config);
  
  // 2. Core-Factory verwenden
  return ContentQuizFactory.createQuiz<AnimalKey>(contentConfig);
};

const adaptAnimalQuizConfig = (config: AnimalQuizConfig): CompleteContentQuizConfig<AnimalKey> => {
  // Tier-spezifische Fragen zu generischen Fragen transformieren
  const questions = createQuestionsFromAnimals(config.animalQuestions);
  
  return {
    id: config.id,
    title: config.title,
    questions,
    initiallyLocked: config.initiallyLocked,
    unlockCondition: config.unlockCondition,
    order: config.order,
    quizMode: config.quizMode,
    initialUnlockedQuestions: config.initialUnlockedQuestions,
    questionType: 'text'
  };
};
```

#### Verwendung

```typescript
// Einfache Quiz-Erstellung
const namibiaQuiz = createAnimalQuiz({
  id: 'namibia_animals',
  title: 'Tiere Namibias', 
  animalQuestions: namibiaAnimals,
  initiallyLocked: false,
  order: 1
});

// Erweiterte Konfiguration mit Freischaltung
const weirdQuiz = createAnimalQuiz({
  id: 'weird_animals',
  title: 'Weird Animals',
  animalQuestions: weirdAnimals,
  initiallyLocked: true,
  unlockCondition: {
    type: 'specificQuiz',
    requiredQuizId: 'namibia_animals',
    description: 'Schließe das Quiz "Tiere Namibias" ab'
  },
  order: 3
});
```

### `animalValidator.ts`

**Validierung und Hilfsfunktionen für Tier-Keys**

#### Core Functions

```typescript
export const validateAnimalKey = (animal: string): animal is AnimalKey => {
  return animalContentProvider.isValidContentKey(animal);
};

export const getValidAnimals = (): string[] => {
  return animalContentProvider.getAllContentKeys();
};

export const findClosestAnimal = (animal: string): string | null => {
  return animalContentProvider.findSimilarContentKey(animal);
};
```

#### Verwendung in Validation

```typescript
// In Quiz-Factory oder anderen Modulen
const validateQuizQuestions = (questions: QuestionWithAnimal[]) => {
  questions.forEach(q => {
    if (!validateAnimalKey(q.animal)) {
      const closest = findClosestAnimal(q.animal);
      const errorMessage = `Invalid animal key: "${q.animal}" for question ${q.id}`;
      
      if (closest) {
        console.error(`${errorMessage}. Did you mean "${closest}"?`);
      } else {
        console.error(`${errorMessage}. Valid animals: ${getValidAnimals().join(', ')}`);
      }
      
      throw new Error(errorMessage);
    }
  });
};
```

## Factory-Pattern Implementierung

### Transformation Pipeline

```bash
AnimalQuizConfig (Tier-spezifisch)
    ↓ adaptAnimalQuizConfig()
CompleteContentQuizConfig (Generisch)
    ↓ ContentQuizFactory.createQuiz()
Quiz<AnimalKey> (Quiz-System-kompatibel)
```

### Configuration Mapping

```typescript
// Tier-spezifische Konfiguration
interface AnimalQuizConfig {
  animalQuestions: QuestionWithAnimal[];  // Tier-Fragen
  // ... andere Properties
}

// ↓ Transformation ↓

// Generische Konfiguration  
interface CompleteContentQuizConfig<T> {
  questions: Question<T>[];               // Generische Fragen
  questionType: 'text';                   // Immer Text für Tiere
  // ... andere Properties (unverändert)
}
```

## Validation & Error Handling

### Comprehensive Validation

```typescript
const validateAnimalQuiz = (config: AnimalQuizConfig): void => {
  // 1. Basis-Validierung
  if (!config.id || !config.title) {
    throw new Error('Quiz ID and title are required');
  }
  
  // 2. Fragen-Validierung
  if (!config.animalQuestions?.length) {
    throw new Error('At least one question is required');
  }
  
  // 3. Tier-Key-Validierung
  config.animalQuestions.forEach(q => {
    if (!validateAnimalKey(q.animal)) {
      const similar = findClosestAnimal(q.animal);
      throw new Error(
        `Invalid animal "${q.animal}" in question ${q.id}` +
        (similar ? `. Did you mean "${similar}"?` : '')
      );
    }
  });
  
  // 4. Asset-Validierung (optional)
  config.animalQuestions.forEach(q => {
    if (!q.imageUrl) {
      throw new Error(`Missing imageUrl for question ${q.id}`);
    }
  });
};
```

### Error Recovery

```typescript
const createAnimalQuizSafe = (config: AnimalQuizConfig): Quiz<AnimalKey> | null => {
  try {
    validateAnimalQuiz(config);
    return createAnimalQuiz(config);
  } catch (error) {
    console.error(`Failed to create animal quiz "${config.id}":`, error);
    
    // Optional: Fallback-Strategien
    // - Filter invalid questions
    // - Use default values
    // - Create minimal quiz
    
    return null;
  }
};
```

## Utility Functions

### Quiz Metadata Helpers

```typescript
export const getAnimalQuizStats = (questions: QuestionWithAnimal[]) => {
  return {
    totalQuestions: questions.length,
    uniqueAnimals: new Set(questions.map(q => q.animal)).size,
    withThumbnails: questions.filter(q => q.thumbnailUrl).length,
    animalTypes: questions.map(q => q.animal)
  };
};

export const validateQuizAssets = (questions: QuestionWithAnimal[]) => {
  const missingAssets: string[] = [];
  
  questions.forEach(q => {
    try {
      require.resolve(q.imageUrl);
    } catch {
      missingAssets.push(`Question ${q.id}: missing main image`);
    }
    
    if (q.thumbnailUrl) {
      try {
        require.resolve(q.thumbnailUrl);
      } catch {
        missingAssets.push(`Question ${q.id}: missing thumbnail`);
      }
    }
  });
  
  return missingAssets;
};
```

### Animal Data Helpers

```typescript
export const getAnimalInfo = (animalKey: AnimalKey) => {
  const animal = ANIMAL_LIST[animalKey];
  return {
    ...animal,
    key: animalKey,
    hasAlternatives: !!animal?.alternativeNames?.length,
    hasFunFact: !!animal?.funFact,
    hasWikipedia: !!animal?.wikipediaName
  };
};

export const searchAnimals = (query: string): AnimalKey[] => {
  const normalizedQuery = query.toLowerCase();
  
  return getValidAnimals().filter(key => {
    const animal = ANIMAL_LIST[key];
    return (
      key.includes(normalizedQuery) ||
      animal.name.toLowerCase().includes(normalizedQuery) ||
      animal.alternativeNames?.some(alt => 
        alt.toLowerCase().includes(normalizedQuery)
      )
    );
  }) as AnimalKey[];
};
```

## Testing Support

### Mock Data Generators

```typescript
export const createMockAnimalQuestion = (
  overrides: Partial<QuestionWithAnimal> = {}
): QuestionWithAnimal => {
  return {
    id: 1,
    animal: 'leopard',
    imageUrl: 'mock://leopard.jpg',
    thumbnailUrl: 'mock://thumb/leopard.jpg',
    ...overrides
  };
};

export const createMockAnimalQuiz = (
  overrides: Partial<AnimalQuizConfig> = {}
): AnimalQuizConfig => {
  return {
    id: 'test_quiz',
    title: 'Test Quiz',
    animalQuestions: [createMockAnimalQuestion()],
    initiallyLocked: false,
    ...overrides
  };
};
```

### Test Utilities

```typescript
export const assertValidAnimalQuiz = (quiz: Quiz<AnimalKey>) => {
  expect(quiz.id).toBeDefined();
  expect(quiz.title).toBeDefined();
  expect(quiz.questions).toHaveLength(quiz.questions.length);
  
  quiz.questions.forEach(question => {
    expect(question.data?.content).toBeDefined();
    expect(validateAnimalKey(question.data!.content)).toBe(true);
  });
};
```

## Performance Optimierung

### Lazy Validation

```typescript
// Validierung nur bei Bedarf
const validateOnDemand = (config: AnimalQuizConfig) => {
  let validated = false;
  
  return {
    ...config,
    get questions() {
      if (!validated) {
        validateAnimalQuiz(config);
        validated = true;
      }
      return createQuestionsFromAnimals(config.animalQuestions);
    }
  };
};
```

### Memoization

```typescript
const memoizedCreateQuiz = memoize(createAnimalQuiz, (config) => 
  JSON.stringify(config)
);
```

## Design-Prinzipien

1. **Single Responsibility**: Jede Funktion hat einen klar definierten Zweck
2. **Fail-Fast**: Validierung so früh wie möglich
3. **Helpful Errors**: Konstruktive Fehlermeldungen mit Lösungsvorschlägen
4. **Type Safety**: Vollständige TypeScript-Abdeckung
5. **Testability**: Einfach zu testende, pure Functions wo möglich
