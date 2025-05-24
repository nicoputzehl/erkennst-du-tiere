# Animals Data

## Überblick

Das Data-Modul verwaltet alle tier-bezogenen Daten der Anwendung, einschließlich Tier-Definitionen und Quiz-Konfigurationen. Es stellt die Grundlage für alle Tier-Quizzes bereit.

## Zweck

- **Daten-Zentrale**: Zentrale Verwaltung aller Tier-Informationen
- **Quiz-Konfiguration**: Definition spezifischer Quiz-Setups
- **Asset-Management**: Organisation von Bildern und Thumbnails
- **Content-Structure**: Strukturierte Datenorganisation für verschiedene Quiz-Typen

## Struktur

```bash
data/
├── animal_list/          # Zentrale Tier-Definitionen
│   └── index.ts
└── quizzes/             # Spezifische Quiz-Daten
    ├── namibia_animals/ # Tiere Namibias Quiz
    ├── weird_animals/   # Seltsame Tiere Quiz
    └── index.ts         # Quiz-Exports
```

## Tier-Definitionen (`animal_list/`)

### `index.ts` - Zentrale Tier-Datenbank

```typescript
interface Animal {
  name: string;                    // Hauptname (richtige Antwort)
  alternativeNames?: string[];     // Alternative akzeptierte Namen
  funFact?: string;               // Interessante Information
  wikipediaName?: string;         // Wikipedia-Suchbegriff
}

const ANIMAL_LIST: Record<string, Animal> = {
  leopard: {
    name: "Leopard",
    alternativeNames: ["Panther"],
    funFact: "Leoparden können ihre Beute auf Bäume ziehen.",
    wikipediaName: "Leopard"
  },
  
  elefant: {
    name: "Elefant",
    funFact: "Elefanten haben ein außergewöhnliches Gedächtnis."
  },
  
  nacktmull: {
    name: "Nacktmull",
    alternativeNames: [],
    funFact: "Nacktmulle sind die einzigen eusoziale Säugetiere."
  }
  // ... weitere Tiere
};
```

**Design-Prinzipien**:

- **Konsistente Keys**: Lowercase, underscore-separated (z.B. `kap_borstenhoernchen`)
- **Required Fields**: Nur `name` ist verpflichtend
- **Flexible Data**: Optionale Felder für erweiterte Informationen
- **Type Safety**: Vollständig typisiert mit TypeScript

## Quiz-Konfigurationen (`quizzes/`)

### Namibia Animals (`namibia_animals/`)

```typescript
// namibia_animals/index.ts
import { QuestionWithAnimal } from "../../../types";

export const namibiaAnimals: QuestionWithAnimal[] = [
  {
    id: 1,
    animal: "leopard",
    imageUrl: require("./img/leopard.jpg"),
    thumbnailUrl: require("./img/thumbnails/leopard.jpg"),
  },
  {
    id: 2,
    animal: "nilpferd", 
    imageUrl: require("./img/nilpferd.jpg"),
    thumbnailUrl: require("./img/thumbnails/nilpferd.jpg"),
  }
  // ... 15 Fragen total
];
```

**Features**:

- **Realistische Fotos**: Echte Tier-Aufnahmen aus Namibia
- **Schwierigkeit**: Einfach bis mittel
- **Thumbnails**: Optimierte kleine Bilder für Übersicht
- **Progression**: Erste Quiz-Stufe (nicht gesperrt)

### Weird Animals (`weird_animals/`)

```typescript
// weird_animals/index.ts
export const weirdAnimals: QuestionWithAnimal[] = [
  {
    id: 1,
    animal: "nacktmull",
    imageUrl: require("./img/weird_animals-nacktmull.jpg"),
    thumbnailUrl: require("./img/thumbnails/weird_animals-nacktmull.jpg"),
  },
  {
    id: 2,
    animal: "axolotl",
    imageUrl: require("./img/weird_animals-axolotl.jpg"),
    thumbnailUrl: require("./img/thumbnails/weird_animals-axolotl.jpg"),
  }
  // ... 10 Fragen total
];
```

**Features**:

- **Exotische Tiere**: Seltene und ungewöhnliche Arten
- **Schwierigkeit**: Schwer
- **Locked Content**: Freigeschaltet nach Abschluss von Namibia-Quiz
- **Educational**: Umfangreiche Fun Facts

## Asset-Organisation

### Bild-Struktur

```bash
quizzes/[quiz_name]/
├── img/                 # Haupt-Bilder (400px hoch)
│   ├── leopard.jpg
│   ├── nilpferd.jpg
│   └── ...
└── img/thumbnails/      # Thumbnails (100x100px)
    ├── leopard.jpg
    ├── nilpferd.jpg
    └── ...
```

