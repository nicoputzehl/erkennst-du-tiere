# Quiz Layer

## Überblick

Das Quiz Layer implementiert die zentrale Quiz-Funktionalität der Anwendung und stellt alle Services, UI-Komponenten und Geschäftslogik für das Quiz-System bereit.

## Zweck

- **Quiz-Engine**: Kernlogik für Quiz-Durchführung und Zustandsverwaltung
- **Business Logic**: Antwortverarbeitung, Fortschrittsverfolgung, Freischaltungen
- **User Interface**: Alle Quiz-bezogenen Screens und Komponenten
- **Service Layer**: Kapselt Geschäftslogik in testbare, wiederverwendbare Services

## Struktur

```bash
src/quiz/
├── components/       # Wiederverwendbare UI-Komponenten
├── contexts/         # React Context Provider für Services
├── domain/          # Pure Geschäftslogik (keine Dependencies)
├── hooks/           # Custom React Hooks
├── persistence/     # Quiz-spezifische Datenpersistierung
├── screens/         # Quiz-Screens (Start, Overview, Question)
├── services/        # Business Logic Services
└── types/           # Quiz-spezifische TypeScript Definitionen
```

### Domain Layer (`domain/`)

**Zweck**: Pure Geschäftslogik ohne externe Abhängigkeiten

- `quizLogic.ts`: Kern-Quiz-Funktionen (Zustandserstellung, Antwortverarbeitung)
- `unlockLogic.ts`: Freischaltungslogik für neue Quizzes

**Key Functions**:

```typescript
createQuizState()       // Erstellt initialen Quiz-Zustand
calculateAnswerResult() // Verarbeitet Antworten und berechnet neuen Zustand
getNextActiveQuestionId() // Findet nächste verfügbare Frage
checkUnlockCondition()  // Prüft Freischaltbedingungen
```

### Services (`services/`)

**Zweck**: Geschäftslogik-Services mit Factory Pattern

**Services**:

- `quizRegistry`: Verwaltung aller verfügbaren Quizzes
- `quizStateManager`: Zustandsverwaltung für aktive Quizzes + Persistierung
- `answerProcessor`: Verarbeitung von Benutzerantworten
- `progressTracker`: Fortschrittsverfolgung und -berechnung
- `unlockManager`: Freischaltungslogik und Event-System

**Factory Pattern**:

```typescript
// Factories erstellen Services mit expliziten Dependencies
const service = createQuizStateManagerService(
  quizRegistryService,
  initialStates
);
```

### Contexts (`contexts/`)

**Zweck**: React Context Provider für Service-Integration

**Provider-Hierarchie**:

```bash
QuizProvider
├── QuizRegistryProvider      # Quiz-Verwaltung
├── QuizStateProvider         # Zustandsverwaltung
├── ProgressTrackerProvider   # Fortschritt
├── AnswerProcessorProvider   # Antwortverarbeitung
├── UnlockManagerProvider     # Freischaltungen
└── ToastProvider            # Benachrichtigungen
```

### Screens (`screens/`)

**Zweck**: Quiz-spezifische UI-Screens

- `QuizStart/`: Startbildschirm mit Quiz-Auswahl
- `QuizOverview/`: Übersicht über alle Fragen eines Quiz
- `Question/`: Einzelne Frage-Ansicht mit Texteingabe

### Persistence (`persistence/`)

**Zweck**: Quiz-spezifische Datenpersistierung

- `QuizPersistenceService.ts`: Service für Quiz-Zustand-Speicherung
- `QuizStorageTypes.ts`: Typen für persistente Datenstrukturen

**Features**:

- Reduzierte persistente Zustände (nur notwendige Daten)
- Versionierung für zukünftige Migrationen
- Automatische Speicherung bei Zustandsänderungen

### Types (`types/`)

**Zweck**: Quiz-spezifische TypeScript Definitionen

```typescript
QuestionType      // TEXT
QuestionStatus    // INACTIVE, ACTIVE, SOLVED
QuizMode         // SEQUENTIAL, ALL_UNLOCKED
Question<T>      // Basis-Frage mit Content-Typ
QuizQuestion<T>  // Frage mit Status
Quiz<T>          // Komplettes Quiz
QuizState<T>     // Laufzeit-Zustand eines Quiz
UnlockCondition  // Freischaltbedingungen
```

## Interaktion mit anderen Ebenen

### ← Core Layer

- **Content-System**: Nutzt ContentHandler/Provider Interfaces
- **Storage**: QuizPersistenceService nutzt StorageService
- **Initialisierung**: Registriert Quiz-Module über Core-System

### ← Animals Layer (und andere Content-Layer)

- **Content-Integration**: Animals implementiert Core-Interfaces für Quiz-System
- **Service-Nutzung**: Animals nutzt Quiz-Services über Context-Provider
- **UI-Integration**: Animals-Quizzes verwenden Quiz-Screens

### → App Layer

- **Provider-Integration**: QuizProvider wird in App-Root eingebunden
- **Navigation**: Quiz-Screens werden über Expo Router angesteuert
- **Global State**: Quiz-Zustand ist app-weit verfügbar

## Datenfluss

### Quiz-Start bis Antwort

1. **Quiz-Auswahl** → QuizRegistry findet Quiz
2. **Initialisierung** → QuizStateManager erstellt/lädt Zustand
3. **UI-Rendering** → Screens zeigen aktuellen Zustand
4. **Antwort-Input** → AnswerProcessor verarbeitet Eingabe
5. **Zustand-Update** → Neuer Zustand wird persistiert
6. **Freischaltung** → UnlockManager prüft neue Freischaltungen

### Service-Dependencies

```bash
AnswerProcessor → QuizStateManager → QuizRegistry
                → UnlockManager   → QuizRegistry
                                  → QuizStateManager
ProgressTracker → QuizStateManager
```

## Design-Prinzipien

1. **Separation of Concerns**: Domain Logic getrennt von UI und Infrastructure
2. **Dependency Injection**: Services erhalten Dependencies explizit
3. **Factory Pattern**: Services werden durch Factories mit Dependencies erstellt
4. **Event-Driven**: UnlockManager nutzt Event-System für Benachrichtigungen
5. **Async-First**: Alle APIs sind asynchron für bessere Performance

## Testing-Strategy

- **Domain Logic**: Pure Functions → einfache Unit Tests
- **Services**: Factory Pattern → Mock-Dependencies für Tests
- **UI Components**: React Testing Library für Component Tests
- **Integration**: End-to-End Tests für komplette Quiz-Flows
