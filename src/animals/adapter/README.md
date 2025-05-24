# Animals Adapter

## Überblick

Der Animals Adapter implementiert die Core-System Interfaces für tier-spezifische Funktionalität und ermöglicht die nahtlose Integration von Tier-Daten in das generische Quiz-System.

## Zweck

- **Interface Implementation**: Implementiert ContentHandler/Provider für Tiere
- **Data Transformation**: Wandelt tier-spezifische Daten in generische Strukturen um
- **Type Safety**: Vollständig typisierte Tier-Referenzen
- **Validation**: Validierung und Fehlerbehandlung für Tier-Keys

## Dateien

### `AnimalContentProvider.ts`

**Implementiert ContentProvider<AnimalKey> Interface**

```typescript
export class AnimalContentProvider implements ContentProvider<AnimalKey> {
  getAllContentKeys(): AnimalKey[] {
    return Object.keys(ANIMAL_LIST) as AnimalKey[];
  }

  getContentItem(key: AnimalKey): ContentItem {
    const animalData = ANIMAL_LIST[key];
    if (!animalData) {
      throw new Error(`Animal "${key}" not found in ANIMAL_LIST`);
    }
    return animalData;
  }

  isValidContentKey(key: string): key is AnimalKey {
    return key in ANIMAL_LIST;
  }

  findSimilarContentKey(key: string): AnimalKey | null {
    const validAnimals = this.getAllContentKeys();
    return validAnimals.find(valid =>
      valid.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(valid.toLowerCase())
    ) || null;
  }
}
```

**Features**:

- **Vollständige Key-Liste**: Zugriff auf alle verfügbaren Tiere
- **Content-Item-Zugriff**: Strukturierte Tier-Daten
- **Validierung**: Type-sichere Key-Prüfung
- **Ähnlichkeits-Suche**: Hilfreich für Fehlerbehandlung und Autocomplete

### `AnimalContentHandlerAdapter.ts`

**Implementiert ContentHandler<AnimalKey> Interface**

```typescript
export class AnimalContentHandlerAdapter implements ContentHandler<AnimalKey> {
  createQuestion(
    id: number, 
    imageUrl: string, 
    contentKey: AnimalKey, 
    thumbnailUrl?: string
  ): Question<AnimalKey> {
    const animalData = ANIMAL_LIST[contentKey];
    
    if (!animalData) {
      throw new Error(`Animal "${contentKey}" not found`);
    }

    return {
      id,
      imageUrl,
      thumbnailUrl,
      answer: animalData.name,
      alternativeAnswers: animalData.alternativeNames,
      funFact: animalData.funFact,
      wikipediaName: animalData.wikipediaName,
      data: { content: contentKey }
    };
  }

  getAnswer(contentKey: AnimalKey): string {
    return ANIMAL_LIST[contentKey]?.name || '';
  }

  getAlternativeAnswers(contentKey: AnimalKey): string[] | undefined {
    return ANIMAL_LIST[contentKey]?.alternativeNames;
  }

  getMetadata(contentKey: AnimalKey): { funFact?: string; wikipediaName?: string } {
    const data = ANIMAL_LIST[contentKey];
    return {
      funFact: data?.funFact,
      wikipediaName: data?.wikipediaName
    };
  }
}
```

**Transformation**:

```bash
AnimalKey → ANIMAL_LIST[key] → Question<AnimalKey>
     ↓
   "leopard" → { name: "Leopard", ... } → { id: 1, answer: "Leopard", ... }
```

### `AnimalQuestionFactoryAdapter.ts`

**Factory-Adapter für Fragen-Erstellung**

```typescript
const adaptAnimalQuestions = (
  questions: QuestionWithAnimal[]
): ContentQuestion[] => {
  return questions.map(q => ({
    id: q.id,
    imageUrl: q.imageUrl,
    thumbnailUrl: q.thumbnailUrl,
    contentKey: q.animal
  }));
};

export const createQuestionsFromAnimals = (
  questions: QuestionWithAnimal[]
): Question[] => {
  const factory = new ContentQuestionFactory<AnimalKey>(
    animalContentHandler,
    animalContentProvider
  );

  return factory.createQuestionsFromContent(
    adaptAnimalQuestions(questions)
  );
};
```

**Adapter-Chain**:

```bash
QuestionWithAnimal → ContentQuestion → ContentQuestionFactory → Question<AnimalKey>
```

## Datenfluss

### Von Tier-Definition zu Quiz-Frage

