# Screens

## Überblick

Quiz-Screens implementieren die Benutzeroberfläche für die Quiz-Funktionalität. Jeder Screen ist für einen spezifischen Teil des Quiz-Flows verantwortlich und nutzt Quiz-Services über Context Provider.

## Zweck

- **User Interface**: Implementierung der Quiz-Benutzeroberfläche
- **Navigation Flow**: Management des Quiz-Durchlaufs
- **State Integration**: Anbindung an Quiz-Services und State
- **User Experience**: Optimierte Performance und Benutzerfreundlichkeit

## Screen-Struktur

```bash
screens/
├── QuizStart/           # Quiz-Auswahl und Startbildschirm
├── QuizOverview/        # Übersicht über alle Fragen eines Quiz
└── Question/            # Einzelne Frage-Ansicht
    ├── TextQuestion/    # Text-basierte Fragen
    ├── components/      # Gemeinsame Frage-Komponenten
    ├── hooks/          # Frage-spezifische Hooks
    └── constants/      # Frage-Konstanten
```

## Quiz Flow

```bash
QuizStart → QuizOverview → Question → QuizOverview
    ↑           ↑             ↓            ↓
    └───────────┴─────────────┴────────────┘
```

## Screen Details

### QuizStart (`QuizStart/`)

**Zweck**: Startbildschirm mit Quiz-Auswahl

#### Komponenten

- `QuizStart.tsx`: Haupt-Screen-Komponente
- `components/QuizGrid.tsx`: Grid-Layout für Quiz-Karten
- `components/QuizCard.tsx`: Einzelne Quiz-Karte mit Fortschritt
- `context/QuizDisplayContext.tsx`: Context für Quiz-Display-Logic

#### Features

```typescript
// Quiz-Initialisierung beim Screen-Load
useEffect(() => {
  const loadQuizStates = async () => {
    for (const quiz of quizzes) {
      await initializeQuizState(quiz.id);
    }
  };
  loadQuizStates();
}, [quizzes, initializeQuizState]);
```

**Quiz-Karten**:

- **Aktive Quizzes**: Fortschrittsanzeige und Navigation
- **Gesperrte Quizzes**: Freischaltbedingungen und Fortschritt
- **Abgeschlossene Quizzes**: Vollständigkeitsanzeige

### QuizOverview (`QuizOverview/`)

**Zweck**: Übersicht über alle Fragen eines Quiz

#### Komponenten - QuizStart

- `QuizOverviewScreen.tsx`: Haupt-Screen-Komponente
- `components/QuestionGrid.tsx`: Grid für Fragen-Thumbnails
- `components/QuestionListTile.tsx`: Einzelne Fragen-Kachel
- `components/ProgressBar.tsx`: Fortschrittsanzeige
- `hooks/useQuizOverview.ts`: Screen-spezifische Logic

#### Features - QuizStart

```typescript
const { quizState, isLoading, error } = useQuizOverview(quizId);

// Performance-optimierte Fragen-Grid
const renderItem = useCallback(({ item }) => (
  <QuestionListTile 
    item={item} 
    onClick={handleQuestionClick}
  />
), [handleQuestionClick]);
```

**Question States**:

- **Inactive**: Gesperrt (Schloss-Icon)
- **Active**: Verfügbar (Thumbnail)
- **Solved**: Gelöst (Thumbnail + Haken)

### Question (`Question/`)

**Zweck**: Einzelne Frage-Ansicht

#### Screen-Architektur

```typescript
QuestionScreen (Router)
    ↓
TextQuestionScreen (Text-basierte Fragen)
    ↓
Components: QuestionImage, AnswerInput, QuestionResult
```

#### Haupt-Komponenten

##### `QuestionScreen.tsx`

**Router-Komponente für Frage-Typen**

```typescript
export const QuestionScreen = ({ quizId, questionId }) => {
  const { quizState, question } = useMemo(() => {
    const state = getQuizState(quizId);
    const foundQuestion = state?.questions.find(q => q.id === parseInt(questionId));
    return { quizState: state, question: foundQuestion };
  }, [quizId, questionId, getQuizState]);

  return (
    <TextQuestionScreen 
      quizId={quizId}
      questionId={questionId} 
      question={question}
    />
  );
};
```

##### `TextQuestion/TextQuestionScreen.tsx`

**Text-basierte Fragen-Implementation**

```typescript
export const TextQuestionScreen = ({ quizId, questionId, question }) => {
  const {
    answer, setAnswer, showResult, isCorrect,
    handleSubmit, handleNext, handleTryAgain, handleBack
  } = useTextQuestionScreen(quizId, questionId, question);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <QuestionImage imageUrl={question.imageUrl} />
        <ThemedView>
          {question.status === 'solved' ? (
            <AlreadyAnswered funFact={question.funFact} />
          ) : !showResult ? (
            <AnswerInput 
              value={answer}
              onChangeText={setAnswer}
              onSubmitEditing={handleSubmit}
            />
          ) : (
            <QuestionResult 
              isCorrect={isCorrect}
              onNext={handleNext}
              onTryAgain={handleTryAgain}
              onBack={handleBack}
            />
          )}
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
```

