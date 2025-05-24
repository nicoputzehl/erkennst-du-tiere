# Animals Types

## Überblick

Das Types-Modul definiert alle tier-spezifischen TypeScript-Typen und Interfaces für das Animals-Layer. Es stellt Type Safety und Intellisense für alle tier-bezogenen Operationen bereit.

## Zweck

- **Type Safety**: Vollständig typisierte Tier-Referenzen und -Operationen
- **Intellisense**: IDE-Unterstützung für Tier-Keys und -Properties
- **Validation**: Compile-time Validierung von Tier-Daten
- **Documentation**: Selbst-dokumentierende Code-Interfaces

## Type Definitionen

### Core Types

#### `AnimalKey`

**Automatisch generierter Union-Type für alle verfügbaren Tiere**

```typescript
import { ANIMAL_LIST } from "../data/animal_list";

export type AnimalKey = keyof typeof ANIMAL_LIST;
// Resultat: "leopard" | "elefant" | "giraffe" | "nacktmull" | ...
```

**Features**:

- **Auto-Generated**: Basiert auf ANIMAL_LIST, automatisch aktualisiert
- **Compile-time Safety**: TypeScript verhindert ungültige Tier-References
- **Intellisense**: IDE zeigt alle verfügbaren Tiere an
- **Refactoring Safe**: Änderungen in ANIMAL_LIST propagieren automatisch

#### `Animal`

**Interface für Tier-Datenstruktur**

```typescript
export interface Animal {
  name: string;                    // Hauptname (richtige Antwort)
  alternativeNames?: string[];     // Alternative akzeptierte Namen
  funFact?: string;               // Interessante Information
  wikipediaName?: string;         // Wikipedia-Suchbegriff
}
```

**Design-Prinzipien**:

- **Required Minimum**: Nur `name` ist verpflichtend
- **Optional Enhancements**: Erweiterte Daten optional
- **Extensible**: Einfach um neue Properties erweiterbar
- **Localization Ready**: Basis für mehrsprachige Erweiterung

### Quiz-Related Types

#### `QuestionWithAnimal`

**Struktur für tier-spezifische Quiz-Fragen-Definitionen**

```typescript
export interface QuestionWithAnimal {
  id: number;           // Eindeutige Frage-ID
  imageUrl: string;     // Haupt-Bild URL
  thumbnailUrl?: string; // Optional: Thumbnail für Übersicht
  animal: AnimalKey;    // Verweis auf Tier (type-safe)
}
```

**Usage**:

```typescript
// Type-safe Quiz-Definition
const namibiaQuestions: QuestionWithAnimal[] = [
  {
    id: 1,
    animal: "leopard",        // ✅ Valid AnimalKey
    imageUrl: "leopard.jpg",
    thumbnailUrl: "thumb.jpg"
  },
  {
    id: 2,
    animal: "dragon",         // ❌ TypeScript Error - nicht in AnimalKey
    imageUrl: "dragon.jpg"
  }
];
```

### Derived Types

#### `AnimalQuestion`

**Typisierte Quiz-Frage mit AnimalKey**

```typescript
export type AnimalQuestion = Question<AnimalKey>;

// Equivalent zu:
interface AnimalQuestion extends Question<AnimalKey> {
  data?: {
    content: AnimalKey;     // Type-safe Tier-Referenz
  };
}
```

**Verwendung**:

```typescript
const processAnimalQuestion = (question: AnimalQuestion) => {
  const animalKey = question.data?.content;  // Type: AnimalKey | undefined
  if (animalKey) {
    const animal = ANIMAL_LIST[animalKey];   // Type-safe Zugriff
    console.log(`Processing ${animal.name}`);
  }
};
```

## Type Guards & Utilities

### Type Validation

```typescript
export const isAnimalKey = (key: string): key is AnimalKey => {
  return key in ANIMAL_LIST;
};

export const isValidAnimalQuestion = (
  question: any
): question is QuestionWithAnimal => {
  return (
    typeof question.id === 'number' &&
    typeof question.imageUrl === 'string' &&
    isAnimalKey(question.animal)
  );
};
```

### Type Assertions

```typescript
export const assertAnimalKey = (key: string): AnimalKey => {
  if (!isAnimalKey(key)) {
    throw new Error(`Invalid animal key: ${key}`);
  }
  return key;
};

export const safeGetAnimal = (key: string): Animal | null => {
  return isAnimalKey(key) ? ANIMAL_LIST[key] : null;
};
```

## Generic Integration

### Quiz-System Integration

```typescript
// Animals-spezifische Typisierung für generische Quiz-Komponenten
export type AnimalQuiz = Quiz<AnimalKey>;
export type AnimalQuizState = QuizState<AnimalKey>;

// Usage in Components
interface AnimalQuizProps {
  quiz: AnimalQuiz;           // Vollständig typisiert
  onAnswer: (key: AnimalKey, answer: string) => void;
}
```

### Service Integration

```typescript
// Type-safe Service-Calls
const quizService = {
  createAnimalQuiz: (config: AnimalQuizConfig): AnimalQuiz => {
    // Implementation
  },
  
  getAnimalQuestion: (quizId: string, questionId: number): AnimalQuestion | null => {
    // Implementation
  },
  
  validateAnimalAnswer: (animalKey: AnimalKey, answer: string): boolean => {
    // Implementation
  }
};
```

