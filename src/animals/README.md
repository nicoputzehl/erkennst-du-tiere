# Animals Layer

## Überblick

Das Animals Layer implementiert die spezifische Tier-Quiz-Funktionalität der Anwendung und dient als konkretes Beispiel für Content-Module, die das Core/Quiz-System nutzen.

## Zweck

- **Content-Implementation**: Konkrete Implementierung für Tier-Inhalte
- **Adapter Pattern**: Verbindet tier-spezifische Daten mit generischen Quiz-Interfaces
- **Daten-Management**: Verwaltet alle Tier-Daten und Quiz-Konfigurationen
- **Beispiel-Architektur**: Zeigt, wie neue Content-Typen hinzugefügt werden

## Struktur

```
src/animals/
├── adapter/          # Adapter für Core-System Integration
├── data/            # Tier-Daten und Quiz-Definitionen
├── helper/          # Utility-Funktionen und Factories
├── quizzes/         # Quiz-Registrierung und -Initialisierung
└── types/           # Tier-spezifische TypeScript Definitionen
```

### Adapter (`adapter/`)

**Zweck**: Implementiert Core-Interfaces für Tier-spezifische Funktionalität

- `AnimalContentProvider.ts`: Implementiert ContentProvider<AnimalKey>
- `AnimalContentHandlerAdapter.ts`: Implementiert ContentHandler<AnimalKey>
- `AnimalQuestionFactoryAdapter.ts`: Erstellt Fragen aus Tier-Definitionen

**Adapter Pattern**:

```typescript
// Tier-spezifische Daten → Generische Interfaces
AnimalKey → ContentProvider → Quiz-System
AnimalData → ContentHandler → Question-Erstellung
QuestionWithAnimal → ContentQuestion → Quiz-Integration
```

### Data (`data/`)

**Zweck**: Alle Tier-Daten und Quiz-Konfigurationen

**Struktur**:

```
data/
├── animal_list/          # Zentrale Tier-Definitionen
│   └── index.ts
└── quizzes/             # Spezifische Quiz-Daten
    ├── namibia_animals/ # Tiere Namibias
    ├── weird_animals/   # Seltsame Tiere
    └── index.ts
```

**Tier-Definition**:

```typescript
interface Animal {
  name: string;                    // Hauptname (richtige Antwort)
  alternativeNames?: string[];     // Alternative akzeptierte Namen
  funFact?: string;               // Interessante Information
  wikipediaName?: string;         // Wikipedia-Suchbegriff
}
```

**Quiz-Konfiguration**:

```typescript
interface QuestionWithAnimal {
  id: number;           // Eindeutige Frage-ID
  imageUrl: string;     // Haupt-Bild
  thumbnailUrl?: string; // Thumbnail für Übersicht
  animal: AnimalKey;    // Verweis auf Tier-Definition
}
```

### Helper (`helper/`)

**Zweck**: Utility-Funktionen und Factory-Pattern Implementierungen

- `createAnimalQuiz.ts`: Factory für Tier-Quiz-Erstellung
- `animalValidator.ts`: Validierung von Tier-Keys

**Quiz-Factory**:

```typescript
interface AnimalQuizConfig {
  id: string;
  title: string;
  animalQuestions: QuestionWithAnimal[];
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  // ... weitere Optionen
}

createAnimalQuiz(config) → Quiz<AnimalKey>
```

### Quizzes (`quizzes/`)

**Zweck**: Quiz-Registrierung und App-Integration

- `animalQuizzes.ts`: Definiert und registriert alle Tier-Quizzes

**Registrierung**:

```typescript
const initializeAnimalQuizzes = () => [
  {
    id: 'namibia_animals',
    quiz: createAnimalQuiz(namibiaConfig),
    contentType: 'animal'
  },
  {
    id: 'weird_animals', 
    quiz: createAnimalQuiz(weirdConfig),
    contentType: 'animal'
  }
];

// Auto-Registrierung beim Module-Load
registerQuizInitializer(initializeAnimalQuizzes);
```

### Types (`types/`)

**Zweck**: Tier-spezifische TypeScript Definitionen

