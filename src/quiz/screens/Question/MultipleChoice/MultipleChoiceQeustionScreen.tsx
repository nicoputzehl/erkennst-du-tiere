import React from 'react';
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

export const MultipleChoiceQuestionScreen: React.FC<
	MultipleChoiceQuestionScreenProps
> = ({ quizId, questionId, question }) => {
	const {
		choices,
		showResult,
		isCorrect,
		initialQuestionStatus,
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
			>
				<QuestionImage imageUrl={question.imageUrl} />
				<ThemedView style={styles.content}>
					{initialQuestionStatus === 'solved' && (
						<AlreadyAnswered funFact={question.funFact} />
					)}
					{!showResult && initialQuestionStatus !== 'solved' && (
						<AnswerChoice
							choices={choices}
							onChoicePress={handleChoiceSelect}
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