## Advanced Types

### Conditional Types

```typescript
// Tier mit Fun Fact
export type AnimalWithFunFact = {
  [K in AnimalKey]: ANIMAL_LIST[K] extends { funFact: string } 
    ? K 
    : never;
}[AnimalKey];

// Tier mit Wikipedia-Link
export type AnimalWithWikipedia = {
  [K in AnimalKey]: ANIMAL_LIST[K] extends { wikipediaName: string }
    ? K
    : never;
}[AnimalKey];
```

### Utility Types

```typescript
// Alle Tier-Namen als Union-Type
export type AnimalName = {
  [K in AnimalKey]: ANIMAL_LIST[K]['name'];
}[AnimalKey];

// Tier-Eigenschaften-Mapping
export type AnimalProperties<T extends AnimalKey = AnimalKey> = {
  [K in T]: {
    key: K;
    name: ANIMAL_LIST[K]['name'];
    hasAlternatives: ANIMAL_LIST[K]['alternativeNames'] extends string[] ? true : false;
    hasFunFact: ANIMAL_LIST[K]['funFact'] extends string ? true : false;
  };
};
```

## Type Documentation

### JSDoc Integration

```typescript
/**
 * Represents a specific animal in the quiz system
 * @example
 * ```typescript
 * const leopard: AnimalKey = "leopard";
 * const animal = ANIMAL_LIST[leopard];
 * console.log(animal.name); // "Leopard"
 * ```
 */
export type AnimalKey = keyof typeof ANIMAL_LIST;

/**
 * Configuration for creating an animal-based quiz question
 * @interface QuestionWithAnimal
 * @property {number} id - Unique identifier for the question
 * @property {AnimalKey} animal - Reference to animal in ANIMAL_LIST
 * @property {string} imageUrl - Path to the main question image
 * @property {string} [thumbnailUrl] - Optional path to thumbnail image
 */
export interface QuestionWithAnimal {
  id: number;
  animal: AnimalKey;
  imageUrl: string;
  thumbnailUrl?: string;
}
```

## Type Testing

### Compile-time Tests

```typescript
// Type-level Tests (keine Runtime-Kosten)
type TestAnimalKey = AnimalKey extends string ? true : false; // true
type TestAnimalQuestion = AnimalQuestion extends Question<AnimalKey> ? true : false; // true

// Ensure AnimalKey includes expected animals
type TestLeopard = "leopard" extends AnimalKey ? true : false; // true
type TestDragon = "dragon" extends AnimalKey ? true : false;   // false
```

### Runtime Validation Tests

```typescript
describe('Animal Types', () => {
  it('validates animal keys correctly', () => {
    expect(isAnimalKey('leopard')).toBe(true);
    expect(isAnimalKey('dragon')).toBe(false);
  });
  
  it('creates valid animal questions', () => {
    const question: QuestionWithAnimal = {
      id: 1,
      animal: 'leopard',
      imageUrl: 'test.jpg'
    };
    
    expect(isValidAnimalQuestion(question)).toBe(true);
  });
});
```

## IDE Integration

### IntelliSense Support

```typescript
// IDE zeigt alle verfügbaren Tiere beim Tippen
const myAnimal: AnimalKey = "le"; // Autocomplete: leopard

// IDE zeigt Tier-Properties
const animal = ANIMAL_LIST["leopard"];
animal.na; // Autocomplete: name, alternativeNames (falls vorhanden)
```

### Error Prevention

```typescript
// Compile-time Fehler verhindern Laufzeit-Probleme
const createQuestion = (animal: AnimalKey) => {
  return ANIMAL_LIST[animal]; // ✅ Type-safe - animal ist garantiert valide
};

// vs. unsicher:
const createQuestionUnsafe = (animal: string) => {
  return ANIMAL_LIST[animal]; // ❌ Potentielle Runtime-Fehler
};
```

## Migration & Evolution

### Type Versioning

```typescript
// Deprecation Warnings
/** @deprecated Use AnimalKey instead */
export type LegacyAnimalType = AnimalKey;

// Migration Helpers
export const migrateToAnimalKey = (legacy: string): AnimalKey | null => {
  return isAnimalKey(legacy) ? legacy : null;
};
```

### Backward Compatibility

```typescript
// Support for legacy question format
export interface LegacyQuestionWithAnimal {
  id: number;
  animalType: string; // Old property name
  imageUrl: string;
}

export const migrateLegacyQuestion = (
  legacy: LegacyQuestionWithAnimal
): QuestionWithAnimal | null => {
  const animalKey = assertAnimalKey(legacy.animalType);
  return {
    id: legacy.id,
    animal: animalKey,
    imageUrl: legacy.imageUrl
  };
};
```

## Performance Considerations

- **Zero Runtime Cost**: TypeScript-Typen werden zur Compile-Zeit entfernt
- **Tree Shaking**: Unused Types werden automatisch eliminiert
- **IntelliSense Caching**: IDE cached Type-Informationen für Performance
- **Minimal Bundle Size**: Types fügen keine Bytes zum Bundle hinzu
