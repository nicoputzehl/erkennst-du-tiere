import React from 'react';
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

export const TextQuestionScreen: React.FC<TextQuestionScreenProps> = ({
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
			>
				<QuestionImage imageUrl={question.imageUrl} />
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
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		padding: 16,
	},
});
