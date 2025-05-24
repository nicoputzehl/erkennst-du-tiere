# Animals Quizzes

## Überblick

Das Quizzes-Modul fungiert als Eingangsschnittstelle für das Animals-Layer in das Quiz-System. Es definiert, konfiguriert und registriert alle verfügbaren Tier-Quizzes bei der App-Initialisierung.

## Zweck

- **Quiz-Registrierung**: Automatische Registrierung aller Tier-Quizzes
- **App-Integration**: Nahtlose Integration in die App-Initialisierung  
- **Configuration**: Zentrale Konfiguration aller Tier-Quiz-Properties
- **Self-Registration**: Module registriert sich selbstständig beim App-Start

## Dateien

### `animalQuizzes.ts`

**Zentrale Tier-Quiz-Definition und -Registrierung**

#### Quiz-Definitionen

```typescript
import { registerQuizInitializer } from '@/src/core/initialization/quizInitialization';
import { createAnimalQuiz } from '../helper/createAnimalQuiz';
import { namibiaAnimals, weirdAnimals } from '../data/quizzes';

export const ANIMAL_CONTENT_TYPE = 'animal';

const initializeAnimalQuizzes = () => [
  {
    id: 'namibia_animals',
    quiz: createAnimalQuiz({
      id: 'namibia_animals',
      title: 'Tiere Namibias',
      animalQuestions: namibiaAnimals,
      initiallyLocked: false,
      order: 1
    }),
    contentType: ANIMAL_CONTENT_TYPE
  },
  {
    id: 'weird_animals',
    quiz: createAnimalQuiz({
      id: 'weird_animals',
      title: 'Weird Animals',
      animalQuestions: weirdAnimals,
      order: 3,
      initiallyLocked: true,
      unlockCondition: {
        type: 'specificQuiz',
        requiredQuizId: 'namibia_animals',
        description: 'Schließe das Quiz "Tiere Namibias" ab, um dieses Quiz freizuschalten.'
      }
    }),
    contentType: ANIMAL_CONTENT_TYPE
  }
];

// Auto-Registrierung beim Module-Load
registerQuizInitializer(initializeAnimalQuizzes);
```

#### Export für direkten Zugriff

```typescript
export const allAnimalQuizCategories = [
  {
    id: 'weird_animals',
    title: 'Weird Animals',
    contentType: ANIMAL_CONTENT_TYPE
  },
  {
    id: 'namibia_animals',
    title: 'Tiere Namibias',
    contentType: ANIMAL_CONTENT_TYPE
  }
];
```

## Quiz-Konfigurationen

### Namibia Animals Quiz

```typescript
{
  id: 'namibia_animals',
  title: 'Tiere Namibias',
  animalQuestions: namibiaAnimals,    // 15 Fragen
  initiallyLocked: false,             // Sofort verfügbar
  order: 1                            // Erstes Quiz
}
```

**Eigenschaften**:

- **Einstiegs-Quiz**: Nicht gesperrt, für neue Benutzer
- **Realistische Bilder**: Echte Fotos aus Namibia
- **Mittlere Schwierigkeit**: Bekannte und weniger bekannte Tiere
- **Bildungsinhalt**: Fokus auf afrikanische Tierwelt

### Weird Animals Quiz

```typescript
{
  id: 'weird_animals',
  title: 'Weird Animals',
  animalQuestions: weirdAnimals,      // 10 Fragen
  order: 3,                           // Spätes Quiz
  initiallyLocked: true,              // Gesperrt am Start
  unlockCondition: {
    type: 'specificQuiz',
    requiredQuizId: 'namibia_animals',
    description: 'Schließe das Quiz "Tiere Namibias" ab'
  }
}
```

**Eigenschaften**:

- **Advanced Content**: Freigeschaltet nach Basis-Quiz
- **Seltene Tiere**: Exotische und ungewöhnliche Arten
- **Hohe Schwierigkeit**: Wenig bekannte Tiere
- **Educational Value**: Erweitert Tier-Wissen erheblich

## Auto-Registrierung

### Initialisierungs-Flow

```bash
1. App-Start
   ↓
2. animalQuizzes.ts wird importiert
   ↓  
3. registerQuizInitializer(initializeAnimalQuizzes) wird aufgerufen
   ↓
4. Initialisierer in Core-Registry gespeichert
   ↓
5. QuizProvider startet initializeAllQuizzes()
   ↓
6. initializeAnimalQuizzes() wird ausgeführt
   ↓
7. createAnimalQuiz() erstellt Quiz-Instanzen
   ↓
8. Quizzes werden in Quiz-Registry registriert
   ↓
9. Tier-Quizzes sind app-weit verfügbar
```

