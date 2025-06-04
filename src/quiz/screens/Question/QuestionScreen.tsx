import React from 'react';
import { ThemedView } from '@/src/common/components/ThemedView';
import { ErrorComponent } from '@/src/common/components/ErrorComponent';
import { LoadingComponent } from '@/src/common/components/LoadingComponent';
import { Question } from './components/Question';
import { useQuestionScreen } from './hooks/useQuestionScreen';


export interface QuestionScreenProps {
  quizId: string | null;
  questionId: string | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  quizId,
  questionId,
}) => {
  // Simplified: One hook instead of multiple context hooks
  const {
    quizState,
    question,
    answer,
    setAnswer,
    isSubmitting,
    showResult,
    isCorrect,
    statusChanged,
    isSolved,
    handleSubmit,
    handleTryAgain,
    handleBack
  } = useQuestionScreen(quizId || '', questionId || '');

  // Early returns for error states
  if (!quizId || !questionId) {
    return <ErrorComponent message='Quiz oder Frage-ID fehlt' />;
  }

  if (!quizState) {
    return <LoadingComponent message='Quiz wird geladen...' />;
  }

  if (!question) {
    return <ErrorComponent message='Frage nicht gefunden' />;
  }

  // Main render - much cleaner props passing
  return (
    <ThemedView gradientType='primary' style={{ flex: 1 }}>
      <Question
        quizId={quizId}
        questionId={questionId}
        question={question}
        answer={answer}
        setAnswer={setAnswer}
        isSubmitting={isSubmitting}
        showResult={showResult}
        isCorrect={isCorrect}
        statusChanged={statusChanged}
        isSolved={isSolved}
        onSubmit={handleSubmit}
        onTryAgain={handleTryAgain}
        onBack={handleBack}
        quizTitle={quizState.title}
      />
    </ThemedView>
  );
};