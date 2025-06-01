# Quiz App Refactoring Plan

## 🎯 Gesamtziel

Transformation der Animal Quiz App von einer over-engineered Context Provider Architektur zu einer einfachen, wartbaren und erweiterbaren Zustand-basierten Lösung mit Multi-Theme Support.

### Success Metrics

- **Code Reduktion:** 80% weniger State Management Code
- **Performance:** 50% weniger Re-Renders
- **Maintainability:** 90% einfacheres Debugging
- **Extensibility:** Multi-Theme Support ohne Code-Duplikation
- **Developer Experience:** Von 15+ Hooks zu 3-4 logischen Gruppen

---

## 📋 Phase 1: Vorbereitung & Setup (2-3 Tage)

### 1.1 Dependency Management

- [ ] `npm install zustand` hinzufügen
- [ ] `npm install @reduxjs/toolkit` entfernen (falls vorhanden)
- [ ] Dev Dependencies für Debugging hinzufügen:

  ```bash
  npm install --save-dev @redux-devtools/extension
  ```

### 1.2 Code-Analyse & Mapping

- [ ] **Aktueller State inventarisieren:**
  - `PersistenceProvider` → AsyncStorage Operations
  - `QuizDataProvider` → Quiz Loading & Caching  
  - `QuizStateProvider` → Quiz Progress & States
  - `UIStateProvider` → Loading, Toasts, Navigation
  - `QuizProvider` → Orchestration Layer

- [ ] **Hook-Inventar erstellen:**

  ```bash
  useAnswerProcessing()     → submitAnswer()
  useUnlockSystem()         → checkUnlocks()  
  useQuizOperations()       → quiz CRUD operations
  useDataManagement()       → persistence layer
  useUIState()              → UI feedback
  usePendingUnlocks()       → unlock notifications
  useNavigationTracking()   → navigation state
  useImageDisplay()         → image logic (vereinfachen)
  ```

### 1.3 Migration Strategy festlegen

- [ ] **Bottom-Up Approach:** Beginne mit UI State (einfachste)
- [ ] **Parallel Development:** Neue Store parallel zu bestehenden Providern
- [ ] **Feature Flags:** Schrittweise Aktivierung neuer Implementierung
- [ ] **Rollback Plan:** Jederzeit zu alter Implementierung zurück

---

## 📦 Phase 2: Core Store Implementierung (3-4 Tage)

### 2.1 Store Struktur definieren

- [ ] **Base Types erstellen:**

  ```typescript
  // store/types.ts
  interface QuizStore {
    // Data Layer
    quizzes: Quiz[];
    quizStates: Record<string, QuizState>;
    
    // UI Layer  
    ui: UIState;
    
    // Navigation Layer
    navigation: NavigationState;
    
    // Actions
    actions: QuizActions;
  }
  ```

### 2.2 Store Implementation

- [ ] **Core Store erstellen:** `store/useQuizStore.ts`
  - State Structure
  - Computed Properties (getters)
  - Action Creators
  - Middleware Setup (persist, devtools)

### 2.3 Persistence Layer

- [ ] **Zustand Persist Middleware konfigurieren:**

  ```typescript
  persist(
    storeDefinition,
    {
      name: 'quiz-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        quizStates: state.quizStates,
        completedQuizzes: state.completedQuizzes
      })
    }
  )
  ```

### 2.4 Development Tools

- [ ] **Redux DevTools Integration:**

  ```typescript
  devtools(
    persistedStore,
    { name: 'quiz-store' }
  )
  ```

---

## 🔄 Phase 3: Provider Migration (5-6 Tage)

### 3.1 UIStateProvider → UI Store Slice (Tag 1)

#### 3.1.1 UI State Migration

- [ ] **Toast System migrieren:**

  ```typescript
  // Alt: useUIState()
  const { showSuccessToast, showErrorToast } = useUIState();
  
  // Neu: useQuizStore()  
  const showToast = useQuizStore(state => state.showToast);
  ```

- [ ] **Loading States konsolidieren:**

  ```typescript
  // Alt: Verschiedene loading states
  const { isGlobalLoading, startLoading, stopLoading } = useUIState();
  
  // Neu: Zentraler loading state
  const { isLoading, setLoading } = useQuizStore();
  ```

