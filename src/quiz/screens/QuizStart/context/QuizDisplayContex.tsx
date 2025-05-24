import React, {
	createContext,
	useContext,
	useMemo,
	useState,
	useEffect,
	useCallback,
} from 'react';
import { UnlockCondition } from '../../../types';
import { useQuiz } from '../../../contexts/QuizProvider';
import { router } from 'expo-router';
import { useProgressTracker } from '../../../contexts/ProgressTrackerProvider';
import { useUnlockManager } from '../../../contexts/UnlockManagerProvider';
import { useQuizState } from '@/src/quiz/contexts/QuizStateProvider';

interface QuizDisplayContextType {
	getQuizProgress: (quizId: string) => number;
	getQuizProgressString: (quizId: string) => string | null;
	getUnlockInfo: (quizId: string) => {
		condition: UnlockCondition | null;
		progress: number;
		isMet: boolean;
	};
	navigateToQuiz: (quizId: string) => void;
	isLoading: boolean;
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
	const { initializeQuizState, getQuizState } = useQuizState();
	const [isLoading, setIsLoading] = useState(false);

	// Log bei jedem Render
	useEffect(() => {
		console.log('[QuizDisplayProvider] Provider rendering');
	});

	// Fortschritt für ein Quiz abrufen mit Debug-Ausgabe - in useCallback einpacken
	const getProgress = useCallback(
		(quizId: string): number => {
			const progress = getQuizProgress(quizId);
			console.log(
				`[QuizDisplayProvider] Progress for quiz ${quizId}: ${progress}%`
			);

			// Debug: Direkt den Quiz-Zustand prüfen
			const state = getQuizState(quizId);
			if (state) {
				const calculatedProgress =
					(state.completedQuestions / state.questions.length) * 100;
				console.log(
					`[QuizDisplayProvider] Quiz state for ${quizId}: ${state.completedQuestions}/${state.questions.length} = ${calculatedProgress}%`
				);
			} else {
				console.log(`[QuizDisplayProvider] No quiz state found for ${quizId}`);
			}

			return progress;
		},
		[getQuizProgress, getQuizState]
	);

	// Navigieren zu einem Quiz, inkl. dessen Initialisierung - in useCallback einpacken
	const navigateToQuiz = useCallback(
		async (quizId: string) => {
			setIsLoading(true);
			try {
				// Quiz-Zustand initialisieren, falls noch nicht geschehen
				const state = await initializeQuizState(quizId);
				if (state) {
					console.log(
						`[QuizDisplayProvider] Quiz ${quizId} initialized: ${state.completedQuestions}/${state.questions.length} completed`
					);
				}

				// Zum Quiz navigieren
				setCurrentQuizId(quizId);
				router.navigate(`/quiz/${quizId}`);
			} catch (error) {
				console.error(
					`[QuizDisplayProvider] Error navigating to quiz ${quizId}:`,
					error
				);
			} finally {
				setIsLoading(false);
			}
		},
		[initializeQuizState, setCurrentQuizId]
	);

	const contextValue = useMemo(
		() => ({
			getQuizProgress: getProgress,
			getQuizProgressString,
			getUnlockInfo: getUnlockProgress,
			navigateToQuiz,
			isLoading,
		}),
		[
			getProgress,
			getQuizProgressString,
			getUnlockProgress,
			navigateToQuiz,
			isLoading,
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
