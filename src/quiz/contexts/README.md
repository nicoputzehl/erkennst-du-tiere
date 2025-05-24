# Contexts (Provider)

## Überblick

Context Provider integrieren Quiz-Services in das React Component-System und stellen eine einheitliche API für UI-Komponenten bereit. Jeder Provider kapselt einen Service und stellt sowohl die Service-Instanz als auch Re-exported Methoden zur Verfügung.

## Zweck

- **Service Integration**: Services in React Context System einbinden
- **API Simplification**: Einfache Hooks für Service-Zugriff
- **State Management**: React-konforme State-Verwaltung
- **Performance**: Optimierte Re-Rendering durch Memoization

## Provider-Hierarchie

```bash
QuizProvider (Orchestrator)
├── QuizRegistryProvider      # Quiz-Verwaltung
├── QuizStateProvider         # Zustandsverwaltung
├── ProgressTrackerProvider   # Fortschritt
├── AnswerProcessorProvider   # Antwortverarbeitung
├── UnlockManagerProvider     # Freischaltungen
└── ToastProvider            # Benachrichtigungen
```

## Provider-Pattern

### Basis-Struktur

```typescript
interface ServiceContextProps {
  service: Service;                    // Service-Instanz
  method1: (...args) => ReturnType;   // Re-exported Methoden
  method2: (...args) => ReturnType;
}

export function ServiceProvider({ children }: { children: ReactNode }) {
  const service = getService();
  
  const contextValue = useMemo(() => ({
    service,
    method1: service.method1,
    method2: service.method2
  }), [service]);
  
  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useService() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within ServiceProvider');
  }
  return context;
}
```

## Core Provider

### QuizProvider

**Zweck**: Orchestrator für alle Quiz-Provider

```typescript
export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const initialize = async () => {
      await initializeAllQuizzes();
      setInitialized(true);
    };
    initialize();
  }, []);

  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <QuizRegistryProvider>
      <QuizStateProvider>
        <ProgressTrackerProvider>
          <AnswerProcessorProvider>
            <UnlockManagerProvider>
              <QuizProviderInner>{children}</QuizProviderInner>
            </UnlockManagerProvider>
          </AnswerProcessorProvider>
        </ProgressTrackerProvider>
      </QuizStateProvider>
    </QuizRegistryProvider>
  );
}
```

**Features**:

- Quiz-Initialisierung beim App-Start
- Loading-State während Initialisierung
- Provider-Hierarchie-Management

### QuizRegistryProvider

**Zweck**: Quiz-Verwaltung und -Registry

```typescript
interface QuizRegistryContextProps {
  quizRegistryService: QuizRegistryService;
  getQuizById: <T>(id: string) => Quiz<T> | undefined;
  getAllQuizzes: <T>() => Quiz<T>[];
  getQuizzesByContentType: <T>(type: string) => Quiz<T>[];
  registerQuiz: <T>(id: string, quiz: Quiz<T>, type?: string) => void;
}
```

### QuizStateProvider

**Zweck**: Quiz-Zustandsverwaltung mit Persistierung

```typescript
interface QuizStateContextProps {
  quizStateManagerService: QuizStateManagerService;
  getQuizState: <T>(quizId: string) => QuizState<T> | undefined;
  initializeQuizState: <T>(quizId: string) => Promise<QuizState<T> | null>;
  updateQuizState: <T>(quizId: string, state: QuizState<T>) => Promise<void>;
  resetQuizState: <T>(quizId: string) => Promise<QuizState<T> | null>;
  isLoading: boolean;
}
```

**Features**:

- Asynchrone State-Operationen
- Loading-State-Management
- Error-Handling für Service-Calls

### AnswerProcessorProvider

**Zweck**: Antwortverarbeitung

```typescript
interface AnswerProcessorContextProps {
  answerProcessorService: AnswerProcessorService;
  answerQuizQuestion: <T>(
    quizId: string,
    questionId: number,
    answer: string
  ) => Promise<{
    isCorrect: boolean;
    newState?: QuizState<T>;
    nextQuestionId?: number;
    unlockedQuiz?: any;
  }>;
}
```

