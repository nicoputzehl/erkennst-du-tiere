// src/quiz/contexts/QuizDisplayContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { UnlockCondition } from '../../../types';
import { useQuiz } from '../../../contexts/QuizProvider';
import { router } from 'expo-router';
import { useProgressTracker } from '../../../contexts/ProgressTrackerProvider';
import { useUnlockManager } from '../../../contexts/UnlockManagerProvider';

interface QuizDisplayContextType {
	getQuizProgress: (quizId: string) => number;
	getQuizProgressString: (quizId: string) => string | null;
	getUnlockInfo: (quizId: string) => {
		condition: UnlockCondition | null;
		progress: number;
		isMet: boolean;
	};
	navigateToQuiz: (quizId: string) => void;
}

const QuizDisplayContext = createContext<QuizDisplayContextType | null>(null);

export function QuizDisplayProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { setCurrentQuizId } = useQuiz();
	const { getUnlockProgress } = useUnlockManager();
	const { getQuizProgress, getQuizProgressString } = useProgressTracker();

	const contextValue = useMemo(
		() => ({
			getQuizProgress,
			getQuizProgressString,
			getUnlockInfo: getUnlockProgress,
			navigateToQuiz: (quizId: string) => {
				setCurrentQuizId(quizId);
				router.push(`/quiz/${quizId}`);
			},
		}),
		[
			getQuizProgress,
			getQuizProgressString,
			getUnlockProgress,
			setCurrentQuizId,
		]
	);

	return (
		<QuizDisplayContext.Provider value={contextValue}>
			{children}
		</QuizDisplayContext.Provider>
	);
}

export function useQuizDisplay() {
	const context = useContext(QuizDisplayContext);
	if (!context) {
		throw new Error('useQuizDisplay must be used within a QuizDisplayProvider');
	}
	return context;
}
