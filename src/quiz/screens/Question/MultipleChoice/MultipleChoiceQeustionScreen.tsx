import React, { memo } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
} from 'react-native';
import { ThemedView } from '@/src/common/components/ThemedView';
import { AlreadyAnswered } from '../components/AlreadyAnswered';
import { QuestionImage } from '../components/QuestionImage';
import { QuestionResult } from '../components/QuestionResult';
import { QUESTION_CONSTANTS } from '../constants/constants';
import { useMultipleChoiceQuestionScreen } from './useMultipleChoiceQuestionScreen';
import { QuizMode, QuizMultipleChoiceQuestion } from '@/src/quiz/types';
import AnswerChoice from '../components/AnswerChoice';

interface MultipleChoiceQuestionScreenProps {
	quizId: string;
	questionId: string;
	question: QuizMultipleChoiceQuestion;
}

export const MultipleChoiceQuestionScreen: React.FC<MultipleChoiceQuestionScreenProps> = memo(({ 
	quizId, 
	questionId, 
	question 
}) => {
	const {
		choices,
		showResult,
		isCorrect,
		initialQuestionStatus,
    isSubmitting,
		handleChoiceSelect,
		handleNext,
		handleTryAgain,
		handleBack,
		isQuizCompleted,
	} = useMultipleChoiceQuestionScreen(quizId, questionId, question);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={QUESTION_CONSTANTS.keyboardVerticalOffset}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps='handled'
				// Performance optimizations
				removeClippedSubviews={true}
				scrollEventThrottle={16}
			>
				<QuestionImage 
					imageUrl={question.imageUrl} 
					thumbnailUrl={question.thumbnailUrl}
				/>
				<ThemedView style={styles.content}>
					{initialQuestionStatus === 'solved' && (
						<AlreadyAnswered funFact={question.funFact} />
					)}
					{!showResult && initialQuestionStatus !== 'solved' && (
						<AnswerChoice
							choices={choices}
							onChoicePress={handleChoiceSelect}
              isSubmitting={isSubmitting}
						/>
					)}
					{showResult && (
						<QuestionResult
							isCorrect={isCorrect}
							funFact={question.funFact}
							onBack={handleBack}
							onTryAgain={handleTryAgain}
							onNext={handleNext}
							quizMode={QuizMode.ALL_UNLOCKED}
							hasNextQuestion={!isQuizCompleted}
						/>
					)}
				</ThemedView>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}, (prevProps, nextProps) => {
	// Memo comparison - only re-render if essential props change
	return (
		prevProps.quizId === nextProps.quizId &&
		prevProps.questionId === nextProps.questionId &&
		prevProps.question.id === nextProps.question.id &&
		prevProps.question.status === nextProps.question.status &&
		prevProps.question.imageUrl === nextProps.question.imageUrl &&
		prevProps.question.thumbnailUrl === nextProps.question.thumbnailUrl
	);
});

MultipleChoiceQuestionScreen.displayName = 'MultipleChoiceQuestionScreen';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff', // Explicit background
	},
	scrollContainer: {
		flexGrow: 1,
		minHeight: '100%', // Ensure full height
	},
	content: {
		flex: 1,
		padding: 16,
		paddingBottom: 32, // Extra padding at bottom
	},
});