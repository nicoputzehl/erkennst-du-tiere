import { ThemedView } from '@/src/common/components/ThemedView';
import { QuizMode, QuizQuestion } from '@/src/quiz/types';
import React, { memo } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
} from 'react-native';
import { AlreadyAnswered } from './AlreadyAnswered';
import { AnswerInput } from './AnswerInput';
import { QuestionImage } from './QuestionImage';
import { QuestionResult } from './QuestionResult';
import { useQuestion } from '../hooks/useQuestion';

interface QuestionProps {
	quizId: string;
	questionId: string;
	question: QuizQuestion;
}

export const Question: React.FC<QuestionProps> = memo(({
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
	} = useQuestion(quizId, questionId, question);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={ Platform.OS === 'ios' ? 100 : 0}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps='handled'
				removeClippedSubviews={true}
				scrollEventThrottle={16}
				automaticallyAdjustKeyboardInsets={true}
			>
				<QuestionImage 
					imageUrl={question.images.imageUrl} 
					thumbnailUrl={question.images.thumbnailUrl}
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
		prevProps.question.images.imageUrl === nextProps.question.images.imageUrl &&
		prevProps.question.images.thumbnailUrl === nextProps.question.images.thumbnailUrl &&
		prevProps.question.images.unsolvedImageUrl === nextProps.question.images.unsolvedImageUrl &&
		prevProps.question.images.unsolvedThumbnailUrl === nextProps.question.images.unsolvedThumbnailUrl
	);
});

Question.displayName = 'Question';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	scrollContainer: {
		flexGrow: 1,
		minHeight: '100%',
		paddingBottom: 20,
	},
	content: {
		flex: 1,
		padding: 16,
		paddingBottom: 32,
		justifyContent: 'space-between',
	},
});