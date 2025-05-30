import { ThemedView } from '@/src/common/components/ThemedView';
import { QuizQuestion } from '@/src/quiz/types';
import React, { memo } from 'react';
import { ScrollView, StyleSheet, Animated, View } from 'react-native';
import { AnswerInput } from './AnswerInput';
import { QuestionImage } from './QuestionImage';
import { useQuestion } from '../hooks/useQuestion';
import { useKeyboardResponsive } from '@/src/common/hooks/useKeyboardResponsiveness';
import { ImageType, useImageDisplay } from '../../../hooks/useImageDisplay';
import { QuestionResult } from './QuestionResult/QuestionResult';
import Header from '@/src/common/components/Header';

interface QuestionProps {
  quizId: string;
  questionId: string;
  question: QuizQuestion;
}

export const Question: React.FC<QuestionProps> = memo(
  ({ quizId, question }) => {
    const {
      answer,
      setAnswer,
      showResult,
      isCorrect,
      initialQuestionStatus,
      handleSubmit,
      handleTryAgain,
      handleBack,
      isSubmitting,
      statusChanged,
      quizTitle
    } = useQuestion(quizId, question);
    
    const { getImageUrl } = useImageDisplay(question);

    const {
      imageHeight,
      contentPadding,
      availableContentHeight,
      isKeyboardVisible,
    } = useKeyboardResponsive({
      defaultImageHeight: 400,
      minImageHeight: 320,
      maxImageHeight: 350,
      bufferHeight: 100,
      imageHeightRatio: 0.4,
      animationDuration: {
        ios: 0,
        android: 0,
      },
      disableFirstAnimationDelay: true,
      useNativeKeyboardAnimation: true,
    });

    return (
      <ThemedView style={styles.container} gradientType="primary">
        <Header
          showBackButton={true}
          backButtonText={quizTitle}
          onBackPress={handleBack}
        />
        <ScrollView
          style={[styles.scrollView, { maxHeight: availableContentHeight }]}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          bounces={false}
        >
          <QuestionImage
            imageUrl={getImageUrl(ImageType.IMG)}
            thumbnailUrl={getImageUrl(ImageType.THUMBNAIL)}
            animatedHeight={imageHeight}
          />

          <Animated.View
            style={[
              styles.content,
              {
                paddingTop: contentPadding,
                paddingBottom: contentPadding,
                marginBottom: isKeyboardVisible ? 10 : 0,
              },
            ]}
          >
            <View style={styles.contentInner}>
              {!showResult && initialQuestionStatus !== 'solved' && (
                <AnswerInput
                  value={answer}
                  onChangeText={setAnswer}
                  onSubmitEditing={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
              {showResult && (
                <QuestionResult
                  isCorrect={isCorrect}
                  funFact={question.funFact}
                  wikipediaSlug={question.wikipediaName || question.answer}
                  onBack={handleBack}
                  onTryAgain={handleTryAgain}
                  statusChanged={statusChanged}
                  answer={question.answer}
                />
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </ThemedView>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.quizId === nextProps.quizId &&
      prevProps.questionId === nextProps.questionId &&
      prevProps.question.id === nextProps.question.id &&
      prevProps.question.status === nextProps.question.status &&
      prevProps.question.images.imageUrl === nextProps.question.images.imageUrl &&
      prevProps.question.images.thumbnailUrl === nextProps.question.images.thumbnailUrl &&
      prevProps.question.images.unsolvedImageUrl === nextProps.question.images.unsolvedImageUrl &&
      prevProps.question.images.unsolvedThumbnailUrl === nextProps.question.images.unsolvedThumbnailUrl
    );
  }
);

Question.displayName = 'Question';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  contentInner: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 200,
  },
});