### Asset-Requirements

- **Haupt-Bilder**: Mindestens 400px Höhe, optimiert für mobile Displays
- **Thumbnails**: 100x100px, quadratisch, für Quiz-Übersicht
- **Format**: JPG für Fotos, PNG für Grafiken mit Transparenz
- **Komprimierung**: Optimiert für mobile Übertragung

## Quiz-Typen

### Standard Text-Quiz (Namibia)

```typescript
// Verwendet für Texteingabe-basierte Fragen
interface QuestionWithAnimal {
  id: number;
  animal: AnimalKey;
  imageUrl: string;
  thumbnailUrl?: string;
}
```

### Freischaltbare Quizzes (Weird Animals)

```typescript
// Definiert in quizzes/animalQuizzes.ts
{
  id: 'weird_animals',
  title: 'Weird Animals',
  animalQuestions: weirdAnimals,
  initiallyLocked: true,
  unlockCondition: {
    type: 'specificQuiz',
    requiredQuizId: 'namibia_animals',
    description: 'Schließe das Quiz "Tiere Namibias" ab'
  }
}
```

## Datenvalidierung

### Tier-Key-Konsistenz

```typescript
// Automatische Validierung zur Compile-Zeit
type AnimalKey = keyof typeof ANIMAL_LIST;

// Beispiel-Validierung
const validateQuizData = (questions: QuestionWithAnimal[]) => {
  questions.forEach(q => {
    if (!(q.animal in ANIMAL_LIST)) {
      throw new Error(`Unknown animal: ${q.animal}`);
    }
  });
};
```

### Asset-Validierung

```typescript
// Zur Laufzeit prüfen ob Assets existieren
const validateAssets = (questions: QuestionWithAnimal[]) => {
  questions.forEach(q => {
    try {
      require.resolve(q.imageUrl);
      if (q.thumbnailUrl) {
        require.resolve(q.thumbnailUrl);
      }
    } catch (error) {
      console.warn(`Missing asset for question ${q.id}:`, error);
    }
  });
};
```

## Content-Management

### Neues Tier hinzufügen

```typescript
// 1. In ANIMAL_LIST definieren
const ANIMAL_LIST = {
  // ... bestehende Tiere
  neues_tier: {
    name: "Neues Tier",
    alternativeNames: ["Alternative"],
    funFact: "Interessanter Fakt über das Tier"
  }
};

// 2. Assets hinzufügen
// - img/neues_tier.jpg
// - img/thumbnails/neues_tier.jpg

// 3. In Quiz-Konfiguration verwenden
export const someQuiz: QuestionWithAnimal[] = [
  // ... bestehende Fragen
  {
    id: 99,
    animal: "neues_tier",
    imageUrl: require("./img/neues_tier.jpg"),
    thumbnailUrl: require("./img/thumbnails/neues_tier.jpg")
  }
];
```

### Neues Quiz erstellen

```typescript
// 1. Neuen Ordner erstellen: quizzes/new_quiz/

// 2. Fragen definieren
// quizzes/new_quiz/index.ts
export const newQuiz: QuestionWithAnimal[] = [
  // Fragen-Definitionen...
];

// 3. In Haupt-Export hinzufügen
// quizzes/index.ts
export * from "./new_quiz";

// 4. In Quiz-Registrierung verwenden
// quizzes/animalQuizzes.ts
import { newQuiz } from '../data/quizzes';
// Quiz-Konfiguration...
```

## Lokalisierung

### Mehrsprachige Tier-Namen

```typescript
interface Animal {
  name: string;                    // Haupt-Sprache (Deutsch)
  alternativeNames?: string[];     // Deutsche Alternativen
  englishName?: string;           // Englischer Name
  scientificName?: string;        // Wissenschaftlicher Name
}

// Beispiel
leopard: {
  name: "Leopard",
  alternativeNames: ["Panther"],
  englishName: "Leopard", 
  scientificName: "Panthera pardus"
}
```

## Performance-Optimierung

### Lazy Loading

```typescript
// Assets werden nur bei Bedarf geladen
const getQuestionImage = (questionId: number) => {
  return require(`./img/question_${questionId}.jpg`);
};
```

### Image Optimization

- **WebP Support**: Moderne Browser-Unterstützung
- **Responsive Images**: Verschiedene Größen für verschiedene Screens
- **Compression**: Optimierte Dateigröße ohne Qualitätsverlust

## Daten-Governance

### Content-Standards

- **Bild-Qualität**: Mindeststandards für Auflösung und Schärfe
- **Tier-Auswahl**: Pädagogisch wertvoll und erkennbar
- **Fun Facts**: Verifizierte und interessante Informationen
- **Namen**: Korrekte deutsche Schreibweise und gängige Alternativen