### Import-Integration

```typescript
// In src/quiz/contexts/QuizProvider.tsx
import '@/src/animals/quizzes/animalQuizzes';

// Module wird geladen → Auto-Registrierung läuft
// Keine weiteren Code-Änderungen nötig
```

## Content-Type-System

### Content-Type Definition

```typescript
export const ANIMAL_CONTENT_TYPE = 'animal';

// Verwendet für:
// - Quiz-Kategorisierung
// - Service-Filter-Funktionen 
// - Analytics und Tracking
// - Content-Management
```

### Usage in Services

```typescript
// Quiz-Registry kann nach Content-Type filtern
const animalQuizzes = getQuizzesByContentType('animal');

// Analytics können Content-Type-spezifische Metriken sammeln
const animalQuizProgress = getProgressByContentType('animal');
```

## Erweiterbarkeit

### Neues Tier-Quiz hinzufügen

```typescript
// 1. Neue Quiz-Daten erstellen
const newAnimalQuiz: QuestionWithAnimal[] = [
  // Fragen-Definitionen...
];

// 2. In initializeAnimalQuizzes() hinzufügen
const initializeAnimalQuizzes = () => [
  // ... bestehende Quizzes
  {
    id: 'new_animal_quiz',
    quiz: createAnimalQuiz({
      id: 'new_animal_quiz',
      title: 'Neues Tier-Quiz',
      animalQuestions: newAnimalQuiz,
      initiallyLocked: true,
      unlockCondition: {
        type: 'completionCount',
        requiredCount: 2,
        description: 'Schließe 2 andere Quizzes ab'
      },
      order: 4
    }),
    contentType: ANIMAL_CONTENT_TYPE
  }
];

// 3. Export aktualisieren
export const allAnimalQuizCategories = [
  // ... bestehende
  {
    id: 'new_animal_quiz',
    title: 'Neues Tier-Quiz',
    contentType: ANIMAL_CONTENT_TYPE
  }
];
```

### Freischaltungs-Strategien

```typescript
// Nach spezifischem Quiz
unlockCondition: {
  type: 'specificQuiz',
  requiredQuizId: 'basic_quiz',
  description: 'Schließe Basic Quiz ab'
}

// Nach Anzahl abgeschlossener Quizzes
unlockCondition: {
  type: 'completionCount', 
  requiredCount: 3,
  description: 'Schließe 3 beliebige Quizzes ab'
}

// Nach Prozent aller Fragen
unlockCondition: {
  type: 'percentage',
  requiredPercentage: 75,
  description: 'Beantworte 75% aller Fragen'
}
```

## Feature Flags & A/B Testing

### Conditional Quiz Loading

```typescript
const initializeAnimalQuizzes = () => {
  const quizzes = [
    // Standard-Quizzes...
  ];
  
  // Feature Flag für experimentelle Quizzes
  if (FEATURE_FLAGS.experimentalQuizzes) {
    quizzes.push({
      id: 'experimental_animals',
      quiz: createAnimalQuiz({
        id: 'experimental_animals',
        title: 'Beta Tier-Quiz',
        animalQuestions: experimentalAnimals,
        initiallyLocked: true
      }),
      contentType: ANIMAL_CONTENT_TYPE
    });
  }
  
  return quizzes;
};
```

### A/B Testing Support

```typescript
const initializeAnimalQuizzes = () => {
  const userGroup = getUserABTestGroup();
  
  if (userGroup === 'difficulty_variant_a') {
    // Schwierigere Version
    return createHardModeQuizzes();
  } else {
    // Standard Version
    return createStandardQuizzes();
  }
};
```

## Debug & Monitoring

### Quiz-Initialization Logging

```typescript
const initializeAnimalQuizzes = () => {
  console.log('[AnimalQuizzes] Initializing animal quizzes...');
  
  const quizzes = [
    // Quiz-Definitionen...
  ];
  
  console.log(`[AnimalQuizzes] Created ${quizzes.length} animal quizzes:`, 
    quizzes.map(q => q.id));
  
  return quizzes;
};
```

### Validation & Health Checks