### ProgressTrackerProvider

**Zweck**: Fortschrittsverfolgung

```typescript
interface ProgressTrackerContextProps {
  progressTrackerService: ProgressTrackerService;
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, current?: number) => number | null;
}
```

### UnlockManagerProvider

**Zweck**: Freischaltungslogik mit Event-System

```typescript
interface UnlockManagerContextProps {
  unlockManagerService: UnlockManagerService;
  getUnlockProgress: (quizId: string) => {
    condition: UnlockCondition | null;
    progress: number;
    isMet: boolean;
  };
  unlockNextQuiz: () => Quiz | null;
  checkForUnlocks: () => Quiz[];
  addUnlockListener: (listener: (quiz: Quiz) => void) => void;
  removeUnlockListener: (listener: (quiz: Quiz) => void) => void;
}
```

**Features**:

- Automatische Toast-Benachrichtigungen bei Freischaltungen
- Event-Listener-Management

### ToastProvider

**Zweck**: Globale Benachrichtigungen

```typescript
interface ToastContextType {
  showToast: (data: ToastData) => void;
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
}
```

## Performance Optimierung

### Memoization

```typescript
const contextValue = useMemo(() => {
  console.log('[Provider] Creating memoized context value');
  
  return {
    service,
    method1: async (...args) => {
      try {
        return await service.method1(...args);
      } catch (error) {
        console.error('[Provider] Error:', error);
        // Handle error
      }
    }
  };
}, [service]); // Nur bei Service-Änderung neu erstellen
```

### Dependency Arrays

```typescript
// ✅ Correct - service ist stabil
const contextValue = useMemo(() => ({ ... }), [service]);

// ❌ Incorrect - führt zu unnecessary re-renders
const contextValue = useMemo(() => ({ ... }), [service.method]);
```

## Error Handling

### Service-Level Error Handling

```typescript
const contextValue = useMemo(() => ({
  answerQuestion: async (quizId, questionId, answer) => {
    try {
      return await service.answerQuizQuestion(quizId, questionId, answer);
    } catch (error) {
      console.error(`[AnswerProcessorProvider] Error:`, error);
      return { isCorrect: false };
    }
  }
}), [service]);
```

### Provider-Level Error Boundaries

```typescript
// In QuizProvider
if (initializationError) {
  return <ErrorScreen error={initializationError} />;
}
```

## Hook Usage

### Standard Usage

```typescript
// In Component
const { answerQuizQuestion } = useAnswerProcessor();
const { getQuizProgress } = useProgressTracker();
const { showSuccessToast } = useToast();

const handleAnswer = async () => {
  const result = await answerQuizQuestion(quizId, questionId, answer);
  if (result.isCorrect) {
    showSuccessToast('Richtig!');
  }
};
```

### Service Access

```typescript
// Direkte Service-Zugriff wenn nötig
const { answerProcessorService } = useAnswerProcessor();
// Für spezielle Service-Methoden die nicht re-exported sind
```

## Lifecycle Management

### Provider Mounting

```bash
1. QuizProvider mounted
   ↓
2. initializeAllQuizzes() called
   ↓
3. Child providers mounted
   ↓
4. Services initialized
   ↓
5. Context values created
   ↓
6. Components can use hooks
```

### Cleanup

```typescript
useEffect(() => {
  const unlockHandler = (quiz) => showToast(`Quiz unlocked: ${quiz.title}`);
  addUnlockListener(unlockHandler);
  
  return () => {
    removeUnlockListener(unlockHandler);
  };
}, [addUnlockListener, removeUnlockListener, showToast]);
```

## Testing

### Provider Testing

```typescript
const renderWithProviders = (component) => {
  return render(
    <QuizProvider>
      {component}
    </QuizProvider>
  );
};

test('component uses quiz service', () => {
  renderWithProviders(<MyComponent />);
  // Test component behavior...
});
```

### Hook Testing

```typescript
const { result } = renderHook(() => useAnswerProcessor(), {
  wrapper: ({ children }) => (
    <QuizProvider>{children}</QuizProvider>
  )
});

expect(result.current.answerQuizQuestion).toBeDefined();
```
