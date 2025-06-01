# Migration Status: Zustand Store für Quiz App

## ✅ Abgeschlossene Schritte

### Schritt 1: Store Setup ✅

- **Zustand Store** mit DevTools eingerichtet (`src/stores/quizStore.ts`)
- **Basis-Funktionalität**: Quiz-Registrierung, Current Quiz, Debug-Info
- **Persistence** mit Zustand middleware vorbereitet
- **Tests** für Store-Grundfunktionen (`__tests__/quizStore.test.ts`)
- **TypeScript-Typisierung** vollständig

### Schritt 2: Quiz-Registrierung Migration ✅

- **Quiz-Registry** als einfache Funktionen (`src/stores/quizRegistry.ts`)
- **Parallele Registrierung** - Store läuft neben bestehendem System
- **Migrierte Quiz-Definitionen** (`src/animals/quizzes-migrated.ts`)
- **Provider für Store-Integration** (`src/stores/QuizStoreProvider.tsx`)
- **Migration-Tests** (`__tests__/migration.test.ts`)
- **Test-Komponente** für Vergleich beider Systeme (`TestMigrationIntegration.tsx`)

## 🔄 Aktueller Stand

- **Store parallel aktiv** neben 5 bestehenden Providern
- **Quiz-Registrierung** funktioniert in beiden Systemen
- **Tests grün** - alle Basis-Funktionen arbeiten
- **Provider-Hierarchie** bereit für schrittweise Migration

## 📋 Geplante Schritte

### Schritt 3: Quiz-State Management migrieren

- **Quiz-States** (Fortschritt, gelöste Fragen) in Store
- **Answer Processing** von `useAnswerProcessing` → Store Actions
- **Progress Calculation** von Utils → Store Selectors
- **Persistence** von Quiz-States automatisch via Zustand

### Schritt 4: UI-State Migration

- **Toast-System** von `UIStateProvider` → Store
- **Loading States** zentralisiert im Store
- **Navigation Tracking** im Store
- **Pending Unlocks** System vereinfachen

### Schritt 5: Provider Replacement

- **Schritt-für-Schritt Ersetzung** der 5 Provider:
  1. `UIStateProvider` → Store
  2. `QuizStateProvider` → Store
  3. `QuizDataProvider` → Store (bereits teilweise)
  4. `PersistenceProvider` → Zustand middleware
  5. `QuizProvider` → Vereinfachter Provider

### Schritt 6: Hook-Vereinfachung

- **Komplexe Hooks ersetzen**: `useAnswerProcessing`, `useQuizOperations`, etc.
- **Ein zentraler Hook**: `useQuiz()` für gesamte App
- **Store-Actions direkt nutzen** statt verschachtelte Hook-Aufrufe

### Schritt 7: Cleanup & Finalisierung

- **Alte Provider/Hooks entfernen**
- **Code-Vereinfachung** und Dead-Code-Removal
- **Performance-Optimierung** mit Zustand Selectors
- **Tests aktualisieren** für neue Architektur

## 🎯 Ziel-Architektur

```typescript
// Von: 5 Provider + 10+ Hooks
<PersistenceProvider>
  <QuizDataProvider>
    <QuizStateProvider>
      <UIStateProvider>
        <QuizProvider>
          {/* Complex hook usage */}
        </QuizProvider>
      </UIStateProvider>
    </QuizStateProvider>
  </QuizDataProvider>
</PersistenceProvider>

// Zu: 1 Store + 1 einfacher Provider
<QuizStoreProvider>
  {/* Direkter Store-Zugriff */}
  const { quizzes, submitAnswer, showToast } = useQuiz();
</QuizStoreProvider>
```

## 📁 Wichtige Dateien

- **Store**: `src/stores/quizStore.ts`
- **Provider**: `src/stores/QuizStoreProvider.tsx`
- **Registry**: `src/stores/quizRegistry.ts`
- **Tests**: `src/stores/__tests__/*.test.ts`
- **Migration-Test**: `src/stores/TestMigrationIntegration.tsx`

## 🚀 Nächster Schritt

**Schritt 3** starten: Quiz-State Management (Antworten, Fortschritt) vom `QuizStateProvider` in den Zustand Store migrieren.
