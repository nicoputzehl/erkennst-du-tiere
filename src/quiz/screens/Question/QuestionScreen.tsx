import { ErrorComponent } from '@/src/common/components/ErrorComponent';
import { LoadingComponent } from '@/src/common/components/LoadingComponent';
import { ThemedView } from '@/src/common/components/ThemedView';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { QuestionComponent } from './components/Question';
import { useQuestionScreen } from './hooks/useQuestionScreen';
import { PurchaseHintPanel } from '../Hints/components/PurchaseHintPanel';
import { AutoFreeHint } from '../Hints/components/AutoFreeHints';
import { ContextualHint } from '../Hints/components/ContextualHint';
import { HintButton } from '../Hints/components/HintButton';
import { PointsDisplay } from '../Hints/components/PointsDisplay';

export interface QuestionScreenProps {
  quizId: string | null;
  questionId: string | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  quizId,
  questionId,
}) => {
  const [showPurchaseHints, setShowPurchaseHints] = useState(false);
  
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
    navigateToHints,
    // EXISTING Contextual Hints
    isContextualHintVisible,
    handleContextualHintClose,
    contextualHintContent,
    
    // NEUE Auto-Free Hints
    isAutoFreeHintVisible,
    handleAutoFreeHintClose,
    autoFreeHintContent,
    
    // NEUE Purchased Hints (dauerhaft)
    purchasedHints,
    handleHintPurchased
  } = useQuestionScreen(quizId || '', questionId || '');

  const handleClosePurchaseHints = useCallback(() => {
    console.log('[QuestionScreen] Closing purchase hints modal');
    setShowPurchaseHints(false);
  }, []);

  const handleOpenPurchaseHints = useCallback(() => {
    console.log('[QuestionScreen] Opening purchase hints modal');
    setShowPurchaseHints(true);
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

  // Main render
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
        onSubmit={handleSubmit}
        onTryAgain={handleTryAgain}
        onBack={handleBack}
        quizTitle={quizState.title}
        // NEUE PROPS für purchased hints (dauerhaft)
        purchasedHints={purchasedHints}
        naavigateToHints={navigateToHints}
      />
      
      {/* Points Display */}
      <View style={{ position: 'absolute', top: 50, right: 16 }}>
        <PointsDisplay quizId={quizId} compact />
      </View>
      
      {/* Hint Button - only show when not showing result and not solved */}
      {!showResult && !isSolved && (
        <HintButton
          quizId={quizId}
          questionId={Number.parseInt(questionId)}
          onOpenHints={handleOpenPurchaseHints}
        />
      )}

      {/* EXISTING: Contextual Hint Modal */}
      <ContextualHint
        isVisible={isContextualHintVisible}
        onClose={handleContextualHintClose}
        content={contextualHintContent}
      />

      {/* NEUE: Auto-Free Hint Modal */}
      <AutoFreeHint
        isVisible={isAutoFreeHintVisible}
        onClose={handleAutoFreeHintClose}
        content={autoFreeHintContent}
      />

      {/* NEUE: Purchase Hint Panel */}
      <PurchaseHintPanel
        quizId={quizId}
        questionId={Number.parseInt(questionId)}
        isVisible={showPurchaseHints}
        onClose={handleClosePurchaseHints}
        onHintPurchased={handleHintPurchased}
      />

    </ThemedView>
  );
};