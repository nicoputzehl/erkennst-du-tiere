# Domain Logic

## Überblick

Die Domain Logic enthält die reine Geschäftslogik der Quiz-Anwendung ohne externe Abhängigkeiten. Alle Funktionen sind pure Functions, die einfach testbar und wiederverwendbar sind.

## Zweck

- **Pure Business Logic**: Kernlogik ohne Side Effects
- **Testability**: Alle Funktionen sind pure Functions
- **Reusability**: Logik kann in verschiedenen Kontexten verwendet werden
- **Predictability**: Gleiche Inputs → gleiche Outputs

## Dateien

### `quizLogic.ts`

**Kern-Quiz-Funktionalität**

#### Quiz-Zustand Management

```typescript
createQuizState<T>(
  questions: Question<T>[],
  id: string,
  title?: string,
  quizMode?: QuizMode,
  initialUnlockedQuestions?: number
): QuizState<T>
```

**Features**:

- Erstellt initialen Quiz-Zustand basierend auf Quiz-Modus
- Sequential: Nur erste N Fragen aktiv
- All Unlocked: Alle Fragen sofort verfügbar

#### Antwort-Verarbeitung

```typescript
calculateAnswerResult<T>(
  state: QuizState<T>,
  questionId: number,
  answer: string
): { newState: QuizState<T>; isCorrect: boolean }

isTextAnswerCorrect<T>(
  question: QuizQuestion<T>,
  answer: string
): boolean
```

**Logik**:

- Normalisiert Antworten für Vergleich
- Prüft Haupt- und Alternative-Antworten
- Berechnet neuen Zustand bei korrekter Antwort
- Aktiviert nächste Frage (Sequential Mode)

#### Navigation & Fortschritt

```typescript
getNextActiveQuestionId<T>(
  state: QuizState<T>,
  currentQuestionId?: number
): number | null

isCompleted<T>(state: QuizState<T>): boolean
```

**Features**:

- Findet nächste ungelöste Frage
- Berücksichtigt Frage-Reihenfolge
- Wrap-around Logic für bessere UX

### `unlockLogic.ts`

**Freischaltungs-Logik**

#### Bedingungsprüfung

```typescript
checkUnlockCondition(
  condition: UnlockCondition,
  allQuizzes: Quiz[],
  quizStates: Map<string, QuizState>
): { isMet: boolean; progress: number }
```

**Unterstützte Bedingungen**:

- **Percentage**: X% aller Fragen beantwortet
- **CompletionCount**: X Quizzes vollständig abgeschlossen
- **SpecificQuiz**: Bestimmtes Quiz abgeschlossen

#### Freischaltungs-Management

```typescript
getNextUnlockableQuiz(
  allQuizzes: Quiz[],
  quizStates: Map<string, QuizState>
): Quiz | null

calculateUnlockProgress(
  condition: UnlockCondition,
  allQuizzes: Quiz[],
  quizStates: Map<string, QuizState>
): { progress: number; isMet: boolean }
```

## Datenstrukturen

### QuizState

```typescript
interface QuizState<T extends ContentKey> {
  id: string;
  title: string;
  questions: QuizQuestion<T>[];  // Mit Status
  completedQuestions: number;
  quizMode?: QuizMode;
}
```

### Question Status Flow

```bash
INACTIVE → ACTIVE → SOLVED
    ↑        ↓
    └────────┘ (nur Sequential Mode)
```

### Quiz Modi

- **SEQUENTIAL**: Fragen werden nacheinander freigeschaltet
- **ALL_UNLOCKED**: Alle Fragen sofort verfügbar

## Verwendung

### Quiz-Erstellung

```typescript
const questions = [/* Question<AnimalKey>[] */];
const state = createQuizState(
  questions,
  'animal_quiz',
  'Tier-Quiz',
  QuizMode.SEQUENTIAL,
  2  // Erste 2 Fragen aktiv
);
```

### Antwort-Verarbeitung

```typescript
const result = calculateAnswerResult(
  currentState,
  questionId,
  userAnswer
);

if (result.isCorrect) {
  // State updaten, nächste Frage aktivieren
  updateQuizState(result.newState);
}
```

### Freischaltungs-Check

```typescript
const condition: UnlockCondition = {
  type: 'specificQuiz',
  requiredQuizId: 'basic_quiz',
  description: 'Complete Basic Quiz'
};

const { isMet, progress } = checkUnlockCondition(
  condition,
  allQuizzes,
  quizStates
);
```

## Design-Prinzipien

### 1. Pure Functions

```typescript
// ✅ Pure - keine Side Effects
const calculateResult = (state, answer) => ({ newState, isCorrect });

// ❌ Impure - modifiziert externen Zustand
const updateState = (answer) => { globalState.score++; };
```

### 2. Immutability

```typescript
// Neue Objekte erstellen statt Mutation
return {
  ...state,
  questions: state.questions.map(q => 
    q.id === questionId ? { ...q, status: 'solved' } : q
  )
};
```

### 3. Explicit Dependencies

```typescript
// Alle benötigten Daten als Parameter
const checkUnlock = (condition, quizzes, states) => { ... };

// Nicht: const checkUnlock = (condition) => { getGlobalQuizzes()... };
```

## Testing

Pure Functions sind einfach testbar:

```typescript
describe('calculateAnswerResult', () => {
  it('marks question as solved on correct answer', () => {
    const state = createMockState();
    const result = calculateAnswerResult(state, 1, 'correct answer');
    
    expect(result.isCorrect).toBe(true);
    expect(result.newState.completedQuestions).toBe(1);
  });
});
```

## Performance

- **Memoization-friendly**: Pure Functions können gecacht werden
- **Predictable**: Keine versteckten Dependencies
- **Parallelizable**: Keine shared state Konflikte
