import { ThemedView } from '@/src/common/components/ThemedView';
import { QuizQuestion } from '@/src/quiz/types';
import { memo } from 'react';
import {
	StyleSheet,
	Animated,
	View,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { AnswerInput } from './AnswerInput';
import { QuestionImage } from './QuestionImage';
import { useQuestion } from '../hooks/useQuestion';
import { ImageType, useImageDisplay } from '../../../hooks/useImageDisplay';
import { QuestionResult } from './QuestionResult/QuestionResult';
import Header from '@/src/common/components/Header';
import { useKeyboardHandling } from '../hooks/useKeyboardHandling';

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
			quizTitle,
		} = useQuestion(quizId, question);

		const { imageHeight } = useKeyboardHandling({ initialImageHeight: 400 });

		const { getImageUrl } = useImageDisplay(question);

		return (
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
			>
				<ThemedView
					gradientType='primary'
					style={{ justifyContent: 'space-between' }}
				>
					<View>
						<Header
							showBackButton={true}
							backButtonText={quizTitle}
							onBackPress={handleBack}
						/>

						<Animated.View
							style={[styles.imageContainer, { height: imageHeight }]}
						>
							<QuestionImage
								imageUrl={getImageUrl(ImageType.IMG)}
								thumbnailUrl={getImageUrl(ImageType.THUMBNAIL)}
								animatedHeight={imageHeight}
							/>
						</Animated.View>
					</View>
					{!showResult && initialQuestionStatus !== 'solved' && (
						<AnswerInput
							value={answer}
							onChangeText={setAnswer}
							onSubmitEditing={handleSubmit}
							isSubmitting={isSubmitting}
						/>
					)}
					{showResult && (
						<View style={styles.contentInner}>
							<QuestionResult
								isCorrect={isCorrect}
								funFact={question.funFact}
								wikipediaSlug={question.wikipediaName || question.answer}
								onBack={handleBack}
								onTryAgain={handleTryAgain}
								statusChanged={statusChanged}
								answer={question.answer}
							/>
						</View>
					)}
				</ThemedView>
			</KeyboardAvoidingView>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.quizId === nextProps.quizId &&
			prevProps.questionId === nextProps.questionId &&
			prevProps.question.id === nextProps.question.id &&
			prevProps.question.status === nextProps.question.status &&
			prevProps.question.images.imageUrl ===
				nextProps.question.images.imageUrl &&
			prevProps.question.images.thumbnailUrl ===
				nextProps.question.images.thumbnailUrl &&
			prevProps.question.images.unsolvedImageUrl ===
				nextProps.question.images.unsolvedImageUrl &&
			prevProps.question.images.unsolvedThumbnailUrl ===
				nextProps.question.images.unsolvedThumbnailUrl
		);
	}
);

Question.displayName = 'Question';

const styles = StyleSheet.create({
	imageContainer: {
		width: '100%',
		overflow: 'hidden',
	},
	contentInner: {
		flex: 1,
		justifyContent: 'space-between',
		minHeight: 200,
	},
});
