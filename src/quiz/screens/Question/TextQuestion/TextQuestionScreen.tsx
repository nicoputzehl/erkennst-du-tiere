import React, { memo } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
} from 'react-native';
import { ThemedView } from '@/src/common/components/ThemedView';
import { AlreadyAnswered } from '../components/AlreadyAnswered';
import { AnswerInput } from '../components/AnswerInput';
import { QuestionImage } from '../components/QuestionImage';
import { QuestionResult } from '../components/QuestionResult';
import { QUESTION_CONSTANTS } from '../constants/constants';
import { useTextQuestionScreen } from './useTextQuestionScreen';
import { QuizMode, QuizQuestion } from '@/src/quiz/types';

interface TextQuestionScreenProps {
	quizId: string;
	questionId: string;
	question: QuizQuestion;
}

export const TextQuestionScreen: React.FC<TextQuestionScreenProps> = memo(({
	quizId,
	questionId,
	question,
}) => {
	const {
		answer,
		setAnswer,
		showResult,
		isCorrect,
		initialQuestionStatus,
		handleSubmit,
		handleNext,
		handleTryAgain,
		handleBack,
		isQuizCompleted,
		isSubmitting
	} = useTextQuestionScreen(quizId, questionId, question);

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
				// Better keyboard handling
				automaticallyAdjustKeyboardInsets={true}
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
							onBack={handleBack}
							onTryAgain={handleTryAgain}
							onNext={handleNext}
							quizMode={QuizMode.SEQUENTIAL}
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

TextQuestionScreen.displayName = 'TextQuestionScreen';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff', // Explicit background
	},
	scrollContainer: {
		flexGrow: 1,
		minHeight: '100%', // Ensure full height
		paddingBottom: 20, // Extra space for keyboard
	},
	content: {
		flex: 1,
		padding: 16,
		paddingBottom: 32, // Extra padding at bottom
		justifyContent: 'space-between', // Better distribution for text input
	},
});