```bash
1. ANIMAL_LIST Definition
   {
     leopard: {
       name: "Leopard",
       alternativeNames: ["Panther"],
       funFact: "...",
       wikipediaName: "Leopard"
     }
   }
   ↓
2. QuestionWithAnimal Konfiguration
   {
     id: 1,
     animal: "leopard",
     imageUrl: "./leopard.jpg",
     thumbnailUrl: "./thumb/leopard.jpg"
   }
   ↓
3. AnimalQuestionFactoryAdapter
   adaptAnimalQuestions() → ContentQuestion
   ↓
4. ContentQuestionFactory
   createQuestionsFromContent() → Question[]
   ↓
5. Quiz-System Integration
   Question<AnimalKey> verwendet in Quiz-Engine
```

## Validation & Error Handling

### Key-Validierung

```typescript
// In AnimalQuestionFactoryAdapter
const factory = new ContentQuestionFactory(handler, provider);

try {
  const questions = factory.createQuestionsFromContent(adaptedQuestions);
} catch (error) {
  // ContentQuestionFactory validiert automatisch
  // - Gibt hilfreiche Fehlermeldungen mit Vorschlägen
  // - Listet verfügbare Keys auf
  console.error("Invalid animal key:", error.message);
}
```

### Fehlermeldungen

```typescript
// Bei ungültigem Tier-Key
"Invalid content key: 'elephnt' for question 1. Did you mean 'elefant'?"

// Bei komplett unbekanntem Key  
"Invalid content key: 'dragon' for question 1. Valid keys are: leopard, elefant, ..."
```

## Type Safety

### AnimalKey Type

```typescript
// Automatisch generiert aus ANIMAL_LIST
type AnimalKey = "leopard" | "elefant" | "giraffe" | ...

// Compile-time Checking
const validKey: AnimalKey = "leopard";    // ✅ OK
const invalidKey: AnimalKey = "dragon";   // ❌ TypeScript Error
```

### Generic Constraint

```typescript
// Question ist typisiert mit AnimalKey
const question: Question<AnimalKey> = createQuestion(1, "url", "leopard");

// Zugriff auf tier-spezifische Daten
const animalKey = question.data?.content; // Type: AnimalKey
```

## Singleton Pattern

```typescript
// Singleton-Instanzen für App-weite Nutzung
export const animalContentProvider = new AnimalContentProvider();
export const animalContentHandler = new AnimalContentHandlerAdapter();

// Verwendung in anderen Modulen
import { animalContentProvider } from './AnimalContentProvider';
const allAnimals = animalContentProvider.getAllContentKeys();
```

## Testing

### Adapter Testing

```typescript
describe('AnimalContentHandlerAdapter', () => {
  const handler = new AnimalContentHandlerAdapter();

  it('creates question from valid animal key', () => {
    const question = handler.createQuestion(1, 'url', 'leopard');
    
    expect(question.answer).toBe('Leopard');
    expect(question.data?.content).toBe('leopard');
  });

  it('throws error for invalid animal key', () => {
    expect(() => {
      handler.createQuestion(1, 'url', 'invalid' as AnimalKey);
    }).toThrow('Animal "invalid" not found');
  });
});
```

### Integration Testing

```typescript
describe('AnimalQuestionFactory', () => {
  it('creates questions from animal configurations', () => {
    const animalQuestions: QuestionWithAnimal[] = [
      { id: 1, animal: 'leopard', imageUrl: 'leopard.jpg' }
    ];

    const questions = createQuestionsFromAnimals(animalQuestions);
    
    expect(questions).toHaveLength(1);
    expect(questions[0].answer).toBe('Leopard');
  });
});
```

## Performance

- **Lazy Loading**: Tier-Daten werden nur bei Bedarf geladen
- **Singleton Pattern**: Eine Adapter-Instanz für die gesamte App
- **Efficient Lookup**: O(1) Zugriff auf Tier-Daten über Object-Keys
- **Memory Efficient**: Keine Duplikation von Tier-Definitionen

## Erweiterbarkeit

### Neue Tier-Features

```typescript
// In ANIMAL_LIST erweitern
interface Animal {
  name: string;
  habitat?: string;        // Neue Property
  conservationStatus?: string;
}

// Adapter automatisch kompatibel durch Interface-Implementation
```

### Neue Content-Typen

Der Animals Adapter dient als Template für andere Content-Typen:

```typescript
// Z.B. MovieContentProvider
export class MovieContentProvider implements ContentProvider<MovieKey> {
  // Gleiche Interface-Implementation mit Movie-Daten
}
```