#### 3.1.2 Komponenten Migration

- [ ] **Toast Component anpassen:** `components/Toast.tsx`
- [ ] **Loading Components anpassen:** `components/LoadingComponent.tsx`
- [ ] **Settings Screen migrieren:** `screens/SettingsScreen.tsx`

#### 3.1.3 Testing & Validation

- [ ] **UI Tests aktualisieren**
- [ ] **Toast Funktionalität testen**
- [ ] **Loading States validieren**

### 3.2 QuizStateProvider → Quiz Store Slice (Tag 2-3)

#### 3.2.1 Quiz State Logic Migration

- [ ] **Quiz CRUD Operations:**

  ```typescript
  // Alt: Multiple Hooks
  const { initializeQuizState, updateQuizState, resetQuizState } = useQuizState();
  
  // Neu: Store Actions
  const { startQuiz, updateQuiz, resetQuiz } = useQuizStore();
  ```

- [ ] **Progress Tracking:**

  ```typescript
  // Alt: Separate Hook
  const progress = getQuizProgress(quizId);
  
  // Neu: Computed Property
  const progress = useQuizStore(state => 
    state.quizStates[quizId]?.completedQuestions / 
    state.quizStates[quizId]?.questions.length * 100
  );
  ```

#### 3.2.2 Question Logic Vereinfachen

- [ ] **Answer Processing konsolidieren:**

  ```typescript
  // Alt: useAnswerProcessing Hook
  const { processAnswer } = useAnswerProcessing();
  
  // Neu: Store Action
  const submitAnswer = useQuizStore(state => state.submitAnswer);
  ```

- [ ] **Image Display vereinfachen:**

  ```typescript
  // Alt: useImageDisplay Hook mit komplexer Logik
  const { getImageUrl } = useImageDisplay(question);
  
  // Neu: Einfache Funktion
  const imageUrl = question.status === 'solved' 
    ? question.images.imageUrl 
    : question.images.unsolvedImageUrl || question.images.imageUrl;
  ```

#### 3.2.3 Komponenten Migration

- [ ] **QuizScreen anpassen:** `screens/Quiz/QuizScreen.tsx`
- [ ] **QuestionScreen anpassen:** `screens/Question/QuestionScreen.tsx`
- [ ] **QuizCard anpassen:** `screens/Quizzes/components/QuizCard/`

### 3.3 QuizDataProvider → Data Store Slice (Tag 4)

#### 3.3.1 Data Loading Migration

- [ ] **Quiz Registry System vereinfachen:**

  ```typescript
  // Alt: Komplexes Registry System
  registerQuizzes(animalQuizConfigs);
  await initializeAllQuizzes();
  
  // Neu: Direkte Initialisierung
  const initializeQuizzes = useQuizStore(state => state.initializeQuizzes);
  initializeQuizzes(animalQuizzes);
  ```

#### 3.3.2 Quiz Access Migration

- [ ] **Quiz Getters vereinfachen:**

  ```typescript
  // Alt: Multiple Context Calls
  const { getQuizById, getAllQuizzes } = useQuizData();
  
  // Neu: Direct Store Access
  const quizzes = useQuizStore(state => state.quizzes);
  const quiz = useQuizStore(state => state.quizzes.find(q => q.id === id));
  ```

### 3.4 PersistenceProvider → Zustand Middleware (Tag 5)

#### 3.4.1 AsyncStorage Migration

- [ ] **Persistence Logic zu Zustand Middleware:**

  ```typescript
  // Alt: Separate Persistence Provider
  const { saveQuizStates, loadQuizStates } = usePersistence();
  
  // Neu: Automatische Persistence durch Zustand
  // Konfiguration in Store Definition
  ```

#### 3.4.2 Data Migration

- [ ] **Bestehende AsyncStorage Daten migrieren**
- [ ] **Backup System für Rollback implementieren**

### 3.5 QuizProvider → Entfernen (Tag 6)

#### 3.5.1 Orchestration Logic Migration

