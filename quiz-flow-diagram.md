graph TD
    A[App-Start] --> B[Quiz-Initialisierung]
    
    B --> C1[AnimalContentProvider<br>definiert Tier-Daten]
    B --> C2[MovieContentProvider<br>definiert Film-Daten]
    
    C1 --> D1[AnimalContentHandler<br>verarbeitet Tier-Daten]
    C2 --> D2[MovieContentHandler<br>verarbeitet Film-Daten]
    
    D1 --> E1[AnimalQuestionFactory<br>erstellt Tier-Fragen]
    D2 --> E2[MovieQuestionFactory<br>erstellt Film-Fragen]
    
    E1 --> F[ContentQuizFactory<br>erstellt generisches Quiz]
    E2 --> F
    
    F --> G[QuizRegistry<br>registriert Quiz mit Content-Type]
    
    G --> H1[Tier-Quiz-Instanz]
    G --> H2[Film-Quiz-Instanz]
    
    H1 --> I[QuizStateManager<br>initialisiert Quiz-Zustand]
    H2 --> I
    
    I --> J[UI-Komponenten<br>zeigen Quiz an]
    
    subgraph "Content-Layer (spezifisch)"
        C1
        C2
        D1
        D2
        E1
        E2
    end
    
    subgraph "Core-Layer (generisch)"
        F
        G
        I
    end
    
    subgraph "Presentation-Layer"
        J
    end