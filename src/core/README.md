# Core Layer

## Überblick

Das Core Layer bildet die Grundlage der Quiz-Anwendung und stellt generische, wiederverwendbare Funktionalitäten bereit, die unabhängig vom konkreten Inhalt (Tiere, Filme, etc.) sind.

## Zweck

- **Abstraktion**: Definiert generische Interfaces und Patterns
- **Wiederverwendbarkeit**: Ermöglicht einfache Erweiterung um neue Content-Typen
- **Infrastruktur**: Stellt grundlegende Services wie Storage und Initialisierung bereit

## Struktur

```bash
src/core/
├── content/          # Generisches Content-System
├── storage/          # Datenpersistierung
└── initialization/   # App-Initialisierung
```

### Content-System (`content/`)

**Zweck**: Definiert generische Interfaces für Content-Verarbeitung

- `ContentHandler.ts`: Interface für die Umwandlung von Content zu Quiz-Fragen
- `ContentQuestionFactory.ts`: Factory zur Erstellung von Fragen aus Content-Definitionen
- `ContentQuizFactory.ts`: Factory zur Erstellung kompletter Quizzes
- `types.ts`: Basis-Typen für Content-Items und Fragen

**Key Interfaces**:

```typescript
ContentHandler<T>     // Verarbeitet Content-Keys zu Fragen
ContentProvider<T>    // Verwaltet verfügbare Content-Items
ContentQuestion      // Definition einer Content-basierten Frage
```

### Storage-System (`storage/`)

**Zweck**: Abstrakte Datenpersistierung für plattformunabhängige Speicherung

- `StorageService.ts`: Generisches Interface für Datenspeicherung
- `AsyncStorageService.ts`: React Native AsyncStorage Implementierung
- `index.ts`: Zentraler Export und Service-Factory

**Features**:

- Asynchrone API für alle Operationen
- JSON-Serialisierung
- Error-Handling
- Plattformunabhängige Abstraktion

### Initialisierung (`initialization/`)

**Zweck**: Modulares System zur App-Initialisierung

- `quizInitialization.ts`: Registry für Quiz-Module und deren Initialisierung

**Pattern**:

```typescript
// Module registrieren sich selbst
registerQuizInitializer(initializeAnimalQuizzes);

// App startet alle Module
await initializeAllQuizzes();
```

## Interaktion mit anderen Ebenen

### → Quiz Layer

- **Content-Interfaces**: Quiz Layer nutzt ContentHandler/Provider Abstrakte
- **Storage**: Quiz-Services verwenden StorageService für Persistierung
- **Initialisierung**: Quiz-Module registrieren sich über Initialization-System

### → Animals Layer (und andere Content-Layer)

- **Adapter Pattern**: Animals implementiert ContentHandler/Provider Interfaces
- **Factory Usage**: Nutzt ContentQuestionFactory und ContentQuizFactory
- **Initialisierung**: Registriert sich über registerQuizInitializer

## Design-Prinzipien

1. **Dependency Inversion**: Abstrakte Interfaces statt konkrete Implementierungen
2. **Single Responsibility**: Jedes Modul hat einen klar definierten Zweck
3. **Open/Closed**: Erweiterbar für neue Content-Typen ohne Modifikation
4. **Interface Segregation**: Kleine, spezifische Interfaces

## Erweiterung

Neue Content-Typen (z.B. Filme, Länder) können das Core Layer nutzen durch:

1. Implementierung der ContentHandler/Provider Interfaces
2. Nutzung der Content-Factories
3. Registrierung über das Initialization-System
4. Verwendung des Storage-Systems für Persistierung

Das Core Layer bleibt dabei unverändert.