- [ ] **Unlock System vereinfachen:**

  ```typescript
  // Alt: Separate Unlock Hook
  const { checkForUnlocks, isQuizUnlocked } = useUnlockSystem();
  
  // Neu: Store Computed Properties
  const unlockedQuizzes = useQuizStore(state => state.unlockedQuizzes);
  ```

#### 3.5.2 Provider Cleanup

- [ ] **QuizProvider Component entfernen**
- [ ] **App.tsx Layout vereinfachen:**

  ```typescript
  // Alt: 5 verschachtelte Provider
  <PersistenceProvider>
    <QuizDataProvider>
      <QuizStateProvider>
        <UIStateProvider>
          <QuizProvider>
  
  // Neu: Nur Theme Provider (falls gewünscht)
  <ThemeProvider>
    <App />
  </ThemeProvider>
  ```

---

## 🧹 Phase 4: Hook Konsolidierung (2-3 Tage)

### 4.1 Hook-Gruppen definieren

- [ ] **Data Hooks:**

  ```typescript
  const useQuizData = () => useQuizStore(state => ({
    quizzes: state.unlockedQuizzes,
    currentQuiz: state.currentQuiz,
    quizStates: state.quizStates
  }));
  ```

- [ ] **Action Hooks:**

  ```typescript
  const useQuizActions = () => useQuizStore(state => ({
    startQuiz: state.startQuiz,
    submitAnswer: state.submitAnswer,
    resetQuiz: state.resetQuiz,
    resetAllQuizzes: state.resetAllQuizzes
  }));
  ```

- [ ] **UI Hooks:**

  ```typescript
  const useUI = () => useQuizStore(state => ({
    isLoading: state.ui.isLoading,
    toast: state.ui.currentToast,
    showToast: state.showToast,
    hideToast: state.hideToast
  }));
  ```

### 4.2 Specialized Hooks

- [ ] **Screen-spezifische Hooks behalten:**

  ```typescript
  // Sinnvolle Screen-Hooks
  const useQuestionScreen = (quizId: string, questionId: number) => {
    const quiz = useQuizStore(state => state.quizStates[quizId]);
    const question = quiz?.questions.find(q => q.id === questionId);
    const submitAnswer = useQuizStore(state => state.submitAnswer);
    
    return { question, submitAnswer, isLoading: quiz?.isLoading };
  };
  ```

### 4.3 Hook Migration

- [ ] **Komponenten auf neue Hooks umstellen**
- [ ] **Alte Hook-Dateien entfernen**
- [ ] **Import-Statements aktualisieren**

---

## 🎨 Phase 5: Theme System Implementation (3-4 Tage)

### 5.1 Theme Abstraction Layer

- [ ] **Core Theme Types definieren:**

  ```typescript
  interface ThemeConfig {
    id: string;
    name: string;
    primaryColor: string;
    quizzes: QuizDefinition[];
    assets: AssetMap;
  }
  ```

### 5.2 Animal Theme Extraktion

- [ ] **Animal-spezifische Daten isolieren:**

  ```typescript
  // themes/animal/index.ts
  export const animalTheme: ThemeConfig = {
    id: 'animals',
    name: 'Erkennst du: Tiere?',
    quizzes: animalQuizzes,
    assets: animalAssets
  };
  ```

### 5.3 Theme Provider Integration

- [ ] **Theme Store erweitern:**

  ```typescript
  interface AppStore extends QuizStore {
    currentTheme: ThemeConfig;
    availableThemes: ThemeConfig[];
    switchTheme: (themeId: string) => void;
  }
  ```

### 5.4 Multi-Theme Demo

- [ ] **Countries Theme als Proof of Concept:**

  ```typescript
  export const countriesTheme: ThemeConfig = {
    id: 'countries',
    name: 'Erkennst du: Länder?',
    quizzes: countryQuizzes,
    assets: countryAssets
  };
  ```

---

## 🧪 Phase 6: Testing & Quality Assurance (2-3 Tage)

### 6.1 Test Migration

- [ ] **Store Tests erstellen:**

  ```typescript
  // __tests__/store/useQuizStore.test.ts
  describe('QuizStore', () => {
    test('should initialize quizzes correctly', () => {
      // Test implementation
    });
  });
  ```

