# QuestionScreen

Kümmert sich um das Verhalten in der Fragen-Ansicht.

## hooks

### useQuestionState

Holt sich anhand der Parameter `quizId` und `questionId` die Frage aus dem QuizState.

### useQuestionScreenConfig

Konfiguriert die Werte im für den Header des Screen.

### useQuestion

Fragen Verarbeitung wird in diesem Hook geregelt.

## components

### AlreadyAnswered

Anzeige für die Seite, wenn diese Frage schon gelöst wurde. *WIP*

### AnswerInput

Handled den Input.

### Question

Komposition der Seitenkomponenten. `useQuestion` wird hier genutzt.

### QuestionImage

Zeigt das Bild zur Frage an. Beim Laden wird zunächst das Thumbnail angezeigt.

### QuestionResult

Anzeige nach Absenden der Antwort. *WIP*