```typescript
type AnimalKey = keyof typeof ANIMAL_LIST;  // Typ-sichere Tier-Referenzen

interface Animal { /* ... */ }              // Tier-Datenstruktur
interface QuestionWithAnimal { /* ... */ }  // Tier-Frage-Definition
type AnimalQuestion = Question<AnimalKey>;   // Typisierte Quiz-Frage
```

## Interaktion mit anderen Ebenen

### → Core Layer

- **Interface-Implementation**: Implementiert ContentHandler/Provider
- **Factory-Usage**: Nutzt ContentQuestionFactory und ContentQuizFactory
- **Initialisierung**: Registriert sich über Core-Initialization-System

### → Quiz Layer

- **Service-Integration**: Nutzt Quiz-Services über Context-Provider
- **Type-Integration**: AnimalKey wird als Generic-Parameter verwendet
- **UI-Integration**: Tier-Quizzes verwenden Standard-Quiz-Screens

### ← App Layer

- **Auto-Loading**: Module registriert sich automatisch beim Import
- **Navigation**: Tier-Quizzes sind über Standard-Quiz-Navigation erreichbar

## Datenfluss

### Von Tier-Daten zu Quiz-Fragen

```
1. ANIMAL_LIST (Tier-Definitionen)
   ↓
2. QuestionWithAnimal (Quiz-spezifische Konfiguration)
   ↓
3. AnimalQuestionFactoryAdapter (Adapter-Transformation)
   ↓
4. ContentQuestionFactory (Core-Factory)
   ↓
5. Question<AnimalKey> (Generische Quiz-Frage)
   ↓
6. Quiz-System (Integration in Quiz-Engine)
```

### Quiz-Initialisierung

```
1. App-Start
   ↓
2. animalQuizzes.ts wird geladen
   ↓
3. registerQuizInitializer() wird aufgerufen
   ↓
4. initializeAllQuizzes() führt Initialisierer aus
   ↓
5. createAnimalQuiz() erstellt Quiz-Instanzen
   ↓
6. Quiz-Registry erhält fertige Quizzes
```

## Verfügbare Quizzes

### Namibia-Tiere (`namibia_animals`)

- **Schwierigkeit**: Einfach
- **Fragen**: 15 Tiere aus Namibia
- **Status**: Standardmäßig freigeschaltet
- **Besonderheit**: Echte Tier-Fotos aus Namibia

### Seltsame Tiere (`weird_animals`)

- **Schwierigkeit**: Schwer
- **Fragen**: 10 ungewöhnliche Tiere
- **Status**: Gesperrt (freigeschaltet nach Namibia-Quiz)
- **Besonderheit**: Seltene und exotische Tiere

## Erweiterung

### Neues Tier hinzufügen

1. Tier in `ANIMAL_LIST` definieren
2. Bilder in entsprechenden Quiz-Ordner
3. `QuestionWithAnimal` zur Quiz-Konfiguration hinzufügen

### Neues Quiz hinzufügen

1. Neuen Ordner in `data/quizzes/` erstellen
2. Quiz-Konfiguration definieren
3. In `animalQuizzes.ts` registrieren

### Neuer Content-Typ (z.B. Filme)

Das Animals Layer dient als Vorlage:

1. Neue Ebene erstellen (z.B. `src/movies/`)
2. Gleiche Struktur verwenden (adapter/, data/, helper/, etc.)
3. Content-spezifische Interfaces implementieren
4. Eigene Quiz-Initialisierer registrieren

## Design-Prinzipien

1. **Adapter Pattern**: Saubere Trennung zwischen Tier-Daten und generischen Interfaces
2. **Factory Pattern**: Quiz-Erstellung über konfigurierbare Factories
3. **Auto-Registration**: Module registrieren sich selbst bei App-Start
4. **Type Safety**: Vollständig typisierte Tier-Referenzen über AnimalKey
5. **Data-Driven**: Quiz-Konfiguration über deklarative Datenstrukturen

## Testing

- **Adapter**: Mock-Daten für Interface-Tests
- **Validation**: Tier-Key-Validierung testen
- **Factory**: Quiz-Erstellung mit verschiedenen Konfigurationen
- **Integration**: End-to-End Tests für komplette Tier-Quizzes