#### Shared Components

##### `components/QuestionImage.tsx`

**Optimierte Bild-Anzeige**

```typescript
export const QuestionImage = ({ imageUrl, thumbnailUrl }) => {
  return (
    <View style={styles.container}>
      <Image
        source={imageUrl}
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={300}
        priority="high"
      />
    </View>
  );
};
```

##### `components/AnswerInput.tsx`

**Text-Eingabe-Komponente**

```typescript
export const AnswerInput = ({ value, onChangeText, onSubmitEditing }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder="Antwort eingeben..."
        autoFocus
      />
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={onSubmitEditing}
      >
        <Text>Prüfen</Text>
      </TouchableOpacity>
    </View>
  );
};
```

##### `components/QuestionResult.tsx`

**Ergebnis-Anzeige**

```typescript
export const QuestionResult = ({ 
  isCorrect, funFact, onNext, onTryAgain, onBack 
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.result, { color: isCorrect ? 'green' : 'red' }]}>
        {isCorrect ? 'Richtig!' : 'Leider falsch!'}
      </Text>
      
      {isCorrect && funFact && (
        <Text style={styles.funFact}>Fun fact: {funFact}</Text>
      )}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={onBack}>
          <Text>Zurück zur Übersicht</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={isCorrect ? onNext : onTryAgain}>
          <Text>{isCorrect ? 'Weiter' : 'Nochmal'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

## Hooks

### `useTextQuestionScreen.ts`

**Screen-spezifische Logic für Text-Fragen**

```typescript
export const useTextQuestionScreen = (quizId, questionId, question) => {
  const { answerQuizQuestion } = useAnswerProcessor();
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = useCallback(async () => {
    const result = await answerQuizQuestion(quizId, question.id, answer.trim());
    
    setIsCorrect(result.isCorrect);
    setShowResult(true);
    
    if (result.isCorrect && result.newState) {
      // State wurde bereits im Service aktualisiert
    }
  }, [quizId, question.id, answer, answerQuizQuestion]);

  return {
    answer, setAnswer, showResult, isCorrect,
    handleSubmit, handleNext, handleTryAgain, handleBack
  };
};
```

### `useBaseQuestionScreen.ts`

**Gemeinsame Logic für alle Frage-Typen**

```typescript
export const useBaseQuestionScreen = (quizId, questionId, question) => {
  const { updateQuizState } = useQuizState();
  const { getNextActiveQuestion, isQuizCompleted } = useProgressTracker();

  const handleNext = useCallback(() => {
    const nextQuestionId = getNextActiveQuestion(quizId, Number(questionId));
    
    if (nextQuestionId) {
      router.replace(`/quiz/${quizId}/${nextQuestionId}`);
    } else {
      router.navigate(`/quiz/${quizId}`);
    }
  }, [quizId, questionId, getNextActiveQuestion]);

  return {
    handleNext, handleBack, handleTryAgain,
    isQuizCompleted: isQuizCompleted(quizId)
  };
};
```

## Navigation Integration

### Expo Router Integration

```typescript
// app/quiz/[quizId].tsx
export default function QuizOverviewRoute() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  return <QuizOverviewScreen quizId={quizId} />;
}

// app/quiz/[quizId]/[questionId].tsx  
export default function QuestionRoute() {
  const { quizId, questionId } = useLocalSearchParams();
  return <QuestionScreen quizId={quizId} questionId={questionId} />;
}
```

### Navigation Flow

```typescript
// Quiz starten
router.navigate(`/quiz/${quizId}`);

// Frage öffnen
router.replace(`/quiz/${quizId}/${questionId}`);

// Zurück zur Übersicht
router.navigate(`/quiz/${quizId}`);
```

## Performance Optimierung

### Memoization

```typescript
// Memoized Components für bessere Performance
export const QuestionListTile = memo(({ item, onClick }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id &&
         prevProps.item.status === nextProps.item.status;
});
```

### Image Optimization

```typescript
<Image
  source={imageUrl}
  cachePolicy="memory-disk"    // Aggressive Caching
  transition={200}             // Smooth Transitions  
  priority="high"              // Prioritized Loading
  contentFit="cover"           // Optimized Sizing
/>
```

### Memory Management

```typescript
// Cleanup bei Component Unmount
useEffect(() => {
  return () => {
    if (Image.clearMemoryCache) {
      Image.clearMemoryCache(); // Nach vielen Bildern
    }
  };
}, []);
```

## Error Handling

### Screen-Level Error Boundaries

```typescript
if (error) {
  return (
    <ThemedView style={styles.centeredContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </ThemedView>
  );
}
```

### Loading States

```typescript
if (isLoading) {
  return (
    <ThemedView style={styles.centeredContainer}>
      <ActivityIndicator size="large" color="#0a7ea4" />
      <Text>Quiz wird geladen...</Text>
    </ThemedView>
  );
}
```
