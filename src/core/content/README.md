# Content System

## Überblick

Das Content System definiert die generischen Interfaces und Factories für die Verarbeitung verschiedener Inhaltstypen (Tiere, Filme, etc.) zu Quiz-Fragen.

## Zweck

- **Abstraktion**: Generische Interfaces für beliebige Content-Typen
- **Factory Pattern**: Standardisierte Erstellung von Fragen und Quizzes
- **Type Safety**: Vollständig typisierte Content-Verarbeitung

## Dateien

### `ContentHandler.ts`

**Interface für Content-zu-Frage Transformation**

```typescript
interface ContentHandler<T extends ContentKey> {
  createQuestion(id, imageUrl, contentKey, thumbnailUrl?) → Question<T>
  getAnswer(contentKey) → string
  getAlternativeAnswers?(contentKey) → string[]
  getMetadata?(contentKey) → { funFact?, wikipediaName? }
}

interface ContentProvider<T extends ContentKey> {
  getAllContentKeys() → T[]
  getContentItem(key) → ContentItem
  isValidContentKey(key) → boolean
  findSimilarContentKey(key) → T | null
}
```

**Verwendung**: Content-Layer (z.B. Animals) implementieren diese Interfaces.

### `ContentQuestionFactory.ts`

**Factory für Fragen-Erstellung**

```typescript
class ContentQuestionFactory<T> {
  constructor(contentHandler, contentProvider)
  createQuestionsFromContent(questions) → Question[]
}
```

**Features**:

- Validierung von Content-Keys
- Automatische Fehlerbehandlung mit Vorschlägen
- Type-sichere Fragen-Erstellung

### `ContentQuizFactory.ts`

**Factory für Quiz-Erstellung**

```typescript
class ContentQuizFactory {
  static createQuiz<T>(config) → Quiz<T>
}
```

**Konfiguration**:

- Quiz-Metadaten (ID, Titel, Reihenfolge)
- Freischaltbedingungen
- Quiz-Modi (Sequential, All Unlocked)

### `types.ts`

**Basis-Typen für Content-System**

```typescript
type ContentKey = string
interface ContentItem {
  name: string
  alternativeNames?: string[]
  funFact?: string
  wikipediaName?: string
}
interface ContentQuestion {
  id: number
  imageUrl: string
  thumbnailUrl?: string
  contentKey: ContentKey
}
```

## Verwendung

### 1. Content-Handler implementieren

```typescript
class AnimalContentHandler implements ContentHandler<AnimalKey> {
  createQuestion(id, imageUrl, animalKey) {
    const animal = ANIMAL_LIST[animalKey];
    return { id, imageUrl, answer: animal.name, ... };
  }
}
```

### 2. Factory verwenden

```typescript
const factory = new ContentQuestionFactory(handler, provider);
const questions = factory.createQuestionsFromContent(questionDefs);
const quiz = ContentQuizFactory.createQuiz({ questions, ... });
```

## Design-Prinzipien

- **Generic Programming**: Funktioniert mit beliebigen Content-Typen
- **Interface Segregation**: Kleine, fokussierte Interfaces
- **Factory Pattern**: Konsistente Objekt-Erstellung
- **Fail-Fast**: Frühe Validierung mit hilfreichen Fehlermeldungen
