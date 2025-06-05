import { ErrorComponent } from '@/src/common/components/ErrorComponent';
import { LoadingComponent } from '@/src/common/components/LoadingComponent';
import { ThemedView } from '@/src/common/components/ThemedView';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ContextualHint, HintButton, HintPanel, PointsDisplay } from '../../components/HintUi';
import { QuestionComponent } from './components/Question';
import { useQuestionScreen } from './hooks/useQuestionScreen';

export interface QuestionScreenProps {
  quizId: string | null;
  questionId: string | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  quizId,
  questionId,
}) => {
  const [showHints, setShowHints] = useState(false);
  
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
    handleBack,
    isContextualHintVisible,
    handleContextualHintClose,
    contextualHintContent,
  } = useQuestionScreen(quizId || '', questionId || '');



  // REMOVED: handleSubmitWithHints - we use the unified handleSubmit from useQuestionScreen now

  const handleCloseHints = useCallback(() => {
    console.log('[QuestionScreen] Closing hints modal');
    setShowHints(false);
  }, []);

  const handleOpenHints = useCallback(() => {
    console.log('[QuestionScreen] Opening hints modal');
    setShowHints(true);
  }, []);

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
      <QuestionComponent
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
        onSubmit={handleSubmit} // FIXED: Use the unified submit function
        onTryAgain={handleTryAgain}
        onBack={handleBack}
        quizTitle={quizState.title}
      />
      
      {/* Points Display */}
      <View style={{ position: 'absolute', top: 50, right: 16 }}>
        <PointsDisplay quizId={quizId} compact />
      </View>
      
      {/* Hint Button - only show when not showing result and not solved */}
      {!showResult && !isSolved && (
        <HintButton
          quizId={quizId}
          questionId={parseInt(questionId)}
          onOpenHints={handleOpenHints}
        />
      )}
      <ContextualHint
        isVisible={isContextualHintVisible}
        onClose={handleContextualHintClose}
        content={contextualHintContent}
      />
      {/* Hint Panel */}
      <HintPanel
        quizId={quizId}
        questionId={parseInt(questionId)}
        isVisible={showHints}
        onClose={handleCloseHints}
      />
    </ThemedView>
  );
};