```typescript
const validateQuizDefinitions = () => {
  const quizzes = initializeAnimalQuizzes();
  
  quizzes.forEach(({ id, quiz }) => {
    // Basis-Validierung
    if (!quiz.questions?.length) {
      console.error(`[AnimalQuizzes] Quiz "${id}" has no questions`);
    }
    
    // Asset-Validierung
    const missingAssets = validateQuizAssets(quiz.questions);
    if (missingAssets.length) {
      console.warn(`[AnimalQuizzes] Quiz "${id}" missing assets:`, missingAssets);
    }
    
    // Tier-Key-Validierung
    quiz.questions.forEach(q => {
      if (q.data?.content && !validateAnimalKey(q.data.content)) {
        console.error(`[AnimalQuizzes] Invalid animal key in quiz "${id}":`, q.data.content);
      }
    });
  });
};
```

## Performance Considerations

### Lazy Quiz Creation

```typescript
// Verzögerte Quiz-Erstellung für bessere App-Start-Performance
const createLazyAnimalQuiz = (config: AnimalQuizConfig) => {
  let quiz: Quiz<AnimalKey> | null = null;
  
  return {
    get quiz() {
      if (!quiz) {
        console.log(`[AnimalQuizzes] Creating quiz "${config.id}" on demand`);
        quiz = createAnimalQuiz(config);
      }
      return quiz;
    },
    id: config.id,
    contentType: ANIMAL_CONTENT_TYPE
  };
};
```

### Memory Management

```typescript
const initializeAnimalQuizzes = () => {
  // Nur Metadaten vorhalten, Quiz-Instanzen bei Bedarf erstellen
  return QUIZ_DEFINITIONS.map(definition => ({
    id: definition.id,
    quiz: createAnimalQuiz(definition),
    contentType: ANIMAL_CONTENT_TYPE,
    
    // Memory cleanup nach Quiz-Abschluss
    cleanup: () => {
      // Bilder aus Cache entfernen
      // Nicht mehr benötigte Daten freigeben
    }
  }));
};
```

## Testing

### Unit Tests

```typescript
describe('Animal Quiz Initialization', () => {
  it('creates all expected quizzes', () => {
    const quizzes = initializeAnimalQuizzes();
    
    expect(quizzes).toHaveLength(2);
    expect(quizzes.map(q => q.id)).toEqual([
      'namibia_animals',
      'weird_animals'
    ]);
  });
  
  it('sets correct unlock conditions', () => {
    const quizzes = initializeAnimalQuizzes();
    const weirdQuiz = quizzes.find(q => q.id === 'weird_animals');
    
    expect(weirdQuiz.quiz.initiallyLocked).toBe(true);
    expect(weirdQuiz.quiz.unlockCondition?.requiredQuizId).toBe('namibia_animals');
  });
});
```

### Integration Tests

```typescript
describe('Animal Quiz Registration', () => {
  it('registers quizzes in quiz registry', async () => {
    // Quiz-Initialisierung simulieren
    await initializeAllQuizzes();
    
    const namibiaQuiz = getQuizById('namibia_animals');
    const weirdQuiz = getQuizById('weird_animals');
    
    expect(namibiaQuiz).toBeDefined();
    expect(weirdQuiz).toBeDefined();
    expect(getQuizzesByContentType('animal')).toHaveLength(2);
  });
});
```

## Migration & Versioning

### Quiz-Definition-Migration

```typescript
const QUIZ_VERSION = 2;

const migrateQuizDefinitions = (definitions: any[]) => {
  return definitions.map(def => {
    if (def.version === 1) {
      // Migration von v1 zu v2
      return {
        ...def,
        version: 2,
        // Neue Properties hinzufügen
        // Deprecated Properties entfernen
      };
    }
    return def;
  });
};
```

### Backward Compatibility

```typescript
const initializeAnimalQuizzes = () => {
  try {
    // Neue Quiz-Definitions-Format versuchen
    return loadQuizDefinitionsV2();
  } catch (error) {
    console.warn('[AnimalQuizzes] Falling back to legacy format');
    return loadLegacyQuizDefinitions();
  }
};
```

## Deployment & Release

### Environment-basierte Konfiguration

```typescript
const initializeAnimalQuizzes = () => {
  const environment = process.env.NODE_ENV;
  
  if (environment === 'development') {
    // Zusätzliche Test-Quizzes in Development
    return [...productionQuizzes, ...devQuizzes];
  }
  
  return productionQuizzes;
};
```

### Gradual Rollout

```typescript
const initializeAnimalQuizzes = () => {
  const userPercentage = getUserRolloutPercentage();
  
  const quizzes = [standardQuizzes];
  
  // Neues Quiz nur für bestimmten Benutzer-Prozentsatz
  if (userPercentage <= 10) { // 10% der Benutzer
    quizzes.push(newExperimentalQuiz);
  }
  
  return quizzes;
};
```
