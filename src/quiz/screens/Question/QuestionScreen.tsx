import { ErrorComponent } from '@/src/common/components/ErrorComponent';
import { LoadingComponent } from '@/src/common/components/LoadingComponent';
import { ThemedView } from '@/src/common/components/ThemedView';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { HintButton, HintPanel, PointsDisplay } from '../../components/HintUi';
import { useHints } from '../../store/hooks/useHints';
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
    handleBack
  } = useQuestionScreen(quizId || '', questionId || '');

    const { recordWrongAnswer } = useHints(quizId || '', parseInt(questionId || '0'));

  
  console.log('🔍 [QuestionScreen] Question source analysis:', {
    quizId,
    questionId,
    questionObject: question,
    hintsPresent: !!question?.hints,
    hintsCount: question?.hints?.length,
    firstHintType: question?.hints?.[0]?.type,
    firstHintHasGenerator: question?.hints?.[0] ? 'generator' in question.hints[0] : 'no hints',
    generatorType: question?.hints?.[0] ? typeof (question.hints[0] as any).generator : 'N/A'
  });
  // Erweitere handleSubmit um Hint-Logic
  const handleSubmitWithHints = useCallback(async () => {
    if (!answer.trim()) return;
    
    // Record wrong answer for contextual hints
    if (quizId && questionId) {
      recordWrongAnswer(answer);
    }
    
    // Original submit logic
    await handleSubmit();
  }, [answer, handleSubmit, recordWrongAnswer, quizId, questionId]);

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
        onSubmit={handleSubmit}
        onTryAgain={handleTryAgain}
        onBack={handleBack}
        quizTitle={quizState.title}
      />
            {/* Points Display */}
      <View style={{ position: 'absolute', top: 50, right: 16 }}>
        <PointsDisplay quizId={quizId} compact />
      </View>
      
      {/* Hint Button */}
      {!showResult && !isSolved && (
        <HintButton
          quizId={quizId}
          questionId={parseInt(questionId)}
          onOpenHints={() => setShowHints(true)}
        />
      )}
      
      {/* Hint Panel */}
      <HintPanel
        quizId={quizId}
        questionId={parseInt(questionId)}
        isVisible={showHints}
        onClose={() => setShowHints(false)}
      />
    </ThemedView>
  );
};