// src/quiz/contexts/QuizProvider.tsx
import React, { createContext, useContext } from 'react';
import { useQuizManager } from '../hooks/useQuizManager';
import { QuizRegistryProvider } from './QuizRegistryProvider';
import { QuizStateProvider } from './QuizStateProvider';
import { ProgressTrackerProvider } from './ProgressTrackerProvider';
import { UnlockManagerProvider } from './UnlockManagerProvider';

import '@/src/animals/initQuiz/quizRegistry';
import { AnswerProcessorProvider } from './AnswerProcessorProvider';

const QuizContext = createContext<ReturnType<typeof useQuizManager> | null>(
	null
);

export function QuizProvider({ children }: { children: React.ReactNode }) {
	return (
		<QuizRegistryProvider>
			<QuizStateProvider>
				<ProgressTrackerProvider>
					<AnswerProcessorProvider>
						<UnlockManagerProvider>
							<QuizProviderInner>{children}</QuizProviderInner>
						</UnlockManagerProvider>
					</AnswerProcessorProvider>
				</ProgressTrackerProvider>
			</QuizStateProvider>
		</QuizRegistryProvider>
	);
}

// Innerer Provider
function QuizProviderInner({ children }: { children: React.ReactNode }) {
	const quizManager = useQuizManager();

	return (
		<QuizContext.Provider value={quizManager}>{children}</QuizContext.Provider>
	);
}

export function useQuiz() {
	const context = useContext(QuizContext);
	if (!context) {
		throw new Error('useQuiz must be used within a QuizProvider');
	}
	return context;
}
