# Erkennst du das Tier? - Projektübersicht und Refactoring

## Projektübersicht

"Erkennst du das Tier?" ist eine mobile Quiz-Anwendung, entwickelt mit React Native und Expo. Benutzer sehen Bilder von Tieren und müssen deren Namen erraten, entweder durch Eingabe eines Textes oder durch Auswahl aus vorgegebenen Optionen (Multiple-Choice).

### Kerneigenschaften:

- **Verschiedene Quiz-Kategorien**: Emojis, Namibia-Tiere, und "Weird Animals"
- **Unterschiedliche Fragetypen**: Texteingabe und Multiple-Choice
- **Freischaltbares Gameplay**: Neue Quiz-Kategorien werden freigeschaltet, wenn bestimmte Bedingungen erfüllt sind
- **Fortschrittsverfolgung**: Das Spiel verfolgt den Fortschritt des Spielers in jedem Quiz

### Architektur:

Die Anwendung basiert auf einer klaren Trennung von:
1. **Core Layer**: Generische Quiz-Funktionalität
2. **Content Layer**: Tierspezifische Daten und Logik
3. **Presentation Layer**: UI-Komponenten und Screens

## Flow-Diagramme

### Architektur-Übersicht

```mermaid
graph TD
    A[App-Start] --> B[Quiz-Provider]
    B --> C[Service Factories]
    C --> D1[QuizRegistry]
    C --> D2[QuizState]
    C --> D3[ProgressTracker]
    C --> D4[AnswerProcessor]
    C --> D5[UnlockManager]
    
    D1 --> E[Quiz-Screens]
    D2 --> E
    D3 --> E
    D4 --> E
    D5 --> E
    
    E --> F1[Quiz-Startseite]
    E --> F2[Quiz-Übersicht]
    E --> F3[Frage-Screen]
```

### Service-Dependency-Flow

```mermaid
graph TD
    A[QuizRegistryService] --> B[QuizStateManagerService]
    B --> C1[ProgressTrackerService]
    B --> C2[UnlockManagerService]
    A --> C2
    B --> C3[AnswerProcessorService]
    C2 --> C3
```

### Daten-Flow beim Beantworten einer Frage

```mermaid
graph TD
    A[Benutzer gibt Antwort] --> B[AnswerProcessor]
    B --> C{Antwort korrekt?}
    C -->|Ja| D[QuizState aktualisieren]
    C -->|Nein| E[Fehlermeldung anzeigen]
    D --> F[UnlockManager prüfen]
    F --> G{Neue Quizze freischalten?}
    G -->|Ja| H[Quiz freischalten & Toast anzeigen]
    G -->|Nein| I[Fortschritt speichern]
    H --> I
    I --> J[Nächste Frage oder Quiz-Übersicht anzeigen]
```

### Provider-Struktur und Kontext-Zugriff

```mermaid
graph TD
    A[QuizProvider] --> B1[QuizRegistryProvider]
    A --> B2[QuizStateProvider]
    A --> B3[ProgressTrackerProvider]
    A --> B4[AnswerProcessorProvider]
    A --> B5[UnlockManagerProvider]
    
    B1 --> C[Kontext-Hooks]
    B2 --> C
    B3 --> C
    B4 --> C
    B5 --> C
    
    C --> D1[useQuizRegistry]
    C --> D2[useQuizState]
    C --> D3[useProgressTracker]
    C --> D4[useAnswerProcessor]
    C --> D5[useUnlockManager]
    C --> D6[useQuiz]
```

## Aktueller Stand des Refactorings

### Abgeschlossene Verbesserungen:

1. **Service-Factories implementiert**:
   - Jeder Service wird nun durch eine Factory-Funktion erstellt
   - Services erhalten explizit ihre Abhängigkeiten
   - Reduzierung globaler Zustandsvariablen

2. **Provider-Struktur optimiert**:
   - Provider haben Zugriff auf Service-Instanzen
   - Klare Trennung von Service-Logik und Kontext-Verwaltung

### Nutzen der Verbesserungen:

1. **Bessere Testbarkeit**:
   - Services können mit Mock-Abhängigkeiten getestet werden
   - Isolation von Komponenten für Unit-Tests

2. **Erhöhte Wartbarkeit**:
   - Explizite Abhängigkeiten statt impliziter globaler Zustände
   - Besseres Verständnis der Serviceinteraktionen
   - Klare API-Grenzen zwischen Diensten

3. **Erweiterbarkeit**:
   - Neue Services können einfach hinzugefügt werden
   - Bestehende Services können leichter ausgetauscht werden

### Nächste Schritte:

1. **Persistenzstrategie implementieren**:
   - Integration von AsyncStorage für Speicherung von Fortschritt und Einstellungen
   - Trennung zwischen flüchtigem und persistentem Zustand

2. **Error-Handling verbessern**:
   - Strukturierte Fehlerbehandlung statt einfacher Fehlermeldungen
   - Implementierung von Error Boundaries

3. **State Management optimieren**:
   - Reevaluierung der eigenen State-Management-Lösung
   - Eventuell Integration von Zustand oder Redux/Toolkit für komplexere Szenarien

4. **Typensicherheit erhöhen**:
   - Vermeidung von `any` wo immer möglich
   - Nutzung von strikteren TypeScript-Einstellungen

## Code-Struktur

Die Hauptkomponenten der Anwendung sind:

- `src/core/`: Core-Funktionalität, die unabhängig vom konkreten Quiz-Inhalt ist
- `src/quiz/`: Quiz-spezifische Logik und UI-Komponenten
- `src/animals/`: Tier-spezifische Inhalte und Adapter
- `src/common/`: Gemeinsam genutzte UI-Komponenten und Utilities

Jeder Service folgt jetzt dem Factory-Pattern:

```typescript
// Service-Interface
interface ServiceInterface {
  // Methoden des Services
}

// Factory-Funktion
export const createService = (
  dependency1: Dependency1Type,
  dependency2: Dependency2Type
): ServiceInterface => {
  // Private Zustände
  let privateState = ...;
  
  // Service-Instanz zurückgeben
  return {
    method1: () => { ... },
    method2: () => { ... }
  };
};
```

Provider greifen auf diese Services zu und stellen sie für die Anwendung bereit:

```typescript
export function ServiceProvider({ children }) {
  // Service-Instanz abrufen
  const service = getService();
  
  const contextValue = {
    service,
    // Re-exported service methods
    method1: service.method1,
    method2: service.method2
  };
  
  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  );
}
```

## Zusammenfassung

Das Projekt "Erkennst du das Tier?" hat durch die Implementierung von Service-Factories und die Optimierung der Provider-Struktur einen bedeutenden Schritt in Richtung besserer Wartbarkeit und Testbarkeit gemacht. Die klare Trennung von Verantwortlichkeiten und die explizite Dependency Injection verbessern die Codequalität und erleichtern zukünftige Erweiterungen.

Das Refactoring folgt den Best Practices für React Native-Anwendungen und nutzt TypeScript, um eine robuste und typsichere Codebasis zu gewährleisten.