- [ ] **Mock Setup vereinfachen:**

  ```typescript
  // Einfache Store Mocks statt Provider Mocks
  const mockStore = {
    quizzes: mockQuizzes,
    currentQuiz: mockQuizState,
    submitAnswer: jest.fn()
  };
  ```

### 6.2 Integration Tests

- [ ] **End-to-End Szenarien testen:**
  - Quiz starten → Frage beantworten → Fortschritt speichern
  - Quiz abschließen → Unlock prüfen → Toast anzeigen
  - App restart → State persistence validieren

### 6.3 Performance Tests

- [ ] **Re-Render Optimierung validieren**
- [ ] **Memory Leak Tests**
- [ ] **Bundle Size Vergleich**

### 6.4 Rollback Vorbereitung

- [ ] **Feature Flags für altes System behalten**
- [ ] **Migration Rollback Skript**
- [ ] **Data Migration Validation**

---

## 🚀 Phase 7: Deployment & Monitoring (1-2 Tage)

### 7.1 Production Build

- [ ] **Bundle Size Analyse**
- [ ] **Performance Profiling**
- [ ] **Error Boundary Updates**

### 7.2 Monitoring Setup

- [ ] **Redux DevTools in Development**
- [ ] **State Change Logging**
- [ ] **Error Tracking für Store Actions**

### 7.3 Documentation

- [ ] **Store Architecture dokumentieren**
- [ ] **Migration Guide für neue Entwickler**
- [ ] **Multi-Theme Setup Guide**

---

## 📊 Success Validation

### Quantitative Metrics

- [ ] **Code Lines:** Reduzierung von ~2000 auf ~500 LOC (State Management)
- [ ] **Bundle Size:** Reduzierung um mindestens 10%
- [ ] **Re-Renders:** Reduzierung um mindestens 50%
- [ ] **Test Coverage:** Mindestens 80% für Store Logic

### Qualitative Metrics

- [ ] **Developer Experience:** Einfacheres Debugging mit DevTools
- [ ] **Code Maintainability:** Klarere Separation of Concerns
- [ ] **Extensibility:** Theme System funktionsfähig
- [ ] **Performance:** Subjektiv flüssigere App-Performance

---

## 🔄 Rollback Strategy

### Emergency Rollback (< 1 Stunde)

- [ ] **Feature Flag Toggle:** Zurück zu alten Providern
- [ ] **AsyncStorage Backup:** Restore alte Datenstruktur
- [ ] **Component Fallbacks:** Alte Implementierung aktivieren

### Planned Rollback (< 4 Stunden)

- [ ] **Git Revert:** Commit-by-Commit zurück
- [ ] **Dependency Cleanup:** Zustand entfernen
- [ ] **Test Suite:** Alte Tests reaktivieren

---

## 📅 Timeline Übersicht

| Phase | Dauer | Kritisch? | Dependencies |
|-------|-------|-----------|--------------|
| 1. Vorbereitung | 2-3 Tage | ⭐⭐⭐ | Keine |
| 2. Core Store | 3-4 Tage | ⭐⭐⭐ | Phase 1 |
| 3. Provider Migration | 5-6 Tage | ⭐⭐⭐ | Phase 2 |
| 4. Hook Konsolidierung | 2-3 Tage | ⭐⭐ | Phase 3 |
| 5. Theme System | 3-4 Tage | ⭐ | Phase 4 |
| 6. Testing & QA | 2-3 Tage | ⭐⭐ | Phase 5 |
| 7. Deployment | 1-2 Tage | ⭐ | Phase 6 |

**Gesamtdauer:** 18-25 Tage (~4-5 Wochen)

---

## 🎯 Nächste konkrete Schritte

1. **Phase 1 starten:** Zustand installieren und Code-Analyse abschließen
2. **Backup erstellen:** Vollständige Kopie des aktuellen funktionsfähigen Codes
3. **Feature Branch:** `feature/zustand-migration` erstellen
4. **Milestone Planning:** Erste Demo nach Phase 3 (UI funktionsfähig)

Bereit für Phase 1? 🚀
